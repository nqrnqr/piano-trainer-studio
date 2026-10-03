"use strict";
// Lazy assembly only; core calls init at the former binding/creation positions.
const virtualKeyboardView = PianoTrainerVirtualKeyboardView.create({ document, isMidiInRange: midi => isMidiInPlayerRange(midi) });
const keyboardController = PianoTrainerKeyboardController.create({ state: AppState,
    isMidiInRange: midi => isMidiInPlayerRange(midi), getHandRole: staff => getAssignedHandRoleForStaff(staff),
    sustains: practiceSustains, led: optionalLedOutput, drawKey: virtualKeyboardView.drawKey });
function renderVirtualKeyboard(currentEntries = null, currentMeasureIdx = null, currentTimestamp = null) {
    const frame = currentEntries && currentMeasureIdx !== null && currentTimestamp !== null ? {
        collectPreview: (depth) => collectFutureLedPreviewEvents(currentEntries, currentMeasureIdx, currentTimestamp, depth)
    } : null;
    keyboardController.render(frame, currentTimestamp);
}
const virtualKeyboardControls = PianoTrainerVirtualKeyboardControls.create({ document, window,
    pressedKeys: AppState.pressedKeys, isMidiInRange: midi => isMidiInPlayerRange(midi),
    ensureLiveAudioReady: () => ensureLiveAudioReady(), triggerVirtualKey: (midi, down, source) => triggerVirtualKey(midi, down, source) });
const createKeyboard = virtualKeyboardControls.createKeyboard;
const scoreStatus = PianoTrainerScoreStatus.create(document, () => AppState.score);
const updateScoreDisplay = scoreStatus.update;
const clearFeedbackVisualStatePreserveScoring = practiceFeedback.clearPreserveScoring;
const scoreUiController = PianoTrainerScoreUiController.create({ state: AppState,
    rebuildStaffIdentity: osmdAdapter.rebuildStaffIdentity, rebuildMeasureTimingCache: () => rebuildMeasureTimingCache(),
    getMeasureCount: osmdAdapter.getGraphicalMeasureCount, resetLoopRange: total => loopControls.resetRangeForScore(total),
    getFirstTempo: osmdAdapter.getFirstScoreTempo, updateTempo: (source, value) => updateTempo(source, value),
    getStaffCount: osmdAdapter.getLoadedStaffCount,
    resetHandAssignments: count => handAssignmentControls.resetForScore(count, getDefaultStaffAssignment),
    updateScoreDisplay, renderLooper: () => renderLooper() });
const initSongUI = scoreUiController.initSongUI;
const scoreSeekController = PianoTrainerScoreSeek.create({ state: AppState, hasGraphicSheet: osmdAdapter.hasGraphicSheet,
    isAnyToolbarPanelOpen: () => isAnyToolbarPanelOpen(), clientPointToSvg: (x, y) => GeometryEngine.clientPointToSvg(x, y),
    getMeasureCount: osmdAdapter.getGraphicalMeasureCount, getMeasureBox: (index, staff) => GeometryEngine.getMeasureBox(index, staff),
    isLoopEnabled: () => playbackControls.isLoopEnabled(), stopTransport: () => playbackTransport.stop(), resetCursor: osmdAdapter.reset,
    isEndReached: osmdAdapter.isEndReached, getCurrentMeasureIndex: osmdAdapter.getCurrentMeasureIndex, advance: osmdAdapter.advance,
    updateCursor: osmdAdapter.updateCursor, scroll: () => handleAutoScroll(), clearVisuals: () => clearVisuals() });
const scoreSeekControls = PianoTrainerScoreSeekControls.create({ document, seek: scoreSeekController.seek });
window.getResolvedStaffAssignmentIdFromNote = getResolvedStaffAssignmentIdFromNote;
window.getResolvedStaffAssignmentIdFromEntry = getResolvedStaffAssignmentIdFromEntry;
window.getAssignedHandRoleForStaff = getAssignedHandRoleForStaff;
//# sourceMappingURL=keyboard-and-score-controls.js.map