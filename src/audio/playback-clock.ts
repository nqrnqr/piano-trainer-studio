
// Ownership around the existing clock APIs; no new scheduling or tempo rules.
export namespace PianoTrainerPlaybackClock {
    export interface Ports {
        nowSeconds(): number;
        monotonicMilliseconds(): number;
        setTimer(callback: () => void, delayMs: number): number;
        clearTimer(id: number): void;
        requestFrame(callback: FrameRequestCallback): number;
        cancelFrame(id: number): void;
    }
    export function create(ports: Ports) {
        const timers = new Set<number>(), frames = new Set<number>();
        let epoch = 0;
        function setTimer(callback: () => void, delayMs: number) {
            const generation = epoch;
            const id = ports.setTimer(() => {
                timers.delete(id);
                if (generation === epoch) callback();
            }, delayMs);
            timers.add(id);
            return id;
        }
        function clearTimer(id: number) { timers.delete(id); ports.clearTimer(id); }
        function requestFrame(callback: FrameRequestCallback) {
            const generation = epoch;
            const id = ports.requestFrame(time => {
                frames.delete(id);
                if (generation === epoch) callback(time);
            });
            frames.add(id);
            return id;
        }
        function dispose() {
            epoch++;
            for (const id of timers) ports.clearTimer(id);
            for (const id of frames) ports.cancelFrame(id);
            timers.clear(); frames.clear();
        }
        return {nowSeconds: ports.nowSeconds, monotonicMilliseconds: ports.monotonicMilliseconds,
            setTimer, clearTimer, requestFrame, dispose,
            readResources: () => ({timers:timers.size, frames:frames.size})};
    }
    export type Service = ReturnType<typeof create>;
}
