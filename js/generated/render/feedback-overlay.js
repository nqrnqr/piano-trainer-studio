"use strict";
// Draw recorded feedback only. Context and scoring are supplied by practice.
var PianoTrainerFeedbackOverlay;
(function (PianoTrainerFeedbackOverlay) {
    function create(ports) {
        const state = ports.state;
        function getGroup() { return ports.ensureGroup('pt-feedback-group'); }
        function clear() { ports.getSvg()?.querySelector('#pt-feedback-group')?.replaceChildren(); }
        function drawMarker(anchor, isCorrect) {
            if (!state.feedbackEnabled || !anchor)
                return;
            const group = getGroup();
            if (!group)
                return;
            const circle = ports.document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', String(anchor.x));
            circle.setAttribute('cy', String(anchor.y));
            circle.setAttribute('r', '4.5');
            circle.setAttribute('fill', isCorrect ? 'rgba(46, 204, 113, 0.55)' : 'rgba(231, 76, 60, 0.55)');
            circle.setAttribute('stroke', isCorrect ? 'rgba(39, 174, 96, 0.9)' : 'rgba(192, 57, 43, 0.9)');
            circle.setAttribute('stroke-width', '1.5');
            group.appendChild(circle);
        }
        function drawStoredMarker(marker) {
            if (!marker?.anchor)
                return;
            drawMarker(marker.anchor, !!marker.isCorrect);
        }
        function render() {
            clear();
            if (!state.feedbackEnabled)
                return;
            const currentContextKey = ports.getCurrentContextKey();
            state.correctFeedbackHistory.forEach(marker => drawStoredMarker(marker));
            state.releasedIncorrectFeedback.forEach(marker => {
                if (marker?.contextKey === currentContextKey)
                    return;
                drawStoredMarker(marker);
            });
            state.activeHeldIncorrectFeedback.forEach(marker => {
                if (marker?.contextKey !== currentContextKey)
                    return;
                drawStoredMarker(marker);
            });
        }
        return { getGroup, clear, drawMarker, drawStoredMarker, render };
    }
    PianoTrainerFeedbackOverlay.create = create;
})(PianoTrainerFeedbackOverlay || (PianoTrainerFeedbackOverlay = {}));
//# sourceMappingURL=feedback-overlay.js.map