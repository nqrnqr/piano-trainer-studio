import {PianoTrainerHandAssignment} from './hand-assignment-controller';
import {PianoTrainerKeyboardController} from './keyboard-controller';
import {PianoTrainerScoreSeek} from './score-seek-controller';
import {PianoTrainerScoreUiController} from './score-ui-controller';
import {PianoTrainerUpdateController} from './update-controller';
import {PianoTrainerAudioRouting} from '../audio/audio-routing';
import {PianoTrainerMetronomeOutput} from '../audio/metronome-output';
import {PianoTrainerMetronome} from '../audio/metronome';
import {PianoTrainerPlaybackClock} from '../audio/playback-clock';
import {PianoTrainerAudioOutput} from '../audio/tone-adapter';
import {PianoTrainerToneTransport} from '../audio/tone-transport';
import {PianoTrainerHandRouting} from '../domain/hand-routing';
import type {PianoTrainerDomain} from '../domain/model';
import {FULL_PIANO_KEY_COUNT, FULL_PIANO_MIDI_MIN, derivePlayerRangeFromKeyboardSize, normalizePlayerPianoType} from '../domain/playable-range';
import {PianoTrainerPreferenceValues} from '../domain/preference-values';
import {PianoTrainerTiming} from '../domain/timing';
import {PianoTrainerVelocity} from '../domain/velocity';

import {PianoTrainerMidiInput} from '../midi/midi-input';
import {PianoTrainerMidiOutput} from '../midi/midi-output';
import {PianoTrainerMidiService} from '../midi/midi-service';
import {PianoTrainerOptionalLed} from '../optional/led/legacy-led-adapter';

