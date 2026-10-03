"use strict";
var PianoTrainerScoreSeekControls;
(function (PianoTrainerScoreSeekControls) {
    function create(ports) {
        const dom = PianoTrainerControlDom.create(ports.document);
        let initialized = false, generation = 0;
        function init() {
            if (initialized)
                return;
            const node = dom.element('canvas-wrapper');
            if (!node)
                throw Error('Missing required trainer control: canvas-wrapper');
            initialized = true;
            const token = generation;
            dom.on(node, 'click', event => { if (token === generation && event instanceof MouseEvent)
                ports.seek(event.clientX, event.clientY); });
        }
        function dispose() { generation++; initialized = false; dom.dispose(); }
        return { init, dispose };
    }
    PianoTrainerScoreSeekControls.create = create;
})(PianoTrainerScoreSeekControls || (PianoTrainerScoreSeekControls = {}));
//# sourceMappingURL=score-seek-controls.js.map