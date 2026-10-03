import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerFeedbackState} from './feedback-state';
import type {PianoTrainerScoring} from './scoring';
import type {LegacyAppState} from '../state/model';
// Build expectations in original source order; do not combine distinct staves.
export namespace PianoTrainerExpectedNotes {
    export interface Ports {
        state: Pick<LegacyAppState, 'expectedNotes' | 'visualNotesToStart' | 'outOfRangeCurrentNotes' | 'practice' | 'mode' | 'baseBpm' | 'speedPercent' | 'realtimeWrongPressInCurrentContext' | 'earlyGraceReservations' | 'pressedKeys' | 'heldCorrectNotes' | 'preExpectedHeldNotes'>;
        getHandRole(staffId: number | null): PianoTrainerDomain.HandRole | null;
        isMidiInRange(midi: number): boolean;
        getAnchor(ref: PianoTrainerDomain.NoteRef, measureIndex: number, staffIndex: number): PianoTrainerDomain.SvgPoint | null;
        describeNote(ref: PianoTrainerDomain.NoteRef, measureIndex: number, staffIndex: number): Readonly<Record<string, unknown>>;
        feedback: Pick<PianoTrainerFeedbackState.Service, 'drawFeedbackNote'>;
        scoring: PianoTrainerScoring.Service;
        getTraversalTimestamp(): number | null;
        pushDebugFrame(frame: PianoTrainerDomain.FeedbackFrameInput): void;
        debugAnchor(name: string, detail: Readonly<Record<string, unknown>>): void;
        debugLog(name: string, detail: Readonly<Record<string, unknown>>): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        function build(entries: Iterable<PianoTrainerDomain.PracticeSourceEntry>, currentMeasureIdx: number, currentTimestamp: number | null = null) {
            state.expectedNotes = [];
            state.visualNotesToStart = [];
            state.outOfRangeCurrentNotes = [];

            const mergedExpected = new Map<string, PianoTrainerDomain.ExpectedNote>();
            const mergedVisuals = new Map<string, PianoTrainerDomain.PendingVisual>();
            const mergedOutOfRange = new Map<string, PianoTrainerDomain.OutOfRangeNote>();

            for (const e of entries) {
                const sid = e.staffId;
                const handRole = ports.getHandRole(sid);
                const isRH = handRole === 'right';
                const isLH = handRole === 'left';
                const isPracticingThisHand = (isRH && state.practice.right) || (isLH && state.practice.left);

                if (isPracticingThisHand) {
                    for (const n of e.notes) {
                        const isInvisibleCue =
                            n.notehead === 'none' ||
                            n.printObject === false ||
                            n.cue === true;

                        if (isInvisibleCue) {
                            continue;
                        }

                        if (!n.rest) {
                            const isTieContinuation = n.tieContinuation;

                            if (!isTieContinuation) {
                                const midi = n.midi;
                                const key = `${sid}|${midi}`;

                                if (!ports.isMidiInRange(midi)) {
                                    if (!mergedOutOfRange.has(key)) {
                                        mergedOutOfRange.set(key, { midi, staffId: sid, mIdx: currentMeasureIdx });
                                    }
                                    continue;
                                }

                                const combinedLength = n.combinedLengthWhole;

                                const noteDurationSeconds = (combinedLength * 4) * (60 / (state.baseBpm * state.speedPercent));
                                const durationMs = noteDurationSeconds * 1000;

                                let visualDurationMs = durationMs * 0.85;
                                let visualEndTimestamp: number | null = null;
                                if (state.mode === 'wait' && Number.isFinite(currentTimestamp)) {
                                    visualEndTimestamp = currentTimestamp! + (combinedLength * 0.85);
                                }

                                const staffIdx = Number(sid) - 1;
                                const anchor = ports.getAnchor(n.noteRef, currentMeasureIdx, staffIdx);

                                const existingExpected = mergedExpected.get(key);
                                if (!existingExpected) {
                                    mergedExpected.set(key, { midi, staffId: sid, hit: false, mIdx: currentMeasureIdx, anchor, noteRef: n.noteRef });
                                } else {
                                    ports.debugAnchor('EXPECTED_NOTE_DEDUPE_COLLISION', {
                                        key,
                                        currentMeasureIdx,
                                        incoming: {
                                            midi,
                                            staffId: sid,
                                            anchor: anchor ? { x: anchor.x, y: anchor.y } : null,
                                            note: ports.describeNote(n.noteRef, currentMeasureIdx, staffIdx)
                                        },
                                        existing: {
                                            midi: existingExpected.midi,
                                            staffId: existingExpected.staffId,
                                            anchor: existingExpected.anchor ? { x: existingExpected.anchor.x, y: existingExpected.anchor.y } : null
                                        }
                                    });
                                    if (!existingExpected.anchor && anchor) {
                                        existingExpected.anchor = anchor;
                                        existingExpected.noteRef = n.noteRef;
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
                                            ? Math.max(existingVisual.endTimestamp!, visualEndTimestamp!)
                                            : visualEndTimestamp;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            state.expectedNotes = Array.from(mergedExpected.values());
            state.visualNotesToStart = Array.from(mergedVisuals.values());
            state.outOfRangeCurrentNotes = Array.from(mergedOutOfRange.values());
            state.realtimeWrongPressInCurrentContext = false;

            const consumedReservationMidis: number[] = [];
            state.expectedNotes.forEach(expected => {
                const reservation = state.earlyGraceReservations.get(expected.midi);
                if (!reservation) return;
                if (reservation.measureIndex !== currentMeasureIdx || reservation.timestamp !== currentTimestamp) return;

                const isStillHeld = state.pressedKeys.has(expected.midi);
                const canCarryTap = !!reservation.allowTapCarry;
                if (!isStillHeld && !canCarryTap) return;

                expected.hit = true;
                if (isStillHeld) {
                    state.heldCorrectNotes.set(expected.midi, expected.staffId);
                    state.preExpectedHeldNotes.add(expected.midi);
                }
                ports.feedback.drawFeedbackNote(expected.midi, true, expected.staffId, currentMeasureIdx, expected.anchor);
                ports.scoring.correct();
                consumedReservationMidis.push(expected.midi);
            });

            if (state.earlyGraceReservations.size > 0) {
                for (const [midi, reservation] of state.earlyGraceReservations.entries()) {
                    const isPastTarget = reservation.measureIndex < currentMeasureIdx || (
                        reservation.measureIndex === currentMeasureIdx && Number(reservation.timestamp) < Number(currentTimestamp)
                    );
                    const isCurrentTargetWithoutExpected = reservation.measureIndex === currentMeasureIdx
                        && reservation.timestamp === currentTimestamp
                        && !state.expectedNotes.some(expected => expected.midi === midi);

                    if (isPastTarget || isCurrentTargetWithoutExpected || consumedReservationMidis.includes(midi)) {
                        state.earlyGraceReservations.delete(midi);
                    }
                }
            }

            if (consumedReservationMidis.length > 0) {
                ports.scoring.updateDisplay();
            }

            ports.pushDebugFrame({
                kind: 'expected',
                measureIndex: currentMeasureIdx,
                timestamp: ports.getTraversalTimestamp(),
                notes: state.expectedNotes.map(n => ({
                    midi: n.midi,
                    staffId: n.staffId,
                    anchor: n.anchor,
                    hit: n.hit,
                    kind: 'expected'
                }))
            });

            ports.debugLog('EXPECTED_NOTES_BUILT', {
                measureIndex: currentMeasureIdx,
                count: state.expectedNotes.length,
                outOfRangeCount: state.outOfRangeCurrentNotes.length,
                expected: state.expectedNotes.map(n => ({
                    midi: n.midi,
                    staffId: n.staffId,
                    mIdx: n.mIdx,
                    hit: n.hit,
                    anchor: n.anchor ? { x: n.anchor.x, y: n.anchor.y } : null
                })),
                outOfRange: state.outOfRangeCurrentNotes.map(n => ({
                    midi: n.midi,
                    staffId: n.staffId,
                    mIdx: n.mIdx
                })),
                visuals: state.visualNotesToStart.map(n => ({
                    midi: n.midi,
                    staffId: n.staffId,
                    durationMs: n.durationMs,
                    mIdx: n.mIdx
                }))
            });
        }
        return {build};
    }
    export type Service = ReturnType<typeof create>;
}
