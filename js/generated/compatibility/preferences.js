"use strict";
// Preserve startup seed/read/write order at the former preferences slot.
const preferences = PianoTrainerPreferences.create({ state: AppState, storage: localStorage, session: sessionStorage,
    keys: PREFERENCE_STORAGE_KEYS, resettableKeys: RESETTABLE_PREFERENCE_KEYS });
const { seedFirstRunDefaults, consumePendingFirstRunNotice, getStoredBool, getStoredNumber, getClampedNumber, setStoredBool, clearSavedPreferences } = preferences;
const { normalizeLedCount, normalizeLedMasterBrightness, normalizeLedFuturePct, normalizeMidiChannel, normalizeMidiInputChannel } = PianoTrainerPreferenceValues;
preferences.init();
//# sourceMappingURL=preferences.js.map