// External JSON is unknown until validation; storage compatibility is unchanged.
interface SettingsBackupPayload {
    version: 1;
    exportedAt: string;
    appVersion: string;
    settings: Record<string, string>;
}

function buildSettingsBackupPayload(): SettingsBackupPayload {
    const settings: Record<string, string> = {};
    RESETTABLE_PREFERENCE_KEYS.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) settings[key] = value;
    });

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        appVersion: APP_VERSION,
        settings
    };
}

function importSettingsBackupPayload(payload: unknown) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Invalid settings backup payload');
    }

    const record = payload as Record<string, unknown>;
    const rawSettings = record && typeof record.settings === 'object' && record.settings && !Array.isArray(record.settings)
        ? record.settings as Record<string, unknown>
        : record;

    const normalizedSettings: Record<string, string> = {};
    RESETTABLE_PREFERENCE_KEYS.forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(rawSettings, key)) return;
        const value = rawSettings[key];
        if (value === null || value === undefined) return;
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
    pendingFirstRunNotice = false;
}
