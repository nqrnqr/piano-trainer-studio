// Classic-script composition only. P9 moves this assembly into bootstrap.
// Existing LED behavior is the default. Explicit boot options or ?led=off choose
// no-op without changing persisted LED device/calibration preferences.
const optionalLedEnabled = typeof window.__PT_BOOT_OPTIONS__?.ledEnabled === 'boolean'
    ? window.__PT_BOOT_OPTIONS__.ledEnabled
    : new URLSearchParams(window.location.search).get('led') !== 'off';

const optionalLedOutput = optionalLedEnabled
    ? PianoTrainerOptionalLed.createLegacy({
        initControls: () => {
            initLegacyMidiLedTest();
            initLedCountControl();
            initLedBrightnessControls();
            initLedCalibrationControls();
        },
        initOutput: () => {
            LedEngine.init();
            WLEDController.clearLastSignature();
            initLedOutputControls();
        },
        refreshMapping: () => updateLedKeyMapping(),
        invalidate: () => WLEDController.clearLastSignature(),
        positionCalibrationPanel: () => positionLedCalibrationPanel(),
        render: (states, depth) => {
            if (depth !== undefined) LedEngine.config.futurePreview = depth;
            LedEngine.renderFromStates(states);
            LedEngine.renderOutputs();
        },
        renderOutputs: () => LedEngine.renderOutputs(),
        updateHardware: (midi, next, previous) => legacyUpdateLEDHardware(midi, next, previous),
        wipeHardware: () => legacyWipeHardwareLEDs(),
        clearOutputs: () => WLEDController.forceClear(),
        isCalibrating: () => AppState.ledCalibrationMode,
        renderKeyboard: () => renderVirtualKeyboard(),
        requestFrame: callback => window.requestAnimationFrame(callback),
        cancelFrame: id => window.cancelAnimationFrame(id),
        stopHardwareResources: () => {
            WLEDController.cancelReconnect();
            WLEDController.stopHealthChecks();
            window.MidiLedTestController?.stop().catch(() => {});
            legacyWipeHardwareLEDs();
        }
    }) : PianoTrainerOptionalLed.createNoop();

function wipeHardwareLEDs() { optionalLedOutput.wipeHardware(); }
const optionalLedPreferences = {
    reset() {
        if (!optionalLedOutput.enabled) return;
        setLedCount(88); setLedMasterBrightness(25); setLedFuture1BrightnessPct(1); setLedFuture2BrightnessPct(1);
        resetAllLedCalibration(); setWledIp(''); setLedOutputMode('none');
    },
    syncControls() {
        if (!optionalLedOutput.enabled) return;
        syncLedBrightnessControls(); syncLedOutputModeControls();
    }
};
if (!optionalLedOutput.enabled) {
    const settings = document.getElementById('fs-led-setup');
    if (settings instanceof HTMLFieldSetElement) {
        settings.disabled = true;
        settings.classList.add('hidden');
    }
}
