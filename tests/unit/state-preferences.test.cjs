const assert = require('node:assert/strict');
const { test } = require('node:test');
const { runScript } = require('../helpers/legacy-script.cjs');
const { stateHarness } = require('../helpers/state-harness.cjs');

test('first run seeds the same defaults and consumes the notice only once', () => {
    const h = stateHarness();
    const saved = h.localStorage.snapshot();
    assert.equal(saved.pt_playerPianoType, '88');
    assert.equal(saved.pt_ledCount, '88');
    assert.equal(saved.pt_trainerPianoVolume, '80');
    assert.equal(saved.pt_trainerMidiOutVolume, '65');
    assert.equal(saved.pt_trainerMidiInBoost, '100');
    assert.equal(saved.pt_metronomeVolume, '25');
    assert.equal(saved.pt_ledMasterBrightness, '25');
    assert.equal(saved.pt_ledFuture1Pct, '1');
    assert.equal(saved.pt_ledFuture2Pct, '1');
    assert.equal(h.commands.consumePendingFirstRunNotice(), true);
    assert.equal(h.commands.consumePendingFirstRunNotice(), false);
});

test('existing settings persist, including layout, while monitoring flags remain forced', () => {
    const h = stateHarness({
        pt_firstRunInit_20260321: 'true', pt_trainerPianoVolume: '37', pt_scoreLayout: 'horizontal',
        pt_inputVelocityEnabled: 'false', pt_liveLowLatencyMonitoringEnabled: 'false',
        pt_lowLatencyPlaybackEnabled: 'true', pt_savedMidiInChannel: '6', pt_savedMidiOutChannel: '4'
    });
    assert.equal(h.localStorage.getItem('pt_trainerPianoVolume'), '37');
    assert.equal(h.localStorage.getItem('pt_scoreLayout'), 'horizontal');
    assert.equal(h.commands.consumePendingFirstRunNotice(), false);
    assert.equal(h.state.inputVelocityEnabled, true);
    assert.equal(h.state.liveLowLatencyMonitoringEnabled, true);
    assert.equal(h.state.lowLatencyPlaybackEnabled, true);
    assert.equal(h.state.midiInChannel, 6);
    assert.equal(h.state.midiOutChannel, 4);
    assert.equal(h.localStorage.getItem('pt_inputVelocityEnabled'), 'true');
});

test('preference normalization preserves legacy missing-number and malformed-value behavior', () => {
    const h = stateHarness({ pt_badBool: 'yes', pt_badNumber: 'garbage' });
    assert.equal(h.commands.getStoredBool('pt_missing', true), true);
    assert.equal(h.commands.getStoredBool('pt_badBool', false), false);
    assert.equal(h.commands.getStoredNumber('pt_missing', 80), 0); // Number(null), not a new defaulting rule.
    assert.equal(h.commands.getStoredNumber('pt_badNumber', 80), 80);
    assert.equal(h.commands.getClampedNumber('pt_missing', 0, 100, 80), 80);
    assert.equal(h.commands.normalizeMidiChannel('18'), 16);
    assert.equal(h.commands.normalizeMidiInputChannel('-3'), 0);
    assert.equal(h.commands.normalizeMidiInputChannel('bad', 0), 0);
});

test('backup round trip preserves string values and layout; reload skip keeps imported defaults', () => {
    const original = stateHarness({
        pt_firstRunInit_20260321: 'true', pt_scoreLayout: 'horizontal', pt_savedMidiInChannel: '8',
        pt_trainerPianoVolume: '33', pt_trainerMode: 'follow', unrelated: 'retain'
    });
    const payload = original.commands.buildSettingsBackupPayload();
    assert.equal(payload.version, 1);
    assert.equal(payload.settings.pt_scoreLayout, 'horizontal');
    assert.equal('unrelated' in payload.settings, false);
    const h = stateHarness({ pt_firstRunInit_20260321: 'true', unrelated: 'retain', pt_scoreLayout: 'traditional' });
    h.commands.importSettingsBackupPayload(JSON.parse(JSON.stringify(payload)));
    assert.equal(h.localStorage.getItem('unrelated'), 'retain');
    assert.equal(h.localStorage.getItem('pt_scoreLayout'), 'horizontal');
    assert.equal(h.sessionStorage.getItem('pt_skipFirstRunOnce'), 'true');
    const reloaded = stateHarness(h.localStorage.snapshot(), h.sessionStorage.snapshot());
    assert.equal(reloaded.localStorage.getItem('pt_trainerPianoVolume'), '33');
    assert.equal(reloaded.state.midiInChannel, 8);
    assert.equal(reloaded.commands.consumePendingFirstRunNotice(), false);
    assert.equal(reloaded.sessionStorage.getItem('pt_skipFirstRunOnce'), null);
});

