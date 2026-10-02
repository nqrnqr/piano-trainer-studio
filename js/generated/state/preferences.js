"use strict";
// Preference parsing and first-run defaults, without UI effects.
const DEFAULT_PREFERENCES = Object.freeze({
    playerPianoType: 88,
    ledCount: 88,
    trainerPianoVolume: 80,
    trainerMidiOutVolume: 65,
    trainerMidiInBoost: 100,
    metronomeVolume: 25,
    ledMasterBrightness: 25,
    ledFuture1Pct: 1,
    ledFuture2Pct: 1
});
let pendingFirstRunNotice = false;
function seedFirstRunDefaults() {
    const skipOnce = sessionStorage.getItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY) === 'true';
    if (skipOnce) {
        sessionStorage.removeItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY);
        localStorage.setItem(FIRST_RUN_INIT_STORAGE_KEY, 'true');
        pendingFirstRunNotice = false;
        return;
    }
    if (localStorage.getItem(FIRST_RUN_INIT_STORAGE_KEY) === 'true')
        return;
    localStorage.setItem(PLAYER_PIANO_STORAGE_KEY, String(DEFAULT_PREFERENCES.playerPianoType));
    localStorage.setItem(LED_COUNT_STORAGE_KEY, String(DEFAULT_PREFERENCES.ledCount));
    localStorage.setItem(TRAINER_PIANO_VOL_STORAGE_KEY, String(DEFAULT_PREFERENCES.trainerPianoVolume));
    localStorage.setItem(TRAINER_MIDIOUT_VOL_STORAGE_KEY, String(DEFAULT_PREFERENCES.trainerMidiOutVolume));
    localStorage.setItem(TRAINER_MIDIIN_BOOST_STORAGE_KEY, String(DEFAULT_PREFERENCES.trainerMidiInBoost));
    localStorage.setItem(METRONOME_VOL_STORAGE_KEY, String(DEFAULT_PREFERENCES.metronomeVolume));
    localStorage.setItem(LED_MASTER_BRIGHTNESS_STORAGE_KEY, String(DEFAULT_PREFERENCES.ledMasterBrightness));
    localStorage.setItem(LED_FUTURE1_PCT_STORAGE_KEY, String(DEFAULT_PREFERENCES.ledFuture1Pct));
    localStorage.setItem(LED_FUTURE2_PCT_STORAGE_KEY, String(DEFAULT_PREFERENCES.ledFuture2Pct));
    localStorage.setItem(FIRST_RUN_INIT_STORAGE_KEY, 'true');
    pendingFirstRunNotice = true;
}
function consumePendingFirstRunNotice() {
    const shouldShow = pendingFirstRunNotice;
    pendingFirstRunNotice = false;
    return shouldShow;
}
function normalizeLedCount(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue))
        return 88;
    return Math.max(1, Math.min(500, Math.round(numericValue)));
}
function normalizeLedMasterBrightness(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue))
        return 70;
    return Math.max(1, Math.min(100, Math.round(numericValue)));
}
function normalizeLedFuturePct(value, fallback) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue))
        return fallback;
    return Math.max(0, Math.min(100, Math.round(numericValue)));
}
function getStoredBool(key, fallback) {
    const value = localStorage.getItem(key);
    if (value === null)
        return fallback;
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    return fallback;
}
function getStoredNumber(key, fallback) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
}
function getClampedNumber(key, min, max, defaultVal) {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === '')
        return Math.min(max, Math.max(min, defaultVal));
    const num = Number(raw);
    return Math.min(max, Math.max(min, Number.isFinite(num) ? num : defaultVal));
}
function setStoredBool(key, value) {
    localStorage.setItem(key, value ? 'true' : 'false');
}
function clearSavedPreferences() {
    RESETTABLE_PREFERENCE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(FIRST_RUN_INIT_STORAGE_KEY);
    sessionStorage.removeItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY);
}
function normalizeMidiChannel(value, fallback = 1) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue))
        return fallback;
    return Math.max(1, Math.min(16, Math.round(numericValue)));
}
function normalizeMidiInputChannel(value, fallback = 0) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue))
        return fallback;
    if (numericValue <= 0)
        return 0;
    return Math.max(1, Math.min(16, Math.round(numericValue)));
}
// Preserve the original startup side effects after state and helpers exist.
seedFirstRunDefaults();
AppState.midiInChannel = normalizeMidiInputChannel(localStorage.getItem(MIDI_IN_CHANNEL_STORAGE_KEY), 0);
AppState.midiOutChannel = normalizeMidiChannel(localStorage.getItem(MIDI_OUT_CHANNEL_STORAGE_KEY), 1);
AppState.midiLightsChannel = normalizeMidiChannel(localStorage.getItem(MIDI_LIGHTS_CHANNEL_STORAGE_KEY), 1);
AppState.midiLedLowVelocity = getStoredBool(MIDI_LED_LOW_VELOCITY_STORAGE_KEY, false);
AppState.ledReverse = getStoredBool(LED_REVERSE_STORAGE_KEY, false);
AppState.inputVelocityEnabled = true;
AppState.liveLowLatencyMonitoringEnabled = true;
AppState.lowLatencyPlaybackEnabled = getStoredBool(TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY, false);
setStoredBool(TRAINER_INPUT_VELOCITY_STORAGE_KEY, true);
setStoredBool(TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY, true);
//# sourceMappingURL=preferences.js.map