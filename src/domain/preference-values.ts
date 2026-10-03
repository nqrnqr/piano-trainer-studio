import type {PianoTrainerDomain} from './model';
// Pure persisted value normalization, shared by startup and device controls.
export namespace PianoTrainerPreferenceValues {
    export function normalizeLedCount(value: unknown) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return 88;
        return Math.max(1, Math.min(500, Math.round(numericValue)));
    }
    export function normalizeLedMasterBrightness(value: unknown) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return 70;
        return Math.max(1, Math.min(100, Math.round(numericValue)));
    }
    export function normalizeLedFuturePct(value: unknown, fallback: number) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return fallback;
        return Math.max(0, Math.min(100, Math.round(numericValue)));
    }
    export function normalizeMidiChannel(value: unknown, fallback: PianoTrainerDomain.MidiChannel = 1): PianoTrainerDomain.MidiChannel {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return fallback;
        return Math.max(1, Math.min(16, Math.round(numericValue))) as PianoTrainerDomain.MidiChannel;
    }
    export function normalizeMidiInputChannel(value: unknown, fallback: PianoTrainerDomain.MidiInputChannel = 0): PianoTrainerDomain.MidiInputChannel {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return fallback;
        if (numericValue <= 0)
            return 0;
        return Math.max(1, Math.min(16, Math.round(numericValue))) as PianoTrainerDomain.MidiChannel;
    }
}
