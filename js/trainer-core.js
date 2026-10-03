(function() {
    try {
        window.__PT_DEBUG_BOOT__ = (window.__PT_DEBUG_BOOT__ || 0) + 1;
    } catch (e) {}
})();


// trainer-core.js
// Remaining preference/routing/keyboard/score-seek integration and classic consumers.
// Typed practice/audio/score factories now own input, playback, repeat timing and metronome decisions.

// State and persisted preference helpers load from generated/state TS modules.
// Keep trainer-core.js focused on orchestration and cross-module coordination.

// IMPORTANT:
// For rendering, pass original .mxl files directly to OSMD.
// Do NOT substitute normalized XML as the render source for .mxl.
// Normalized XML may still be used for other features, but not render.

// ===== Boot + persisted preferences =====

function getDefaultStaffAssignment() {
    const stavesCount = osmd?.GraphicSheet?.MeasureList?.[0]?.length || 2;
    return {
        left: stavesCount > 1 ? 2 : null,
        right: 1
    };
}

function parseStaffAssignmentValue(value) {
    if (value === '' || value === '-' || value == null) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatStaffAssignmentValue(value) {
    const parsed = parseStaffAssignmentValue(value);
    return parsed == null ? '' : String(parsed);
}

function getAssignedHandRoleForStaff(staffId) {
    const sid = Number(staffId);
    if (!Number.isFinite(sid)) return null;
    if (sid === Number(AppState.hands.right)) return 'right';
    if (sid === Number(AppState.hands.left)) return 'left';
    return null;
}

function cloneModeRoutingState(state, fallback) {
    return {
        left: state?.left ?? fallback.left,
        right: state?.right ?? fallback.right
    };
}

function normalizeFollowModeSettings() {
    const follow = AppState.modeSettings.follow;
    const left = !!follow.practice.left;
    const right = !!follow.practice.right;
    const useLeft = left && !right;
    const useRight = !useLeft;
    follow.practice.left = useLeft;
    follow.practice.right = useRight;
    follow.playback.left = !useLeft;
    follow.playback.right = useLeft;
}

function getCurrentModeSettings() {
    const modeKey = AppState.mode === 'wait' ? 'wait' : (AppState.mode === 'follow' ? 'follow' : 'realtime');
    if (!AppState.modeSettings[modeKey]) {
        AppState.modeSettings[modeKey] = {
            practice: { left: true, right: true },
            playback: { left: true, right: true }
        };
    }
    if (modeKey === 'follow') normalizeFollowModeSettings();
    return AppState.modeSettings[modeKey];
}

function syncActiveHandStateFromMode() {
    const settings = getCurrentModeSettings();
    AppState.practice.left = !!settings.practice.left;
    AppState.practice.right = !!settings.practice.right;
    AppState.playback.left = !!settings.playback.left;
    AppState.playback.right = !!settings.playback.right;
}

function setFollowPracticeHand(hand) {
    const follow = AppState.modeSettings.follow;
    const useLeft = hand === 'left';
    follow.practice.left = useLeft;
    follow.practice.right = !useLeft;
    follow.playback.left = !useLeft;
    follow.playback.right = useLeft;
    if (AppState.mode === 'follow') syncActiveHandStateFromMode();
}


function applyPersistedTrainerAndSettingsPreferences() {
    AppState.mode = localStorage.getItem(TRAINER_MODE_STORAGE_KEY) || 'realtime';
    AppState.feedbackEnabled = getStoredBool(TRAINER_FEEDBACK_STORAGE_KEY, true);
    AppState.futurePreviewEnabled = getStoredBool(TRAINER_FUTURE_PREVIEW_STORAGE_KEY, true);
    AppState.futurePreviewDepth = 1;
    AppState.correctHighlightEnabled = getStoredBool(TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY, true);
    syncActiveHandStateFromMode();
    AppState.audioEnabled.hands = getStoredBool(TRAINER_AUDIO_HANDS_STORAGE_KEY, true);
    AppState.audioEnabled.other = getStoredBool(TRAINER_AUDIO_OTHER_STORAGE_KEY, false);
    AppState.audioEnabled.instrument = getStoredBool(TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY, false);
    AppState.audioEnabled.virtual = getStoredBool(TRAINER_AUDIO_VIRTUAL_STORAGE_KEY, true);
    AppState.midiOutEnabled.hands = getStoredBool(TRAINER_MIDIOUT_HANDS_STORAGE_KEY, false);
    AppState.midiOutEnabled.other = getStoredBool(TRAINER_MIDIOUT_OTHER_STORAGE_KEY, false);
    AppState.midiOutEnabled.instrument = getStoredBool(TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY, false);
    AppState.midiOutEnabled.virtual = getStoredBool(TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY, false);
    AppState.midiOutVolume = getClampedNumber(TRAINER_MIDIOUT_VOL_STORAGE_KEY, 0, 100, 65);
    AppState.midiInBoost = getClampedNumber(TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100);
    AppState.inputVelocityEnabled = true;
    AppState.liveLowLatencyMonitoringEnabled = true;
    setStoredBool(TRAINER_INPUT_VELOCITY_STORAGE_KEY, true);
    setStoredBool(TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY, true);
    AppState.visualPulseEnabled = getStoredBool(VISUAL_PULSE_STORAGE_KEY, true);
    AppState.accentedDownbeatEnabled = getStoredBool(ACCENTED_DOWNBEAT_STORAGE_KEY, true);
    AppState.loopCountInEnabled = getStoredBool(LOOP_COUNT_IN_STORAGE_KEY, true);
    AppState.metronomeMidiOutEnabled = getStoredBool(METRONOME_MIDIOUT_STORAGE_KEY, false);

    const realtimeRadio = document.getElementById('mode-realtime');
    const waitRadio = document.getElementById('mode-wait');
    const followRadio = document.getElementById('mode-follow');
    if (AppState.mode === 'wait') {
        if (waitRadio) waitRadio.checked = true;
    } else if (AppState.mode === 'follow') {
        if (followRadio) followRadio.checked = true;
    } else {
        if (realtimeRadio) realtimeRadio.checked = true;
    }

    const feedbackCheckbox = document.getElementById('check-feedback');
    if (feedbackCheckbox) feedbackCheckbox.checked = AppState.feedbackEnabled;

    const futurePreviewCheckbox = document.getElementById('check-future-preview');
    if (futurePreviewCheckbox) futurePreviewCheckbox.checked = AppState.futurePreviewEnabled;

    const correctHighlightCheckbox = document.getElementById('check-correct-highlight');
    if (correctHighlightCheckbox) correctHighlightCheckbox.checked = AppState.correctHighlightEnabled;

    const practiceLeftCheckbox = document.getElementById('practice-lh');
    if (practiceLeftCheckbox) practiceLeftCheckbox.checked = AppState.practice.left;

    const practiceRightCheckbox = document.getElementById('practice-rh');
    if (practiceRightCheckbox) practiceRightCheckbox.checked = AppState.practice.right;

    const playbackLeftCheckbox = document.getElementById('enable-staff-lh');
    if (playbackLeftCheckbox) playbackLeftCheckbox.checked = AppState.playback.left;

    const playbackRightCheckbox = document.getElementById('enable-staff-rh');
    if (playbackRightCheckbox) playbackRightCheckbox.checked = AppState.playback.right;

    const audioHandsCheckbox = document.getElementById('enable-hand-staves');
    if (audioHandsCheckbox) audioHandsCheckbox.checked = AppState.audioEnabled.hands;

    const audioOtherCheckbox = document.getElementById('enable-other');
    if (audioOtherCheckbox) audioOtherCheckbox.checked = AppState.audioEnabled.other;

    const audioInstrumentCheckbox = document.getElementById('enable-instrument');
    if (audioInstrumentCheckbox) audioInstrumentCheckbox.checked = AppState.audioEnabled.instrument;
    syncMidiInBoostUi();

    const audioVirtualCheckbox = document.getElementById('enable-virtual-keyboard');
    if (audioVirtualCheckbox) audioVirtualCheckbox.checked = AppState.audioEnabled.virtual;

    const midiOutHandsCheckbox = document.getElementById('enable-midiout-hand-staves');
    if (midiOutHandsCheckbox) midiOutHandsCheckbox.checked = AppState.midiOutEnabled.hands;

    const midiOutOtherCheckbox = document.getElementById('enable-midiout-other');
    if (midiOutOtherCheckbox) midiOutOtherCheckbox.checked = AppState.midiOutEnabled.other;

    const midiOutInstrumentCheckbox = document.getElementById('enable-midiout-instrument');
    if (midiOutInstrumentCheckbox) midiOutInstrumentCheckbox.checked = AppState.midiOutEnabled.instrument;

    const midiOutVirtualCheckbox = document.getElementById('enable-midiout-virtual-keyboard');
    if (midiOutVirtualCheckbox) midiOutVirtualCheckbox.checked = AppState.midiOutEnabled.virtual;


    const pianoVolume = getClampedNumber(TRAINER_PIANO_VOL_STORAGE_KEY, 0, 100, 80);
    updatePianoVolume(pianoVolume);

    const midiOutVolume = getClampedNumber(TRAINER_MIDIOUT_VOL_STORAGE_KEY, 0, 100, 65);
    updateMidiOutVolume(midiOutVolume, { save: false });

    const midiInBoost = getClampedNumber(TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100);
    updateMidiInBoost(midiInBoost, { save: false });

    const zoomPercent = getClampedNumber(TRAINER_ZOOM_STORAGE_KEY, 50, 150, 100);
    if (localStorage.getItem(TRAINER_ZOOM_STORAGE_KEY) === null || localStorage.getItem(TRAINER_ZOOM_STORAGE_KEY) === '') {
        localStorage.setItem(TRAINER_ZOOM_STORAGE_KEY, String(zoomPercent));
    }
    syncZoomControls(zoomPercent);
    applyZoom(zoomPercent, { save: false });

    const autoScrollCheckbox = document.getElementById('check-autoscroll');
    if (autoScrollCheckbox) autoScrollCheckbox.checked = getStoredBool(TRAINER_AUTOSCROLL_STORAGE_KEY, true);

    const keyboardCheckbox = document.getElementById('check-keyboard');
    const keyboardVisible = getStoredBool(TRAINER_KEYBOARD_STORAGE_KEY, true);
    if (keyboardCheckbox) keyboardCheckbox.checked = keyboardVisible;
    const keyboardContainer = document.getElementById('virtual-keyboard-container');
    if (keyboardContainer) keyboardContainer.classList.toggle('hidden', !keyboardVisible);

    AppState.fullscreenOnPlay = getStoredBool(TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY, false);
    const fullscreenOnPlayCheckbox = document.getElementById('check-fullscreen-on-play');
    if (fullscreenOnPlayCheckbox) fullscreenOnPlayCheckbox.checked = AppState.fullscreenOnPlay;
    syncFullscreenUi();

    const debugEnabled = getStoredBool(SETTINGS_DEBUG_STORAGE_KEY, false);
    setDebugEnabled(debugEnabled, { clearHistory: !debugEnabled, logChange: false, reason: 'startup-persisted' });

    const visualPulseCheckbox = document.getElementById('check-visual-pulse');
    if (visualPulseCheckbox) visualPulseCheckbox.checked = AppState.visualPulseEnabled;

    const accentedDownbeatCheckbox = document.getElementById('check-accented-downbeat');
    if (accentedDownbeatCheckbox) accentedDownbeatCheckbox.checked = AppState.accentedDownbeatEnabled;

    const loopCountInCheckbox = document.getElementById('check-loop-countin');
    if (loopCountInCheckbox) loopCountInCheckbox.checked = AppState.loopCountInEnabled;

    const metronomeMidiOutCheckbox = document.getElementById('check-metronome-midiout');
    if (metronomeMidiOutCheckbox) metronomeMidiOutCheckbox.checked = AppState.metronomeMidiOutEnabled;

    const metronomeVolume = getClampedNumber(METRONOME_VOL_STORAGE_KEY, 0, 100, 25);
    updateMetroVolume(metronomeVolume, { save: false });
}

function restoreDefaultPreferences({ reloadDevices = true } = {}) {
    clearSavedPreferences();

    AppState.mode = 'realtime';
    const realtimeRadio = document.getElementById('mode-realtime');
    const waitRadio = document.getElementById('mode-wait');
    if (realtimeRadio) realtimeRadio.checked = true;
    if (waitRadio) waitRadio.checked = false;

    AppState.feedbackEnabled = true;
    const feedbackCheckbox = document.getElementById('check-feedback');
    if (feedbackCheckbox) feedbackCheckbox.checked = true;

    AppState.futurePreviewEnabled = true;
    const futurePreviewCheckbox = document.getElementById('check-future-preview');
    if (futurePreviewCheckbox) futurePreviewCheckbox.checked = true;

    AppState.correctHighlightEnabled = true;
    const correctHighlightCheckbox = document.getElementById('check-correct-highlight');
    if (correctHighlightCheckbox) correctHighlightCheckbox.checked = true;

    AppState.futurePreviewDepth = 1;

    AppState.modeSettings.realtime = { practice: { left: true, right: true }, playback: { left: true, right: true } };
    AppState.modeSettings.wait = { practice: { left: true, right: true }, playback: { left: false, right: false } };
    AppState.modeSettings.follow = { practice: { left: false, right: true }, playback: { left: true, right: false } };
    syncActiveHandStateFromMode();
    const practiceLeftCheckbox = document.getElementById('practice-lh');
    if (practiceLeftCheckbox) practiceLeftCheckbox.checked = true;
    const practiceRightCheckbox = document.getElementById('practice-rh');
    if (practiceRightCheckbox) practiceRightCheckbox.checked = true;

    AppState.audioEnabled.hands = true;
    AppState.audioEnabled.other = false;
    AppState.audioEnabled.instrument = false;
    AppState.audioEnabled.virtual = true;
    const playbackLeftCheckbox = document.getElementById('enable-staff-lh');
    if (playbackLeftCheckbox) playbackLeftCheckbox.checked = AppState.playback.left;
    const playbackRightCheckbox = document.getElementById('enable-staff-rh');
    if (playbackRightCheckbox) playbackRightCheckbox.checked = AppState.playback.right;
    const audioHandsCheckbox = document.getElementById('enable-hand-staves');
    if (audioHandsCheckbox) audioHandsCheckbox.checked = true;
    const audioOtherCheckbox = document.getElementById('enable-other');
    if (audioOtherCheckbox) audioOtherCheckbox.checked = false;
    const audioInstrumentCheckbox = document.getElementById('enable-instrument');
    if (audioInstrumentCheckbox) audioInstrumentCheckbox.checked = false;
    const audioVirtualCheckbox = document.getElementById('enable-virtual-keyboard');
    if (audioVirtualCheckbox) audioVirtualCheckbox.checked = true;
    updateMidiInBoost(getClampedNumber(TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100));
    syncMidiInBoostUi();

    AppState.midiOutEnabled.hands = false;
    AppState.midiOutEnabled.other = false;
    AppState.midiOutEnabled.instrument = false;
    AppState.midiOutEnabled.virtual = false;
    const midiOutHandsCheckbox = document.getElementById('enable-midiout-hand-staves');
    if (midiOutHandsCheckbox) midiOutHandsCheckbox.checked = false;
    const midiOutOtherCheckbox = document.getElementById('enable-midiout-other');
    if (midiOutOtherCheckbox) midiOutOtherCheckbox.checked = false;
    const midiOutInstrumentCheckbox = document.getElementById('enable-midiout-instrument');
    if (midiOutInstrumentCheckbox) midiOutInstrumentCheckbox.checked = false;
    const midiOutVirtualCheckbox = document.getElementById('enable-midiout-virtual-keyboard');
    if (midiOutVirtualCheckbox) midiOutVirtualCheckbox.checked = false;

    updatePianoVolume(80);
    ScoreDisplay.setMode('traditional');
    applyZoom(100);

    const autoScrollCheckbox = document.getElementById('check-autoscroll');
    if (autoScrollCheckbox) autoScrollCheckbox.checked = true;

    const keyboardCheckbox = document.getElementById('check-keyboard');
    if (keyboardCheckbox) keyboardCheckbox.checked = true;
    const keyboardContainer = document.getElementById('virtual-keyboard-container');
    if (keyboardContainer) keyboardContainer.classList.remove('hidden');

    AppState.visualPulseEnabled = true;
    const visualPulseCheckbox = document.getElementById('check-visual-pulse');
    if (visualPulseCheckbox) visualPulseCheckbox.checked = true;

    AppState.accentedDownbeatEnabled = true;
    const accentedDownbeatCheckbox = document.getElementById('check-accented-downbeat');
    if (accentedDownbeatCheckbox) accentedDownbeatCheckbox.checked = true;

    AppState.loopCountInEnabled = true;
    const loopCountInCheckbox = document.getElementById('check-loop-countin');
    if (loopCountInCheckbox) loopCountInCheckbox.checked = true;

    AppState.metronomeMidiOutEnabled = false;
    const metronomeMidiOutCheckbox = document.getElementById('check-metronome-midiout');
    if (metronomeMidiOutCheckbox) metronomeMidiOutCheckbox.checked = false;

    updateMetroVolume(25, { save: true });
    syncTempoMetronomeDependentUi();

    setDebugEnabled(false, { clearHistory: true, logChange: false, reason: 'reset-defaults' });

    setPlayerPianoType(88);
    if (optionalLedOutput.enabled) {
        setLedCount(88);
        setLedMasterBrightness(25);
        setLedFuture1BrightnessPct(1);
        setLedFuture2BrightnessPct(1);
        resetAllLedCalibration();

        setWledIp('');
        setLedOutputMode('none');
    }

    const midiInSelect = document.getElementById('midi-in');
    if (midiInSelect) {
        midiInSelect.value = 'none';
        midiInSelect.dispatchEvent(new Event('change'));
    }

    const midiOutSelect = document.getElementById('midi-out');
    if (midiOutSelect) {
        midiOutSelect.value = 'none';
        midiOutSelect.dispatchEvent(new Event('change'));
    }
    const midiOutChannelSelect = document.getElementById('midi-out-channel');
    if (midiOutChannelSelect) {
        midiOutChannelSelect.value = '1';
        midiOutChannelSelect.dispatchEvent(new Event('change'));
    }

    const midiLightsSelect = document.getElementById('midi-lights');
    if (midiLightsSelect) {
        midiLightsSelect.value = 'none';
        midiLightsSelect.dispatchEvent(new Event('change'));
    }
    const midiLightsChannelSelect = document.getElementById('midi-lights-channel');
    if (midiLightsChannelSelect) {
        midiLightsChannelSelect.value = '1';
        midiLightsChannelSelect.dispatchEvent(new Event('change'));
    }

    const defaults = getDefaultStaffAssignment();
    const assignLeft = document.getElementById('assign-lh');
    if (assignLeft) assignLeft.value = formatStaffAssignmentValue(defaults.left);
    const assignRight = document.getElementById('assign-rh');
    if (assignRight) assignRight.value = formatStaffAssignmentValue(defaults.right);
    syncHandAssignmentFromControls();

    applyModeSettings();
    if (optionalLedOutput.enabled) {
        syncLedBrightnessControls();
        syncLedOutputModeControls();
    }
    renderLooper();
    renderVirtualKeyboard();
    optionalLedOutput.positionCalibrationPanel();

    if (reloadDevices) {
        populateMIDIDevices();
    }
}

// LED helpers, simulator, hardware protocol, and WLED transport now live in js/led.js.

// ==========================================
// INITIALIZE AUDIO ENGINES
// ==========================================

// ===== Score renderer + transport primitives =====

let osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmd-container", {
    autoResize: false, 
    drawTitle: true
});
ScoreDisplay.init();

