import type {PianoTrainerDomain} from '../domain/model';
import type {LegacyAppState} from '../state/model';
import type {PianoTrainerPerformance} from '../domain/performance-position';
// Preserve the P5 input contract and side-effect order; all external effects use ports.
export namespace PianoTrainerFeedbackState {
    export interface Ports {
        getPerformanceEvent?(): PianoTrainerPerformance.PerformedEvent | null;
        captureDisplay?(midi: number, staff: number | null, anchor: PianoTrainerDomain.SvgPoint): Partial<PianoTrainerDomain.FeedbackMarker>;
        state: Pick<LegacyAppState, 'currentExpectedContext' | 'feedbackEnabled' | 'activeHeldIncorrectFeedback' | 'releasedIncorrectFeedback' | 'correctFeedbackHistory' | 'realtimeWrongPressInCurrentContext'>;
        getTraversalPosition(): PianoTrainerDomain.TraversalPosition | null;
        resolveAnchor(midi: number, staffId: number | null, measureIndex: number | null, anchor: PianoTrainerDomain.SvgPoint | number | null): PianoTrainerDomain.SvgPoint | null;
        renderOverlay(): void;
        clearOverlay(): void;
        clearDebug(): void;
        pushDebugFrame(frame: PianoTrainerDomain.FeedbackFrameInput): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        function getFeedbackContextKey(measureIndex: number | null = null, timestamp: number | null = null) {
            const event = ports.getPerformanceEvent?.();
            const suffix = event ? `|${event.scoreRevision}/${event.runId}/${event.eventId}` : '';
            return `${Number.isFinite(measureIndex) ? measureIndex : 'na'}|${Number.isFinite(timestamp) ? timestamp : 'na'}${suffix}`;
        }

        function getCurrentFeedbackContext() {
            const measureIndex = state.currentExpectedContext?.measureIndex ?? ports.getTraversalPosition()?.measureIndex ?? null;
            const timestamp = state.currentExpectedContext?.timestamp ?? ports.getTraversalPosition()?.timestampWhole ?? null;
            return {
                measureIndex,
                timestamp,
                key: getFeedbackContextKey(measureIndex, timestamp)
            };
        }

        function registerHeldIncorrectFeedback(midi: number, targetStaffId: number | null, forceMIdx: number | null = null, anchorOrExactY: PianoTrainerDomain.SvgPoint | number | null = null) {
            if (!state.feedbackEnabled) return;

            const anchor = ports.resolveAnchor(midi, targetStaffId, forceMIdx, anchorOrExactY);
            if (!anchor) return;

            const context = getCurrentFeedbackContext();
            state.activeHeldIncorrectFeedback.set(midi, {
                midi,
                staffId: targetStaffId,
                anchor,
                isCorrect: false,
                measureIndex: context.measureIndex,
                timestamp: context.timestamp,
                contextKey: context.key
                ,...ports.captureDisplay?.(midi, targetStaffId, anchor)
            });

            ports.renderOverlay();
            ports.pushDebugFrame({
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

        function releaseHeldIncorrectFeedback(midi: number) {
            const marker = state.activeHeldIncorrectFeedback.get(midi);
            if (!marker) return;

            state.activeHeldIncorrectFeedback.delete(midi);
            state.releasedIncorrectFeedback.push(marker);
            ports.renderOverlay();
        }

        function drawFeedbackNote(midi: number, isCorrect: boolean, targetStaffId: number | null, forceMIdx: number | null = null, anchorOrExactY: PianoTrainerDomain.SvgPoint | number | null = null) {
            if (!state.feedbackEnabled) return;

            const anchor = ports.resolveAnchor(midi, targetStaffId, forceMIdx, anchorOrExactY);
            if (!anchor) return;

            const context = getCurrentFeedbackContext();
            const marker: PianoTrainerDomain.FeedbackMarker = {
                midi,
                staffId: targetStaffId,
                anchor,
                isCorrect: !!isCorrect,
                measureIndex: forceMIdx,
                timestamp: context.timestamp,
                contextKey: getFeedbackContextKey(forceMIdx, context.timestamp)
                ,...ports.captureDisplay?.(midi, targetStaffId, anchor)
            };

            if (isCorrect) {
                state.correctFeedbackHistory.push(marker);
            } else {
                state.releasedIncorrectFeedback.push(marker);
            }

            ports.renderOverlay();
            ports.pushDebugFrame({
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
        function clearPreserveScoring() {
            ports.clearOverlay();
            state.activeHeldIncorrectFeedback.clear();
            state.releasedIncorrectFeedback = [];
            state.correctFeedbackHistory = [];
            state.realtimeWrongPressInCurrentContext = false;
            ports.clearDebug();
        }
        return {getFeedbackContextKey, getCurrentFeedbackContext, registerHeldIncorrectFeedback, releaseHeldIncorrectFeedback, drawFeedbackNote, clearPreserveScoring};
    }
    export type Service = ReturnType<typeof create>;
}
