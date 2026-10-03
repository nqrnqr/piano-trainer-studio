
export namespace PianoTrainerVelocity {
    export function normalizeLiveVelocity(velocity: unknown) {
        const numericVelocity = Number(velocity);
        const clampedMidi = Math.max(1, Math.min(127, Number.isFinite(numericVelocity) ? numericVelocity : 100));
        return {
            midi: clampedMidi,
            gain: Math.max(0.05, Math.min(1, clampedMidi / 127))
        };
    }
}