audioOutput.init();


metronomeOutput.init();


// ==========================================
// SCORING DISPLAY LOGIC
// ==========================================

// ===== Score loading + file entry points =====

function updateScoreDisplay() {
    const total = AppState.score.correct + AppState.score.wrong;
    let percentage = 100;
    
    if (total > 0) {
        percentage = Math.round((AppState.score.correct / total) * 100);
    }
    
    document.getElementById('live-score').innerText = `${percentage}%`;
}


// ==========================================
// FILE LOADER & UI INIT
// ==========================================
scoreFileControls.init();


let globalStaffIdentityMap = new Map();

function rebuildGlobalStaffIdentityMap() {
    globalStaffIdentityMap = new Map();

    const instruments = osmd?.Sheet?.Instruments || osmd?.Sheet?.instruments || [];
    let nextGlobalStaffId = 1;

    instruments.forEach(instrument => {
        const staves = instrument?.Staves || instrument?.staves || instrument?.Staffs || instrument?.staffs || [];
        staves.forEach(staff => {
            if (staff && !globalStaffIdentityMap.has(staff)) {
                globalStaffIdentityMap.set(staff, nextGlobalStaffId++);
            }
        });
    });
}

function getResolvedStaffAssignmentIdFromNote(note) {
    const staffCandidates = [
        note?.ParentStaff,
        note?.parentStaff,
        note?.ParentVoiceEntry?.ParentSourceStaffEntry?.ParentStaff,
        note?.parentVoiceEntry?.parentSourceStaffEntry?.parentStaff,
        note?.SourceStaff,
        note?.sourceStaff
    ].filter(Boolean);

    for (const staff of staffCandidates) {
        if (globalStaffIdentityMap.has(staff)) {
            return globalStaffIdentityMap.get(staff);
        }
    }

    const fallbackId = Number(staffCandidates[0]?.id ?? note?.ParentStaff?.id ?? note?.parentStaff?.id);
    return Number.isFinite(fallbackId) ? fallbackId : null;
}