test('flat backups retain legacy coercion and ignore unsupported / null values', () => {
    const h = stateHarness();
    h.commands.importSettingsBackupPayload({ pt_scoreLayout: 'horizontal', pt_savedMidiInChannel: 5, pt_ledReverse: false, pt_trainerMode: null, unrelated: 'no' });
    assert.equal(h.localStorage.getItem('pt_savedMidiInChannel'), '5');
    assert.equal(h.localStorage.getItem('pt_ledReverse'), 'false');
    assert.equal(h.localStorage.getItem('pt_trainerMode'), null);
    assert.equal(h.localStorage.getItem('unrelated'), null);
});

test('invalid backup rejects before changing storage', () => {
    const h = stateHarness();
    const before = h.localStorage.snapshot();
    for (const invalid of [null, 1, 'bad', [], {}, { settings: { unsupported: 'only' } }]) {
        assert.throws(() => h.commands.importSettingsBackupPayload(invalid), /Invalid settings backup payload|No supported settings/);
        assert.deepEqual(h.localStorage.snapshot(), before);
    }
});

test('reset removes supported settings and first-run flags but preserves unrelated / update values', () => {
    const h = stateHarness({ pt_firstRunInit_20260321: 'true', pt_scoreLayout: 'horizontal', pt_updateManifestUrl: '/custom.json', pt_assetVersionOverride: 'test', unrelated: 'yes' }, { pt_skipFirstRunOnce: 'true' });
    h.commands.clearSavedPreferences();
    assert.equal(h.localStorage.getItem('pt_scoreLayout'), null);
    assert.equal(h.localStorage.getItem('pt_firstRunInit_20260321'), null);
    assert.equal(h.sessionStorage.getItem('pt_skipFirstRunOnce'), null);
    assert.equal(h.localStorage.getItem('unrelated'), 'yes');
    assert.equal(h.localStorage.getItem('pt_updateManifestUrl'), '/custom.json');
    assert.equal(h.localStorage.getItem('pt_assetVersionOverride'), 'test');
    h.commands.seedFirstRunDefaults();
    assert.equal(h.localStorage.getItem('pt_trainerPianoVolume'), '80');
});

test('settings do not replace the shared state, Map or Set identities', () => {
    const h = stateHarness();
    const state = h.state, pressed = state.pressedKeys, reservations = state.earlyGraceReservations;
    h.commands.importSettingsBackupPayload({ pt_scoreLayout: 'horizontal' });
    h.commands.clearSavedPreferences();
    h.commands.seedFirstRunDefaults();
    assert.equal(h.evaluate('AppState'), state);
    assert.equal(state.pressedKeys, pressed);
    assert.equal(state.earlyGraceReservations, reservations);
    assert.equal(h.context.window.AppState, undefined);
    for (const key of ['wledDdpLastSendOk', 'wledDdpLastSendAt', 'wledDdpLastError', 'scoreLibrarySelectedFolderIds', 'scoreLibraryFolderManageMode']) assert.equal(key in state, false);
});

test('mode-specific routing keeps independent objects and Follow chooses exactly one practice hand', () => {
    const h = stateHarness();
    runScript(h.context, 'js/generated/domain/hand-routing.js');
    runScript(h.context, 'js/generated/compatibility/hand-routing.js');
    h.state.mode = 'follow';
    h.evaluate("handRouting.setFollowPracticeHand('left')");
    assert.equal(h.state.practice.left, true);
    assert.equal(h.state.practice.right, false);
    assert.equal(h.state.playback.left, false);
    assert.equal(h.state.playback.right, true);
    assert.equal(h.state.modeSettings.wait.practice.left, true);
    assert.equal(h.state.modeSettings.wait.playback.right, false);
    assert.notEqual(h.state.practice, h.state.modeSettings.follow.practice);
    h.state.mode = 'wait';
    h.evaluate('syncActiveHandStateFromMode()');
    assert.equal(h.state.practice.right, true);
    assert.equal(h.state.playback.right, false);
});

test('persisted display layout restores after recreating the display module', () => {
    const initializeDisplay = h => {
        const elements = new Map();
        class Element { constructor() { this.style={};this.classList={toggle(){}}; } addEventListener() {} }
        class Select extends Element {}
        class Input extends Element {}
        Object.assign(h.context,{HTMLElement:Element,HTMLSelectElement:Select,HTMLInputElement:Input});
        h.context.document = { getElementById: id => {
            if (!elements.has(id)) elements.set(id, new (id==='select-score-layout'?Select:id==='check-autoscroll'?Input:Element)());
            return elements.get(id);
        } };
        h.context.osmd = { EngravingRules: {}, cursor: null, setOptions() {}, IsReadyToRender: () => false };
        for(const file of ['score/osmd-adapter','render/score-viewport','render/score-renderer','compatibility/score-rendering'])runScript(h.context,`js/generated/${file}.js`);
        h.evaluate('ScoreDisplay.init()');
        assert.equal(h.evaluate('ScoreDisplay.isHorizontal()'), true);
        assert.equal(elements.get('select-score-layout').value, 'horizontal');
    };
    const h = stateHarness({ pt_firstRunInit_20260321: 'true', pt_scoreLayout: 'horizontal' });
    initializeDisplay(h);
    initializeDisplay(stateHarness(h.localStorage.snapshot()));
});
