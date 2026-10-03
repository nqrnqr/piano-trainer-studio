"use strict";
const legacyMidiLedTestResources = createLegacyLedResources();
const legacyMidiLedTest = window.PianoTrainerLegacyMidiLedTest.create({
    state: AppState, document, console, resources: legacyMidiLedTestResources, LedEngine, buildChromaticTestNotes,
    getLegacyMidiOutput: id => getLegacyMidiOutput(id), getMidiStatus, getPlayerPlayableRange,
    getSelectedMidiLightsChannel, optionalLedOutput, rememberOutgoingMidiMessage,
    renderVirtualKeyboard: () => renderVirtualKeyboard(), wipeHardwareLEDs
});
const MidiLedTestController = legacyMidiLedTest.controller;
const initLegacyMidiLedTest = legacyMidiLedTest.init;
//# sourceMappingURL=midi-led-test.js.map