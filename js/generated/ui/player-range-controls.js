"use strict";
// Shared playable-range controls. Hardware refresh goes through the optional port.
function syncPlayerPianoTypeControl() {
    const select = getPlayerPianoTypeSelect();
    if (select) {
        select.value = String(AppState.playerPianoType);
    }
    const label = document.getElementById('player-piano-range-label');
    if (label) {
        const range = getPlayerPlayableRange();
        label.textContent = `Playable Range: MIDI ${range.minMidi}–${range.maxMidi}`;
    }
}
function refreshPlayerRangeDependentState() {
    AppState.expectedNotes = AppState.expectedNotes.filter(note => isMidiInPlayerRange(note.midi));
    AppState.visualNotesToStart = AppState.visualNotesToStart.filter(note => isMidiInPlayerRange(note.midi));
    AppState.sustainedVisuals = AppState.sustainedVisuals.filter(note => isMidiInPlayerRange(note.midi));
    AppState.outOfRangeCurrentNotes = AppState.outOfRangeCurrentNotes.filter(note => !isMidiInPlayerRange(note.midi));
    AppState.heldCorrectNotes.forEach((staffId, midi) => {
        if (!isMidiInPlayerRange(midi)) {
            AppState.heldCorrectNotes.delete(midi);
        }
    });
    optionalLedOutput.refreshMapping();
    optionalLedOutput.invalidate();
    optionalLedOutput.renderOutputs();
}
function setPlayerPianoType(value, { save = true, rerender = true } = {}) {
    AppState.playerPianoType = normalizePlayerPianoType(value);
    AppState.playerRange = derivePlayerRangeFromKeyboardSize(AppState.playerPianoType);
    if (save) {
        localStorage.setItem(PLAYER_PIANO_STORAGE_KEY, String(AppState.playerPianoType));
    }
    syncPlayerPianoTypeControl();
    refreshPlayerRangeDependentState();
    AppState.ledPreviewTimelineDirty = true;
    AppState.lastLedPreviewEvents = [];
    AppState.ledPreviewTraversalIndex = -1;
    if (rerender) {
        renderVirtualKeyboard();
    }
}
function initPlayerPianoTypeControl() {
    const saved = localStorage.getItem(PLAYER_PIANO_STORAGE_KEY);
    setPlayerPianoType(saved ?? 88, { save: false, rerender: false });
    const select = getPlayerPianoTypeSelect();
    if (select && !select.dataset.boundPlayerRange) {
        select.dataset.boundPlayerRange = 'true';
        select.value = String(AppState.playerPianoType);
        select.addEventListener('change', (e) => {
            if (e.target instanceof HTMLSelectElement)
                setPlayerPianoType(e.target.value);
        });
    }
    syncPlayerPianoTypeControl();
}
function getPlayerPianoTypeSelect() {
    const select = document.getElementById('select-player-piano-type');
    return select instanceof HTMLSelectElement ? select : null;
}
//# sourceMappingURL=player-range-controls.js.map