"use strict";
const settingsBackup = PianoTrainerSettingsBackup.create({ storage: localStorage, session: sessionStorage,
    keys: PREFERENCE_STORAGE_KEYS, resettableKeys: RESETTABLE_PREFERENCE_KEYS, appVersion: APP_VERSION, now: () => new Date(),
    clearSavedPreferences, cancelPendingFirstRunNotice: preferences.cancelPendingFirstRunNotice });
const { buildSettingsBackupPayload, importSettingsBackupPayload } = settingsBackup;
//# sourceMappingURL=settings-backup.js.map