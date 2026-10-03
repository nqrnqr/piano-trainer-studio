import type {LegacyAppState} from '../state/model';
import {PianoTrainerControlDom} from './controls-dom';
export namespace PianoTrainerScoreStatus {
    export function create(document: Document, getScore: () => Readonly<LegacyAppState['score']>) {
        const dom = PianoTrainerControlDom.create(document);
        function update() {
            const score = getScore();
            const total = score.correct + score.wrong;
            let percentage = 100;
            if (total > 0) percentage = Math.round((score.correct / total) * 100);
            const node = dom.element('live-score');
            if (!node) throw Error('Missing required trainer control: live-score');
            node.innerText = `${percentage}%`;
        }
        return {update};
    }
}
