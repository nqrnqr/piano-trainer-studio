"use strict";
// Per-application range cache; pure range calculations remain in domain.
var PianoTrainerPlayerRange;
(function (PianoTrainerPlayerRange) {
    function create(AppState) {
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
        return { getPlayerPlayableRange, isCurrentOutOfRangeScoreNote, isMidiInPlayerRange, getMidiKeyPosition01 };
    }
    PianoTrainerPlayerRange.create = create;
})(PianoTrainerPlayerRange || (PianoTrainerPlayerRange = {}));
//# sourceMappingURL=player-range.js.map