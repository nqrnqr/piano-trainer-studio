"use strict";
// Ownership around the existing clock APIs; no new scheduling or tempo rules.
var PianoTrainerPlaybackClock;
(function (PianoTrainerPlaybackClock) {
    function create(ports) {
        const timers = new Set(), frames = new Set();
        let epoch = 0;
        function setTimer(callback, delayMs) {
            const generation = epoch;
            const id = ports.setTimer(() => {
                timers.delete(id);
                if (generation === epoch)
                    callback();
            }, delayMs);
            timers.add(id);
            return id;
        }
        function clearTimer(id) { timers.delete(id); ports.clearTimer(id); }
        function requestFrame(callback) {
            const generation = epoch;
            const id = ports.requestFrame(time => {
                frames.delete(id);
                if (generation === epoch)
                    callback(time);
            });
            frames.add(id);
            return id;
        }
        function dispose() {
            epoch++;
            for (const id of timers)
                ports.clearTimer(id);
            for (const id of frames)
                ports.cancelFrame(id);
            timers.clear();
            frames.clear();
        }
        return { nowSeconds: ports.nowSeconds, monotonicMilliseconds: ports.monotonicMilliseconds,
            setTimer, clearTimer, requestFrame, dispose,
            readResources: () => ({ timers: timers.size, frames: frames.size }) };
    }
    PianoTrainerPlaybackClock.create = create;
})(PianoTrainerPlaybackClock || (PianoTrainerPlaybackClock = {}));
//# sourceMappingURL=playback-clock.js.map