import {PianoTrainerLegacyLedResources} from '../optional/led/legacy-led-resources';
import {PianoTrainerEarlyGrace} from '../practice/early-grace';
import {PianoTrainerExpectedNotes} from '../practice/expected-notes';
import {PianoTrainerFeedbackState} from '../practice/feedback-state';
import {PianoTrainerInputController} from '../practice/input-controller';
import {PianoTrainerInputMatching} from '../practice/input-matching';
import {PianoTrainerPlaybackCoordinator} from '../practice/playback-coordinator';
import {PianoTrainerPlaybackState} from '../practice/playback-state';
import {PianoTrainerScoring} from '../practice/scoring';
import {PianoTrainerSustainState} from '../practice/sustain-state';
import {PianoTrainerFeedbackOverlay} from '../render/feedback-overlay';
import {PianoTrainerGeometry} from '../render/geometry-engine';
import {PianoTrainerLoopOverlay} from '../render/loop-overlay';
import {PianoTrainerScoreRenderer} from '../render/score-renderer';
import {PianoTrainerScoreViewport} from '../render/score-viewport';
import {PianoTrainerVirtualKeyboardView} from '../render/virtual-keyboard';
import {PianoTrainerMeasureTiming} from '../score/measure-timing';
import {PianoTrainerMusicXmlIO} from '../score/musicxml-io';
import {PianoTrainerOsmdAdapter} from '../score/osmd-adapter';
import {PianoTrainerOsmdDebugObservation} from '../score/osmd-debug-observation';
import {PianoTrainerScoreConversion} from '../score/score-conversion';
import {PianoTrainerScoreLibrary} from '../score/score-library';
import {PianoTrainerScoreLoader} from '../score/score-loader';
import {PianoTrainerScoreTraversal} from '../score/score-traversal';
import {PianoTrainerTransposeController} from '../score/transpose-controller';
import {PianoTrainerTransposeEngine} from '../score/transpose-engine';
import {PianoTrainerWebmscoreAdapter} from '../score/webmscore-adapter';
import {PianoTrainerAppState} from '../state/app-state';
import {PianoTrainerPlayerRange} from '../state/player-range';
import {ACCENTED_DOWNBEAT_STORAGE_KEY, ASSET_VERSION_OVERRIDE_STORAGE_KEY, LED_CALIBRATION_STORAGE_KEY, LED_COUNT_STORAGE_KEY, LED_FUTURE1_PCT_STORAGE_KEY, LED_FUTURE2_PCT_STORAGE_KEY, LED_MASTER_BRIGHTNESS_STORAGE_KEY, LED_OUTPUT_MODE_STORAGE_KEY, LED_REVERSE_STORAGE_KEY, LOOP_COUNT_IN_STORAGE_KEY, METRONOME_MIDIOUT_STORAGE_KEY, METRONOME_VOL_STORAGE_KEY, PLAYER_PIANO_STORAGE_KEY, PREFERENCE_STORAGE_KEYS, RESETTABLE_PREFERENCE_KEYS, SETTINGS_DEBUG_STORAGE_KEY, TRAINER_AUDIO_HANDS_STORAGE_KEY, TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY, TRAINER_AUDIO_OTHER_STORAGE_KEY, TRAINER_AUDIO_VIRTUAL_STORAGE_KEY, TRAINER_AUTOSCROLL_STORAGE_KEY, TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY, TRAINER_FEEDBACK_STORAGE_KEY, TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY, TRAINER_FUTURE_PREVIEW_STORAGE_KEY, TRAINER_KEYBOARD_STORAGE_KEY, TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY, TRAINER_MIDIIN_BOOST_STORAGE_KEY, TRAINER_MIDIOUT_HANDS_STORAGE_KEY, TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY, TRAINER_MIDIOUT_OTHER_STORAGE_KEY, TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY, TRAINER_MIDIOUT_VOL_STORAGE_KEY, TRAINER_MODE_STORAGE_KEY, TRAINER_PIANO_VOL_STORAGE_KEY, TRAINER_SCORE_LAYOUT_STORAGE_KEY, TRAINER_ZOOM_STORAGE_KEY, UPDATE_MANIFEST_URL_STORAGE_KEY, VISUAL_PULSE_STORAGE_KEY, WLED_DDP_DEBUG_STORAGE_KEY, WLED_IP_STORAGE_KEY, WLED_TRANSPORT_STORAGE_KEY, WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY} from '../state/preference-keys';
import {PianoTrainerPreferences} from '../state/preferences';
import {PianoTrainerSettingsBackup} from '../state/settings-backup';
import {getPreferredPianoSampleExtension} from '../ui/audio-capabilities';
import {PianoTrainerAudioLevelControls} from '../ui/audio-level-controls';
import {PianoTrainerConnectionStatus} from '../ui/connection-status';
import {PianoTrainerDisplayControls} from '../ui/display-controls';
import {PianoTrainerFeedbackDebug} from '../ui/feedback-debug';
import {PianoTrainerHandAssignmentControls} from '../ui/hand-assignment-controls';
import {PianoTrainerLibraryActions} from '../ui/library-actions';
import {PianoTrainerLibraryControlsState} from '../ui/library-controls-state';
import {PianoTrainerLibraryDialogs} from '../ui/library-dialogs';
import {PianoTrainerLibraryList} from '../ui/library-list';
import {PianoTrainerLoopControls} from '../ui/loop-controls';
import {PianoTrainerMidiControls} from '../ui/midi-controls';
import {createPermissionHelp, getMidiPermissionHelpText, getUnknownErrorMessage, getWledPermissionHelpText, isLikelyBrowserAccessIssue} from '../ui/permission-help';
import {PianoTrainerPlaybackControls} from '../ui/playback-controls';
import {PianoTrainerPlayerRangeControls} from '../ui/player-range-controls';
import {PianoTrainerPracticeControls} from '../ui/practice-controls';
import {PianoTrainerPreferenceControls} from '../ui/preference-controls';
import {PianoTrainerScoreFileControls} from '../ui/score-file-controls';
import {PianoTrainerScoreFileReader} from '../ui/score-file-reader';
import {PianoTrainerScoreSeekControls} from '../ui/score-seek-controls';
import {PianoTrainerScoreStatus} from '../ui/score-status';
import {PianoTrainerScoresDrawer} from '../ui/scores-drawer';
import {PianoTrainerSettingsActions} from '../ui/settings-actions';
import {PianoTrainerSettingsFiles} from '../ui/settings-controls';
import {PianoTrainerTempoControls} from '../ui/tempo-controls';
import {PianoTrainerTempoPulse} from '../ui/tempo-pulse';
import {PianoTrainerToolbar} from '../ui/toolbar';
import {PianoTrainerTransposeControls} from '../ui/transpose-controls';
import {PianoTrainerUpdateControls} from '../ui/update-controls';
import {PianoTrainerVirtualKeyboardControls} from '../ui/virtual-keyboard-controls';
export function createServices() {
const permissionHelp = createPermissionHelp(document);
const {showMidiPermissionHelp,clearMidiPermissionHelp,showWledPermissionHelp,clearWledPermissionHelp}=permissionHelp;
let osmd: PianoTrainerOsmdVendor.Renderer;
let initialized=false, disposed=false, firstRunTimer:number|undefined;
// app-state.ts composition
const appMetadata = PianoTrainerAppState.readMetadata({manifest: window.__PT_APP_MANIFEST__, assetVersion: window.__PT_ASSET_VERSION__,
    getManifestUrl: () => localStorage.getItem(UPDATE_MANIFEST_URL_STORAGE_KEY)});
const APP_VERSION = appMetadata.version;
const UPDATE_MANIFEST_URL = appMetadata.manifestUrl;
const UPDATE_RELEASES_URL = appMetadata.releaseUrl;
const AppState = PianoTrainerAppState.create();

// hand-routing.ts composition
const handRouting = PianoTrainerHandRouting.create(AppState);
const getAssignedHandRoleForStaff = handRouting.getAssignedHandRoleForStaff;
const isPracticeHandEnabledForStaff = handRouting.isPracticeHandEnabledForStaff;
const syncActiveHandStateFromMode = handRouting.syncActiveHandStateFromMode;

// preferences.ts composition
const preferences = PianoTrainerPreferences.create({state: AppState, storage: localStorage, session: sessionStorage,
    keys: PREFERENCE_STORAGE_KEYS, resettableKeys: RESETTABLE_PREFERENCE_KEYS});
const { consumePendingFirstRunNotice, getStoredBool, getClampedNumber, setStoredBool, clearSavedPreferences } = preferences;
const {normalizeLedCount, normalizeLedMasterBrightness, normalizeLedFuturePct, normalizeMidiChannel,
    normalizeMidiInputChannel} = PianoTrainerPreferenceValues;


// Composition: player-range.ts
const playerRange = PianoTrainerPlayerRange.create(AppState);
const { getPlayerPlayableRange, isMidiInPlayerRange, getMidiKeyPosition01 } = playerRange;

// Composition: settings-backup.ts
const settingsBackup = PianoTrainerSettingsBackup.create({storage: localStorage, session: sessionStorage,
    keys: PREFERENCE_STORAGE_KEYS, resettableKeys: RESETTABLE_PREFERENCE_KEYS, appVersion: APP_VERSION, now: () => new Date(),
    clearSavedPreferences, cancelPendingFirstRunNotice: preferences.cancelPendingFirstRunNotice});
const {buildSettingsBackupPayload, importSettingsBackupPayload} = settingsBackup;

// settings-files.ts composition
const settingsFiles = PianoTrainerSettingsFiles.create({document, createReader: () => new FileReader(),
    createBlob: (parts, options) => new Blob(parts, options), createObjectURL: blob => URL.createObjectURL(blob),
    revokeObjectURL: url => URL.revokeObjectURL(url), now: () => new Date(), buildPayload: buildSettingsBackupPayload,
    importPayload: importSettingsBackupPayload, alert: message => window.alert(message), reload: () => window.location.reload(),
    warn: (message, error) => console.warn(message, error)});

const downloadSettingsBackup = settingsFiles.downloadSettingsBackup;
const handleSettingsBackupImportFile = settingsFiles.handleSettingsBackupImportFile;

// transpose.ts composition
const transposeCommands=PianoTrainerTransposeController.create({
    getApp:()=>typeof AppState==='undefined'?undefined:AppState, getEngine:()=>PianoTrainerTransposeEngine,
    getLoader:()=>loadScoreIntoApp, syncUi:()=>transposeControls.syncUiFromState(), setStatus:(text,error)=>transposeControls.setStatus(text,error),
    reportError:(message,error)=>console.error(message,error),
    errorText:(error,fallback)=>{
        const message=error&&(typeof error==='object'||typeof error==='function')&&'message'in error?error.message:null;
        return message?String(message):fallback;
    }
});
const transposeControls=PianoTrainerTransposeControls.create({document,commands:transposeCommands,getEngine:()=>PianoTrainerTransposeEngine});
const TransposeUI ={...transposeCommands,syncUiFromState:transposeControls.syncUiFromState,getPanel:transposeControls.getPanel,
    init:()=>{transposeCommands.init();transposeControls.init();},dispose:()=>{transposeControls.dispose();transposeCommands.dispose();}};


// toolbar.ts composition
const toolbarUi = PianoTrainerToolbar.create({document, window, storage: localStorage, state: AppState,
    refreshScoresDrawer: () => refreshScoresDrawer()});

const positionScoresPanel = toolbarUi.positionScoresPanel;
const syncToolbarButtonStates = toolbarUi.syncToolbarButtonStates;
const hideToolbarPanels = toolbarUi.hideToolbarPanels;
const closeToolbarPanel = toolbarUi.closeToolbarPanel;
const isAnyToolbarPanelOpen = toolbarUi.isAnyToolbarPanelOpen;
const ToolbarUI = {syncToolbarButtonStates, showToolbarPanel: toolbarUi.showToolbarPanel,
    closeToolbarPanel, hideToolbarPanels, toggleToolbarPanel: toolbarUi.toggleToolbarPanel,
    isAnyToolbarPanelOpen, positionScoresPanel, init: toolbarUi.init, dispose: toolbarUi.dispose};
const IntroUI = {maybeShowFirstRunIntro: toolbarUi.maybeShowFirstRunIntro,
    showFirstRunIntro: toolbarUi.showFirstRunIntro, closeFirstRunIntro: toolbarUi.closeFirstRunIntro,
    markFirstRunIntroSeen: toolbarUi.markFirstRunIntroSeen};

// score-library.ts composition
const ScoreLibrary = PianoTrainerScoreLibrary.create({ hasIndexedDB: () => 'indexedDB' in window, getIndexedDB: () => window.indexedDB,
    makeId: () => {
        if (window.crypto?.randomUUID)
            return window.crypto.randomUUID();
        return `ptlib-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    },
    now: () => Date.now(), isoNow: () => new Date().toISOString(), storage: { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) },
    starterUrl: new URL('assets/Starter_Scores.json', document.baseURI).toString(), fetch: (...args) => fetch(...args),
    format: { getScoreFileTypeFromName: name => getScoreFileTypeFromName(name), getScoreDisplayTitle: name => getScoreDisplayTitle(name) } });
const getScoreLibraryFolderLabel = PianoTrainerScoreLibrary.getScoreLibraryFolderLabel;

// scores-ui.ts composition
const libraryUiLifetime = PianoTrainerLibraryControlsState.createLifetime();
const librarySelection = PianoTrainerLibraryControlsState.create(AppState);
const libraryDialogs = PianoTrainerLibraryDialogs.create({ document, library: ScoreLibrary, lifetime: libraryUiLifetime });
const libraryUiPorts = { document, window, state: AppState, library: ScoreLibrary, lifetime: libraryUiLifetime, selection: librarySelection,
    format: { getScoreDisplayTitle: (name = '') => getScoreDisplayTitle(name), getScoreFileTypeFromName: (name = '') => getScoreFileTypeFromName(name) },
    prompt: (...args: [
        string,
        string?
    ]) => window.prompt(...args), confirm: (message: string) => window.confirm(message), alert: (message: unknown) => window.alert(message),
    reportError: (...args: [
        string,
        unknown?
    ]) => console.error(...args) };
const libraryActions = PianoTrainerLibraryActions.create({ ...libraryUiPorts, dialogs: libraryDialogs, now: () => Date.now(), url: URL,
    refreshScoresDrawer: () => scoresDrawer.refreshScoresDrawer(), ensureScoresDrawerOpen: () => scoresDrawer.ensureScoresDrawerOpen(),
    getConverter: () => MidiImport, readScoreFile: file => readScoreFile(file) });
const libraryRows = PianoTrainerLibraryList.create({ ...libraryUiPorts, dialogs: libraryDialogs,
    refreshScoresDrawer: () => scoresDrawer.refreshScoresDrawer(), createLibraryFolder: () => libraryActions.createLibraryFolder(),
    openScoresImportPicker: () => scoresDrawer.openScoresImportPicker(), closeScoresDrawer: () => scoresDrawer.closeScoresDrawer(),
    getScoreLibraryFolderLabel, loadScoreIntoApp: (raw, options) => loadScoreIntoApp(raw, options) });
const scoresDrawer = PianoTrainerScoresDrawer.create({ ...libraryUiPorts, rows: libraryRows, actions: libraryActions,
    getToolbar: () => ToolbarUI, openScoreFilePicker: () => openScoreFilePicker(), getScoreLibraryFolderLabel, positionScoresPanel: () => positionScoresPanel(), reportWarning: (message, error) => console.warn(message, error) });
const refreshScoresDrawer = () => scoresDrawer.refreshScoresDrawer();
function initScoresDrawerShell() { libraryUiLifetime.init(); scoresDrawer.init(); }
function disposeScoresUi() { libraryUiLifetime.dispose(); libraryDialogs.dispose(); libraryRows.dispose(); scoresDrawer.dispose(); }



const ScoresUI = { ...libraryActions, refreshScoresDrawer, promptForLibraryFolderChoice: libraryDialogs.promptForLibraryFolderChoice,
    initScoresDrawerShell, init: initScoresDrawerShell, dispose: disposeScoresUi, closeScoresDrawer: scoresDrawer.closeScoresDrawer,
    updateScoresActionButtonsState: scoresDrawer.updateScoresActionButtonsState };

// device-controls.ts composition
const connectionStatus = PianoTrainerConnectionStatus.create({document, state: AppState,
    getPort: (direction, id) => getLegacyMidiPort(direction, id), syncMidiOutChannelVisibility: () => syncMidiOutChannelVisibility(),
    syncWledStatus: () => syncWledStatus()});
const updateConnectionStatuses = connectionStatus.updateConnectionStatuses;
const refreshConnectionStatuses = connectionStatus.refreshConnectionStatuses;
const updateController = PianoTrainerUpdateController.create({state: AppState, version: APP_VERSION,
    releaseUrl: UPDATE_RELEASES_URL, manifestUrl: UPDATE_MANIFEST_URL, storage: localStorage,
    keys: {assetOverride: ASSET_VERSION_OVERRIDE_STORAGE_KEY, manifestUrl: UPDATE_MANIFEST_URL_STORAGE_KEY},
    location: window.location, replaceHistory: path => window.history.replaceState({}, '', path),
    fetch: (url, options) => fetch(url, options), createAbortController: () => new AbortController(), nowMs: () => Date.now(),
    getErrorMessage: getUnknownErrorMessage, setChecking: () => updateControls.setChecking(), syncControls: () => updateControls.syncUpdateControls()});
const updateControls = PianoTrainerUpdateControls.create({document, state: AppState, version: APP_VERSION, commands: updateController,
    open: (url, target, features) => {window.open(url, target, features);}, alert: message => window.alert(message), confirm: message => window.confirm(message)});
// LED calls init during ordinary setting changes: preserve its state refresh/check each time.
const initUpdateControls = updateControls.init;



// legacy-led.ts composition
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
    keys: {LED_CALIBRATION_STORAGE_KEY, LED_COUNT_STORAGE_KEY, LED_FUTURE1_PCT_STORAGE_KEY, LED_FUTURE2_PCT_STORAGE_KEY,
        LED_MASTER_BRIGHTNESS_STORAGE_KEY, LED_OUTPUT_MODE_STORAGE_KEY, LED_REVERSE_STORAGE_KEY, WLED_DDP_DEBUG_STORAGE_KEY,
        WLED_IP_STORAGE_KEY, WLED_TRANSPORT_STORAGE_KEY, WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY},
    FULL_PIANO_KEY_COUNT, FULL_PIANO_MIDI_MIN, getMidiTest: () => legacyMidiLedTest.controller,
    clearWledPermissionHelp, closeToolbarPanel, getClampedNumber,
    getLegacyMidiOutput: id => getLegacyMidiOutput(id), getMidiKeyPosition01, getMidiLightsStatus: status => getMidiLightsStatus(status),
    getPlayerPlayableRange, getStoredBool, getWledPermissionHelpText, initUpdateControls, isLikelyBrowserAccessIssue,
    normalizeLedCount, normalizeLedFuturePct, normalizeLedMasterBrightness,
    rememberOutgoingMidiMessage: (status, note, velocity) => rememberOutgoingMidiMessage(status, note, velocity),
    renderVirtualKeyboard: () => renderVirtualKeyboard(), setStoredBool, showWledPermissionHelp, syncToolbarButtonStates,
    updateConnectionStatuses, wipeHardwareLEDs: () => wipeHardwareLEDs()
});
const {LedEngine, WLEDController, initLedCountControl, initLedBrightnessControls, initLedCalibrationControls,
    initLedOutputControls, updateLedKeyMapping, positionLedCalibrationPanel, legacyUpdateLEDHardware, legacyWipeHardwareLEDs,
    setLedCount, setLedMasterBrightness, setLedFuture1BrightnessPct, setLedFuture2BrightnessPct, resetAllLedCalibration,
    setWledIp, setLedOutputMode, syncLedBrightnessControls, syncLedOutputModeControls, syncWledStatus,
    selectLedCalibrationMidi, buildChromaticTestNotes} = legacyLed;
const syncSettingsDebugVisibility = legacyLed.syncWledTransportControls;

// optional-led.ts composition
// Existing LED behavior is the default. Explicit boot options or ?led=off choose
// no-op without changing persisted LED device/calibration preferences.
const optionalLedEnabled = typeof window.__PT_BOOT_OPTIONS__?.ledEnabled === 'boolean'
    ? window.__PT_BOOT_OPTIONS__.ledEnabled
    : new URLSearchParams(window.location.search).get('led') !== 'off';

const optionalLedOutput = optionalLedEnabled
    ? PianoTrainerOptionalLed.createLegacy({
        initControls: () => {
            legacyLed.activate();
            initLegacyMidiLedTest();
            initLedCountControl();
            initLedBrightnessControls();
            initLedCalibrationControls();
        },
        initOutput: () => {
            legacyLed.activate();
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
        clearOutputs: async () => { await WLEDController.forceClear(); },
        isCalibrating: () => AppState.ledCalibrationMode,
        renderKeyboard: () => renderVirtualKeyboard(),
        requestFrame: callback => window.requestAnimationFrame(callback),
        cancelFrame: id => window.cancelAnimationFrame(id),
        stopHardwareResources: () => {
            legacyMidiLedTest.dispose();
            legacyLed.dispose();
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

// player-range-controls.ts composition
const playerRangeControls = PianoTrainerPlayerRangeControls.create({document, state: AppState,
    normalize: normalizePlayerPianoType, derive: derivePlayerRangeFromKeyboardSize, getRange: getPlayerPlayableRange,
    inRange: isMidiInPlayerRange, readSaved: () => localStorage.getItem(PLAYER_PIANO_STORAGE_KEY),
    save: value => localStorage.setItem(PLAYER_PIANO_STORAGE_KEY, value), renderKeyboard: () => renderVirtualKeyboard(), led: optionalLedOutput});
const initPlayerPianoTypeControl = playerRangeControls.init;
const setPlayerPianoType = playerRangeControls.setPlayerPianoType;

// midi.ts composition
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
    document, storage: localStorage, keys: PREFERENCE_STORAGE_KEYS, normalizeMidiChannel, normalizeMidiInputChannel, setStoredBool,
    state: AppState, service: midiService, optionalLedEnabled: optionalLedOutput.enabled,
    ledTest: () => legacyMidiLedTest.controller,
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


function syncMidiOutChannelVisibility() { midiControls.syncMidiOutChannelVisibility(); }


function getSelectedMidiLightsChannel() { return midiControls.getSelectedMidiLightsChannel(); }
function getLegacyMidiPort(direction: 'input' | 'output', id: string) { return midiService.getPort(direction, id); }
function getLegacyMidiOutput(id: string) { return midiService.getOutput(id); }
function getMidiStatus(baseStatus: number, channelOneBased: unknown) { return baseStatus + (normalizeMidiChannel(channelOneBased, 1) - 1); }

function getMidiLightsStatus(baseStatus: number) { return getMidiStatus(baseStatus, AppState.midiLightsChannel || 1); }
function rememberOutgoingMidiMessage(status: number, note: number, velocity: number) { midiEchoFilter.remember(status, note, velocity); }

function getSelectedMidiOutOutput() { return midiOutput.getOutput(); }

function sendMidiOutExpressionLevel(value: unknown = AppState.midiOutVolume) { return midiOutput.expression(value); }





// Composition: midi-led-test.ts
const legacyMidiLedTestResources = createLegacyLedResources();
const legacyMidiLedTest = window.PianoTrainerLegacyMidiLedTest.create({
    state: AppState, document, console, resources: legacyMidiLedTestResources, LedEngine, buildChromaticTestNotes,
    getLegacyMidiOutput: id => getLegacyMidiOutput(id), getMidiStatus, getPlayerPlayableRange,
    getSelectedMidiLightsChannel, optionalLedOutput, rememberOutgoingMidiMessage,
    renderVirtualKeyboard: () => renderVirtualKeyboard(), wipeHardwareLEDs
});

const initLegacyMidiLedTest = legacyMidiLedTest.init;

// score-conversion.ts composition
const webmscoreAdapter=PianoTrainerWebmscoreAdapter.create({document,getVendor:()=>window.WebMscore});
const conversionFileReader=PianoTrainerScoreFileReader.create({createReader:()=>new FileReader(),
    format:{getScoreFileTypeFromName:name=>getScoreFileTypeFromName(name),getScoreDisplayTitle:name=>getScoreDisplayTitle(name)}});
const scoreConversion=PianoTrainerScoreConversion.create({ensureWebMscoreLoaded:()=>webmscoreAdapter.ensureWebMscoreLoaded(),
    readArrayBuffer:file=>conversionFileReader.readArrayBuffer(file),getLoader:()=>loadScoreIntoApp,reportError:(message,error)=>console.error(message,error)});
const MidiImport ={...scoreConversion,dispose:()=>{scoreConversion.dispose();conversionFileReader.dispose();webmscoreAdapter.dispose();}};

// geometry.ts composition
// implementations; P6/P9 replace these consumers with explicit narrow ports.
const geometryEngine = PianoTrainerGeometry.create({
    score: {
        getGraphicalNote: (note, measure, staff) => osmdAdapter.getGraphicalNote(note, measure, staff),
        getMeasureBox: (measure, staff, units) => osmdAdapter.getMeasureBox(measure, staff, units),
        getCursorElement: () => osmdAdapter.getCursorElement(),
        getCurrentMeasureIndex: () => osmdAdapter.getCurrentMeasureIndex(),
        getStaffTopY: (measure, staff) => osmdAdapter.getStaffTopY(measure, staff)
    },
    document,
    getSvg: () => document.querySelector<SVGSVGElement>('#osmd-container svg'),
    getComputedStyle: node => window.getComputedStyle(node),
    clearOverlays: () => {
        feedbackOverlay.clear(); loopOverlay.clear(); feedbackDebug?.clearSvgDebug();
    },
    fallbackHands: () => AppState.hands,
    describeNote: (note, measure, staff) => describeLogicalNoteForDebug(note, measure, staff),
    describeGraphicalNote: note => describeGraphicalNoteForDebug(note),
    debugLog: (name, detail) => debugLogAnchorResolution(name, detail)
});
const feedbackOverlay = PianoTrainerFeedbackOverlay.create({
    state: AppState, document, getSvg: () => geometryEngine.getSvg(),
    ensureGroup: id => geometryEngine.ensureGroup(id),
    getCurrentContextKey: () => getCurrentFeedbackContext().key
});
const loopOverlay = PianoTrainerLoopOverlay.create({
    bounds: AppState.looper, document, getSvg: () => geometryEngine.getSvg(),
    ensureGroup: id => geometryEngine.ensureGroup(id),
    enabled: () => {
        const control = document.getElementById('check-looper');
        if (!(control instanceof HTMLInputElement)) throw new Error('Missing required loop control: check-looper');
        return control.checked;
    },
    measureCount: () => osmdAdapter.getMeasureCount(),
    measureBox: (index, staff) => geometryEngine.getMeasureBox(index, staff)
});
const GeometryEngine = Object.assign(geometryEngine, {
    getFeedbackGroup: () => feedbackOverlay.getGroup(),
    getLooperGroup: () => loopOverlay.getGroup(),
    clearSvgFeedback: () => feedbackOverlay.clear(),
    clearSvgLooper: () => loopOverlay.clear(),
    drawFeedbackMarker: (anchor: PianoTrainerDomain.SvgPoint | null, correct: boolean) => feedbackOverlay.drawMarker(anchor, correct),
    drawStoredFeedbackMarker: (marker: PianoTrainerDomain.FeedbackMarker) => feedbackOverlay.drawStoredMarker(marker),
    renderLooper: () => loopOverlay.render()
});
function renderFeedbackOverlay() { feedbackOverlay.render(); }



// feedback-debug.ts composition
const feedbackDebug = PianoTrainerFeedbackDebug.create({document, state: AppState,
    getSvg: () => GeometryEngine.getSvg(), ensureGroup: id => GeometryEngine.ensureGroup(id),
    readEnabled: () => getStoredBool(SETTINGS_DEBUG_STORAGE_KEY, false),
    saveEnabled: enabled => setStoredBool(SETTINGS_DEBUG_STORAGE_KEY, enabled),
    publishStickyEnabled: () => {},
    setInterval: (callback, delay) => window.setInterval(callback, delay), clearInterval: id => window.clearInterval(id),
    now: () => new Date(), log: (...args) => console.log(...args), warn: (...args) => console.warn(...args), error: (...args) => console.error(...args)});
const debugLogEvent = (label: string, payload: Readonly<Record<string, unknown>> = {}) => feedbackDebug.debugLogEvent(label, payload);
const describeLogicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeLogicalNoteForDebug;
const describeGraphicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeGraphicalNoteForDebug;
const debugLogAnchorResolution = (label: string, payload: Readonly<Record<string, unknown>> = {}) => feedbackDebug.debugLogAnchorResolution(label, payload);


const setDebugEnabled = (enabled: boolean, options: PianoTrainerFeedbackDebug.Options = {}) => feedbackDebug.setDebugEnabled(enabled, options);

const clearStickyDebug = () => feedbackDebug.clearStickyDebug();

// score-rendering.ts composition
const osmdAdapter = PianoTrainerOsmdAdapter.create({
    getRenderer: () => osmd,
    describeNote: (note, measure, staff) => describeLogicalNoteForDebug(note, measure, staff),
    describeGraphicalNote: note => describeGraphicalNoteForDebug(note),
    debugLog: (name, detail) => debugLogAnchorResolution(name, detail),
    reportError: (message, error) => console.error(message, error)
});
const getResolvedStaffAssignmentIdFromNote = osmdAdapter.resolveStaffIdFromNote;
const getResolvedStaffAssignmentIdFromEntry = osmdAdapter.resolveStaffIdFromEntry;
function requireScoreDisplayElement<T extends HTMLElement>(id: string, type: {new(): T}): T {
    const element = document.getElementById(id);
    if (!(element instanceof type)) throw new Error(`Missing required score display element: ${id}`);
    return element;
}
const ScoreDisplay = PianoTrainerScoreViewport.create({
    elements: {
        area: requireScoreDisplayElement('music-area', HTMLElement),
        wrapper: requireScoreDisplayElement('canvas-wrapper', HTMLElement),
        layout: requireScoreDisplayElement('select-score-layout', HTMLSelectElement),
        autoScroll: requireScoreDisplayElement('check-autoscroll', HTMLInputElement)
    },
    score: osmdAdapter, state: AppState, storage: localStorage,
    storageKey: TRAINER_SCORE_LAYOUT_STORAGE_KEY,
    getSvg: () => document.querySelector<SVGSVGElement>('#osmd-container svg'),
    getAnchor: (ref, measureIndex, staffIndex) => {
        const note = osmdAdapter.resolveNote(ref);
        return note ? GeometryEngine.getNoteAnchor(note, measureIndex, staffIndex) : null;
    },
    clearFeedbackPreserveScoring: () => clearFeedbackVisualStatePreserveScoring(),
    renderScoreAndRefreshGeometry: () => scoreRenderer.renderScoreAndRefreshGeometry(),
    requestFrame: callback => window.requestAnimationFrame(callback),
    cancelFrame: id => window.cancelAnimationFrame(id),
    prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
});
const scoreRenderer = PianoTrainerScoreRenderer.create({
    score: osmdAdapter, invalidateGeometry: () => GeometryEngine.invalidate(),
    afterRender: () => ScoreDisplay.afterRender(), renderFeedback: () => renderFeedbackOverlay(),
    renderLoop: () => GeometryEngine.renderLooper(),
    renderDebug: () => feedbackDebug?.renderStickyDebug()
});

function renderScoreAndRefreshGeometry() { scoreRenderer.renderScoreAndRefreshGeometry(); }
function handleAutoScroll() { ScoreDisplay.autoScroll(); }

// score-traversal.ts composition
// functions lazily; the shared service has no hardware, DOM or vendor globals.
const sharedScoreTraversal = PianoTrainerScoreTraversal.create({
    state: AppState,
    getCursor: () => osmdAdapter.getTraversalCursor(),
    resolveStaffId: note => getResolvedStaffAssignmentIdFromNote(note),
    isPracticeHandEnabled: staffId => isPracticeHandEnabledForStaff(staffId),
    getHandRole: staffId => getAssignedHandRoleForStaff(staffId),
    isMidiInRange: midi => isMidiInPlayerRange(midi),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});









const collectFutureLedPreviewEvents = sharedScoreTraversal.collectFuturePreviewEvents;

// audio.ts composition
const audioOutput = PianoTrainerAudioOutput.create({
    tone: Tone, state: AppState,
    sampleExtension: () => getPreferredPianoSampleExtension(),
    setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
    clearTimer: id => window.clearTimeout(id),
    warn: (message, error) => console.warn(message, error)
});
const audioRouting = PianoTrainerAudioRouting.create({
    state: AppState, audio: audioOutput, midi: midiOutput,
    setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
    clearTimer: id => window.clearTimeout(id)
});
function applyToneLatencyProfileForMode(mode = AppState.mode) { audioOutput.applyToneLatencyProfileForMode(mode); }
function ensurePianoSamplerLoaded() { return audioOutput.ensurePianoSamplerLoaded(); }
function ensureLiveAudioReady() { return audioOutput.ensureLiveAudioReady(); }
function getLiveAudioTime() { return audioOutput.getLiveAudioTime(); }


// metronome.ts composition
const scoreMeasureTiming = PianoTrainerMeasureTiming.create({
    getMeasure: index => osmdAdapter.getSourceMeasure(index),
    getMeasureCount: () => osmdAdapter.getSourceMeasureCount(),
    getCursor: () => osmdAdapter.getTraversalCursor(),
    restoreToPosition: (measure, timestamp) => sharedScoreTraversal.restoreToMeasureAndTimestamp(measure, timestamp)
});
const metronomeClock = PianoTrainerPlaybackClock.create({
    nowSeconds: () => Tone.now(), monotonicMilliseconds: () => performance.now(),
    setTimer: (callback, delay) => window.setTimeout(callback, delay), clearTimer: id => window.clearTimeout(id),
    requestFrame: callback => window.requestAnimationFrame(callback), cancelFrame: id => window.cancelAnimationFrame(id)
});
const metronomeOutput = PianoTrainerMetronomeOutput.create({tone: Tone});
const tempoPulseUi = PianoTrainerTempoPulse.create(() => document.getElementById('btn-tempo'));
const trainerMetronome = PianoTrainerMetronome.create({
    state: AppState, clock: metronomeClock, audio: metronomeOutput,
    midi: {isAvailable: () => !!midiOutput.getOutput(),
        percussionClick: (note, velocity, duration) => midiOutput.percussionClick(note, velocity, duration)},
    timing: scoreMeasureTiming,
    isEnabled: () => { const checkbox = document.getElementById('check-metronome'); return checkbox instanceof HTMLInputElement && checkbox.checked; },
    getVolume: () => { const slider = document.getElementById('slider-metro-vol'); return slider instanceof HTMLInputElement ? slider.value : undefined; },
    getPulseTarget: tempoPulseUi.getTarget,
    getLiveAudioTime: () => getLiveAudioTime(),
    getCurrentMeasureIndex: () => osmdAdapter.getCurrentMeasureIndex(),
    getCountInBeats: measure => osmdAdapter.getCountInBeats(measure)
});
function getMeasureTimingInfo(index: number | undefined) { return scoreMeasureTiming.getInfo(index); }
const rebuildMeasureTimingCache = scoreMeasureTiming.rebuild;






const clearTempoVisualPulse = trainerMetronome.clearTempoVisualPulse;

const clearScheduledMetronomeEvents = trainerMetronome.clearScheduledMetronomeEvents;
const stopWaitModeMetronome = trainerMetronome.stopWaitModeMetronome;



const rebuildWaitModeMetronome = trainerMetronome.rebuildWaitModeMetronome;



// practice.ts composition
// Concrete score/audio/render/optional LED objects are composed only here.
const practiceFeedback = PianoTrainerFeedbackState.create({
    state: AppState,
    getTraversalPosition: () => osmdAdapter.readPositions().traversal,
    resolveAnchor: (midi, staffId, measureIndex, anchor) => GeometryEngine.resolveFeedbackAnchor(midi, staffId, measureIndex, anchor),
    renderOverlay: () => renderFeedbackOverlay(),
    clearOverlay: () => GeometryEngine.clearSvgFeedback(),
    clearDebug: () => {
        if (typeof clearStickyDebug === 'function') clearStickyDebug();
    },
    pushDebugFrame: frame => feedbackDebug?.pushStickyDebugFrame?.(frame)
});
const practiceScoring = PianoTrainerScoring.create({
    state: AppState, feedback: practiceFeedback, updateDisplay: () => updateScoreDisplay()
});
const practiceMatching = PianoTrainerInputMatching.create({
    state: AppState, getCursorX: () => GeometryEngine.getCursorSvgX(),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});
const practiceEarlyGrace = PianoTrainerEarlyGrace.create({
    state: AppState, getHandRole: staff => getAssignedHandRoleForStaff(staff),
    isPracticeHandEnabled: staff => isPracticeHandEnabledForStaff(staff),
    getTimeline: () => sharedScoreTraversal.ensurePreviewTimelineBuilt(),
    findTimelineIndex: PianoTrainerScoreTraversal.findMatchingTimelineIndex,
    getBeatsToWait: options => PianoTrainerTiming.getTraversalBeatsToWait(options),
    getMeasureTimingInfo: index => getMeasureTimingInfo(index)
});
const practiceExpectedNotes = PianoTrainerExpectedNotes.create({
    state: AppState, getHandRole: staff => getAssignedHandRoleForStaff(staff),
    isMidiInRange: midi => isMidiInPlayerRange(midi),
    getAnchor: (ref, measureIndex, staffIndex) => {
        const note = osmdAdapter.resolveNote(ref);
        return note ? GeometryEngine.getNoteAnchor(note, measureIndex, staffIndex) : null;
    },
    describeNote: (ref, measureIndex, staffIndex) => {
        const note = osmdAdapter.resolveNote(ref);
        return note ? describeLogicalNoteForDebug(note, measureIndex, staffIndex) : {};
    },
    feedback: practiceFeedback, scoring: practiceScoring,
    getTraversalTimestamp: () => osmdAdapter.readPositions().traversal?.timestampWhole ?? null,
    pushDebugFrame: frame => feedbackDebug?.pushStickyDebugFrame?.(frame),
    debugAnchor: (name, detail) => debugLogAnchorResolution(name, detail),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});
const practiceSustains = PianoTrainerSustainState.create({
    state: AppState, renderKeyboard: () => renderVirtualKeyboard(),
    setTimer: (callback, delay) => window.setTimeout(callback, delay), clearTimer: id => window.clearTimeout(id)
});
const practiceInput = PianoTrainerInputController.create({
    state: AppState, audio: audioRouting, matching: practiceMatching, early: practiceEarlyGrace,
    feedback: practiceFeedback, scoring: practiceScoring,
    selectCalibration: midi => selectLedCalibrationMidi(midi),
    renderKeyboard: () => renderVirtualKeyboard(), advanceAfterHit: () => checkWaitModeAdvance(),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});
function triggerVirtualKey(midi: number, down: boolean, source: PianoTrainerDomain.InputSource = 'midi', velocity = 100) {
    practiceInput.handle({kind: down ? 'note-on' : 'note-off', note: midi, velocity, source,
        channel: null, receivedAtMs: performance.now()});
}

const getCurrentFeedbackContext = practiceFeedback.getCurrentFeedbackContext;






function buildExpectedNotesFromEntries(entries: PianoTrainerScoreTraversal.VoiceEntry[], measureIndex: number, timestamp: number | null = null) {
    practiceExpectedNotes.build(osmdAdapter.readPracticeEntries(entries, entry => getResolvedStaffAssignmentIdFromEntry(entry)), measureIndex, timestamp);
}










// playback.ts composition
const playbackClock = PianoTrainerPlaybackClock.create({
    nowSeconds: () => Tone.now(), monotonicMilliseconds: () => performance.now(),
    setTimer: (callback, delay) => window.setTimeout(callback, delay), clearTimer: id => window.clearTimeout(id),
    requestFrame: callback => window.requestAnimationFrame(callback), cancelFrame: id => window.cancelAnimationFrame(id)
});
const playbackTransport = PianoTrainerToneTransport.create(Tone);
const playbackControls = PianoTrainerPlaybackControls.create({getElement: id => document.getElementById(id)});
const playbackState = PianoTrainerPlaybackState.create({
    state: AppState, clearFeedbackPreserveScoring: practiceFeedback.clearPreserveScoring,
    clearTimer: id => practiceSustains.cancelTimer(id), wipeHardware: () => wipeHardwareLEDs(),
    renderKeyboard: () => renderVirtualKeyboard()
});
const trainerPlayback = PianoTrainerPlaybackCoordinator.create({
    state: AppState, clock: playbackClock, transport: playbackTransport, controls: playbackControls,
    transitions: playbackState, metronome: trainerMetronome,
    score: {
        hasCursor: osmdAdapter.hasCursor, isEndReached: osmdAdapter.isEndReached,
        readEvent: () => osmdAdapter.readPlaybackEvent(entry => getResolvedStaffAssignmentIdFromEntry(entry)),
        getTimestamp: osmdAdapter.getCurrentTimestamp, getMeasureIndex: osmdAdapter.getCurrentMeasureIndex,
        getTempo: osmdAdapter.getPlaybackTempo, advance: osmdAdapter.advance, reset: osmdAdapter.reset,
        update: osmdAdapter.updateCursor, show: osmdAdapter.showCursor
    },
    audio: {
        schedule: audioRouting.schedulePlaybackForDestinations, silence: audioOutput.silence,
        ensureReady: audioOutput.ensureLiveAudioReady, applyLatencyProfile: () => audioOutput.applyToneLatencyProfileForMode()
    },
    midi: midiOutput,
    practice: {
        buildExpected: practiceExpectedNotes.build, getHandRole: staff => getAssignedHandRoleForStaff(staff),
        startSustains: practiceSustains.startVisualSustains, processMisses: practiceScoring.processMissedNotes
    },
    timing: {getTraversalBeatsToWait: options => PianoTrainerTiming.getTraversalBeatsToWait(options),
        getMeasureTimingInfo: scoreMeasureTiming.getInfo},
    ensureTimeline: () => { sharedScoreTraversal.ensurePreviewTimelineBuilt(); },
    led: {wipeHardware: () => wipeHardwareLEDs(), clearOutputs: () => optionalLedOutput.clearOutputs()},
    ui: {
        scroll: () => handleAutoScroll(), cancelViewport: ScoreDisplay.cancel,
        clearSvgFeedback: GeometryEngine.clearSvgFeedback,
        updatePlayPause: () => updatePlayPauseButton(), hidePanels: () => hideToolbarPanels(),
        isFullscreenActive: () => isFullscreenActive(), requestFullscreen: () => requestAppFullscreen(),
        preserveScroll: callback => { preserveMusicAreaScroll(callback); },
        renderFeedback: () => renderFeedbackOverlay(),
        renderEventKeyboard: (event, measure, timestamp) => renderVirtualKeyboard(osmdAdapter.legacyEntriesForPlayback(event), measure, timestamp),
        updateScore: () => updateScoreDisplay(), updateTempoPercent: value => updateTempo('percent', value)
    }
});
const checkWaitModeAdvance = trainerPlayback.checkWaitModeAdvance;

const startPlaybackFromToolbar = trainerPlayback.startPlaybackFromToolbar;

const pausePlaybackFromToolbar = trainerPlayback.pausePlaybackFromToolbar;
const resetPlaybackForLoadedScore = trainerPlayback.resetPlaybackForLoadedScore;
const resetPlaybackFromToolbar = trainerPlayback.resetPlaybackFromToolbar;
const silencePlaybackOutputsImmediately = trainerPlayback.silencePlaybackOutputsImmediately;
const clearTransientPlaybackState = playbackState.clearTransient;
const clearVisuals = playbackState.clearVisuals;
const enforceLooperBounds = trainerPlayback.enforceLooperBounds;
const renderLooper = GeometryEngine.renderLooper;

// score-data.ts composition
const scoreFormat = PianoTrainerMusicXmlIO.create({
    getNormalizer: () => MidiImport && typeof MidiImport.normalizeScoreToMusicXml === 'function'
        ? (rawData, options) => MidiImport!.normalizeScoreToMusicXml(rawData, options) : null,
    warn: (message, error) => console.warn(message, error)
});
const scoreFileReader = PianoTrainerScoreFileReader.create({createReader: () => new FileReader(), format: scoreFormat});
const scoreLoader = PianoTrainerScoreLoader.create({
    state: AppState, format: scoreFormat, score: osmdAdapter,
    resetPlayback: () => resetPlaybackForLoadedScore(),
    resetTempo: () => {if (typeof updateTempo === 'function') updateTempo('percent', 100);},
    render: () => renderScoreAndRefreshGeometry(), initSongUI: () => initSongUI(), scroll: () => handleAutoScroll(),
    getLibrary: () => ScoreLibrary, refreshLibrary: () => refreshScoresDrawer(),
    notifyTranspose: skipReset => {
        const transpose = TransposeUI;
        if (transpose && typeof transpose.handleScoreLoaded === 'function') {
            if (!skipReset) transpose.handleScoreLoaded();
            else {transpose.refreshAvailabilityFromCurrentScore(); transpose.syncUiFromState();}
        }
    },
    success: () => {
        console.error('File loaded successfully.');
        if (AppState.debugEventFlow || AppState.debugMatchLogs || AppState.debugAnchorResolution || AppState.debugPersistentAnchors) {
            console.error('[PianoTrainer debug LOAD] console logging active', {
                debugAnchors: AppState.debugPersistentAnchors, debugEventFlow: AppState.debugEventFlow, debugMatchLogs: AppState.debugMatchLogs,
                debugStickyFrames: AppState.debugStickyFrameLimit, expectedNotes: AppState.expectedNotes ? AppState.expectedNotes.length : null,
                ts: new Date().toISOString()
            });
        }
    },
    reportError: error => {
        console.error('OSMD Load Error:', error);
        const message = error && (typeof error === 'object' || typeof error === 'function') && 'message' in error ? error.message : null;
        alert(message ? String(message) : 'Error loading score file.');
    }
});
const scoreFileInput = document.getElementById('file-input');
if (!(scoreFileInput instanceof HTMLInputElement)) throw new Error('Missing required score file input: file-input');
const scoreFileControls = PianoTrainerScoreFileControls.create({
    input: scoreFileInput, resumeAudio: () => audioOutput.resumeWithoutWaiting(), readFile: file => scoreFileReader.readScoreFile(file),
    load: (rawData, options) => scoreLoader.loadScoreIntoApp(rawData, options), getConverter: () => MidiImport,
    closeDrawer: () => {if (ScoresUI && typeof ScoresUI.closeScoresDrawer === 'function') ScoresUI.closeScoresDrawer();}
});
const getScoreFileTypeFromName = scoreFormat.getScoreFileTypeFromName;
const getScoreDisplayTitle = scoreFormat.getScoreDisplayTitle;
const readScoreFile = scoreFileReader.readScoreFile;
const loadScoreIntoApp = scoreLoader.loadScoreIntoApp;
const openScoreFilePicker = scoreFileControls.openScoreFilePicker;


// native-controls.ts composition
const displayControls=PianoTrainerDisplayControls.create({document,window,state:AppState,
    saveZoom:value=>localStorage.setItem(TRAINER_ZOOM_STORAGE_KEY,value),hideToolbarPanels,
    reportWarning:(message,error)=>console.warn(message,error),pause:()=>pausePlaybackFromToolbar(),
    play:()=>startPlaybackFromToolbar(),reset:()=>resetPlaybackFromToolbar(),
    isReadyToRender:()=>osmdAdapter.isReady(),setZoom:value=>osmdAdapter.setZoom(value),
    clearFeedbackVisualStatePreserveScoring:()=>clearFeedbackVisualStatePreserveScoring(),
    renderScoreAndRefreshGeometry:()=>renderScoreAndRefreshGeometry(),positionCalibrationPanel:()=>optionalLedOutput.positionCalibrationPanel()});
const tempoControls=PianoTrainerTempoControls.create({document,state:AppState,hasMidiOutput:()=>!!getSelectedMidiOutOutput(),
    setBpm:value=>playbackTransport.setBpm(value),getCurrentMeasureIndex:()=>osmdAdapter.getCurrentMeasureIndexIfAvailable(),
    getWaitMeasureIndex:()=>trainerMetronome.getWaitMeasureIndex(),rebuildWaitModeMetronome:index=>rebuildWaitModeMetronome(index),
    saveBool:(key,value)=>setStoredBool(({accentedDownbeat:ACCENTED_DOWNBEAT_STORAGE_KEY,visualPulse:VISUAL_PULSE_STORAGE_KEY,
        metronomeMidiOut:METRONOME_MIDIOUT_STORAGE_KEY})[key],value),
    clearTempoVisualPulse:()=>clearTempoVisualPulse(),clearScheduledMetronomeEvents:()=>clearScheduledMetronomeEvents(),stopWaitModeMetronome:()=>stopWaitModeMetronome()});
const audioLevelControls=PianoTrainerAudioLevelControls.create({document,state:AppState,
    save:(key,value)=>localStorage.setItem(({pianoVolume:TRAINER_PIANO_VOL_STORAGE_KEY,midiOutVolume:TRAINER_MIDIOUT_VOL_STORAGE_KEY,
        midiInBoost:TRAINER_MIDIIN_BOOST_STORAGE_KEY,metroVolume:METRONOME_VOL_STORAGE_KEY})[key],value),
    setPianoVolume:value=>audioOutput.setPianoVolume(value),sendMidiOutExpressionLevel:value=>sendMidiOutExpressionLevel(value),
    setMetronomeVolumeDecibels:value=>metronomeOutput.setVolumeDecibels(value)});
const loopControls=PianoTrainerLoopControls.create({document,window,state:AppState,renderLooper:()=>renderLooper(),
    enforceLooperBounds:()=>enforceLooperBounds(),saveLoopCountIn:value=>setStoredBool(LOOP_COUNT_IN_STORAGE_KEY,value)});
const isFullscreenActive=displayControls.isFullscreenActive;
const syncFullscreenUi=displayControls.syncFullscreenUi;
const requestAppFullscreen=displayControls.requestAppFullscreen;

const updatePlayPauseButton=displayControls.updatePlayPauseButton;
const preserveMusicAreaScroll=displayControls.preserveMusicAreaScroll;
const syncZoomControls=displayControls.syncZoomControls;
const applyZoom=displayControls.applyZoom;
const syncTempoMetronomeDependentUi=tempoControls.syncTempoMetronomeDependentUi;
const updateTempo=tempoControls.updateTempo;
const updatePianoVolume=audioLevelControls.updatePianoVolume;
const updateMidiOutVolume=audioLevelControls.updateMidiOutVolume;
const updateMidiInBoost=audioLevelControls.updateMidiInBoost;
const updateMetroVolume=audioLevelControls.updateMetroVolume;
const syncMidiInBoostUi=audioLevelControls.syncMidiInBoostUi;
const syncLooperDependentUi=loopControls.syncLooperDependentUi;

// preference-controls.ts composition
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
    syncSettingsDebugVisibility: () => {if (typeof syncSettingsDebugVisibility === 'function') syncSettingsDebugVisibility();},
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

// keyboard-and-score-controls.ts composition
const virtualKeyboardView = PianoTrainerVirtualKeyboardView.create({document, isMidiInRange: midi => isMidiInPlayerRange(midi)});
const keyboardController = PianoTrainerKeyboardController.create({state: AppState,
    isMidiInRange: midi => isMidiInPlayerRange(midi), getHandRole: staff => getAssignedHandRoleForStaff(staff),
    sustains: practiceSustains, led: optionalLedOutput, drawKey: virtualKeyboardView.drawKey});
function renderVirtualKeyboard(currentEntries: PianoTrainerScoreTraversal.Entries = null,
    currentMeasureIdx: number | null = null, currentTimestamp: number | null = null) {
    const frame = currentEntries && currentMeasureIdx !== null && currentTimestamp !== null ? {
        collectPreview: (depth: number) => collectFutureLedPreviewEvents(currentEntries, currentMeasureIdx, currentTimestamp, depth)
    } : null;
    keyboardController.render(frame, currentTimestamp);
}
const virtualKeyboardControls = PianoTrainerVirtualKeyboardControls.create({document, window,
    pressedKeys: AppState.pressedKeys, isMidiInRange: midi => isMidiInPlayerRange(midi),
    ensureLiveAudioReady: () => ensureLiveAudioReady(), triggerVirtualKey: (midi, down, source) => triggerVirtualKey(midi, down, source)});
const createKeyboard = virtualKeyboardControls.createKeyboard;
const scoreStatus = PianoTrainerScoreStatus.create(document, () => AppState.score);
const updateScoreDisplay = scoreStatus.update;
const clearFeedbackVisualStatePreserveScoring = practiceFeedback.clearPreserveScoring;
const scoreUiController = PianoTrainerScoreUiController.create({state: AppState,
    rebuildStaffIdentity: osmdAdapter.rebuildStaffIdentity, rebuildMeasureTimingCache: () => rebuildMeasureTimingCache(),
    getMeasureCount: osmdAdapter.getGraphicalMeasureCount, resetLoopRange: total => loopControls.resetRangeForScore(total),
    getFirstTempo: osmdAdapter.getFirstScoreTempo, updateTempo: (source, value) => updateTempo(source, value),
    getStaffCount: osmdAdapter.getLoadedStaffCount,
    resetHandAssignments: count => handAssignmentControls.resetForScore(count, getDefaultStaffAssignment),
    updateScoreDisplay, renderLooper: () => renderLooper()});
const initSongUI = scoreUiController.initSongUI;
const scoreSeekController = PianoTrainerScoreSeek.create({state: AppState, hasGraphicSheet: osmdAdapter.hasGraphicSheet,
    isAnyToolbarPanelOpen: () => isAnyToolbarPanelOpen(), clientPointToSvg: (x, y) => GeometryEngine.clientPointToSvg(x, y),
    getMeasureCount: osmdAdapter.getGraphicalMeasureCount, getMeasureBox: (index, staff) => GeometryEngine.getMeasureBox(index, staff),
    isLoopEnabled: () => playbackControls.isLoopEnabled(), stopTransport: () => playbackTransport.stop(), resetCursor: osmdAdapter.reset,
    isEndReached: osmdAdapter.isEndReached, getCurrentMeasureIndex: osmdAdapter.getCurrentMeasureIndex, advance: osmdAdapter.advance,
    updateCursor: osmdAdapter.updateCursor, scroll: () => handleAutoScroll(), clearVisuals: () => clearVisuals()});
const scoreSeekControls = PianoTrainerScoreSeekControls.create({document, seek: scoreSeekController.seek});

function init() {if(initialized || disposed)return;initialized=true;
preferences.init();
settingsFiles.init();
TransposeUI.init();
toolbarUi.init();
initScoresDrawerShell();
positionScoresPanel();
syncToolbarButtonStates();
midiControls.init();
feedbackDebug.init();
osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay('osmd-container',{autoResize:false,drawTitle:true});
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
    firstRunTimer = window.setTimeout(() => {
        if (IntroUI?.maybeShowFirstRunIntro) {
            IntroUI.maybeShowFirstRunIntro();
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


}
function dispose() {if(disposed)return;disposed=true;
if(firstRunTimer!==undefined)window.clearTimeout(firstRunTimer);
scoreLoader.dispose();
practiceSustains.dispose();
disposeScoresUi();
trainerPlayback.dispose();
ScoreDisplay.dispose();
virtualKeyboardControls.dispose();
scoreSeekControls.dispose();
practiceControls.dispose();
handAssignmentControls.dispose();
settingsActions.dispose();
displayControls.dispose();
tempoControls.dispose();
audioLevelControls.dispose();
loopControls.dispose();
playerRangeControls.dispose();
midiControls.dispose();
midiService.dispose();
midiOutput.dispose();
optionalLedOutput.dispose();
legacyMidiLedTest.dispose();
legacyLed.dispose();
updateControls.dispose();
updateController.dispose();
feedbackDebug.dispose();
settingsFiles.dispose();
transposeControls.dispose();
transposeCommands.dispose();
toolbarUi.dispose();
scoreFileControls.dispose();
scoreFileReader.dispose();
scoreConversion.dispose();
conversionFileReader.dispose();
webmscoreAdapter.dispose();
ScoreLibrary.dispose();
audioRouting.dispose();
audioOutput.dispose();
metronomeOutput.dispose();
osmdAdapter.dispose();
preferences.dispose();
}
return {
    init,
    dispose,
    appMetadata,
    AppState,
    handRouting,
    preferences,
    playerRange,
    settingsBackup,
    settingsFiles,
    transposeCommands,
    transposeControls,
    toolbarUi,
    ScoreLibrary,
    libraryUiLifetime,
    librarySelection,
    libraryDialogs,
    libraryActions,
    libraryRows,
    scoresDrawer,
    connectionStatus,
    updateController,
    updateControls,
    legacyLedResources,
    legacyLed,
    optionalLedOutput,
    playerRangeControls,
    midiEchoFilter,
    midiService,
    midiOutput,
    midiControls,
    legacyMidiLedTestResources,
    legacyMidiLedTest,
    webmscoreAdapter,
    conversionFileReader,
    scoreConversion,
    geometryEngine,
    feedbackOverlay,
    loopOverlay,
    feedbackDebug,
    osmdAdapter,
    ScoreDisplay,
    scoreRenderer,
    sharedScoreTraversal,
    audioOutput,
    audioRouting,
    scoreMeasureTiming,
    metronomeClock,
    metronomeOutput,
    trainerMetronome,
    practiceFeedback,
    practiceScoring,
    practiceMatching,
    practiceEarlyGrace,
    practiceExpectedNotes,
    practiceSustains,
    practiceInput,
    playbackClock,
    playbackTransport,
    playbackState,
    trainerPlayback,
    scoreFormat,
    scoreFileReader,
    scoreLoader,
    scoreFileControls,
    displayControls,
    tempoControls,
    audioLevelControls,
    loopControls,
    practiceControls,
    handAssignmentController,
    handAssignmentControls,
    preferenceControls,
    settingsActions,
    virtualKeyboardView,
    keyboardController,
    virtualKeyboardControls,
    scoreStatus,
    scoreUiController,
    scoreSeekController,
    scoreSeekControls
};
}
