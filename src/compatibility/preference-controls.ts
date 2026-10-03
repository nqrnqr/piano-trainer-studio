// Lazy commands preserve classic startup order. P9 composes these in bootstrap.
const practiceControls = PianoTrainerPracticeControls.create({document, state: AppState, routing: handRouting,
    getSelectedMidiOutOutput: () => getSelectedMidiOutOutput(),
    syncTempoMetronomeDependentUi: () => syncTempoMetronomeDependentUi(),
    applyToneLatencyProfileForMode: () => applyToneLatencyProfileForMode(),
    saveBool: (key, value) => setStoredBool(({
        keyboard: TRAINER_KEYBOARD_STORAGE_KEY, feedback: TRAINER_FEEDBACK_STORAGE_KEY,
        futurePreview: TRAINER_FUTURE_PREVIEW_STORAGE_KEY, correctHighlight: TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY,
        autoScroll: TRAINER_AUTOSCROLL_STORAGE_KEY, fullscreenOnPlay: TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY,
        lowLatencyPlayback: TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY, audioHands: TRAINER_AUDIO_HANDS_STORAGE_KEY,
        audioOther: TRAINER_AUDIO_OTHER_STORAGE_KEY, audioInstrument: TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY,
        audioVirtual: TRAINER_AUDIO_VIRTUAL_STORAGE_KEY, midiOutHands: TRAINER_MIDIOUT_HANDS_STORAGE_KEY,
        midiOutOther: TRAINER_MIDIOUT_OTHER_STORAGE_KEY, midiOutInstrument: TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY,
        midiOutVirtual: TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY
    })[key], value),
    saveMode: value => localStorage.setItem(TRAINER_MODE_STORAGE_KEY, value),
    pause: () => pausePlaybackFromToolbar(), clearScheduledMetronomeEvents: () => clearScheduledMetronomeEvents(),
    stopWaitModeMetronome: () => stopWaitModeMetronome(), silencePlaybackOutputsImmediately: () => silencePlaybackOutputsImmediately(),
    clearTransientPlaybackState: options => clearTransientPlaybackState(options),
    readPianoVolume: () => audioLevelControls.readPianoVolume(), readMetroVolume: () => audioLevelControls.readMetroVolume(),
    updatePianoVolume: value => updatePianoVolume(value), updateMetroVolume: value => updateMetroVolume(value),
    renderKeyboard: () => renderVirtualKeyboard(), clearSvgFeedback: () => GeometryEngine.clearSvgFeedback(),
    renderFeedbackOverlay: () => renderFeedbackOverlay(),
    syncSettingsDebugVisibility: () => {if (typeof window.syncSettingsDebugVisibility === 'function') window.syncSettingsDebugVisibility();},
    positionCalibrationPanel: () => optionalLedOutput.positionCalibrationPanel(), dispatchResize: () => window.dispatchEvent(new Event('resize')),
    releaseLowLatencyPlayback: () => audioOutput.releaseLowLatencyPlayback(), syncMidiInBoostUi: () => syncMidiInBoostUi()});
const applyModeSettings = practiceControls.applyModeSettings;
const syncTrainerRoutingUiState = practiceControls.syncTrainerRoutingUiState;
function getDefaultStaffAssignment() {return PianoTrainerHandRouting.defaultAssignment(osmdAdapter.getDefaultStaffCount());}
const handAssignmentController = PianoTrainerHandAssignment.create({state: AppState,
    captureCurrentFrame: () => {
        const frame = osmdAdapter.readHandAssignmentFrame();
        if (!frame) return null;
        const {entries, measureIndex, timestamp} = frame;
        return {hasEntries: entries.length > 0, measureIndex,
            buildExpected: () => buildExpectedNotesFromEntries(entries, measureIndex, timestamp),
            renderKeyboard: () => renderVirtualKeyboard(entries, measureIndex, timestamp)};
    }, renderKeyboard: () => renderVirtualKeyboard()});
const handAssignmentControls = PianoTrainerHandAssignmentControls.create({document, commit: handAssignmentController.commit});
const syncHandAssignmentFromControls = handAssignmentControls.syncHandAssignmentFromControls;
const preferenceControls = PianoTrainerPreferenceControls.create({document, state: AppState, storage: localStorage,
    keys: PREFERENCE_STORAGE_KEYS, getStoredBool, getClampedNumber, setStoredBool, clearSavedPreferences,
    syncActiveHandStateFromMode, syncMidiInBoostUi, updatePianoVolume, updateMidiOutVolume, updateMidiInBoost,
    syncZoomControls, applyZoom, syncFullscreenUi,
    setDebugEnabled: (value, options) => setDebugEnabled(value, options), updateMetroVolume,
    syncTempoMetronomeDependentUi, setPlayerPianoType, getDefaultStaffAssignment, syncHandAssignmentFromControls,
    applyModeSettings, setScoreLayout: value => ScoreDisplay.setMode(value),
    resetLedPreferences: () => optionalLedPreferences.reset(), syncLedPreferenceControls: () => optionalLedPreferences.syncControls(),
    positionCalibrationPanel: () => optionalLedOutput.positionCalibrationPanel(), renderLooper: () => renderLooper(),
    renderVirtualKeyboard: () => renderVirtualKeyboard(), populateMIDIDevices: () => {void populateMIDIDevices();}});
const applyPersistedTrainerAndSettingsPreferences = preferenceControls.applyPersistedTrainerAndSettingsPreferences;
const restoreDefaultPreferences = preferenceControls.restoreDefaultPreferences;
const settingsActions = PianoTrainerSettingsActions.create({document, downloadSettingsBackup, handleSettingsBackupImportFile,
    confirm: message => window.confirm(message), restoreDefaultPreferences});
