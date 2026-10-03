import type {PREFERENCE_STORAGE_KEYS} from './preference-keys';
// Unknown JSON boundary and synchronous storage commands; no startup work on import.
export namespace PianoTrainerSettingsBackup {
    export interface Ports {
        storage: Pick<Storage, 'getItem' | 'setItem'>;
        session: Pick<Storage, 'setItem'>;
        keys: Pick<typeof PREFERENCE_STORAGE_KEYS, 'FIRST_RUN_INIT_STORAGE_KEY' | 'SKIP_FIRST_RUN_ONCE_STORAGE_KEY'>;
        resettableKeys: readonly string[];
        appVersion: string;
        now(): Date;
        clearSavedPreferences(): void;
        cancelPendingFirstRunNotice(): void;
    }
    // External JSON is unknown until validation; storage compatibility is unchanged.
    export interface Payload {
        version: 1;
        exportedAt: string;
        appVersion: string;
        settings: Record<string, string>;
    }
    export function create(ports: Ports) {
        const { storage: localStorage, session: sessionStorage, resettableKeys: RESETTABLE_PREFERENCE_KEYS, appVersion: APP_VERSION, clearSavedPreferences } = ports;
        const { FIRST_RUN_INIT_STORAGE_KEY, SKIP_FIRST_RUN_ONCE_STORAGE_KEY } = ports.keys;
        function buildSettingsBackupPayload(): Payload {
            const settings: Record<string, string> = {};
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
}
