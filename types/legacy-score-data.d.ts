// Temporary declarations for JS consumers; P8 migrates them before P9 bootstrap.
declare function initSongUI(): void;
declare function refreshScoresDrawer(): Promise<void>;
interface Window {
    MidiImport?: PianoTrainerScoreConversion.Service;
    ScoreLibrary?: PianoTrainerScoreLibrary.Service;
    TransposeEngine?: typeof PianoTrainerTransposeEngine;
    TransposeUI?: PianoTrainerTransposeController.Service & {syncUiFromState(): void; getPanel(): HTMLElement | null};
    ScoresUI?: {closeScoresDrawer(): void};
    loadScoreIntoApp?: (rawData: PianoTrainerDomain.ScoreRawData, options?: PianoTrainerDomain.ScoreLoadOptions) => Promise<void>;
    openScoreFilePicker?: () => void;
}
