"use strict";
// Coordinate a committed staff assignment without reading vendor objects or DOM.
var PianoTrainerHandAssignment;
(function (PianoTrainerHandAssignment) {
    function create(ports) {
        function commit(left, right, refreshCurrentFrame) {
            if (right == null)
                return;
            const state = ports.state;
            state.hands.left = left;
            state.hands.right = right;
            state.ledPreviewTimelineDirty = true;
            state.lastLedPreviewEvents = [];
            const frame = refreshCurrentFrame ? ports.captureCurrentFrame() : null;
            if (!frame) {
                ports.renderKeyboard();
                return;
            }
            if (frame.hasEntries && frame.measureIndex != null) {
                frame.buildExpected();
                frame.renderKeyboard();
            }
            else {
                state.expectedNotes = [];
                state.visualNotesToStart = [];
                state.outOfRangeCurrentNotes = [];
                ports.renderKeyboard();
            }
        }
        return { commit };
    }
    PianoTrainerHandAssignment.create = create;
})(PianoTrainerHandAssignment || (PianoTrainerHandAssignment = {}));
//# sourceMappingURL=hand-assignment-controller.js.map