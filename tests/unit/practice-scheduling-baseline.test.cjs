const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const { runFunction, read } = require('../helpers/legacy-script.cjs');

// Fake clock only at the existing scheduler boundary; execute the original
// checkWaitModeAdvance body to characterize timing and side-effect order.
function harness(mode, { now = 10, anchor = 10.8, hit = true } = {}) {
    const events = [];
    const timers = [];
    const state = {
        mode, isPlaying: true, isAudioBusy: true, anchorTime: anchor,
        expectedNotes: [{ midi: 60, hit }, { midi: 64, hit }],
        pendingAudio: [{ midi: 48, durationMs: 450, velocity: 80, toLocalAudio: true, toMidiOut: false }],
        followAdvanceInfo: { currentMeasureIdx: 0, currentTimestamp: 0, waitSeconds: 1, beatsToWait: 2 }
    };
    const ratio = read('js/trainer-core.js').match(/^const FOLLOW_ME_MIN_WAIT_RATIO = ([\d.]+);/m);
    assert.ok(ratio, 'production Follow minimum ratio exists');
    const context = vm.createContext({
        AppState: state, FOLLOW_ME_MIN_WAIT_RATIO: Number(ratio[1]), Tone: { now: () => now },
        osmd: { cursor: { update: () => events.push('cursor') } },
        schedulePlaybackForDestinations: (...args) => events.push(['audio', ...args]),
        startVisualSustains: () => events.push('sustains'),
        scheduleMetronomeForPlaybackWindow: (...args) => events.push(['metronome', ...args]),
        handleAutoScroll: () => events.push('scroll'), playbackLoop: () => events.push('loop'),
        setTimeout: (callback, delay) => timers.push({ callback, delay })
    });
    runFunction(context, 'js/trainer-core.js', 'checkWaitModeAdvance');
    return { context, state, events, timers };
}

test('Wait holds partial chords without accompaniment or advancement', () => {
    const h = harness('wait');
    h.state.expectedNotes[1].hit = false;
    h.context.checkWaitModeAdvance();
    assert.equal(h.state.isAudioBusy, true);
    assert.equal(h.state.pendingAudio.length, 1);
    assert.equal(h.timers.length, 0);
    assert.equal(h.events.length, 0);
});

test('Wait flushes accompaniment, starts sustain, and advances after 10ms in order', () => {
    const h = harness('wait');
    h.context.checkWaitModeAdvance();
    assert.equal(h.state.isAudioBusy, false);
    assert.equal(h.state.pendingAudio.length, 0);
    assert.equal(h.timers[0].delay, 10);
    h.timers[0].callback();
    assert.deepEqual(h.events.map(event => Array.isArray(event) ? event[0] : event), ['audio', 'sustains', 'cursor', 'scroll', 'loop']);
});

for (const [name, anchor, expectedDelay] of [
    ['on-time input uses remaining beat', 10.8, 800],
    ['late input uses full wait', 9.8, 1000],
    ['near-boundary input uses comfort fallback', 10.001, 1000]
]) {
    test(`Follow ${name}`, () => {
        const h = harness('follow', { anchor });
        h.context.checkWaitModeAdvance();
        assert.equal(h.timers[0].delay, expectedDelay);
        const metronome = h.events.find(event => Array.isArray(event) && event[0] === 'metronome');
        assert.equal(Math.round(metronome[4] * 1000), expectedDelay);
        h.timers[0].callback();
        assert.deepEqual(h.events.slice(-3), ['cursor', 'scroll', 'loop']);
    });
}

for (const mode of ['wait', 'follow']) {
    test(`${mode} pending advancement is suppressed after pause`, () => {
        const h = harness(mode);
        h.context.checkWaitModeAdvance();
        const before = h.events.length;
        h.state.isPlaying = false;
        h.timers[0].callback();
        assert.equal(h.events.length, before);
    });
}

test('Realtime never enters Wait input advancement', () => {
    const h = harness('realtime');
    h.context.checkWaitModeAdvance();
    assert.equal(h.timers.length, 0);
    assert.equal(h.events.length, 0);
    assert.equal(h.state.isAudioBusy, true);
});
