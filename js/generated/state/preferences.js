"use strict";
// Storage and startup writes are explicit commands on an application-owned service.
var PianoTrainerPreferences;
(function (PianoTrainerPreferences) {
    // Preference parsing and first-run defaults, without UI effects.
    PianoTrainerPreferences.DEFAULT_PREFERENCES = Object.freeze({
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
    function create(ports) {
        const { state: AppState, storage: localStorage, session: sessionStorage, resettableKeys: RESETTABLE_PREFERENCE_KEYS } = ports;
        const { SKIP_FIRST_RUN_ONCE_STORAGE_KEY, FIRST_RUN_INIT_STORAGE_KEY, PLAYER_PIANO_STORAGE_KEY, LED_COUNT_STORAGE_KEY, TRAINER_PIANO_VOL_STORAGE_KEY, TRAINER_MIDIOUT_VOL_STORAGE_KEY, TRAINER_MIDIIN_BOOST_STORAGE_KEY, METRONOME_VOL_STORAGE_KEY, LED_MASTER_BRIGHTNESS_STORAGE_KEY, LED_FUTURE1_PCT_STORAGE_KEY, LED_FUTURE2_PCT_STORAGE_KEY, MIDI_IN_CHANNEL_STORAGE_KEY, MIDI_OUT_CHANNEL_STORAGE_KEY, MIDI_LIGHTS_CHANNEL_STORAGE_KEY, MIDI_LED_LOW_VELOCITY_STORAGE_KEY, LED_REVERSE_STORAGE_KEY, TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY, TRAINER_INPUT_VELOCITY_STORAGE_KEY, TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY } = ports.keys;
        const { normalizeMidiChannel, normalizeMidiInputChannel } = PianoTrainerPreferenceValues;
        let initialized = false;
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
            localStorage.setItem(PLAYER_PIANO_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.playerPianoType));
            localStorage.setItem(LED_COUNT_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.ledCount));
            localStorage.setItem(TRAINER_PIANO_VOL_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.trainerPianoVolume));
            localStorage.setItem(TRAINER_MIDIOUT_VOL_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.trainerMidiOutVolume));
            localStorage.setItem(TRAINER_MIDIIN_BOOST_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.trainerMidiInBoost));
            localStorage.setItem(METRONOME_VOL_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.metronomeVolume));
            localStorage.setItem(LED_MASTER_BRIGHTNESS_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.ledMasterBrightness));
            localStorage.setItem(LED_FUTURE1_PCT_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.ledFuture1Pct));
            localStorage.setItem(LED_FUTURE2_PCT_STORAGE_KEY, String(PianoTrainerPreferences.DEFAULT_PREFERENCES.ledFuture2Pct));
            localStorage.setItem(FIRST_RUN_INIT_STORAGE_KEY, 'true');
            pendingFirstRunNotice = true;
        }
        function consumePendingFirstRunNotice() {
            const shouldShow = pendingFirstRunNotice;
            pendingFirstRunNotice = false;
            return shouldShow;
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
        function init() {
            if (initialized)
                return;
            initialized = true;
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
        }
        function cancelPendingFirstRunNotice() { pendingFirstRunNotice = false; }
        function dispose() { initialized = false; cancelPendingFirstRunNotice(); }
        return { init, dispose, seedFirstRunDefaults, consumePendingFirstRunNotice, cancelPendingFirstRunNotice, getStoredBool, getStoredNumber, getClampedNumber, setStoredBool, clearSavedPreferences };
    }
    PianoTrainerPreferences.create = create;
})(PianoTrainerPreferences || (PianoTrainerPreferences = {}));
//# sourceMappingURL=preferences.js.map