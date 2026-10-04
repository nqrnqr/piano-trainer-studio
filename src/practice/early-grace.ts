import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerTiming} from '../domain/timing';
import type {PianoTrainerScoreTraversal} from '../score/score-traversal';
import type {LegacyAppState} from '../state/model';
// Preserve the P5 input contract and side-effect order; all external effects use ports.
export namespace PianoTrainerEarlyGrace {
    export interface PracticeWindow {
        handRole: PianoTrainerDomain.HandRole;
        timeline: PianoTrainerDomain.PreviewTimelineEvent[];
        currentIndex: number; referenceEvent: PianoTrainerDomain.PreviewEvent | null; referenceIndex: number;
        nextEvent: PianoTrainerDomain.PreviewEvent | null; nextIndex: number;
    }
    export interface Ports {
        state: Pick<LegacyAppState, 'practice' | 'currentExpectedContext' | 'expectedNotes' | 'isPlaying' | 'mode' | 'earlyGraceReservations' | 'heldCorrectNotes' | 'preExpectedHeldNotes' | 'ledPreviewTraversalIndex'>;
        getHandRole(staffId: number | null): PianoTrainerDomain.HandRole | null;
        isPracticeHandEnabled(staffId: number | null): boolean;
        getTimeline(): PianoTrainerDomain.PreviewTimelineEvent[];
        findTimelineIndex: typeof PianoTrainerScoreTraversal.findMatchingTimelineIndex;
        getBeatsToWait: PianoTrainerTiming.Api['getTraversalBeatsToWait'];
        getMeasureTimingInfo(measureIndex: number | undefined): PianoTrainerTiming.MeasureTimingInfo | null | undefined;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        function getSinglePracticedHandRole(): PianoTrainerDomain.HandRole | null {
            const left = !!state.practice.left;
            const right = !!state.practice.right;
            if (left === right) return null;
            return left ? 'left' : 'right';
        }

        function getRenderableNotesForHandFromTimelineEvent(event: PianoTrainerDomain.PreviewEvent | null | undefined, handRole: PianoTrainerDomain.HandRole | null) {
            if (!event?.notes?.length || !handRole) return [];
            return event.notes.filter(note => ports.getHandRole(note.staffId) === handRole);
        }

        function findSingleHandPracticeTimelineWindow(): PracticeWindow | null {
            const handRole = getSinglePracticedHandRole();
            const ctx = state.currentExpectedContext;
            if (!handRole || !ctx) return null;

            const timeline = ports.getTimeline();
            if (!Array.isArray(timeline) || timeline.length === 0) return null;

            const exactIndex = ctx.traceStepIndex === undefined ? -1 : timeline.findIndex(event => event.traceStepIndex === ctx.traceStepIndex);
            const currentIndex = exactIndex >= 0 ? exactIndex : ports.findTimelineIndex(
                timeline,
                ctx.measureIndex,
                ctx.timestamp,
                ctx.signature,
                0
            );
            if (currentIndex < 0) return null;

            let referenceEvent: PianoTrainerDomain.PreviewEvent | null = null;
            let referenceIndex = -1;
            for (let i = currentIndex; i >= 0; i--) {
                const notes = getRenderableNotesForHandFromTimelineEvent(timeline[i], handRole);
                if (notes.length > 0) {
                    referenceEvent = {
                        // Nonempty filtered notes prove this timeline entry exists.
                        measureIndex: timeline[i]!.measureIndex,
                        timestamp: timeline[i]!.timestamp,
                        notes
                    };
                    referenceIndex = i;
                    break;
                }
            }

            let nextEvent: PianoTrainerDomain.PreviewEvent | null = null;
            let nextIndex = -1;
            for (let i = currentIndex + 1; i < timeline.length; i++) {
                const notes = getRenderableNotesForHandFromTimelineEvent(timeline[i], handRole);
                if (notes.length > 0) {
                    nextEvent = {
                        measureIndex: timeline[i]!.measureIndex,
                        timestamp: timeline[i]!.timestamp,
                        notes
                    };
                    nextIndex = i;
                    break;
                }
            }

            return {
                handRole,
                timeline,
                currentIndex,
                referenceEvent,
                referenceIndex,
                nextEvent,
                nextIndex
            };
        }

        function findNextSingleHandPracticeTimelineEvent() {
            return findSingleHandPracticeTimelineWindow()?.nextEvent || null;
        }

