"use strict";
// Transitional assembly at the former LED slot; P9 bootstrap will own these instances.
function createLegacyLedResources() {
    return PianoTrainerLegacyLedResources.create({
        setTimer: (callback, delay) => window.setTimeout(callback, delay), clearTimer: id => window.clearTimeout(id),
        setInterval: (callback, delay) => window.setInterval(callback, delay), clearInterval: id => window.clearInterval(id),
        requestFrame: callback => window.requestAnimationFrame(callback), cancelFrame: id => window.cancelAnimationFrame(id),
        createReader: () => new FileReader(), createRequest: () => new AbortController(),
        createUrl: blob => URL.createObjectURL(blob), revokeUrl: url => URL.revokeObjectURL(url),
        createLink: () => document.createElement('a')
    });
}
const legacyLedResources = createLegacyLedResources();
const legacyLed = window.PianoTrainerLegacyLed.create({
    state: AppState, document, storage: localStorage, console, fetch: (url, options) => fetch(url, options),
    resources: legacyLedResources, view: window,
    keys: { LED_CALIBRATION_STORAGE_KEY, LED_COUNT_STORAGE_KEY, LED_FUTURE1_PCT_STORAGE_KEY, LED_FUTURE2_PCT_STORAGE_KEY,
        LED_MASTER_BRIGHTNESS_STORAGE_KEY, LED_OUTPUT_MODE_STORAGE_KEY, LED_REVERSE_STORAGE_KEY, WLED_DDP_DEBUG_STORAGE_KEY,
        WLED_IP_STORAGE_KEY, WLED_TRANSPORT_STORAGE_KEY, WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY },
    FULL_PIANO_KEY_COUNT, FULL_PIANO_MIDI_MIN, getMidiTest: () => legacyMidiLedTest.controller,
    clearWledPermissionHelp, closeToolbarPanel, getClampedNumber,
    getLegacyMidiOutput: id => getLegacyMidiOutput(id), getMidiKeyPosition01, getMidiLightsStatus: status => getMidiLightsStatus(status),
    getPlayerPlayableRange, getStoredBool, getWledPermissionHelpText, initUpdateControls, isLikelyBrowserAccessIssue,
    normalizeLedCount, normalizeLedFuturePct, normalizeLedMasterBrightness,
    rememberOutgoingMidiMessage: (status, note, velocity) => rememberOutgoingMidiMessage(status, note, velocity),
    renderVirtualKeyboard: () => renderVirtualKeyboard(), setStoredBool, showWledPermissionHelp, syncToolbarButtonStates,
    updateConnectionStatuses, wipeHardwareLEDs: () => wipeHardwareLEDs()
});
const { LedEngine, WLEDController, initLedCountControl, initLedBrightnessControls, initLedCalibrationControls, initLedOutputControls, updateLedKeyMapping, positionLedCalibrationPanel, legacyUpdateLEDHardware, legacyWipeHardwareLEDs, setLedCount, setLedMasterBrightness, setLedFuture1BrightnessPct, setLedFuture2BrightnessPct, resetAllLedCalibration, setWledIp, setLedOutputMode, syncLedBrightnessControls, syncLedOutputModeControls, syncWledStatus, selectLedCalibrationMidi, buildChromaticTestNotes } = legacyLed;
window.syncSettingsDebugVisibility = legacyLed.syncWledTransportControls;
//# sourceMappingURL=legacy-led.js.map