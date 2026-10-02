"use strict";
// Shared cache / legacy forwarding for keyboard, grading and preview consumers.
function getPlayerPlayableRange() {
    if (!AppState.playerRange || AppState.playerRange.keyCount !== AppState.playerPianoType) {
        AppState.playerRange = derivePlayerRangeFromKeyboardSize(AppState.playerPianoType);
    }
    return AppState.playerRange;
}
function isCurrentOutOfRangeScoreNote(midi) {
    return AppState.outOfRangeCurrentNotes.some(note => Number(note.midi) === Number(midi));
}
function isMidiInPlayerRange(midi) {
    return isMidiInPlayableRange(midi, getPlayerPlayableRange());
}
function getMidiKeyPosition01(midi) {
    return getPlayableRangePosition01(midi, getPlayerPlayableRange());
}
//# sourceMappingURL=player-range.js.map