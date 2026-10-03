"use strict";
var PianoTrainerHandAssignmentControls;
(function (PianoTrainerHandAssignmentControls) {
    function create(ports) {
        const dom = PianoTrainerControlDom.create(ports.document);
        const owned = [];
        let generation = 0;
        function syncHandAssignmentFromControls({ refreshCurrentFrame = false } = {}) {
            const left = dom.optionalSelect('assign-lh'), right = dom.optionalSelect('assign-rh');
            if (!left || !right)
                return;
            ports.commit(PianoTrainerHandRouting.parseAssignment(left.value), PianoTrainerHandRouting.parseAssignment(right.value), refreshCurrentFrame);
        }
        function init() {
            const left = dom.optionalSelect('assign-lh'), right = dom.optionalSelect('assign-rh');
            if (!left || !right || left.dataset.boundHandAssign === 'true')
                return;
            left.dataset.boundHandAssign = 'true';
            right.dataset.boundHandAssign = 'true';
            owned.push({ left, right });
            const token = generation;
            const change = () => { if (token === generation)
                syncHandAssignmentFromControls({ refreshCurrentFrame: true }); };
            dom.on(left, 'change', change);
            dom.on(right, 'change', change);
        }
        function dispose() {
            generation++;
            dom.dispose();
            for (const pair of owned) {
                if (pair.left.dataset.boundHandAssign === 'true')
                    delete pair.left.dataset.boundHandAssign;
                if (pair.right.dataset.boundHandAssign === 'true')
                    delete pair.right.dataset.boundHandAssign;
            }
            owned.length = 0;
        }
        return { init, dispose, syncHandAssignmentFromControls };
    }
    PianoTrainerHandAssignmentControls.create = create;
})(PianoTrainerHandAssignmentControls || (PianoTrainerHandAssignmentControls = {}));
//# sourceMappingURL=hand-assignment-controls.js.map