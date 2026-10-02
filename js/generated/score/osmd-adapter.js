"use strict";
// OSMD object identity, revision-scoped note references and painted cursor state.
// Preserve the existing prototype/shallow-array snapshot and repeat state.
var PianoTrainerOsmdAdapter;
(function (PianoTrainerOsmdAdapter) {
    function create(ports) {
        let currentSheet, scoreRevision = 0, noteSequence = 0;
        let noteRefs = new WeakMap();
        const sourceNotes = new Map();
        let displayedIterator = null;
        let displayedSheet;
        let ownedHook = null;
        function syncSheet() {
            const sheet = ports.getRenderer().Sheet;
            if (sheet !== currentSheet) {
                currentSheet = sheet;
                scoreRevision++;
                noteSequence = 0;
                noteRefs = new WeakMap();
                sourceNotes.clear();
            }
            return sheet;
        }
        function noteRef(note) {
            syncSheet();
            const existing = noteRefs.get(note);
            if (existing)
                return existing;
            const ref = Object.freeze({ scoreRevision, id: `note-${++noteSequence}` });
            noteRefs.set(note, ref);
            sourceNotes.set(ref.id, note);
            return ref;
        }
        function resolveNote(ref) {
            syncSheet();
            return ref.scoreRevision === scoreRevision ? sourceNotes.get(ref.id) || null : null;
        }
        function detachHook() {
            if (ownedHook && ownedHook.cursor.update === ownedHook.wrapper)
                ownedHook.cursor.update = ownedHook.original;
            ownedHook = null;
        }
        function attachHook(cursor) {
            if (ownedHook?.cursor === cursor && cursor.update === ownedHook.wrapper)
                return;
            detachHook();
            const original = cursor.update;
            const update = original.bind(cursor);
            const wrapper = () => {
                const iterator = cursor.Iterator;
                // Localized vendor assertion: preserve the original prototype and
                // enumerable private repeat fields, including shallow-copied arrays.
                displayedIterator = Object.assign(Object.create(Object.getPrototypeOf(iterator)), iterator);
                for (const key of Object.keys(displayedIterator)) {
                    const value = Reflect.get(displayedIterator, key);
                    if (Array.isArray(value))
                        Reflect.set(displayedIterator, key, value.slice());
                }
                displayedSheet = syncSheet();
                return update();
            };
            cursor.update = wrapper;
            ownedHook = { cursor, original, wrapper };
        }
        function afterRender(preservePaintedPosition) {
            const sheet = syncSheet(), cursor = ports.getRenderer().cursor;
            if (!cursor)
                return;
            if (preservePaintedPosition && displayedIterator && displayedSheet === sheet) {
                const playbackIterator = cursor.Iterator;
                cursor.iterator = displayedIterator;
                try {
                    cursor.update();
                }
                finally {
                    cursor.iterator = playbackIterator;
                }
            }
            attachHook(cursor);
        }
        function getDefaults() {
            const renderer = ports.getRenderer(), rules = renderer.EngravingRules;
            return { maximumWidth: rules.SheetMaximumWidth, options: {
                    renderSingleHorizontalStaffline: false,
                    newSystemFromXML: rules.NewSystemAtXMLNewSystemAttribute,
                    newSystemFromNewPageInXML: rules.NewSystemAtXMLNewPageAttribute,
                    newPageFromXML: rules.NewPageAtXMLNewPageAttribute,
                    followCursor: renderer.FollowCursor
                } };
        }
        function setLayout(horizontal, defaults) {
            const renderer = ports.getRenderer();
            renderer.setOptions(horizontal ? {
                renderSingleHorizontalStaffline: true, newSystemFromXML: false,
                newSystemFromNewPageInXML: false, newPageFromXML: false, followCursor: false
            } : defaults.options);
            renderer.EngravingRules.SheetMaximumWidth = horizontal ? 10000000 : defaults.maximumWidth;
        }
        function getGraphicalNote(logicalNote, mIdx, staffIdx) {
            try {
                const renderer = ports.getRenderer();
                if (!renderer.GraphicSheet || !renderer.GraphicSheet.MeasureList)
                    return null;
                const measure = renderer.GraphicSheet.MeasureList[mIdx][staffIdx];
                if (!measure || !measure.staffEntries)
                    return null;
                const debugCandidates = [];
                for (let i = 0; i < measure.staffEntries.length; i++) {
                    const se = measure.staffEntries[i];
                    if (!se.graphicalVoiceEntries)
                        continue;
                    for (let j = 0; j < se.graphicalVoiceEntries.length; j++) {
                        const gve = se.graphicalVoiceEntries[j];
                        if (!gve.notes)
                            continue;
                        for (let k = 0; k < gve.notes.length; k++) {
                            const gn = gve.notes[k], src = gn?.sourceNote;
                            if (src) {
                                debugCandidates.push({ isExact: src === logicalNote,
                                    sameHalfTone: src?.halfTone === logicalNote?.halfTone,
                                    sameTimestamp: (src?.ParentVoiceEntry?.Timestamp?.RealValue ?? null) === (logicalNote?.ParentVoiceEntry?.Timestamp?.RealValue ?? null),
                                    sameLength: (src?.Length?.RealValue ?? null) === (logicalNote?.Length?.RealValue ?? null),
                                    ...ports.describeGraphicalNote(gn) });
                            }
                            if (gn.sourceNote === logicalNote) {
                                ports.debugLog('GRAPHICAL_NOTE_MATCH', {
                                    target: ports.describeNote(logicalNote, mIdx, staffIdx), chosen: ports.describeGraphicalNote(gn),
                                    nearby: debugCandidates.filter(c => c.sameHalfTone || c.sameTimestamp || c.isExact).slice(0, 12)
                                });
                                return gn;
                            }
                        }
                    }
                }
                ports.debugLog('GRAPHICAL_NOTE_MISS', {
                    target: ports.describeNote(logicalNote, mIdx, staffIdx),
                    nearby: debugCandidates.filter(c => c.sameHalfTone || c.sameTimestamp).slice(0, 12)
                });
            }
            catch (error) {
                ports.reportError('Error finding graphical note:', error);
            }
            return null;
        }
        function readPositions() {
            const sheet = syncSheet(), cursor = ports.getRenderer().cursor;
            const position = (iterator) => iterator ? { measureIndex: iterator.CurrentMeasureIndex, timestampWhole: iterator.currentTimeStamp?.RealValue ?? null } : null;
            return { scoreRevision, traversal: position(cursor?.Iterator),
                painted: displayedSheet === sheet ? position(displayedIterator) : null };
        }
        function getMeasureBox(measureIndex, staffIndex, unitsToPx) {
            const measure = ports.getRenderer().GraphicSheet?.MeasureList?.[measureIndex]?.[staffIndex];
            if (!measure?.ParentStaffLine)
                return null;
            const sys = measure.ParentStaffLine.ParentMusicSystem;
            let topYUnits = sys.PositionAndShape.AbsolutePosition.y;
            let bottomYUnits = topYUnits + sys.PositionAndShape.Size.height;
            if (sys.StaffLines && sys.StaffLines.length > 0) {
                topYUnits = sys.StaffLines[0].PositionAndShape.AbsolutePosition.y;
                bottomYUnits = sys.StaffLines[sys.StaffLines.length - 1].PositionAndShape.AbsolutePosition.y + 4;
            }
            const paddingUnits = 4;
            return { x: measure.PositionAndShape.AbsolutePosition.x * unitsToPx,
                y: (topYUnits - paddingUnits) * unitsToPx,
                width: measure.PositionAndShape.Size.width * unitsToPx,
                height: ((bottomYUnits + paddingUnits) - (topYUnits - paddingUnits)) * unitsToPx };
        }
        function getCombinedTieLength(note) {
            if (!note)
                return 0;
            let total = 0;
            let current = note;
            const seen = new Set();
            while (current && !seen.has(current)) {
                seen.add(current);
                if (current.Length && typeof current.Length.RealValue === 'number') {
                    total += current.Length.RealValue;
                }
                const tie = current.NoteTie;
                if (!tie)
                    break;
                // Prefer an explicit next note link if present
                const next = tie.Notes?.find(n => n !== current) ||
                    tie.NextNote ||
                    tie.nextNote ||
                    null;
                if (!next)
                    break;
                // Only combine true same-pitch ties
                if (next.halfTone !== current.halfTone)
                    break;
                current = next;
            }
            return total || (note.Length?.RealValue ?? 0);
        }
        // Lazy domain projection preserves original source-note read order.
        // OSMD objects stay in this adapter; geometry resolves only NoteRef.
        function* readPracticeEntries(entries, resolveStaffId) {
            // Original Array.forEach skips holes and captures the initial length.
            const entryCount = entries.length;
            for (let entryIndex = 0; entryIndex < entryCount; entryIndex++) {
                if (!(entryIndex in entries))
                    continue;
                const entry = entries[entryIndex];
                const staffId = resolveStaffId(entry);
                const notes = {
                    *[Symbol.iterator]() {
                        const sourceNotes = entry.Notes, noteCount = sourceNotes.length;
                        for (let noteIndex = 0; noteIndex < noteCount; noteIndex++) {
                            if (!(noteIndex in sourceNotes))
                                continue;
                            const note = sourceNotes[noteIndex];
                            yield {
                                get midi() { return note.halfTone + 12; },
                                get noteRef() { return noteRef(note); },
                                get notehead() { return note.Notehead; },
                                get printObject() { return note.PrintObject; },
                                get cue() { return note.isCueNote; },
                                get rest() { return note.isRest(); },
                                get tieContinuation() { return !!note.NoteTie && note.NoteTie.StartNote !== note; },
                                get combinedLengthWhole() { return note.NoteTie && note.NoteTie.StartNote === note ? getCombinedTieLength(note) : note.Length.RealValue; }
                            };
                        }
                    }
                };
                yield { staffId, notes };
            }
        }
        function dispose() {
            detachHook();
            displayedIterator = null;
            displayedSheet = undefined;
            noteRefs = new WeakMap();
            sourceNotes.clear();
            scoreRevision++;
        }
        return { getCombinedTieLength, readPracticeEntries, noteRef, resolveNote, afterRender, getDefaults, setLayout, getGraphicalNote, getMeasureBox, readPositions, dispose,
            getMeasureCount: () => ports.getRenderer().GraphicSheet?.MeasureList.length ?? null,
            // Legacy wrong-note fallback is called with a loaded cursor/sheet.
            // Preserve its missing-measure exception semantics in this boundary.
            getCurrentMeasureIndex: () => ports.getRenderer().cursor.Iterator.CurrentMeasureIndex,
            getStaffTopY: (measureIndex, staffIndex) => {
                const measures = ports.getRenderer().GraphicSheet.MeasureList;
                const measure = measures[measureIndex][staffIndex] || measures[measureIndex][0];
                return measure.PositionAndShape.AbsolutePosition.y * 10;
            },
            isReady: () => ports.getRenderer().IsReadyToRender(),
            render: () => ports.getRenderer().render(),
            getCursorElement: () => ports.getRenderer().cursor?.cursorElement || null };
    }
    PianoTrainerOsmdAdapter.create = create;
})(PianoTrainerOsmdAdapter || (PianoTrainerOsmdAdapter = {}));
//# sourceMappingURL=osmd-adapter.js.map