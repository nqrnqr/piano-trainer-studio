const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const { runScript } = require('../helpers/legacy-script.cjs');
const { storage } = require('../helpers/state-harness.cjs');

function cold() {
    const context = vm.createContext({});
    for (const file of ['domain/playable-range', 'domain/preference-values', 'state/preference-keys',
        'state/app-state', 'state/preferences', 'state/settings-backup', 'state/player-range']) {
        runScript(context, `js/generated/${file}.js`);
    }
    const api = vm.runInContext('({state: PianoTrainerAppState, preferences: PianoTrainerPreferences, backup: PianoTrainerSettingsBackup, range: PianoTrainerPlayerRange, values: PianoTrainerPreferenceValues, keys: PREFERENCE_STORAGE_KEYS, resettableKeys: RESETTABLE_PREFERENCE_KEYS})', context);
    return { context, ...api };
}

function preferences(h, local = {}, savedSession = {}) {
    const effects = [];
    const wrap = (name, data) => {
        const original = storage(data);
        return { ...original, ...Object.fromEntries(['getItem', 'setItem', 'removeItem'].map(method => [method, (...args) => {
            effects.push([name, method, ...args]);
            return original[method](...args);
        }])) };
    };
    const state = h.state.create(), localStorage = wrap('local', local), sessionStorage = wrap('session', savedSession);
    const service = h.preferences.create({ state, storage: localStorage, session: sessionStorage, keys: h.keys, resettableKeys: h.resettableKeys });
    return { state, service, localStorage, sessionStorage, effects };
}

test('state modules load without Window, storage or an application instance', () => {
    const h = cold();
    assert.equal(h.context.AppState, undefined);
    assert.equal(h.context.preferences, undefined);
    const p = preferences(h);
    assert.deepEqual(p.effects, []);
    assert.equal(p.service.consumePendingFirstRunNotice(), false);
    h.backup.create({ storage: p.localStorage, session: p.sessionStorage, keys: h.keys,
        resettableKeys: h.resettableKeys, appVersion: 'test', now: () => new Date(0),
        clearSavedPreferences: p.service.clearSavedPreferences,
        cancelPendingFirstRunNotice: p.service.cancelPendingFirstRunNotice });
    h.range.create(p.state);
    assert.deepEqual(p.effects, []);
});

test('fresh applications isolate nested routing, note collections and range caches', () => {
    const h = cold(), a = h.state.create(), b = h.state.create();
    a.pressedKeys.add(60);
    a.earlyGraceReservations.set(60, { midi: 60 });
    a.modeSettings.follow.practice.left = true;
    a.expectedNotes.push({ midi: 60 });
    const ar = h.range.create(a), br = h.range.create(b);
    assert.equal(b.pressedKeys.size, 0);
    assert.equal(b.earlyGraceReservations.size, 0);
    assert.equal(b.modeSettings.follow.practice.left, false);
    assert.equal(b.expectedNotes.length, 0);
    assert.notEqual(ar.getPlayerPlayableRange(), br.getPlayerPlayableRange());
    assert.equal(a.playerRange, ar.getPlayerPlayableRange());
});

test('explicit init preserves seed and forced-write order and deduplicates until dispose', () => {
    const h = cold(), p = preferences(h);
    p.service.init();
    const writes = p.effects.filter(effect => effect[1] === 'setItem');
    assert.deepEqual(writes.map(effect => effect[2]), ['pt_playerPianoType', 'pt_ledCount',
        'pt_trainerPianoVolume', 'pt_trainerMidiOutVolume', 'pt_trainerMidiInBoost', 'pt_metronomeVolume',
        'pt_ledMasterBrightness', 'pt_ledFuture1Pct', 'pt_ledFuture2Pct', 'pt_firstRunInit_20260321',
        'pt_inputVelocityEnabled', 'pt_liveLowLatencyMonitoringEnabled']);
    const count = p.effects.length;
    p.service.init();
    assert.equal(p.effects.length, count);
    p.service.dispose();
    assert.equal(p.effects.length, count);
    assert.equal(p.service.consumePendingFirstRunNotice(), false);
    p.service.init();
    assert.equal(p.service.consumePendingFirstRunNotice(), false);
    assert.deepEqual(p.effects.slice(count).filter(effect => effect[1] === 'setItem').map(effect => effect[2]),
        ['pt_inputVelocityEnabled', 'pt_liveLowLatencyMonitoringEnabled']);
});

test('first-run notices belong to their instance and imports cancel only the owning notice', () => {
    const h = cold(), a = preferences(h), b = preferences(h);
    a.service.init(); b.service.init();
    const service = h.backup.create({ storage: a.localStorage, session: a.sessionStorage, keys: h.keys,
        resettableKeys: h.resettableKeys, appVersion: 'test', now: () => new Date('2026-10-03T00:00:00.000Z'),
        clearSavedPreferences: a.service.clearSavedPreferences,
        cancelPendingFirstRunNotice: a.service.cancelPendingFirstRunNotice });
    assert.equal(service.buildSettingsBackupPayload().exportedAt, '2026-10-03T00:00:00.000Z');
    service.importSettingsBackupPayload({ settings: { pt_trainerPianoVolume: '33', pt_scoreLayout: 'horizontal' } });
    assert.equal(a.service.consumePendingFirstRunNotice(), false);
    assert.equal(b.service.consumePendingFirstRunNotice(), true);
    a.service.dispose(); a.service.init();
    assert.equal(a.localStorage.getItem('pt_trainerPianoVolume'), '33');
    assert.equal(a.sessionStorage.getItem('pt_skipFirstRunOnce'), null);
    assert.equal(a.service.consumePendingFirstRunNotice(), false);
});

test('boot metadata retains precedence, trimming and one explicit storage read', () => {
    const h = cold();
    for (const [manifest, assetVersion, saved, version, releaseUrl] of [
        [undefined, undefined, null, 'dev', 'https://github.com/nqrnqr/piano-trainer-studio/releases'],
        [{ version: ' 1.2.4 ', releaseUrl: ' /release ', downloadUrl: ' /download ' }, undefined, '/custom.json', '1.2.4', '/release'],
        [{ version: 'manifest' }, ' override ', '', 'override', 'https://github.com/nqrnqr/piano-trainer-studio/releases']
    ]) {
        let reads = 0;
        const result = h.state.readMetadata({ manifest, assetVersion, getManifestUrl: () => { reads++; return saved; } });
        assert.equal(reads, 1);
        assert.equal(result.version, version);
        assert.equal(result.manifestUrl, saved || 'version.json');
        if (!saved) {
            assert.equal(new URL(result.manifestUrl, 'https://nqrnqr.github.io/piano-trainer-studio/').pathname,
                '/piano-trainer-studio/version.json');
        }
        assert.equal(result.releaseUrl, releaseUrl);
        assert.equal(result.downloadUrl, manifest?.downloadUrl?.trim() || 'https://github.com/nqrnqr/piano-trainer-studio/archive/refs/heads/main.zip');
    }
});