function getResolvedStaffAssignmentIdFromEntry(entry) {
    const firstNote = entry?.Notes?.[0] || entry?.notes?.[0] || null;
    return getResolvedStaffAssignmentIdFromNote(firstNote);
}

window.getResolvedStaffAssignmentIdFromNote = getResolvedStaffAssignmentIdFromNote;
window.getResolvedStaffAssignmentIdFromEntry = getResolvedStaffAssignmentIdFromEntry;
window.getAssignedHandRoleForStaff = getAssignedHandRoleForStaff;

function syncHandAssignmentFromControls({ refreshCurrentFrame = false } = {}) {
    const lhAssign = document.getElementById('assign-lh');
    const rhAssign = document.getElementById('assign-rh');
    if (!lhAssign || !rhAssign) return;

    const nextLeft = parseStaffAssignmentValue(lhAssign.value);
    const nextRight = parseStaffAssignmentValue(rhAssign.value);
    if (nextRight == null) return;

    AppState.hands.left = nextLeft;
    AppState.hands.right = nextRight;
    AppState.ledPreviewTimelineDirty = true;
    AppState.lastLedPreviewEvents = [];

    if (!refreshCurrentFrame || !osmd?.cursor?.Iterator) {
        renderVirtualKeyboard();
        return;
    }

    const entries = osmd.cursor.Iterator.CurrentVoiceEntries || [];
    const currentMeasureIdx = osmd.cursor.Iterator.CurrentMeasureIndex;
    const currentTimestamp = osmd.cursor.Iterator.currentTimeStamp?.RealValue ?? null;

    if (entries.length > 0 && currentMeasureIdx != null) {
        buildExpectedNotesFromEntries(entries, currentMeasureIdx, currentTimestamp);
        renderVirtualKeyboard(entries, currentMeasureIdx, currentTimestamp);
    } else {
        AppState.expectedNotes = [];
        AppState.visualNotesToStart = [];
        AppState.outOfRangeCurrentNotes = [];
        renderVirtualKeyboard();
    }
}

