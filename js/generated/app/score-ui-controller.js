"use strict";
// Loading coordinates score metadata and UI commands in the original order.
var PianoTrainerScoreUiController;
(function (PianoTrainerScoreUiController) {
    function create(ports) {
        function initSongUI() {
            ports.rebuildStaffIdentity();
            ports.rebuildMeasureTimingCache();
            const total = ports.getMeasureCount();
            ports.resetLoopRange(total);
            // Preserve the old second tempo read after the truthy condition.
            if (ports.getFirstTempo())
                ports.state.baseBpm = ports.getFirstTempo();
            else
                ports.state.baseBpm = 120;
            ports.updateTempo('percent', ports.state.speedPercent * 100);
            const staves = ports.getStaffCount();
            ports.resetHandAssignments(staves);
            ports.state.score.correct = 0;
            ports.state.score.wrong = 0;
            ports.updateScoreDisplay();
            ports.renderLooper();
        }
        return { initSongUI };
    }
    PianoTrainerScoreUiController.create = create;
})(PianoTrainerScoreUiController || (PianoTrainerScoreUiController = {}));
//# sourceMappingURL=score-ui-controller.js.map