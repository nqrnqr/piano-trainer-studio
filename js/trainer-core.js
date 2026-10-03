// Transitional startup order only. P9 moves assembly into typed bootstrap.
// Vendor, audio, controls, preferences, MIDI and optional LED retain this order.
(function() {
    try {
        window.__PT_DEBUG_BOOT__ = (window.__PT_DEBUG_BOOT__ || 0) + 1;
    } catch (e) {}
})();
let osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmd-container", {
    autoResize: false, 
    drawTitle: true
});
ScoreDisplay.init();
audioOutput.init();
metronomeOutput.init();
scoreFileControls.init();
practiceControls.initFuturePreview();
practiceControls.initModeAndFeedback();
scoreSeekControls.init();
displayControls.initPlaybackShell();
displayControls.initZoom();
tempoControls.initEditing();
audioLevelControls.init();
practiceControls.initRouting();
loopControls.initOptions();
tempoControls.initMetronomePreferences();
syncLooperDependentUi();
tempoControls.initMetronomeToggle();
loopControls.initRange();
settingsActions.init();
initPlayerPianoTypeControl();
optionalLedOutput.initControls();
virtualKeyboardControls.initActivation();
applyToneLatencyProfileForMode();
ensurePianoSamplerLoaded().catch(() => {});
createKeyboard();
optionalLedOutput.initOutput();
initUpdateControls();
applyPersistedTrainerAndSettingsPreferences();
if (typeof consumePendingFirstRunNotice === 'function' && consumePendingFirstRunNotice()) {
    window.setTimeout(() => {
        if (window.IntroUI?.maybeShowFirstRunIntro) {
            window.IntroUI.maybeShowFirstRunIntro();
        }
    }, 0);
}
setupMIDI();
optionalLedOutput.refreshMapping();
optionalLedOutput.renderOutputs();
optionalLedOutput.positionCalibrationPanel();
updateConnectionStatuses();
applyModeSettings();
optionalLedOutput.start();
window.syncTrainerRoutingUiState = syncTrainerRoutingUiState;
