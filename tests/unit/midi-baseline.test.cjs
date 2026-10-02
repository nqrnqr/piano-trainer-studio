const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const { runScript, runFunction } = require('../helpers/legacy-script.cjs');

function harness() {
    const elements = new Map();
    const input = { id: 'test-input', onmidimessage: null };
    const second = { id: 'second-input', onmidimessage: null };
    const received = [];
    const sent = [];
    let now = 1000;
    const element = id => {
        if (!elements.has(id)) elements.set(id, {
            value: 'none', checked: false, dataset: {}, listeners: {}, selectedOptions: [],
            classList: { toggle() {}, add() {} },
            addEventListener(event, callback) { this.listeners[event] = callback; }
        });
        return elements.get(id);
    };
    const state = { midiInChannel: 0, midiOutChannel: 1, ledOutputMode: 'none', recentMidiEchoes: [] };
    const context = vm.createContext({
        window: {}, console, performance: { now: () => now },
        document: { getElementById: element },
        localStorage: { setItem() {}, removeItem() {} },
        AppState: state,
        MIDI_IN_ID_STORAGE_KEY: 'pt_midiInId', MIDI_IN_NAME_STORAGE_KEY: 'pt_midiInName',
        updateConnectionStatuses() {},
        triggerVirtualKey: (...args) => received.push(args),
        access: { inputs: new Map([[input.id, input], [second.id, second]]), outputs: new Map([['test-output', { state: 'connected', send: bytes => sent.push(Array.from(bytes)) }]]) }
    });
    for (const name of ['normalizeMidiChannel', 'normalizeMidiInputChannel']) runFunction(context, 'js/trainer-state.js', name);
    runScript(context, 'js/midi.js');
    vm.runInContext('midiAccess = access', context);
    element('midi-in-channel').value = '0';
    element('midi-out-channel').value = '1';
    element('midi-out').value = 'test-output';
    const select = id => element('midi-in').listeners.change({ target: Object.assign(element('midi-in'), { value: id }) });
    select(input.id);
    return { context, input, second, received, sent, state, element, select, advance: ms => { now += ms; } };
}

test('raw MIDI Note On, Note Off and zero-velocity Note On use the production input callback', () => {
    const h = harness();
    for (const data of [[0x90, 60, 81], [0x80, 60, 32], [0x90, 61, 0]]) h.input.onmidimessage({ data: Uint8Array.from(data) });
    assert.deepEqual(h.received, [[60, true, 'midi', 81], [60, false, 'midi', 32], [61, false, 'midi', 0]]);
});

test('Any accepts all channels; selected input channel rejects other channels and non-note messages', () => {
    const h = harness();
    h.input.onmidimessage({ data: [0x9F, 60, 90] });
    h.element('midi-in-channel').value = '2';
    for (const data of [[0x90, 61, 90], [0x91, 62, 91], [0xB1, 64, 127], [0xC1, 4], [0xF8]]) h.input.onmidimessage({ data });
    assert.deepEqual(h.received, [[60, true, 'midi', 90], [62, true, 'midi', 91]]);
});

test('exact outgoing echoes are suppressed for 120ms; different velocity and expired echoes pass', () => {
    const h = harness();
    h.context.rememberOutgoingMidiMessage(0x90, 60, 90);
    h.input.onmidimessage({ data: [0x90, 60, 90] });
    h.input.onmidimessage({ data: [0x90, 60, 91] });
    h.advance(120);
    h.input.onmidimessage({ data: [0x90, 60, 90] });
    assert.deepEqual(h.received, [[60, true, 'midi', 91], [60, true, 'midi', 90]]);
});

test('switching and selecting None releases the previous device callback', () => {
    const h = harness();
    h.select(h.second.id);
    assert.equal(h.input.onmidimessage, null);
    h.second.onmidimessage({ data: [0x90, 60, 90] });
    h.select(h.second.id);
    h.second.onmidimessage({ data: [0x90, 61, 90] });
    assert.equal(h.received.length, 2);
    h.select('none');
    assert.equal(h.second.onmidimessage, null);
});

test('later core definitions preserve effective velocity behavior and output channel', () => {
    const h = harness();
    h.context.sendMidiOutNoteOn(60, 0);
    assert.deepEqual(h.sent.pop(), [0x90, 60, 100]); // Earlier MIDI definition.
    for (const name of ['getMidiOutStatus', 'getSelectedMidiOutOutput', 'normalizeLiveVelocity', 'sendMidiOutNoteOn', 'sendMidiOutNoteOff']) runFunction(h.context, 'js/trainer-core.js', name);
    h.element('midi-out-channel').value = '3';
    h.state.midiOutChannel = 3;
    for (const velocity of [0, 65.5, NaN, 999]) h.context.sendMidiOutNoteOn(60, velocity);
    h.context.sendMidiOutNoteOff(60);
    assert.deepEqual(h.sent, [[0x92, 60, 1], [0x92, 60, 65.5], [0x92, 60, 100], [0x92, 60, 127], [0x82, 60, 0]]);
    h.element('midi-out').value = 'none';
    assert.equal(h.context.sendMidiOutNoteOn(60), false);
});
