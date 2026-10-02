// feedback-engine.js
// Remaining legacy matching, expected-note construction and feedback state.
// Geometry/overlays are owned by src/render; keep their port contract stable.
//
// WARNING:
// - Do not recalculate beam layout here.
// - Do not change OSMD/VexFlow coordinate assumptions casually.
// - Do not “clean up” notehead selection heuristics without targeted regression tests.
// - Keep feedback fixes isolated from playback scheduling and general UI changes.
//
// Fragile cases intentionally preserved here:
// - ornaments / lead-ins / non-note glyph clutter near noteheads
// - side-shifted same-stem chord clusters
// - augmentation dots and dot-like SVG shapes
// - fingering / technical / lyric / annotation rejection
// - cue or hidden notes that should not generate feedback expectations

// ==========================================
// VISUAL LOOPER ENGINE
// ==========================================

function renderLooper() {
    GeometryEngine.renderLooper();
}

function enforceLooperBounds() {
    if (!document.getElementById('check-looper').checked || !osmd.cursor) return;
    
    const minLoop = AppState.looper.min;
    const maxLoop = AppState.looper.max;
    const current = osmd.cursor.Iterator.CurrentMeasureIndex + 1;
    
    if (current < minLoop || current > maxLoop) {
        osmd.cursor.reset();
        while (!osmd.cursor.Iterator.EndReached && osmd.cursor.Iterator.CurrentMeasureIndex < minLoop - 1) {
            osmd.cursor.Iterator.moveToNext();
        }
        osmd.cursor.update();
        handleAutoScroll();
    }
}

// ==========================================
// VISUAL FEEDBACK & AUTO-SCROLL
// ==========================================

function getFeedbackContextKey(measureIndex = null, timestamp = null) {
    return `${Number.isFinite(measureIndex) ? measureIndex : 'na'}|${Number.isFinite(timestamp) ? timestamp : 'na'}`;
}

function getCurrentFeedbackContext() {
    const measureIndex = AppState.currentExpectedContext?.measureIndex ?? osmd?.cursor?.Iterator?.CurrentMeasureIndex ?? null;
    const timestamp = AppState.currentExpectedContext?.timestamp ?? osmd?.cursor?.Iterator?.currentTimeStamp?.RealValue ?? null;
    return {
        measureIndex,
        timestamp,
        key: getFeedbackContextKey(measureIndex, timestamp)
    };
}

function registerHeldIncorrectFeedback(midi, targetStaffId, forceMIdx = null, anchorOrExactY = null) {
    if (!AppState.feedbackEnabled) return;

    const anchor = resolveFeedbackAnchor(midi, targetStaffId, forceMIdx, anchorOrExactY);
    if (!anchor) return;

    const context = getCurrentFeedbackContext();
    AppState.activeHeldIncorrectFeedback.set(midi, {
        midi,
        staffId: targetStaffId,
        anchor,
        isCorrect: false,
        measureIndex: context.measureIndex,
        timestamp: context.timestamp,
        contextKey: context.key
    });

    renderFeedbackOverlay();
    window.FeedbackDebug?.pushStickyDebugFrame?.({
        kind: 'feedback',
        measureIndex: forceMIdx,
        notes: [{
            midi,
            staffId: targetStaffId,
            anchor,
            hit: false,
            kind: 'feedback'
        }]
    });
}

function releaseHeldIncorrectFeedback(midi) {
    const marker = AppState.activeHeldIncorrectFeedback.get(midi);
    if (!marker) return;

    AppState.activeHeldIncorrectFeedback.delete(midi);
    AppState.releasedIncorrectFeedback.push(marker);
    renderFeedbackOverlay();
}

