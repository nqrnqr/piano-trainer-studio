"use strict";
// Transitional playable-range UI composition; startup initializes at the former core position.
const playerRangeControls = PianoTrainerPlayerRangeControls.create({ document, state: AppState,
    normalize: normalizePlayerPianoType, derive: derivePlayerRangeFromKeyboardSize, getRange: getPlayerPlayableRange,
    inRange: isMidiInPlayerRange, readSaved: () => localStorage.getItem(PLAYER_PIANO_STORAGE_KEY),
    save: value => localStorage.setItem(PLAYER_PIANO_STORAGE_KEY, value), renderKeyboard: () => renderVirtualKeyboard(), led: optionalLedOutput });
const initPlayerPianoTypeControl = playerRangeControls.init;
const setPlayerPianoType = playerRangeControls.setPlayerPianoType;
//# sourceMappingURL=player-range-controls.js.map