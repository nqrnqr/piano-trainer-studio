"use strict";
// Shared musical traversal. LED output consumes this data; it does not own it.
// P3 preserves the legacy position restoration rule and 100000-step limits.
var PianoTrainerScoreTraversal;
(function (PianoTrainerScoreTraversal) {
    function isRenderableAttackNote(note) {
        if (!note || (note.isRest && note.isRest()))
            return false;
        const isInvisibleCue = note.Notehead === 'none' ||
            note.PrintObject === false ||
            note.isCueNote === true;
        if (isInvisibleCue)
            return false;
        const tie = note.NoteTie;
        const isTieContinuation = !!(tie && tie.StartNote && tie.StartNote !== note);
        if (isTieContinuation)
            return false;
        return true;
    }
    PianoTrainerScoreTraversal.isRenderableAttackNote = isRenderableAttackNote;
    function makeEntrySignature(entries) {
        const parts = [];
        (entries || []).forEach(entry => {
            (entry?.Notes || []).forEach(note => {
                const staffId = Number(note?.ParentStaff?.id) || 0;
                const midi = note?.halfTone != null ? note.halfTone + 12 : 'rest';
                const length = note?.Length?.RealValue ?? 'na';
                const tieState = (note?.NoteTie && note.NoteTie.StartNote && note.NoteTie.StartNote !== note) ? 'tiecont' : 'attack';
                const restFlag = (note?.isRest && note.isRest()) ? 'rest' : 'note';
                parts.push(`${staffId}:${midi}:${length}:${tieState}:${restFlag}`);
            });
        });
        parts.sort();
        return parts.join('|');
    }
    PianoTrainerScoreTraversal.makeEntrySignature = makeEntrySignature;
    function findMatchingTimelineIndex(timeline, measureIndex, timestamp, signature, startIndex = 0) {
        if (!Array.isArray(timeline) || timeline.length === 0)
            return -1;
        for (let i = Math.max(0, startIndex); i < timeline.length; i++) {
            const event = timeline[i];
            if (event.measureIndex === measureIndex && event.timestamp === timestamp && event.signature === signature) {
                return i;
            }
        }
        return -1;
    }
    PianoTrainerScoreTraversal.findMatchingTimelineIndex = findMatchingTimelineIndex;
    function create(ports) {
        const state = ports.state;
        function getHandStatePrefix(staffId) {
            return ports.getHandRole(staffId) === 'left' ? 'l' : 'r';
        }
        function describeEntries(entries, measureIndex = null, timestamp = null) {
            if (!entries || entries.length === 0) {
                return { measureIndex, timestamp, notes: [] };
            }
            const notes = [];
            entries.forEach(entry => {
                (entry.Notes || []).forEach(note => {
                    notes.push({
                        staffId: ports.resolveStaffId(note),
                        midi: note?.halfTone != null ? note.halfTone + 12 : null,
                        isRest: !!(note?.isRest && note.isRest()),
                        isTieContinuation: !!(note?.NoteTie && note.NoteTie.StartNote && note.NoteTie.StartNote !== note)
                    });
                });
            });
            return { measureIndex, timestamp, notes };
        }
        function collectRenderablePreviewNotes(entries, previewDepthIndex) {
            const mergedNotes = new Map();
            (entries || []).forEach(entry => {
                (entry?.Notes || []).forEach(note => {
                    const staffId = ports.resolveStaffId(note);
                    if (!ports.isPracticeHandEnabled(staffId))
                        return;
                    if (!isRenderableAttackNote(note))
                        return;
                    const midi = note.halfTone + 12;
                    if (!ports.isMidiInRange(midi))
                        return;
                    const key = `${staffId}|${midi}`;
                    if (!mergedNotes.has(key)) {
                        mergedNotes.set(key, {
                            midi,
                            staffId,
                            state: `future${previewDepthIndex}-${getHandStatePrefix(staffId)}`
                        });
                    }
                });
            });
            return Array.from(mergedNotes.values());
        }
        function buildTimelineEvent(entries, measureIndex, timestamp) {
            return {
                measureIndex,
                timestamp,
                signature: makeEntrySignature(entries),
                notes: collectRenderablePreviewNotes(entries, 1)
            };
        }
        function restoreToMeasureAndTimestamp(targetMeasureIndex, targetTimestamp) {
            const cursor = ports.getCursor();
            if (!cursor)
                return;
            cursor.reset();
            const safetyMax = 100000;
            let safety = 0;
            while (!cursor.Iterator.EndReached && safety < safetyMax) {
                const measureIndex = cursor.Iterator.CurrentMeasureIndex;
                const timestamp = cursor.Iterator.currentTimeStamp?.RealValue ?? null;
                if (measureIndex === targetMeasureIndex && timestamp === targetTimestamp) {
                    break;
                }
                cursor.Iterator.moveToNext();
                safety += 1;
            }
            cursor.update();
        }
        function ensurePreviewTimelineBuilt() {
            if (!state.ledPreviewTimelineDirty && Array.isArray(state.ledPreviewTimeline) && state.ledPreviewTimeline.length > 0) {
                return state.ledPreviewTimeline;
            }
            const cursor = ports.getCursor();
            if (!cursor?.Iterator) {
                state.ledPreviewTimeline = [];
                return state.ledPreviewTimeline;
            }
            const savedMeasureIndex = cursor.Iterator.CurrentMeasureIndex;
            const savedTimestamp = cursor.Iterator.currentTimeStamp?.RealValue ?? null;
            const timeline = [];
            const safetyMax = 100000;
            let safety = 0;
            cursor.reset();
            while (!cursor.Iterator.EndReached && safety < safetyMax) {
                const entries = cursor.Iterator.CurrentVoiceEntries;
                if (entries && entries.length > 0) {
                    timeline.push(buildTimelineEvent(entries, cursor.Iterator.CurrentMeasureIndex, cursor.Iterator.currentTimeStamp?.RealValue ?? null));
                }
                cursor.Iterator.moveToNext();
                safety += 1;
            }
            restoreToMeasureAndTimestamp(savedMeasureIndex, savedTimestamp);
            state.ledPreviewTimeline = timeline;
            state.ledPreviewTimelineDirty = false;
            state.ledPreviewTraversalIndex = -1;
            return timeline;
        }
        function resolveTraversalIndex(currentEntries, currentMeasureIdx, currentTimestamp) {
            const timeline = ensurePreviewTimelineBuilt();
            if (!timeline.length)
                return -1;
            const signature = makeEntrySignature(currentEntries);
            const currentIndex = state.ledPreviewTraversalIndex;
            if (currentIndex >= 0 && currentIndex < timeline.length) {
                const currentEvent = timeline[currentIndex];
                if (currentEvent.measureIndex === currentMeasureIdx && currentEvent.timestamp === currentTimestamp && currentEvent.signature === signature) {
                    return currentIndex;
                }
            }
            const forwardIndex = findMatchingTimelineIndex(timeline, currentMeasureIdx, currentTimestamp, signature, currentIndex >= 0 ? currentIndex + 1 : 0);
            if (forwardIndex !== -1) {
                state.ledPreviewTraversalIndex = forwardIndex;
                return forwardIndex;
            }
            const restartIndex = findMatchingTimelineIndex(timeline, currentMeasureIdx, currentTimestamp, signature, 0);
            state.ledPreviewTraversalIndex = restartIndex;
            return restartIndex;
        }
        function collectFuturePreviewEvents(currentEntries, currentMeasureIdx, currentTimestamp, depth) {
            const requestedDepth = Math.max(0, Math.min(2, Number(depth) || 0));
            if (requestedDepth <= 0)
                return [];
            if (!state.isPlaying || state.countInActive)
                return [];
            ports.debugLog('LED_PREVIEW_CURSOR_EVENT', describeEntries(currentEntries, currentMeasureIdx, currentTimestamp));
            const timeline = ensurePreviewTimelineBuilt();
            const currentIndex = resolveTraversalIndex(currentEntries, currentMeasureIdx, currentTimestamp);
            if (!timeline.length || currentIndex < 0) {
                for (let i = 0; i < requestedDepth; i++) {
                    ports.debugLog(`LED_FUTURE_${i + 1}_SELECTED`, { skipped: true, reason: 'timeline-index-unresolved' });
                }
                return [];
            }
            const currentEvent = timeline[currentIndex];
            if (!currentEvent?.notes?.length) {
                for (let i = 0; i < requestedDepth; i++) {
                    ports.debugLog(`LED_FUTURE_${i + 1}_SELECTED`, { skipped: true, reason: 'current-event-has-no-renderable-attacks' });
                }
                return [];
            }
            const results = [];
            for (let i = currentIndex + 1; i < timeline.length && results.length < requestedDepth; i++) {
                const event = timeline[i];
                if (!event?.notes?.length)
                    continue;
                const depthIndex = results.length + 1;
                const previewEvent = {
                    measureIndex: event.measureIndex,
                    timestamp: event.timestamp,
                    notes: event.notes.map(note => ({
                        ...note,
                        state: `future${depthIndex}-${getHandStatePrefix(note.staffId)}`
                    }))
                };
                results.push(previewEvent);
                ports.debugLog(`LED_FUTURE_${depthIndex}_SELECTED`, {
                    measureIndex: previewEvent.measureIndex,
                    timestamp: previewEvent.timestamp,
                    notes: previewEvent.notes.map(note => ({ midi: note.midi, staffId: note.staffId, state: note.state }))
                });
            }
            for (let i = results.length; i < requestedDepth; i++) {
                ports.debugLog(`LED_FUTURE_${i + 1}_SELECTED`, { skipped: true, reason: 'end-reached-or-no-playable-event' });
            }
            return results;
        }
        return { describeEntries, collectRenderablePreviewNotes, buildTimelineEvent,
            restoreToMeasureAndTimestamp, ensurePreviewTimelineBuilt,
            resolveTraversalIndex, collectFuturePreviewEvents };
    }
    PianoTrainerScoreTraversal.create = create;
})(PianoTrainerScoreTraversal || (PianoTrainerScoreTraversal = {}));
//# sourceMappingURL=score-traversal.js.map