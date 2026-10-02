"use strict";
// The original render lifecycle. Call order is part of the visual contract.
var PianoTrainerScoreRenderer;
(function (PianoTrainerScoreRenderer) {
    function create(ports) {
        function renderScoreAndRefreshGeometry() {
            if (!ports.score.isReady())
                return;
            ports.score.render();
            ports.invalidateGeometry();
            ports.afterRender();
            ports.renderFeedback();
            ports.renderLoop();
            ports.renderDebug();
        }
        return { renderScoreAndRefreshGeometry };
    }
    PianoTrainerScoreRenderer.create = create;
})(PianoTrainerScoreRenderer || (PianoTrainerScoreRenderer = {}));
//# sourceMappingURL=score-renderer.js.map