function bindHandAssignmentControls() {
    const lhAssign = document.getElementById('assign-lh');
    const rhAssign = document.getElementById('assign-rh');
    if (!lhAssign || !rhAssign || lhAssign.dataset.boundHandAssign === 'true') return;

    const handleChange = () => {
        syncHandAssignmentFromControls({ refreshCurrentFrame: true });
    };

    lhAssign.dataset.boundHandAssign = 'true';
    rhAssign.dataset.boundHandAssign = 'true';
    lhAssign.addEventListener('change', handleChange);
    rhAssign.addEventListener('change', handleChange);
}

function initSongUI() {
    rebuildGlobalStaffIdentityMap();
    rebuildMeasureTimingCache();

    const totalMeasures = osmd.GraphicSheet.MeasureList.length;
    loopControls.resetRangeForScore(totalMeasures);
    
    if (osmd.Sheet.SourceMeasures.length > 0 && osmd.Sheet.SourceMeasures[0].TempoInBPM) {
        AppState.baseBpm = osmd.Sheet.SourceMeasures[0].TempoInBPM;
    } else {
        AppState.baseBpm = 120; 
    }
    
    updateTempo('percent', AppState.speedPercent * 100);
    
    const stavesCount = osmd.GraphicSheet.MeasureList[0].length;
    const lhAssign = document.getElementById('assign-lh');
    const rhAssign = document.getElementById('assign-rh');
    lhAssign.innerHTML = ""; rhAssign.innerHTML = "";
    
    lhAssign.innerHTML = '<option value="">-</option>';
    rhAssign.innerHTML = '';

    for(let i = 1; i <= stavesCount; i++) {
        lhAssign.innerHTML += `<option value="${i}">${i}</option>`;
        rhAssign.innerHTML += `<option value="${i}">${i}</option>`;
    }

    const defaults = getDefaultStaffAssignment();
    lhAssign.value = formatStaffAssignmentValue(defaults.left);
    rhAssign.value = formatStaffAssignmentValue(defaults.right);
    bindHandAssignmentControls();
    syncHandAssignmentFromControls();
    
    AppState.score.correct = 0;
    AppState.score.wrong = 0;
    updateScoreDisplay();
    renderLooper(); 
}

// Practice owns input, expectations, scoring and sustain state. Rendering and
// optional hardware output remain delegated through their established ports.


// ===== Virtual keyboard + LED preview coordination =====

function getLegacyTraversalCursor() {
    return osmd?.cursor;
}


function isPracticeHandEnabledForStaff(staffId) {
    const handRole = getAssignedHandRoleForStaff(staffId);
    return (handRole === 'right' && AppState.practice.right) || (handRole === 'left' && AppState.practice.left);
}


function getFuturePreviewDepth() {
    if (!AppState.futurePreviewEnabled) return 0;
    return AppState.futurePreviewEnabled ? 1 : 0;
}

function getLedStatePriority(stateClass) {
    if (!stateClass) return 0;
    if (stateClass === 'expected-l' || stateClass === 'expected-r') return 5;
    if (stateClass === 'future1-l' || stateClass === 'future1-r' || stateClass === 'future2-l' || stateClass === 'future2-r') return 4;
    if (stateClass === 'pressed-l' || stateClass === 'pressed-r') return 2;
    if (stateClass === 'wrong' || stateClass === 'active') return 1;
    return 0;
}

function chooseHigherPriorityLedState(currentState, candidateState) {
    return getLedStatePriority(candidateState) > getLedStatePriority(currentState)
        ? candidateState
        : currentState;
}

function applyLedFuturePreviewStates(baseStates, previewEvents) {
    const ledStates = new Map(baseStates);

    (previewEvents || []).forEach(event => {
        event.notes.forEach(note => {
            const currentState = ledStates.get(note.midi) || null;
            const nextState = chooseHigherPriorityLedState(currentState, note.state);
            if (nextState && nextState !== currentState) {
                ledStates.set(note.midi, nextState);
            }
        });
    });

    return ledStates;
}

// ==========================================
// Virtual keyboard state presentation (hardware output uses the optional port)
// ==========================================


const KEY_STATE_CLASSES = ['expected-l', 'expected-r', 'pressed-l', 'pressed-r', 'wrong', 'active', 'future1-l', 'future1-r'];

function getKeyInlineVisual(state) {
    return {
        filter: '',
        boxShadow: '',
        transform: ''
    };
}

function applyInlineKeyVisual(el, state) {
    if (!el) return;
    el.style.filter = '';
    el.style.boxShadow = '';
    el.style.transform = '';
}


