"use strict";
var PianoTrainerVelocity;
(function (PianoTrainerVelocity) {
    function normalizeLiveVelocity(velocity) {
        const numericVelocity = Number(velocity);
        const clampedMidi = Math.max(1, Math.min(127, Number.isFinite(numericVelocity) ? numericVelocity : 100));
        return {
            midi: clampedMidi,
            gain: Math.max(0.05, Math.min(1, clampedMidi / 127))
        };
    }
    PianoTrainerVelocity.normalizeLiveVelocity = normalizeLiveVelocity;
})(PianoTrainerVelocity || (PianoTrainerVelocity = {}));
//# sourceMappingURL=velocity.js.map