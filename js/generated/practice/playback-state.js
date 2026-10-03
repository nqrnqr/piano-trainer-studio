"use strict";
// Original visual/transient cleanup, including the distinct Pause/Reset rules.
var PianoTrainerPlaybackState;
(function (PianoTrainerPlaybackState) {
    function create(ports) {
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
        function clearTransient({ clearVisualState = false } = {}) {
            state.pendingAudio = [];
            state.followAdvanceInfo = null;
            state.currentExpectedContext = null;
            state.earlyGraceReservations.clear();
            state.isAudioBusy = false;
            state.expectedNotes = [];
            state.realtimeWrongPressInCurrentContext = false;
            state.preExpectedHeldNotes.clear();
            if (clearVisualState)
                clearVisuals();
        }
        return { clearVisuals, clearTransient };
    }
    PianoTrainerPlaybackState.create = create;
})(PianoTrainerPlaybackState || (PianoTrainerPlaybackState = {}));
//# sourceMappingURL=playback-state.js.map