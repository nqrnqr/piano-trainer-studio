"use strict";
var PianoTrainerScoreStatus;
(function (PianoTrainerScoreStatus) {
    function create(document, getScore) {
        const dom = PianoTrainerControlDom.create(document);
        function update() {
            const score = getScore();
            const total = score.correct + score.wrong;
            let percentage = 100;
            if (total > 0)
                percentage = Math.round((score.correct / total) * 100);
            const node = dom.element('live-score');
            if (!node)
                throw Error('Missing required trainer control: live-score');
            node.innerText = `${percentage}%`;
        }
        return { update };
    }
    PianoTrainerScoreStatus.create = create;
})(PianoTrainerScoreStatus || (PianoTrainerScoreStatus = {}));
//# sourceMappingURL=score-status.js.map