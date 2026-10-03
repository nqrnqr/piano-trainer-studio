import type {LegacyAppState} from '../state/model';
// Original visual/transient cleanup, including the distinct Pause/Reset rules.
export namespace PianoTrainerPlaybackState {
    export type State = Pick<LegacyAppState, 'activeTimeouts' | 'sustainedVisuals' | 'visualNotesToStart' |
        'expectedNotes' | 'outOfRangeCurrentNotes' | 'activeHeldIncorrectFeedback' | 'releasedIncorrectFeedback' |
        'correctFeedbackHistory' | 'realtimeWrongPressInCurrentContext' | 'heldCorrectNotes' |
        'preExpectedHeldNotes' | 'lastLedPreviewEvents' | 'ledPreviewTraversalIndex' | 'followAdvanceInfo' |
        'currentExpectedContext' | 'earlyGraceReservations' | 'pendingAudio' | 'isAudioBusy'>;
    export interface Ports {
        state: State;
        clearFeedbackPreserveScoring(): void;
        clearTimer(id: number): void;
        wipeHardware(): void;
        renderKeyboard(): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        function clearVisuals() {
            ports.clearFeedbackPreserveScoring();
            state.activeTimeouts.forEach(id => ports.clearTimer(id));
            state.activeTimeouts = [];
            state.sustainedVisuals = [];
            state.visualNotesToStart = [];
            state.expectedNotes = [];
            state.outOfRangeCurrentNotes = [];
            state.activeHeldIncorrectFeedback.clear();
            state.releasedIncorrectFeedback = [];
            state.correctFeedbackHistory = [];
            state.realtimeWrongPressInCurrentContext = false;
            state.heldCorrectNotes.clear();
            state.preExpectedHeldNotes.clear();
            state.lastLedPreviewEvents = [];
            state.ledPreviewTraversalIndex = -1;
            state.followAdvanceInfo = null;
            state.currentExpectedContext = null;
            state.earlyGraceReservations.clear();
            ports.wipeHardware();
            ports.renderKeyboard();
        }
        function clearTransient({clearVisualState = false}: {clearVisualState?: boolean} = {}) {
            state.pendingAudio = [];
            state.followAdvanceInfo = null;
            state.currentExpectedContext = null;
            state.earlyGraceReservations.clear();
            state.isAudioBusy = false;
            state.expectedNotes = [];
            state.realtimeWrongPressInCurrentContext = false;
            state.preExpectedHeldNotes.clear();
            if (clearVisualState) clearVisuals();
        }
        return {clearVisuals, clearTransient};
    }
    export type Service = ReturnType<typeof create>;
}