function renderVirtualKeyboard(currentEntries = null, currentMeasureIdx = null, currentTimestamp = null) {
    const desiredStates = new Map();
    const previewStateMap = new Map();

    if (AppState.ledCalibrationMode) {
        if (AppState.ledCalibrationSelectedMidi != null && isMidiInPlayerRange(AppState.ledCalibrationSelectedMidi)) {
            desiredStates.set(AppState.ledCalibrationSelectedMidi, 'calibration');
        }

        optionalLedOutput.render(desiredStates);

        for (let i = 21; i <= 108; i++) {
            const desiredClass = AppState.ledCalibrationSelectedMidi === i ? 'active' : null;
            const el = document.querySelector(`.key[data-midi="${i}"]`);
            if (el) {
                el.classList.toggle('out-of-range', !isMidiInPlayerRange(i));
                KEY_STATE_CLASSES.forEach(cls => el.classList.remove(cls));
            if (desiredClass) el.classList.add(desiredClass);
                applyInlineKeyVisual(el, desiredClass);
            }
        }

        return;
    }

    practiceSustains.pruneAtTimestamp(currentTimestamp);

    AppState.sustainedVisuals.forEach(n => {
        if (!isMidiInPlayerRange(n.midi)) return;
        const handRole = getAssignedHandRoleForStaff(n.staffId);
        desiredStates.set(n.midi, handRole === 'left' ? 'expected-l' : 'expected-r');
    });
    AppState.visualNotesToStart.forEach(n => {
        if (!isMidiInPlayerRange(n.midi)) return;
        const handRole = getAssignedHandRoleForStaff(n.staffId);
        desiredStates.set(n.midi, handRole === 'left' ? 'expected-l' : 'expected-r');
    });

    const previewDepth = getFuturePreviewDepth();
    let previewEvents = previewDepth > 0 ? (AppState.lastLedPreviewEvents || []) : [];

    if (currentEntries && currentMeasureIdx !== null && currentTimestamp !== null) {
        previewEvents = collectFutureLedPreviewEvents(
            currentEntries,
            currentMeasureIdx,
            currentTimestamp,
            previewDepth
        );
        AppState.lastLedPreviewEvents = previewEvents;
    }

    (previewEvents || []).forEach(event => {
        event.notes.forEach(note => {
            const currentState = previewStateMap.get(note.midi) || null;
            const nextState = chooseHigherPriorityLedState(currentState, note.state);
            if (nextState && nextState !== currentState) {
                previewStateMap.set(note.midi, nextState);
            }
        });
    });

    AppState.pressedKeys.forEach(midi => {
        const previewState = previewStateMap.get(midi) || null;
        practiceSustains.markHeldPreview(midi, previewState);

        const currentState = desiredStates.get(midi) || null;
        const isCarryHeldIntoExpected =
            AppState.preExpectedHeldNotes.has(midi) &&
            (currentState === 'expected-l' || currentState === 'expected-r');

        if (isCarryHeldIntoExpected) {
            desiredStates.set(midi, currentState);
        } else if (currentState === 'expected-l' || currentState === 'expected-r') {
            if (AppState.correctHighlightEnabled) {
                desiredStates.set(midi, currentState === 'expected-l' ? 'pressed-l' : 'pressed-r');
            } else {
                desiredStates.set(midi, currentState);
            }
        } else if (previewState === 'future1-l' || previewState === 'future1-r') {
            desiredStates.set(midi, previewState);
        } else if (AppState.heldCorrectNotes.has(midi)) {
            const hasActiveSustainForMidi = AppState.sustainedVisuals.some(v => v.midi === midi)
                || AppState.visualNotesToStart.some(v => v.midi === midi)
                || AppState.expectedNotes.some(n => n.midi === midi);

            if (hasActiveSustainForMidi) {
                if (AppState.correctHighlightEnabled) {
                    const staffId = AppState.heldCorrectNotes.get(midi);
                    desiredStates.set(midi, getAssignedHandRoleForStaff(staffId) === 'left' ? 'pressed-l' : 'pressed-r');
                } else {
                    desiredStates.delete(midi);
                }
            } else {
                // Ignore keys that remain physically held after their musical/visual
                // lifespan has ended. They should not stay amber, but they also
                // should not fall through to wrong/red while still held.
                desiredStates.delete(midi);
            }
        } else {
            desiredStates.set(midi, AppState.isPlaying ? 'wrong' : 'active');
        }
    });

    const displayStates = previewDepth > 0
        ? applyLedFuturePreviewStates(desiredStates, previewEvents)
        : desiredStates;

    optionalLedOutput.render(displayStates, previewDepth);

    for (let i = 21; i <= 108; i++) {
        const desiredClass = displayStates.get(i) || null;
        
        const el = document.querySelector(`.key[data-midi="${i}"]`);
        if (el) {
            el.classList.toggle('out-of-range', !isMidiInPlayerRange(i));
            const currentUIClass = [...el.classList].find(c => ['expected-l', 'expected-r', 'pressed-l', 'pressed-r', 'wrong', 'active', 'future1-l', 'future1-r'].includes(c));
            if (currentUIClass !== desiredClass) {
                if (currentUIClass) el.classList.remove(currentUIClass);
                if (desiredClass) el.classList.add(desiredClass);
            }
            applyInlineKeyVisual(el, desiredClass);
        }

        const hardwareDesiredClass = desiredStates.get(i) || null;
        const currentHardwareClass = AppState.hardwareLEDState.get(i) || null;
        if (currentHardwareClass !== hardwareDesiredClass) {
            optionalLedOutput.updateHardware(i, hardwareDesiredClass, currentHardwareClass);
            
            if (hardwareDesiredClass) {
                AppState.hardwareLEDState.set(i, hardwareDesiredClass);
            } else {
                AppState.hardwareLEDState.delete(i);
            }
        }
    }
}


function clearFeedbackVisualStatePreserveScoring() {
    practiceFeedback.clearPreserveScoring();
}


// ==========================================
// VIRTUAL KEYBOARD & DYNAMIC MIDI
// ==========================================
let activeVirtualPointerId = null;
let activeVirtualPointerMidi = null;


function releaseActiveVirtualPointer(pointerId = null) {
    if (activeVirtualPointerMidi == null) return;
    if (pointerId != null && activeVirtualPointerId != null && pointerId !== activeVirtualPointerId) return;
    triggerVirtualKey(activeVirtualPointerMidi, false, 'ui');
    activeVirtualPointerId = null;
    activeVirtualPointerMidi = null;
}

function createKeyboard() {
    const kb = document.getElementById('virtual-keyboard');
    const blackIndices = [1, 3, 6, 8, 10];

    if (!kb) return;
    kb.innerHTML = '';

    const bindStart = async (key, midi, token = null) => {
        if (key.dataset.virtualDown === '1') return;
        key.dataset.virtualDown = '1';
        await ensureLiveAudioReady();
        if (activeVirtualPointerMidi != null && activeVirtualPointerMidi !== midi) {
            releaseActiveVirtualPointer();
        }
        activeVirtualPointerId = token;
        activeVirtualPointerMidi = midi;
        triggerVirtualKey(midi, true, 'ui');
    };

    const bindEnd = (key, midi, token = null) => {
        if (token != null && activeVirtualPointerId != null && token !== activeVirtualPointerId) return;
        key.dataset.virtualDown = '0';
        if (AppState.pressedKeys.has(midi)) triggerVirtualKey(midi, false, 'ui');
        if (activeVirtualPointerMidi === midi) {
            activeVirtualPointerId = null;
            activeVirtualPointerMidi = null;
        }
    };

    for (let i = 0; i < 88; i++) {
        const key = document.createElement('div');
        const midi = i + 21;
        const isBlack = blackIndices.includes((i + 9) % 12);

        key.className = `key ${isBlack ? 'black' : 'white'}`;
        key.classList.toggle('out-of-range', !isMidiInPlayerRange(midi));
        key.dataset.midi = midi;
        key.dataset.virtualDown = '0';

        key.addEventListener('pointerdown', async (event) => {
            event.preventDefault();
            if (typeof key.setPointerCapture === 'function') {
                try { key.setPointerCapture(event.pointerId); } catch (_) {}
            }
            await bindStart(key, midi, `pointer:${event.pointerId}`);
        });
        key.addEventListener('pointerup', (event) => {
            event.preventDefault();
            bindEnd(key, midi, `pointer:${event.pointerId}`);
        });
        key.addEventListener('pointercancel', (event) => {
            event.preventDefault();
            bindEnd(key, midi, `pointer:${event.pointerId}`);
        });
        key.addEventListener('pointerleave', (event) => {
            if (event.pointerType === 'mouse') bindEnd(key, midi, `pointer:${event.pointerId}`);
        });
        key.addEventListener('mousedown', async (event) => {
            event.preventDefault();
            await bindStart(key, midi, 'mouse');
        });
        key.addEventListener('mouseup', (event) => {
            event.preventDefault();
            bindEnd(key, midi, 'mouse');
        });
        key.addEventListener('mouseleave', () => bindEnd(key, midi, 'mouse'));
        key.addEventListener('touchstart', async (event) => {
            event.preventDefault();
            const touch = event.changedTouches?.[0];
            await bindStart(key, midi, touch ? `touch:${touch.identifier}` : 'touch');
        }, { passive: false });
        key.addEventListener('touchend', (event) => {
            event.preventDefault();
            const touch = event.changedTouches?.[0];
            bindEnd(key, midi, touch ? `touch:${touch.identifier}` : 'touch');
        }, { passive: false });
        key.addEventListener('touchcancel', (event) => {
            event.preventDefault();
            const touch = event.changedTouches?.[0];
            bindEnd(key, midi, touch ? `touch:${touch.identifier}` : 'touch');
        }, { passive: false });

        kb.appendChild(key);
    }
}

