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
        if (file !== 'preference-keys') runScript(context, `js/generated/compatibility/${file}.js`);
    }
    runScript(context, 'js/generated/state/player-range.js');
    runScript(context, 'js/generated/compatibility/player-range.js');
    const evaluate = code => vm.runInContext(code, context);
    const commands = evaluate('({...preferences, ...settingsBackup, ...playerRange, ...PianoTrainerPreferenceValues})');
    return { context, commands, localStorage, sessionStorage, evaluate, state: evaluate('AppState') };
}

module.exports = { storage, stateHarness };
