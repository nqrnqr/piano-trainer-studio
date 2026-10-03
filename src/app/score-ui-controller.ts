import type {LegacyAppState} from '../state/model';
// Loading coordinates score metadata and UI commands in the original order.
export namespace PianoTrainerScoreUiController {
    export interface Ports {
        state: Pick<LegacyAppState, 'baseBpm' | 'speedPercent' | 'score'>;
        rebuildStaffIdentity(): void;
        rebuildMeasureTimingCache(): void;
        getMeasureCount(): number;
        resetLoopRange(count: number): void;
        getFirstTempo(): number | undefined;
        updateTempo(source: 'percent', value: number): void;
        getStaffCount(): number;
        resetHandAssignments(staves: number): void;
        updateScoreDisplay(): void;
        renderLooper(): void;
    }
    export function create(ports: Ports) {
        function initSongUI() {
            ports.rebuildStaffIdentity(); ports.rebuildMeasureTimingCache();
            const total = ports.getMeasureCount(); ports.resetLoopRange(total);
            // Preserve the old second tempo read after the truthy condition.
            if (ports.getFirstTempo()) ports.state.baseBpm = ports.getFirstTempo()!;
            else ports.state.baseBpm = 120;
            ports.updateTempo('percent', ports.state.speedPercent * 100);
            const staves = ports.getStaffCount(); ports.resetHandAssignments(staves);
            ports.state.score.correct = 0; ports.state.score.wrong = 0;
            ports.updateScoreDisplay(); ports.renderLooper();
        }
        return {initSongUI};
    }
}