function drawFeedbackNote(midi, isCorrect, targetStaffId, forceMIdx = null, anchorOrExactY = null) {
    if (!AppState.feedbackEnabled) return;

    const anchor = resolveFeedbackAnchor(midi, targetStaffId, forceMIdx, anchorOrExactY);
    if (!anchor) return;

    const context = getCurrentFeedbackContext();
    const marker = {
        midi,
        staffId: targetStaffId,
        anchor,
        isCorrect: !!isCorrect,
        measureIndex: forceMIdx,
        timestamp: context.timestamp,
        contextKey: getFeedbackContextKey(forceMIdx, context.timestamp)
    };

    if (isCorrect) {
        AppState.correctFeedbackHistory.push(marker);
    } else {
        AppState.releasedIncorrectFeedback.push(marker);
    }

    renderFeedbackOverlay();
    window.FeedbackDebug?.pushStickyDebugFrame?.({
        kind: 'feedback',
        measureIndex: forceMIdx,
        notes: [{
            midi,
            staffId: targetStaffId,
            anchor,
            hit: isCorrect,
            kind: 'feedback'
        }]
    });
}

function findExpectedMatchForMidi(midi) {
    const candidates = AppState.expectedNotes.filter(n => n.midi === midi && !n.hit);
    if (AppState.debugMatchLogs) {
        debugLogEvent('MATCH_CANDIDATES', {
            midi,
            count: candidates.length,
            candidates: candidates.map(n => ({
                midi: n.midi,
                staffId: n.staffId,
                mIdx: n.mIdx,
                hit: n.hit,
                anchor: n.anchor ? { x: n.anchor.x, y: n.anchor.y } : null
            }))
        });
    }
    if (candidates.length === 0) return null;
    if (candidates.length === 1) {
        if (AppState.debugMatchLogs) {
            debugLogEvent('MATCH_CHOSEN', {
                midi,
                reason: 'single-candidate',
                chosen: {
                    staffId: candidates[0].staffId,
                    mIdx: candidates[0].mIdx,
                    anchor: candidates[0].anchor ? { x: candidates[0].anchor.x, y: candidates[0].anchor.y } : null
                }
            });
        }
        return candidates[0];
    }

    const cursorX = getCursorSvgX();
    if (cursorX == null) {
        if (AppState.debugMatchLogs) {
            debugLogEvent('MATCH_CHOSEN', {
                midi,
                reason: 'no-cursor-x',
                chosen: {
                    staffId: candidates[0].staffId,
                    mIdx: candidates[0].mIdx,
                    anchor: candidates[0].anchor ? { x: candidates[0].anchor.x, y: candidates[0].anchor.y } : null
                }
            });
        }
        return candidates[0];
    }

    const chosen = candidates
        .slice()
        .sort((a, b) => {
            const ax = a.anchor?.x ?? cursorX;
            const bx = b.anchor?.x ?? cursorX;
            return Math.abs(ax - cursorX) - Math.abs(bx - cursorX);
        })[0];

    if (AppState.debugMatchLogs) {
        debugLogEvent('MATCH_CHOSEN', {
            midi,
            reason: 'closest-to-cursor-x',
            cursorX,
            chosen: {
                staffId: chosen.staffId,
                mIdx: chosen.mIdx,
                anchor: chosen.anchor ? { x: chosen.anchor.x, y: chosen.anchor.y } : null
            }
        });
    }

    return chosen;
}

//editing function buildexpectednotefromentries to let playback ring through tied notes//
function getCombinedTieLength(note) {
    if (!note) return 0;

    let total = 0;
    let current = note;
    const seen = new Set();

    while (current && !seen.has(current)) {
        seen.add(current);

        if (current.Length && typeof current.Length.RealValue === 'number') {
            total += current.Length.RealValue;
        }

        const tie = current.NoteTie;
        if (!tie) break;

        // Prefer an explicit next note link if present
        const next =
            tie.Notes?.find(n => n !== current) ||
            tie.NextNote ||
            tie.nextNote ||
            null;

        if (!next) break;

        // Only combine true same-pitch ties
        if (next.halfTone !== current.halfTone) break;

        current = next;
    }

    return total || (note.Length?.RealValue ?? 0);
}