function syncTrainerRoutingUiState() {
    const hasMidiOut = !!getSelectedMidiOutOutput();
    const summary = document.getElementById('trainer-midi-out-summary');
    const midiOutCard = document.getElementById('trainer-midiout-card');
    const summaryHint = document.getElementById('trainer-midi-out-summary-hint');
    if (summary) {
        if (hasMidiOut) {
            const outName = document.getElementById('midi-out')?.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, '') || 'MIDI Out';
            summary.textContent = `Send playback and input to ${outName}.`;
            summary.classList.remove('is-disabled');
            summaryHint?.classList.add('hidden');
        } else {
            summary.textContent = 'No MIDI device selected.';
            summary.classList.add('is-disabled');
            summaryHint?.classList.remove('hidden');
        }
    }
    midiOutCard?.classList.toggle('is-disabled', !hasMidiOut);
    const midiOutVolumeSlider = document.getElementById('slider-midiout-vol');
    const midiOutVolumeInput = document.getElementById('val-midiout-vol');
    if (midiOutVolumeSlider) midiOutVolumeSlider.disabled = !hasMidiOut;
    if (midiOutVolumeInput) midiOutVolumeInput.disabled = !hasMidiOut;
    ['enable-midiout-hand-staves', 'enable-midiout-other', 'enable-midiout-instrument', 'enable-midiout-virtual-keyboard'].forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;
        const shouldDisable = !hasMidiOut;
        input.disabled = shouldDisable;
        input.closest('label')?.classList.toggle('is-disabled', shouldDisable);
    });
    syncTempoMetronomeDependentUi();
}

// MIDI access/output live in src/midi; device DOM controls live in src/ui/midi-controls.ts.


// ==========================================
// WAIT MODE ENGINE
// ==========================================

// ===== Trainer mode flow =====


// ==========================================
// UI LISTENERS & SYNC LOGIC
// ==========================================
function applyModeSettings() {
    applyToneLatencyProfileForMode();
    const isWait = AppState.mode === 'wait';
    const isFollow = AppState.mode === 'follow';

    syncActiveHandStateFromMode();

    const practiceLeftToggle = document.getElementById('practice-lh');
    const practiceRightToggle = document.getElementById('practice-rh');
    const playbackLeftToggle = document.getElementById('enable-staff-lh');
    const playbackRightToggle = document.getElementById('enable-staff-rh');
    const audioHandsToggle = document.getElementById('enable-hand-staves');
    const otherAudioToggle = document.getElementById('enable-other');
    const midiOutHandsToggle = document.getElementById('enable-midiout-hand-staves');
    const midiOutOtherToggle = document.getElementById('enable-midiout-other');
    const playbackRow = document.querySelector('.practice-playback-row');
    const waitNoteRow = document.getElementById('practice-wait-note-row');
    const waitNote = document.getElementById('practice-wait-note');
    const lowLatencyPlaybackCheckbox = document.getElementById('check-low-latency-playback');

    if (practiceLeftToggle) practiceLeftToggle.checked = AppState.practice.left;
    if (practiceRightToggle) practiceRightToggle.checked = AppState.practice.right;
    if (playbackLeftToggle) playbackLeftToggle.checked = AppState.playback.left;
    if (playbackRightToggle) playbackRightToggle.checked = AppState.playback.right;
    if (lowLatencyPlaybackCheckbox) lowLatencyPlaybackCheckbox.checked = !!AppState.lowLatencyPlaybackEnabled;

    // Keep Audio/Routing hand-staff preferences untouched when switching modes.
    // Wait mode blocks score playback behaviorally, but it must not rewrite or visually
    // uncheck the user's saved routing choices in More -> Audio/Routing.

    if (practiceLeftToggle) {
        practiceLeftToggle.disabled = false;
        practiceLeftToggle.closest('label')?.classList.toggle('is-disabled', false);
    }
    if (practiceRightToggle) {
        practiceRightToggle.disabled = false;
        practiceRightToggle.closest('label')?.classList.toggle('is-disabled', false);
    }
    const playbackDisabled = isWait || isFollow;

    if (playbackLeftToggle) {
        playbackLeftToggle.disabled = playbackDisabled;
        playbackLeftToggle.closest('label')?.classList.toggle('is-disabled', playbackDisabled);
    }
    if (playbackRightToggle) {
        playbackRightToggle.disabled = playbackDisabled;
        playbackRightToggle.closest('label')?.classList.toggle('is-disabled', playbackDisabled);
    }
    playbackRow?.classList.toggle('is-disabled', playbackDisabled);
    if (audioHandsToggle) {
        audioHandsToggle.disabled = false;
        audioHandsToggle.closest('label')?.classList.toggle('is-disabled', false);
    }
    if (otherAudioToggle) otherAudioToggle.disabled = isWait;
    if (midiOutHandsToggle) {
        const disableMidiOutHands = !getSelectedMidiOutOutput();
        midiOutHandsToggle.disabled = disableMidiOutHands;
        midiOutHandsToggle.closest('label')?.classList.toggle('is-disabled', disableMidiOutHands);
    }
    if (midiOutOtherToggle) midiOutOtherToggle.disabled = isWait || !getSelectedMidiOutOutput();

    let modeNote = '';
    if (isWait) modeNote = 'Audio playback is unavailable in Wait mode.';
    else if (isFollow) modeNote = 'Playback is automatically set to the opposite hand in Follow Me.';
    waitNoteRow?.classList.toggle('is-hidden', !modeNote);
    waitNoteRow?.classList.toggle('is-disabled-context', playbackDisabled && !!modeNote);
    if (waitNote) {
        waitNote.textContent = modeNote;
        waitNote.classList.toggle('is-disabled', !modeNote);
    }
    syncTrainerRoutingUiState();
}

