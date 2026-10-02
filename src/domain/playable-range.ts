// Pure keyboard range math. No DOM, storage, audio, OSMD or LED hardware.
const FULL_PIANO_MIDI_MIN = 21;
const FULL_PIANO_MIDI_MAX = 108;
const FULL_PIANO_KEY_COUNT = 88;
const PLAYER_PIANO_SIZES = [88, 76, 73, 61, 49, 37, 32, 25];

function normalizePlayerPianoType(value: unknown): number {
    const numericValue = Number(value);
    return PLAYER_PIANO_SIZES.includes(numericValue) ? numericValue : 88;
}

function derivePlayerRangeFromKeyboardSize(keyCount: unknown): PianoTrainerDomain.PlayerRange {
    const normalizedKeyCount = normalizePlayerPianoType(keyCount);
    const keysTrimmed = FULL_PIANO_KEY_COUNT - normalizedKeyCount;
    const trimLow = Math.floor(keysTrimmed / 2);
    const trimHigh = keysTrimmed - trimLow;
    const minMidi = FULL_PIANO_MIDI_MIN + trimLow;
    const maxMidi = FULL_PIANO_MIDI_MAX - trimHigh;

    return {
        keyCount: normalizedKeyCount,
        minMidi,
        maxMidi,
        trimmedLowKeys: trimLow,
        trimmedHighKeys: trimHigh
    };
}

function isMidiInPlayableRange(midi: unknown, range: PianoTrainerDomain.PlayerRange): boolean {
    return Number(midi) >= range.minMidi && Number(midi) <= range.maxMidi;
}

function getPlayableRangePosition01(midi: unknown, range: PianoTrainerDomain.PlayerRange): number {
    const playableSpan = Math.max(1, range.maxMidi - range.minMidi);
    return (Number(midi) - range.minMidi) / playableSpan;
}
