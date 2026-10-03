import type {PianoTrainerOsmdAdapter} from '../score/osmd-adapter';
// The original render lifecycle. Call order is part of the visual contract.
export namespace PianoTrainerScoreRenderer {
    export interface Ports {
        score: Pick<PianoTrainerOsmdAdapter.Service, 'isReady' | 'render'>;
        invalidateGeometry(): void;
        afterRender(): void;
        renderFeedback(): void;
        renderLoop(): void;
        renderDebug(): void;
    }
    export function create(ports: Ports) {
        function renderScoreAndRefreshGeometry() {
            if (!ports.score.isReady()) return;
            ports.score.render();
            ports.invalidateGeometry();
            ports.afterRender();
            ports.renderFeedback();
            ports.renderLoop();
            ports.renderDebug();
        }
        return {renderScoreAndRefreshGeometry};
    }
}
