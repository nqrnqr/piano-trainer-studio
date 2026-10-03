"use strict";
// Seek the first matching measure along the existing real iterator traversal.
var PianoTrainerScoreSeek;
(function (PianoTrainerScoreSeek) {
    function create(ports) {
        function seek(clientX, clientY) {
            if (!ports.hasGraphicSheet() || ports.state.isPlaying)
                return;
            if (ports.isAnyToolbarPanelOpen())
                return;
            const point = ports.clientPointToSvg(clientX, clientY);
            if (!point)
                return;
            let target = -1;
            for (let i = 0; i < ports.getMeasureCount(); i++) {
                const box = ports.getMeasureBox(i, 0);
                if (!box)
                    continue;
                if (point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height) {
                    target = i;
                    break;
                }
            }
            if (target !== -1) {
                const enabled = ports.isLoopEnabled();
                if (enabled && (target < ports.state.looper.min - 1 || target > ports.state.looper.max - 1))
                    return;
                ports.stopTransport();
                ports.resetCursor();
                while (!ports.isEndReached() && ports.getCurrentMeasureIndex() < target)
                    ports.advance();
                ports.updateCursor();
                ports.scroll();
                ports.clearVisuals();
            }
        }
        return { seek };
    }
    PianoTrainerScoreSeek.create = create;
})(PianoTrainerScoreSeek || (PianoTrainerScoreSeek = {}));
//# sourceMappingURL=score-seek-controller.js.map