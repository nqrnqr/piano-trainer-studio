const assert = require('node:assert/strict');
const { test } = require('node:test');
const { harness: playbackHarness } = require('../helpers/playback-harness.cjs');

// Fake clock only at the existing scheduler boundary; execute the original
// typed coordinator to retain the P0 timing and side-effect assertions.
function harness(mode, { now = 10, anchor = 10.8, hit = true } = {}) {
    const events = [];
    const timers = [];
    const state = {
        mode, isPlaying: true, isAudioBusy: true, anchorTime: anchor,
        expectedNotes: [{ midi: 60, hit }, { midi: 64, hit }],
        pendingAudio: [{ midi: 48, durationMs: 450, velocity: 80, toLocalAudio: true, toMidiOut: false }],
        followAdvanceInfo: { currentMeasureIdx: 0, currentTimestamp: 0, waitSeconds: 1, beatsToWait: 2 }
    };
    const h = playbackHarness({now, state});
    assert.equal(h.api('PianoTrainerPlaybackCoordinator').FOLLOW_ME_MIN_WAIT_RATIO, 0.6);
    h.ports.audio.schedule = (...args) => events.push(['audio', ...args]);
    h.ports.practice.startSustains = () => events.push('sustains');
    h.ports.metronome.scheduleMetronomeForPlaybackWindow = (...args) => events.push(['metronome', ...args]);
    h.ports.score.update = () => events.push('cursor');
    h.ports.ui.scroll = () => events.push('scroll');
    h.ports.score.isEndReached = () => {events.push('loop');return true;};
    h.ports.controls.isLoopEnabledAtEnd = () => true;
    h.backend.setTimer = (callback, delay) => timers.push({callback, delay});
    return {context:{checkWaitModeAdvance:h.service.checkWaitModeAdvance}, state:h.state, events, timers};
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
