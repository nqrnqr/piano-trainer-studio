const assert = require('node:assert/strict');
const { test } = require('node:test');
const {midiHarness:harness}=require('../helpers/midi-harness.cjs');

test('raw MIDI Note On, Note Off and zero-velocity Note On use the production input callback', async () => {
    const h = await harness();
    for (const data of [[0x90, 60, 81], [0x80, 60, 32], [0x90, 61, 0]]) h.input.onmidimessage({ data: Uint8Array.from(data) });
    assert.deepEqual(h.received, [[60, true, 'midi', 81], [60, false, 'midi', 32], [61, false, 'midi', 0]]);
});

test('Any accepts all channels; selected input channel rejects other channels and non-note messages', async () => {
    const h = await harness();
    h.input.onmidimessage({ data: [0x9F, 60, 90] });
    h.element('midi-in-channel').value = '2';
    for (const data of [[0x90, 61, 90], [0x91, 62, 91], [0xB1, 64, 127], [0xC1, 4], [0xF8]]) h.input.onmidimessage({ data });
    assert.deepEqual(h.received, [[60, true, 'midi', 90], [62, true, 'midi', 91]]);
});

test('exact outgoing echoes are suppressed for 120ms; different velocity and expired echoes pass', async () => {
    const h = await harness();
    h.echo.remember(0x90, 60, 90);
    h.input.onmidimessage({ data: [0x90, 60, 90] });
    h.input.onmidimessage({ data: [0x90, 60, 91] });
    h.advance(120);
    h.input.onmidimessage({ data: [0x90, 60, 90] });
    assert.deepEqual(h.received, [[60, true, 'midi', 91], [60, true, 'midi', 90]]);
});

test('switching and selecting None releases the previous device callback', async () => {
    const h = await harness();
    h.select(h.second.id);
    assert.equal(h.input.onmidimessage, null);
    h.second.onmidimessage({ data: [0x90, 60, 90] });
    h.select(h.second.id);
    h.second.onmidimessage({ data: [0x90, 61, 90] });
    assert.equal(h.received.length, 2);
    h.select('none');
    assert.equal(h.second.onmidimessage, null);
});

test('sole output implementation preserves effective core velocity and uses state over stale DOM channel', async () => {
    const h = await harness();
    h.element('midi-out-channel').value = '7';
    h.state.midiOutChannel = 3;
    for (const velocity of [0, 65.5, NaN, 999]) h.output.noteOn(60, velocity);
    h.output.noteOff(60);
    assert.deepEqual(h.sent, [[0x92, 60, 1], [0x92, 60, 65.5], [0x92, 60, 100], [0x92, 60, 127], [0x82, 60, 0]]);
    h.element('midi-out').value = 'none';
    assert.equal(h.output.noteOn(60), false);
});
