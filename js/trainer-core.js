(function() {
    try {
        window.__PT_DEBUG_BOOT__ = (window.__PT_DEBUG_BOOT__ || 0) + 1;
    } catch (e) {}
})();


// trainer-core.js
// Remaining keyboard/score-seek/score-UI integration and classic consumers.
// Typed practice/audio/score factories now own input, playback, repeat timing and metronome decisions.

// State and persisted preference helpers load from generated/state TS modules.
// Keep trainer-core.js focused on orchestration and cross-module coordination.

// IMPORTANT:
// For rendering, pass original .mxl files directly to OSMD.
// Do NOT substitute normalized XML as the render source for .mxl.
// Normalized XML may still be used for other features, but not render.

// ===== Boot + persisted preferences =====

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

// MIDI access/output live in src/midi; device DOM controls live in src/ui/midi-controls.ts.


// ==========================================
// WAIT MODE ENGINE
// ==========================================

// ===== Trainer mode flow =====


// ==========================================
// UI LISTENERS & SYNC LOGIC
// ==========================================

practiceControls.initFuturePreview();

// ===== Toolbar shell + floating panel coordination =====
// Typed toolbar controller owns shell resources.

// ===== Score library + drawer workflow =====
// Typed score repository and drawer controllers own the library workflow.

practiceControls.initModeAndFeedback();

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

practiceControls.initRouting();

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


settingsActions.init();

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
