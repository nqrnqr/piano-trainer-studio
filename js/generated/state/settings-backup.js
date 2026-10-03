"use strict";
// Unknown JSON boundary and synchronous storage commands; no startup work on import.
var PianoTrainerSettingsBackup;
(function (PianoTrainerSettingsBackup) {
    function create(ports) {
        const { storage: localStorage, session: sessionStorage, resettableKeys: RESETTABLE_PREFERENCE_KEYS, appVersion: APP_VERSION, clearSavedPreferences } = ports;
        const { FIRST_RUN_INIT_STORAGE_KEY, SKIP_FIRST_RUN_ONCE_STORAGE_KEY } = ports.keys;
        function buildSettingsBackupPayload() {
            const settings = {};
            RESETTABLE_PREFERENCE_KEYS.forEach((key) => {
                const value = localStorage.getItem(key);
                if (value !== null)
                    settings[key] = value;
            });
            return {
                version: 1,
                exportedAt: ports.now().toISOString(),
                appVersion: APP_VERSION,
                settings
            };
        }
        function importSettingsBackupPayload(payload) {
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
                throw new Error('Invalid settings backup payload');
            }
            const record = payload;
            const rawSettings = record && typeof record.settings === 'object' && record.settings && !Array.isArray(record.settings)
                ? record.settings
                : record;
            const normalizedSettings = {};
            RESETTABLE_PREFERENCE_KEYS.forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(rawSettings, key))
                    return;
                const value = rawSettings[key];
                if (value === null || value === undefined)
                    return;
                normalizedSettings[key] = String(value);
            });
            if (Object.keys(normalizedSettings).length === 0) {
                throw new Error('No supported settings found in backup');
            }
            clearSavedPreferences();
            Object.entries(normalizedSettings).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
            sessionStorage.setItem(SKIP_FIRST_RUN_ONCE_STORAGE_KEY, 'true');
            localStorage.setItem(FIRST_RUN_INIT_STORAGE_KEY, 'true');
            ports.cancelPendingFirstRunNotice();
        }
        return { buildSettingsBackupPayload, importSettingsBackupPayload };
    }
    PianoTrainerSettingsBackup.create = create;
})(PianoTrainerSettingsBackup || (PianoTrainerSettingsBackup = {}));
//# sourceMappingURL=settings-backup.js.map