import type {PianoTrainerDomain} from '../domain/model';
import type {LegacyAppState} from '../state/model';
// Seek the first matching measure along the existing real iterator traversal.
export namespace PianoTrainerScoreSeek {
    export interface Box {x: number; y: number; width: number; height: number;}
    export interface Ports {
        seekPresentation?(x: number, y: number): boolean;
        state: Pick<LegacyAppState, 'isPlaying' | 'looper'>;
        hasGraphicSheet(): boolean;
        isAnyToolbarPanelOpen(): boolean;
        clientPointToSvg(x: number, y: number): PianoTrainerDomain.SvgPoint | null;
        getMeasureCount(): number;
        getMeasureBox(index: number, staff: number): Box | null;
        isLoopEnabled(): boolean;
        stopTransport(): void;
        resetCursor(): void;
        isEndReached(): boolean;
        getCurrentMeasureIndex(): number;
        advance(): void;
        updateCursor(): void;
        scroll(): void;
        clearVisuals(): void;
    }
    export function create(ports: Ports) {
        function seek(clientX: number, clientY: number) {
            if (!ports.hasGraphicSheet() || ports.state.isPlaying) return;
            if (ports.isAnyToolbarPanelOpen()) return;
            if (ports.seekPresentation?.(clientX, clientY)) return;
            const point = ports.clientPointToSvg(clientX, clientY);
            if (!point) return;
            let target = -1;
            for (let i = 0; i < ports.getMeasureCount(); i++) {
                const box = ports.getMeasureBox(i, 0);
                if (!box) continue;
                if (point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height) {
                    target = i; break;
                }
            }
            if (target !== -1) {
                const enabled = ports.isLoopEnabled();
                if (enabled && (target < ports.state.looper.min - 1 || target > ports.state.looper.max - 1)) return;
                ports.stopTransport(); ports.resetCursor();
                while (!ports.isEndReached() && ports.getCurrentMeasureIndex() < target) ports.advance();
                ports.updateCursor(); ports.scroll(); ports.clearVisuals();
            }
        }
        return {seek};
    }
}
