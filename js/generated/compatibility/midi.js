"use strict";
// Transitional classic composition. P9 moves assembly/lifecycle into bootstrap.
const midiEchoFilter = PianoTrainerMidiInput.createEchoFilter(AppState, () => performance.now());
function dispatchTrainerNoteInput(input) {
    practiceInput.handle(input);
}
const midiService = PianoTrainerMidiService.create({
    requestAccess: navigator.requestMIDIAccess ? () => navigator.requestMIDIAccess() : null,
    onReady: () => midiControls.onReady(),
    onDevicesChanged: () => midiControls.onDevicesChanged(),
    onAccessError: error => {
        console.warn('MIDI Access Denied', error);
        showMidiPermissionHelp(getMidiPermissionHelpText());
    },
    selectedInputChannel: () => midiControls.getSelectedMidiInChannel(),
    isEcho: (status, note, velocity) => midiEchoFilter.isRecent(status, note, velocity),
    dispatch: input => dispatchTrainerNoteInput(input),
    nowMs: () => performance.now()
});
const midiOutput = PianoTrainerMidiOutput.create({
    getOutput: () => {
        const id = midiControls.getSelectedOutputId();
        if (id === 'none')
            return null;
        const output = midiService.getOutput(id);
        return output && output.state !== 'disconnected' ? output : null;
    },
    getChannel: () => AppState.midiOutChannel,
    getVolume: () => AppState.midiOutVolume,
    normalizeChannel: value => normalizeMidiChannel(value, 1),
    normalizeVelocity: value => PianoTrainerVelocity.normalizeLiveVelocity(value).midi,
    remember: (status, note, velocity) => midiEchoFilter.remember(status, note, velocity),
    setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
    clearTimer: id => window.clearTimeout(id)
});
const midiControls = PianoTrainerMidiControls.create({
    document, storage: localStorage, keys: PREFERENCE_STORAGE_KEYS, normalizeMidiChannel, normalizeMidiInputChannel, setStoredBool,
    state: AppState, service: midiService, optionalLedEnabled: optionalLedOutput.enabled,
    ledTest: () => legacyMidiLedTest.controller,
    updateConnections: () => updateConnectionStatuses(),
    refreshConnections: () => refreshConnectionStatuses(),
    clearPermissionHelp: () => clearMidiPermissionHelp(),
    syncRouting: () => { if (typeof syncTrainerRoutingUiState === 'function')
        syncTrainerRoutingUiState(); },
    sendExpression: () => midiOutput.expression(),
    wipeLed: () => wipeHardwareLEDs(),
    renderKeyboard: () => renderVirtualKeyboard()
});
function setupMIDI() { return midiService.init(); }
function populateMIDIDevices() { midiControls.populateMIDIDevices(); }
function populateMidiChannelSelect(id, value = 1, options = {}) { midiControls.populateMidiChannelSelect(id, value, options); }
function syncMidiInputConfigVisibility() { midiControls.syncMidiInputConfigVisibility(); }
function syncMidiOutChannelVisibility() { midiControls.syncMidiOutChannelVisibility(); }
function getSelectedMidiInChannel() { return midiControls.getSelectedMidiInChannel(); }
function getSelectedMidiOutChannel() { return midiControls.getSelectedMidiOutChannel(); }
function getSelectedMidiLightsChannel() { return midiControls.getSelectedMidiLightsChannel(); }
function getLegacyMidiPort(direction, id) { return midiService.getPort(direction, id); }
function getLegacyMidiOutput(id) { return midiService.getOutput(id); }
function getMidiStatus(baseStatus, channelOneBased) { return baseStatus + (normalizeMidiChannel(channelOneBased, 1) - 1); }
function getMidiOutStatus(baseStatus) { return midiOutput.status(baseStatus); }
function getMidiLightsStatus(baseStatus) { return getMidiStatus(baseStatus, AppState.midiLightsChannel || 1); }
function rememberOutgoingMidiMessage(status, note, velocity) { midiEchoFilter.remember(status, note, velocity); }
function isRecentOutgoingMidiEcho(status, note, velocity) { return midiEchoFilter.isRecent(status, note, velocity); }
function getSelectedMidiOutOutput() { return midiOutput.getOutput(); }
function getMidiOutExpressionValue(value = AppState.midiOutVolume) { return PianoTrainerMidiOutput.expressionValue(value); }
function sendMidiOutExpressionLevel(value = AppState.midiOutVolume) { return midiOutput.expression(value); }
function sendMidiOutNoteOn(note, velocity = 100) { return midiOutput.noteOn(note, velocity); }
function sendMidiOutNoteOff(note) { return midiOutput.noteOff(note); }
function scheduleMidiOutPlaybackNote(note, durationMs, velocity = 100) { midiOutput.scheduleNote(note, durationMs, velocity); }
midiControls.init();
//# sourceMappingURL=midi.js.map