function syncLowLatencyPlaybackPreferenceUi() {
    const lowLatencyPlaybackCheckbox = document.getElementById('check-low-latency-playback');
    if (lowLatencyPlaybackCheckbox) {
        lowLatencyPlaybackCheckbox.checked = !!AppState.lowLatencyPlaybackEnabled;
    }
}

function initLedSimulatorToggleControl() {
    return;
}

(function ensureFuturePreviewControls() {
    const existingCheckbox = document.getElementById('check-future-preview');
    if (!existingCheckbox) return;

    const existingSelect = document.getElementById('select-future-depth');
    if (existingSelect && existingSelect.parentNode) {
        existingSelect.parentNode.removeChild(existingSelect);
    }

    AppState.futurePreviewDepth = 1;
    existingCheckbox.checked = AppState.futurePreviewEnabled;
    existingCheckbox.addEventListener('change', (e) => {
        AppState.futurePreviewEnabled = e.target.checked;
        AppState.futurePreviewDepth = 1;
        setStoredBool(TRAINER_FUTURE_PREVIEW_STORAGE_KEY, AppState.futurePreviewEnabled);
        AppState.lastLedPreviewEvents = [];
        renderVirtualKeyboard();
    });

    const correctHighlightCheckbox = document.getElementById('check-correct-highlight');
    if (correctHighlightCheckbox) {
        correctHighlightCheckbox.checked = AppState.correctHighlightEnabled;
        if (!correctHighlightCheckbox.dataset.boundCorrectHighlight) {
            correctHighlightCheckbox.dataset.boundCorrectHighlight = 'true';
            correctHighlightCheckbox.addEventListener('change', (e) => {
                AppState.correctHighlightEnabled = e.target.checked;
                setStoredBool(TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY, AppState.correctHighlightEnabled);
                renderVirtualKeyboard();
            });
        }
    }
})();


// ===== Toolbar shell + floating panel coordination =====
// Typed toolbar controller owns shell resources.

// ===== Score library + drawer workflow =====
// Typed score repository and drawer controllers own the library workflow.

document.getElementById('check-keyboard').addEventListener('change', (e) => {
    const kbContainer = document.getElementById('virtual-keyboard-container');
    setStoredBool(TRAINER_KEYBOARD_STORAGE_KEY, e.target.checked);
    if (e.target.checked) {
        kbContainer.classList.remove('hidden');
        renderVirtualKeyboard(); 
    } else {
        kbContainer.classList.add('hidden');
    }
    optionalLedOutput.positionCalibrationPanel();
    window.dispatchEvent(new Event('resize')); 
});

document.getElementById('check-feedback').addEventListener('change', (e) => {
    AppState.feedbackEnabled = e.target.checked;
    setStoredBool(TRAINER_FEEDBACK_STORAGE_KEY, AppState.feedbackEnabled);
    if (!e.target.checked) {
        GeometryEngine.clearSvgFeedback();
    } else {
        renderFeedbackOverlay();
    }
    if (typeof window.syncSettingsDebugVisibility === 'function') {
        window.syncSettingsDebugVisibility();
    }
});

document.querySelectorAll('input[name="practice-mode"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        if (!e.target.checked) return;

        const nextMode = e.target.value;
        if (AppState.isPlaying || AppState.countInActive) {
            pausePlaybackFromToolbar();
        }
        AppState.mode = nextMode;
        localStorage.setItem(TRAINER_MODE_STORAGE_KEY, AppState.mode);
        clearScheduledMetronomeEvents();
        stopWaitModeMetronome();
        silencePlaybackOutputsImmediately();
        clearTransientPlaybackState({ clearVisualState: true });
        applyModeSettings();
        applyToneLatencyProfileForMode();
        updatePianoVolume(audioLevelControls.readPianoVolume());
        updateMetroVolume(audioLevelControls.readMetroVolume());
    });
});


// ===== Playback navigation + metronome scheduling =====


// WARNING:
// Count-in and metronome startup are timing-sensitive.
// Keep transport startup, visual pulse timing, and playback handoff aligned when adjusting this flow.
let ptNeedsImmediateResumeStart = false;

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !AppState.isPlaying) {
        ptNeedsImmediateResumeStart = true;
    }
});

function consumeImmediateResumeStartFlag() {
    const shouldBypass = ptNeedsImmediateResumeStart;
    ptNeedsImmediateResumeStart = false;
    return shouldBypass;
}


document.getElementById('canvas-wrapper').addEventListener('click', (e) => {
    if (!osmd.GraphicSheet || AppState.isPlaying) return;
    if (isAnyToolbarPanelOpen()) return;

    const svgPoint = GeometryEngine.clientPointToSvg(e.clientX, e.clientY);
    if (!svgPoint) return;

    let targetMeasureIdx = -1;

    for (let i = 0; i < osmd.GraphicSheet.MeasureList.length; i++) {
        const box = GeometryEngine.getMeasureBox(i, 0);
        if (!box) continue;

        if (svgPoint.x >= box.x && svgPoint.x <= box.x + box.width && svgPoint.y >= box.y && svgPoint.y <= box.y + box.height) {
            targetMeasureIdx = i;
            break;
        }
    }

    if (targetMeasureIdx !== -1) {
        const isLoopEnabled = document.getElementById('check-looper').checked;
        if (isLoopEnabled && (targetMeasureIdx < AppState.looper.min - 1 || targetMeasureIdx > AppState.looper.max - 1)) {
            return;
        }

        playbackTransport.stop();

        osmd.cursor.reset();
        while (!osmd.cursor.Iterator.EndReached && osmd.cursor.Iterator.CurrentMeasureIndex < targetMeasureIdx) {
            osmd.cursor.Iterator.moveToNext();
        }
        osmd.cursor.update();
        handleAutoScroll();
        clearVisuals();
    }
});


displayControls.initPlaybackShell();
displayControls.initZoom();

tempoControls.initEditing();
audioLevelControls.init();

const autoScrollCheckbox = document.getElementById('check-autoscroll');
if (autoScrollCheckbox) {
    autoScrollCheckbox.addEventListener('change', (e) => {
        setStoredBool(TRAINER_AUTOSCROLL_STORAGE_KEY, e.target.checked);
    });
}

const fullscreenOnPlayCheckbox = document.getElementById('check-fullscreen-on-play');
if (fullscreenOnPlayCheckbox) {
    fullscreenOnPlayCheckbox.addEventListener('change', (e) => {
        AppState.fullscreenOnPlay = e.target.checked;
        setStoredBool(TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY, AppState.fullscreenOnPlay);
    });
}

const lowLatencyPlaybackCheckbox = document.getElementById('check-low-latency-playback');
if (lowLatencyPlaybackCheckbox) {
    syncLowLatencyPlaybackPreferenceUi();
    lowLatencyPlaybackCheckbox.addEventListener('change', (e) => {
        AppState.lowLatencyPlaybackEnabled = e.target.checked;
        setStoredBool(TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY, AppState.lowLatencyPlaybackEnabled);
        if (!AppState.lowLatencyPlaybackEnabled) {
            audioOutput.releaseLowLatencyPlayback();
        }
    });
}

