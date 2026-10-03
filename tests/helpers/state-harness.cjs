const vm = require('node:vm');
const { runScript } = require('./legacy-script.cjs');

function storage(initial = {}) {
    const values = new Map(Object.entries(initial));
    return {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: key => values.delete(key),
        snapshot: () => Object.fromEntries(values)
    };
}

function stateHarness(local = {}, session = {}) {
    const localStorage = storage(local);
    const sessionStorage = storage(session);
    const context = vm.createContext({ window: {}, localStorage, sessionStorage });
    runScript(context, 'js/generated/domain/playable-range.js');
    runScript(context, 'js/generated/domain/preference-values.js');
    for (const file of ['preference-keys', 'app-state', 'preferences', 'settings-backup']) {
        runScript(context, `js/generated/state/${file}.js`);
    }
    runScript(context, 'js/generated/state/player-range.js');
    const evaluate = code => vm.runInContext(code, context);
    const state = evaluate('PianoTrainerAppState').create();
    const keys = evaluate('PREFERENCE_STORAGE_KEYS'), resettableKeys = evaluate('RESETTABLE_PREFERENCE_KEYS');
    const preferences = evaluate('PianoTrainerPreferences').create({state, storage:localStorage, session:sessionStorage, keys, resettableKeys});
    const metadata = evaluate('PianoTrainerAppState').readMetadata({getManifestUrl:()=>localStorage.getItem(keys.UPDATE_MANIFEST_URL_STORAGE_KEY)});
    preferences.init();
    const settingsBackup = evaluate('PianoTrainerSettingsBackup').create({storage:localStorage,session:sessionStorage,keys,resettableKeys,
        appVersion:metadata.version,now:()=>new Date(),clearSavedPreferences:preferences.clearSavedPreferences,cancelPendingFirstRunNotice:preferences.cancelPendingFirstRunNotice});
    const playerRange = evaluate('PianoTrainerPlayerRange').create(state);
    Object.assign(context, {AppState:state,preferences,settingsBackup,playerRange,APP_VERSION:metadata.version,
        UPDATE_MANIFEST_URL:metadata.manifestUrl,UPDATE_RELEASES_URL:metadata.releaseUrl});
    const commands = evaluate('({...preferences, ...settingsBackup, ...playerRange, ...PianoTrainerPreferenceValues})');
    return { context, commands, localStorage, sessionStorage, evaluate, state };
}

module.exports = { storage, stateHarness };