        function getSingleHandPracticeBeatsUntilNextEvent(windowInfo: PracticeWindow | null | undefined) {
            const nextEvent = windowInfo?.nextEvent;
            if (!nextEvent) return Number.POSITIVE_INFINITY;

            const referenceEvent = windowInfo?.referenceEvent;
            if (!referenceEvent) {
                const ctx = state.currentExpectedContext;
                if (!ctx || !Number.isFinite(ctx.measureIndex) || !Number.isFinite(ctx.timestamp)) {
                    return Number.POSITIVE_INFINITY;
                }
                return ports.getBeatsToWait({
                    currentMeasureIdx: ctx.measureIndex,
                    currentTimestamp: ctx.timestamp,
                    nextMeasureIdx: nextEvent.measureIndex,
                    nextTimestamp: nextEvent.timestamp,
                    fallbackLength: 0.25,
                    getMeasureTimingInfo: ports.getMeasureTimingInfo
                });
            }

            return ports.getBeatsToWait({
                currentMeasureIdx: referenceEvent.measureIndex,
                currentTimestamp: referenceEvent.timestamp,
                nextMeasureIdx: nextEvent.measureIndex,
                nextTimestamp: nextEvent.timestamp,
                fallbackLength: 0.25,
                getMeasureTimingInfo: ports.getMeasureTimingInfo
            });
        }

        function tryReserveSingleHandEarlyGrace(midi: number) {
            if (!state.isPlaying) return null;
            if (state.mode !== 'follow' && state.mode !== 'realtime') return null;
            if (!getSinglePracticedHandRole()) return null;
            if (state.expectedNotes.length > 0 && !state.expectedNotes.every(n => n.hit)) return null;

            const practiceWindow = findSingleHandPracticeTimelineWindow();
            const nextEvent = practiceWindow?.nextEvent || null;
            if (!nextEvent) return null;

            const matched = nextEvent.notes.find(note => note.midi === midi);
            if (!matched) return null;

            const beatsUntilTarget = getSingleHandPracticeBeatsUntilNextEvent(practiceWindow);
            // In Follow Me, early grace should be based on the next cursor for the practiced hand only.
            // Once we have identified that next practiced-hand event, keep the reservation even if the user
            // releases before the app reaches any intervening playback-hand cursor steps.
            const allowTapCarry = state.mode === 'follow'
                ? true
                : (Number.isFinite(beatsUntilTarget) && beatsUntilTarget <= 1.05);
            const reservation: PianoTrainerDomain.EarlyGraceReservation = {
                midi,
                staffId: matched.staffId,
                measureIndex: nextEvent.measureIndex,
                timestamp: nextEvent.timestamp,
                allowTapCarry,
                beatsUntilTarget: Number.isFinite(beatsUntilTarget) ? beatsUntilTarget : null
            };

            state.earlyGraceReservations.set(midi, reservation);
            state.heldCorrectNotes.set(midi, matched.staffId);
            state.preExpectedHeldNotes.add(midi);
            return reservation;
        }

        function tryReserveRealtimeUpcomingHeldNote(midi: number) {
            if (!state.isPlaying || state.mode !== 'realtime') return null;
            if (!Number.isFinite(midi)) return null;
            if (!state.currentExpectedContext) return null;

            const timeline = ports.getTimeline();
            if (!Array.isArray(timeline) || timeline.length === 0) return null;

            const ctx = state.currentExpectedContext;
            const exactIndex = ctx.traceStepIndex === undefined ? -1 : timeline.findIndex(event => event.traceStepIndex === ctx.traceStepIndex);
            const currentIndex = exactIndex >= 0 ? exactIndex : ports.findTimelineIndex(
                timeline,
                ctx.measureIndex,
                ctx.timestamp,
                ctx.signature,
                state.ledPreviewTraversalIndex >= 0 ? state.ledPreviewTraversalIndex : 0
            );
            if (currentIndex < 0) return null;

            const maxLookaheadBeats = 1.1;

            for (let i = currentIndex + 1; i < timeline.length; i++) {
                const event = timeline[i];
                if (!event?.notes?.length) continue;

                const beatsUntilTarget = ports.getBeatsToWait({
                    currentMeasureIdx: ctx.measureIndex,
                    currentTimestamp: ctx.timestamp,
                    nextMeasureIdx: event.measureIndex,
                    nextTimestamp: event.timestamp,
                    fallbackLength: 0.25,
                    getMeasureTimingInfo: ports.getMeasureTimingInfo
                });

                if (!Number.isFinite(beatsUntilTarget)) continue;
                if (beatsUntilTarget > maxLookaheadBeats) break;

                const matched = event.notes.find(note => note.midi === midi && ports.isPracticeHandEnabled(note.staffId));
                if (!matched) continue;

                const reservation: PianoTrainerDomain.EarlyGraceReservation = {
                    midi,
                    staffId: matched.staffId,
                    measureIndex: event.measureIndex,
                    timestamp: event.timestamp,
                    allowTapCarry: false,
                    beatsUntilTarget
                };

                state.earlyGraceReservations.set(midi, reservation);
                state.heldCorrectNotes.set(midi, matched.staffId);
                state.preExpectedHeldNotes.add(midi);
                return reservation;
            }

            return null;
        }
        return {getSinglePracticedHandRole, getRenderableNotesForHandFromTimelineEvent, findSingleHandPracticeTimelineWindow, findNextSingleHandPracticeTimelineEvent, getSingleHandPracticeBeatsUntilNextEvent, tryReserveSingleHandEarlyGrace, tryReserveRealtimeUpcomingHeldNote};
    }
    export type Service = ReturnType<typeof create>;
}
