"use strict";
// Score changes retain the original per-note feedback and batched UI ordering.
var PianoTrainerScoring;
(function (PianoTrainerScoring) {
    function create(ports) {
        const state = ports.state;
        function correct() { state.score.correct++; }
        function wrong() { state.score.wrong++; }
        function processMissedNotes() {
            let missedCount = 0;
            const suppressMissedVisuals = state.mode === 'realtime' && state.realtimeWrongPressInCurrentContext;
            state.expectedNotes.forEach(n => {
                if (!n.hit) {
                    if (!suppressMissedVisuals) {
                        ports.feedback.drawFeedbackNote(n.midi, false, n.staffId, n.mIdx, n.anchor);
                    }
                    wrong();
                    missedCount++;
                }
            });
            if (missedCount > 0)
                ports.updateDisplay();
        }
        return { correct, wrong, processMissedNotes, updateDisplay: ports.updateDisplay };
    }
    PianoTrainerScoring.create = create;
})(PianoTrainerScoring || (PianoTrainerScoring = {}));
//# sourceMappingURL=scoring.js.map