document.getElementById('practice-lh').addEventListener('change', (e) => {
    if (AppState.mode === 'follow') {
        if (!e.target.checked) {
            e.target.checked = true;
            return;
        }
        setFollowPracticeHand('left');
        applyModeSettings();
        return;
    }
    const settings = getCurrentModeSettings();
    settings.practice.left = e.target.checked;
    syncActiveHandStateFromMode();
});
document.getElementById('practice-rh').addEventListener('change', (e) => {
    if (AppState.mode === 'follow') {
        if (!e.target.checked) {
            e.target.checked = true;
            return;
        }
        setFollowPracticeHand('right');
        applyModeSettings();
        return;
    }
    const settings = getCurrentModeSettings();
    settings.practice.right = e.target.checked;
    syncActiveHandStateFromMode();
});

const enableStaffLh = document.getElementById('enable-staff-lh');
if (enableStaffLh) {
    enableStaffLh.addEventListener('change', (e) => {
        if (AppState.mode === 'follow' || AppState.mode === 'wait') {
            e.target.checked = AppState.playback.left;
            return;
        }
        const settings = getCurrentModeSettings();
        settings.playback.left = e.target.checked;
        syncActiveHandStateFromMode();
    });
}
const enableStaffRh = document.getElementById('enable-staff-rh');
if (enableStaffRh) {
    enableStaffRh.addEventListener('change', (e) => {
        if (AppState.mode === 'follow' || AppState.mode === 'wait') {
            e.target.checked = AppState.playback.right;
            return;
        }
        const settings = getCurrentModeSettings();
        settings.playback.right = e.target.checked;
        syncActiveHandStateFromMode();
    });
}
const enableHandStaves = document.getElementById('enable-hand-staves');
if (enableHandStaves) {
    enableHandStaves.addEventListener('change', (e) => {
        AppState.audioEnabled.hands = e.target.checked;
        setStoredBool(TRAINER_AUDIO_HANDS_STORAGE_KEY, AppState.audioEnabled.hands);
    });
}
const enableOther = document.getElementById('enable-other');
if (enableOther) {
    enableOther.addEventListener('change', (e) => {
        AppState.audioEnabled.other = e.target.checked;
        setStoredBool(TRAINER_AUDIO_OTHER_STORAGE_KEY, AppState.audioEnabled.other);
    });
}
const enableInstrument = document.getElementById('enable-instrument');
if (enableInstrument) {
    enableInstrument.addEventListener('change', (e) => {
        AppState.audioEnabled.instrument = e.target.checked;
        setStoredBool(TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY, AppState.audioEnabled.instrument);
        syncMidiInBoostUi();
    });
}
const enableVirtualKeyboard = document.getElementById('enable-virtual-keyboard');
if (enableVirtualKeyboard) {
    enableVirtualKeyboard.addEventListener('change', (e) => {
        AppState.audioEnabled.virtual = e.target.checked;
        setStoredBool(TRAINER_AUDIO_VIRTUAL_STORAGE_KEY, AppState.audioEnabled.virtual);
    });
}
const enableMidiOutHandStaves = document.getElementById('enable-midiout-hand-staves');
if (enableMidiOutHandStaves) {
    enableMidiOutHandStaves.addEventListener('change', (e) => {
        AppState.midiOutEnabled.hands = e.target.checked;
        setStoredBool(TRAINER_MIDIOUT_HANDS_STORAGE_KEY, AppState.midiOutEnabled.hands);
    });
}
const enableMidiOutOther = document.getElementById('enable-midiout-other');
if (enableMidiOutOther) {
    enableMidiOutOther.addEventListener('change', (e) => {
        AppState.midiOutEnabled.other = e.target.checked;
        setStoredBool(TRAINER_MIDIOUT_OTHER_STORAGE_KEY, AppState.midiOutEnabled.other);
    });
}
const enableMidiOutInstrument = document.getElementById('enable-midiout-instrument');
if (enableMidiOutInstrument) {
    enableMidiOutInstrument.addEventListener('change', (e) => {
        AppState.midiOutEnabled.instrument = e.target.checked;
        setStoredBool(TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY, AppState.midiOutEnabled.instrument);
    });
}
const enableMidiOutVirtualKeyboard = document.getElementById('enable-midiout-virtual-keyboard');
if (enableMidiOutVirtualKeyboard) {
    enableMidiOutVirtualKeyboard.addEventListener('change', (e) => {
        AppState.midiOutEnabled.virtual = e.target.checked;
        setStoredBool(TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY, AppState.midiOutEnabled.virtual);
    });
}

loopControls.initOptions();
tempoControls.initMetronomePreferences();
syncLooperDependentUi();
tempoControls.initMetronomeToggle();
loopControls.initRange();

// ==========================================
// PLAYBACK ENGINE
// ==========================================

// ===== Realtime playback loop =====


// WARNING:
// This loop coordinates cursor movement, repeat/jump behavior, trainer expectations, and timer-based playback.
// Change with regression testing for repeats, metronome drift, and complex score navigation.


const backupSettingsButton = document.getElementById('btn-backup-settings');
if (backupSettingsButton) {
    backupSettingsButton.addEventListener('click', () => {
        downloadSettingsBackup();
    });
}

const importSettingsButton = document.getElementById('btn-import-settings');
const importSettingsInput = document.getElementById('input-settings-import');
if (importSettingsButton && importSettingsInput) {
    importSettingsButton.addEventListener('click', () => {
        importSettingsInput.value = '';
        importSettingsInput.click();
    });
    importSettingsInput.addEventListener('change', (event) => {
        const file = event.target.files && event.target.files[0];
        handleSettingsBackupImportFile(file);
        importSettingsInput.value = '';
    });
}

const resetPreferencesButton = document.getElementById('btn-reset-preferences');
if (resetPreferencesButton) {
    resetPreferencesButton.addEventListener('click', () => {
        const confirmed = window.confirm('Reset ALL saved Settings and Trainer preferences? This will erase all saved settings and restore defaults.');
        if (!confirmed) return;
        restoreDefaultPreferences();
    });
}

// INIT Call
initPlayerPianoTypeControl();
optionalLedOutput.initControls();
window.addEventListener('pointerup', (event) => releaseActiveVirtualPointer(`pointer:${event.pointerId}`));
window.addEventListener('pointercancel', (event) => releaseActiveVirtualPointer(`pointer:${event.pointerId}`));
window.addEventListener('mouseup', () => releaseActiveVirtualPointer('mouse'));
window.addEventListener('touchend', (event) => {
    const touch = event.changedTouches?.[0];
    releaseActiveVirtualPointer(touch ? `touch:${touch.identifier}` : 'touch');
}, { passive: true });
window.addEventListener('touchcancel', (event) => {
    const touch = event.changedTouches?.[0];
    releaseActiveVirtualPointer(touch ? `touch:${touch.identifier}` : 'touch');
}, { passive: true });
window.addEventListener('blur', () => releaseActiveVirtualPointer());
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        releaseActiveVirtualPointer();
        return;
    }
    ensureLiveAudioReady();
});
window.addEventListener('pageshow', () => {
    ensureLiveAudioReady();
});
window.addEventListener('focus', () => {
    ensureLiveAudioReady();
});
document.addEventListener('touchstart', () => {
    ensureLiveAudioReady();
}, { passive: true });
document.addEventListener('pointerdown', () => {
    ensureLiveAudioReady();
}, { passive: true });
document.addEventListener('mousedown', () => {
    ensureLiveAudioReady();
}, { passive: true });

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
