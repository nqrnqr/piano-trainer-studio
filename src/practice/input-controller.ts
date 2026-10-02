// Preserve the P5 input contract and side-effect order; all external effects use ports.
namespace PianoTrainerInputController {
    export interface Ports {
        state: Pick<LegacyAppState, 'pressedKeys' | 'ledCalibrationMode' | 'isPlaying' | 'practice' | 'mode' | 'realtimeWrongPressInCurrentContext' | 'heldCorrectNotes' | 'preExpectedHeldNotes' | 'earlyGraceReservations'>;
        audio: {
            monitorNoteOn(midi: number, source: PianoTrainerDomain.InputSource, velocity: number): void;
            monitorNoteOff(midi: number, source: PianoTrainerDomain.InputSource): void;
        };
        matching: PianoTrainerInputMatching.Service;
        early: PianoTrainerEarlyGrace.Service;
        feedback: PianoTrainerFeedbackState.Service;
        scoring: PianoTrainerScoring.Service;
        selectCalibration(midi: number): void;
        renderKeyboard(): void;
        advanceAfterHit(): void;
        debugLog(name: string, detail: Readonly<Record<string, unknown>>): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        function receive(midi: number, isPressed: boolean, source: PianoTrainerDomain.InputSource = 'midi', velocity = 100) {
            if (isPressed) {
                state.pressedKeys.add(midi);

                ports.audio.monitorNoteOn(midi, source, velocity);

                if (state.ledCalibrationMode) {
                    ports.selectCalibration(midi);
                    ports.renderKeyboard();
                    return;
                }

                if (state.isPlaying) {
                    const expectedMatch = ports.matching.findExpectedMatchForMidi(midi);
                    const sustainMatch = !expectedMatch ? ports.matching.findSatisfiedOrSustainedMatchForMidi(midi) : null;
                    const repeatCarryReservation = (!expectedMatch && sustainMatch?.source === 'already-hit')
                        ? ports.early.tryReserveSingleHandEarlyGrace(midi)
                        : null;
                    const realtimeUpcomingReservation = (!expectedMatch && !sustainMatch && !repeatCarryReservation)
                        ? ports.early.tryReserveRealtimeUpcomingHeldNote(midi)
                        : null;
                    const earlyGraceReservation = (!expectedMatch && !sustainMatch && !realtimeUpcomingReservation)
                        ? ports.early.tryReserveSingleHandEarlyGrace(midi)
                        : (realtimeUpcomingReservation || repeatCarryReservation);
                    const isCorrect = !!expectedMatch;
                    const isAcceptedRepeat = !expectedMatch && !!sustainMatch;
                    const isEarlyGraceReserved = !!earlyGraceReservation;
                    const targetStaffId = expectedMatch ? expectedMatch.staffId : (sustainMatch ? sustainMatch.staffId : (earlyGraceReservation ? earlyGraceReservation.staffId : null));

                    if (state.practice.left || state.practice.right) {
                        const forceMIdx = expectedMatch ? expectedMatch.mIdx : null;
                        const anchor = expectedMatch ? expectedMatch.anchor : null;

                        ports.debugLog('KEY_PRESS_MATCH_RESULT', {
                            midi,
                            isCorrect,
                            isAcceptedRepeat,
                            isEarlyGraceReserved,
                            targetStaffId,
                            forceMIdx,
                            sustainMatch: sustainMatch ? {
                                midi: sustainMatch.midi,
                                staffId: sustainMatch.staffId,
                                mIdx: sustainMatch.mIdx,
                                source: sustainMatch.source
                            } : null,
                            anchor: anchor ? { x: anchor.x, y: anchor.y } : null,
                            expectedMatch: expectedMatch ? {
                                midi: expectedMatch.midi,
                                staffId: expectedMatch.staffId,
                                mIdx: expectedMatch.mIdx,
                                hit: expectedMatch.hit
                            } : null
                        });

                        if (isCorrect) {
                            ports.feedback.drawFeedbackNote(midi, true, targetStaffId, forceMIdx, anchor);
                            ports.scoring.correct();
                            state.heldCorrectNotes.set(midi, targetStaffId);
                            ports.scoring.updateDisplay();
                        } else if (isAcceptedRepeat || isEarlyGraceReserved) {
                            state.heldCorrectNotes.set(midi, targetStaffId);
                        } else {
                            if (state.mode === 'realtime') {
                                state.realtimeWrongPressInCurrentContext = true;
                            }
                            ports.feedback.registerHeldIncorrectFeedback(midi, targetStaffId, forceMIdx, anchor);
                            ports.scoring.wrong();
                            ports.scoring.updateDisplay();
                        }
                    }

                    if (isCorrect) {
                        expectedMatch!.hit = true;
                        if (state.mode === 'wait' || state.mode === 'follow') {
                            ports.advanceAfterHit();
                        }
                    }
                }
            } else {
                state.pressedKeys.delete(midi);
                state.heldCorrectNotes.delete(midi);
                state.preExpectedHeldNotes.delete(midi);
                const earlyReservation = state.earlyGraceReservations.get(midi);
                if (!earlyReservation || !earlyReservation.allowTapCarry) {
                    state.earlyGraceReservations.delete(midi);
                }
                ports.feedback.releaseHeldIncorrectFeedback(midi);

                ports.audio.monitorNoteOff(midi, source);
            }

            ports.renderKeyboard();
        }
        return {receive, handle: (input: PianoTrainerDomain.TrainerNoteInput) => receive(input.note, input.kind === 'note-on', input.source, input.velocity)};
    }
    export type Service = ReturnType<typeof create>;
}
