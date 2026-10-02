// Transitional classic composition. P9 moves assembly/lifecycle into bootstrap.
const midiEchoFilter = PianoTrainerMidiInput.createEchoFilter(AppState, () => performance.now());
function dispatchTrainerNoteInput(input: PianoTrainerDomain.TrainerNoteInput) {
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
        if (id === 'none') return null;
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
    state: AppState, service: midiService, optionalLedEnabled: optionalLedOutput.enabled,
    ledTest: () => window.MidiLedTestController,
    updateConnections: () => updateConnectionStatuses(),
    refreshConnections: () => refreshConnectionStatuses(),
    clearPermissionHelp: () => clearMidiPermissionHelp(),
    syncRouting: () => { if (typeof syncTrainerRoutingUiState === 'function') syncTrainerRoutingUiState(); },
    sendExpression: () => midiOutput.expression(),
    wipeLed: () => wipeHardwareLEDs(),
    renderKeyboard: () => renderVirtualKeyboard()
});

function setupMIDI() { return midiService.init(); }
function populateMIDIDevices() { midiControls.populateMIDIDevices(); }
function populateMidiChannelSelect(id: string, value = 1, options = {}) { midiControls.populateMidiChannelSelect(id, value, options); }
function syncMidiInputConfigVisibility() { midiControls.syncMidiInputConfigVisibility(); }
function syncMidiOutChannelVisibility() { midiControls.syncMidiOutChannelVisibility(); }
function getSelectedMidiInChannel() { return midiControls.getSelectedMidiInChannel(); }
function getSelectedMidiOutChannel() { return midiControls.getSelectedMidiOutChannel(); }
function getSelectedMidiLightsChannel() { return midiControls.getSelectedMidiLightsChannel(); }
function getLegacyMidiPort(direction: 'input' | 'output', id: string) { return midiService.getPort(direction, id); }
function getLegacyMidiOutput(id: string) { return midiService.getOutput(id); }
function getMidiStatus(baseStatus: number, channelOneBased: unknown) { return baseStatus + (normalizeMidiChannel(channelOneBased, 1) - 1); }
function getMidiOutStatus(baseStatus: number) { return midiOutput.status(baseStatus); }
function getMidiLightsStatus(baseStatus: number) { return getMidiStatus(baseStatus, AppState.midiLightsChannel || 1); }
function rememberOutgoingMidiMessage(status: number, note: number, velocity: number) { midiEchoFilter.remember(status, note, velocity); }
function isRecentOutgoingMidiEcho(status: number, note: number, velocity: number) { return midiEchoFilter.isRecent(status, note, velocity); }
function getSelectedMidiOutOutput() { return midiOutput.getOutput(); }
function getMidiOutExpressionValue(value: unknown = AppState.midiOutVolume) { return PianoTrainerMidiOutput.expressionValue(value); }
function sendMidiOutExpressionLevel(value: unknown = AppState.midiOutVolume) { return midiOutput.expression(value); }
function sendMidiOutNoteOn(note: number, velocity: unknown = 100) { return midiOutput.noteOn(note, velocity); }
function sendMidiOutNoteOff(note: number) { return midiOutput.noteOff(note); }
function scheduleMidiOutPlaybackNote(note: number, durationMs: unknown, velocity: unknown = 100) { midiOutput.scheduleNote(note, durationMs, velocity); }
midiControls.init();