function buildExpectedNotesFromEntries(entries, currentMeasureIdx, currentTimestamp = null) {
    AppState.expectedNotes = [];
    AppState.visualNotesToStart = [];
    AppState.outOfRangeCurrentNotes = [];

    const mergedExpected = new Map();
    const mergedVisuals = new Map();
    const mergedOutOfRange = new Map();

    entries.forEach(e => {
        const sid = window.getResolvedStaffAssignmentIdFromEntry ? window.getResolvedStaffAssignmentIdFromEntry(e) : Number(e.Notes[0]?.ParentStaff?.id);
        const handRole = window.getAssignedHandRoleForStaff ? window.getAssignedHandRoleForStaff(sid) : null;
        const isRH = handRole === 'right';
        const isLH = handRole === 'left';
        const isPracticingThisHand = (isRH && AppState.practice.right) || (isLH && AppState.practice.left);

        if (isPracticingThisHand) {
            e.Notes.forEach(n => {
                const isInvisibleCue =
                    n.Notehead === 'none' ||
                    n.PrintObject === false ||
                    n.isCueNote === true;

                if (isInvisibleCue) {
                    return;
                }

                if (!n.isRest()) {
                    const isTieContinuation = n.NoteTie && n.NoteTie.StartNote !== n;

                    if (!isTieContinuation) {
                        const midi = n.halfTone + 12;
                        const key = `${sid}|${midi}`;

                        if (!isMidiInPlayerRange(midi)) {
                            if (!mergedOutOfRange.has(key)) {
                                mergedOutOfRange.set(key, { midi, staffId: sid, mIdx: currentMeasureIdx });
                            }
                            return;
                        }

                        const combinedLength = (n.NoteTie && n.NoteTie.StartNote === n)
                            ? getCombinedTieLength(n)
                            : n.Length.RealValue;

                        const noteDurationSeconds = (combinedLength * 4) * (60 / (AppState.baseBpm * AppState.speedPercent));
                        const durationMs = noteDurationSeconds * 1000;

                        let visualDurationMs = durationMs * 0.85;
                        let visualEndTimestamp = null;
                        if (AppState.mode === 'wait' && Number.isFinite(currentTimestamp)) {
                            visualEndTimestamp = currentTimestamp + (combinedLength * 0.85);
                        }

                        const staffIdx = sid - 1;
                        const anchor = GeometryEngine.getNoteAnchor(n, currentMeasureIdx, staffIdx);

                        const existingExpected = mergedExpected.get(key);
                        if (!existingExpected) {
                            mergedExpected.set(key, { midi, staffId: sid, hit: false, mIdx: currentMeasureIdx, anchor, noteRef: getScoreNoteRef(n) });
                        } else {
                            debugLogAnchorResolution('EXPECTED_NOTE_DEDUPE_COLLISION', {
                                key,
                                currentMeasureIdx,
                                incoming: {
                                    midi,
                                    staffId: sid,
                                    anchor: anchor ? { x: anchor.x, y: anchor.y } : null,
                                    note: describeLogicalNoteForDebug(n, currentMeasureIdx, staffIdx)
                                },
                                existing: {
                                    midi: existingExpected.midi,
                                    staffId: existingExpected.staffId,
                                    anchor: existingExpected.anchor ? { x: existingExpected.anchor.x, y: existingExpected.anchor.y } : null
                                }
                            });
                            if (!existingExpected.anchor && anchor) {
                                existingExpected.anchor = anchor;
                                existingExpected.noteRef = getScoreNoteRef(n);
                            }
                        }

                        const existingVisual = mergedVisuals.get(key);
                        if (!existingVisual) {
                            mergedVisuals.set(key, {
                                midi,
                                staffId: sid,
                                durationMs: visualDurationMs,
                                endTimestamp: visualEndTimestamp,
                                mIdx: currentMeasureIdx
                            });
                        } else {
                            existingVisual.durationMs = Math.max(existingVisual.durationMs, visualDurationMs);
                            if (Number.isFinite(visualEndTimestamp)) {
                                existingVisual.endTimestamp = Number.isFinite(existingVisual.endTimestamp)
                                    ? Math.max(existingVisual.endTimestamp, visualEndTimestamp)
                                    : visualEndTimestamp;
                            }
                        }
                    }
                }
            });
        }
    });

    AppState.expectedNotes = Array.from(mergedExpected.values());
    AppState.visualNotesToStart = Array.from(mergedVisuals.values());
    AppState.outOfRangeCurrentNotes = Array.from(mergedOutOfRange.values());
    AppState.realtimeWrongPressInCurrentContext = false;

    const consumedReservationMidis = [];
    AppState.expectedNotes.forEach(expected => {
        const reservation = AppState.earlyGraceReservations.get(expected.midi);
        if (!reservation) return;
        if (reservation.measureIndex !== currentMeasureIdx || reservation.timestamp !== currentTimestamp) return;

        const isStillHeld = AppState.pressedKeys.has(expected.midi);
        const canCarryTap = !!reservation.allowTapCarry;
        if (!isStillHeld && !canCarryTap) return;

        expected.hit = true;
        if (isStillHeld) {
            AppState.heldCorrectNotes.set(expected.midi, expected.staffId);
            AppState.preExpectedHeldNotes.add(expected.midi);
        }
        drawFeedbackNote(expected.midi, true, expected.staffId, currentMeasureIdx, expected.anchor);
        AppState.score.correct++;
        consumedReservationMidis.push(expected.midi);
    });

    if (AppState.earlyGraceReservations.size > 0) {
        for (const [midi, reservation] of AppState.earlyGraceReservations.entries()) {
            const isPastTarget = reservation.measureIndex < currentMeasureIdx || (
                reservation.measureIndex === currentMeasureIdx && reservation.timestamp < currentTimestamp
            );
            const isCurrentTargetWithoutExpected = reservation.measureIndex === currentMeasureIdx
                && reservation.timestamp === currentTimestamp
                && !AppState.expectedNotes.some(expected => expected.midi === midi);

            if (isPastTarget || isCurrentTargetWithoutExpected || consumedReservationMidis.includes(midi)) {
                AppState.earlyGraceReservations.delete(midi);
            }
        }
    }

    if (consumedReservationMidis.length > 0) {
        updateScoreDisplay();
    }

    window.FeedbackDebug?.pushStickyDebugFrame?.({
        kind: 'expected',
        measureIndex: currentMeasureIdx,
        timestamp: osmd?.cursor?.Iterator?.currentTimeStamp?.RealValue ?? null,
        notes: AppState.expectedNotes.map(n => ({
            midi: n.midi,
            staffId: n.staffId,
            anchor: n.anchor,
            hit: n.hit,
            kind: 'expected'
        }))
    });

    debugLogEvent('EXPECTED_NOTES_BUILT', {
        measureIndex: currentMeasureIdx,
        count: AppState.expectedNotes.length,
        outOfRangeCount: AppState.outOfRangeCurrentNotes.length,
        expected: AppState.expectedNotes.map(n => ({
            midi: n.midi,
            staffId: n.staffId,
            mIdx: n.mIdx,
            hit: n.hit,
            anchor: n.anchor ? { x: n.anchor.x, y: n.anchor.y } : null
        })),
        outOfRange: AppState.outOfRangeCurrentNotes.map(n => ({
            midi: n.midi,
            staffId: n.staffId,
            mIdx: n.mIdx
        })),
        visuals: AppState.visualNotesToStart.map(n => ({
            midi: n.midi,
            staffId: n.staffId,
            durationMs: n.durationMs,
            mIdx: n.mIdx
        }))
    });
}

function processMissedNotes() {
    let missedCount = 0;
    const suppressMissedVisuals = AppState.mode === 'realtime' && AppState.realtimeWrongPressInCurrentContext;

    AppState.expectedNotes.forEach(n => {
        if (!n.hit) {
            if (!suppressMissedVisuals) {
                drawFeedbackNote(n.midi, false, n.staffId, n.mIdx, n.anchor);
            }
            AppState.score.wrong++;
            missedCount++;
        }
    });

    if (missedCount > 0) {
        updateScoreDisplay();
    }
}
