// Temporary declarations for JS consumers; P8 migrates them before P9 bootstrap.
interface Window {
    MidiImport?: PianoTrainerScoreConversion.Service;
    ScoreLibrary?: PianoTrainerScoreLibrary.Service;
    TransposeEngine?: typeof PianoTrainerTransposeEngine;
    TransposeUI?: PianoTrainerTransposeController.Service & {syncUiFromState(): void; getPanel(): HTMLElement | null};
    ScoresUI?: PianoTrainerLibraryActions.Service & Pick<PianoTrainerScoresDrawer.Service,'closeScoresDrawer'|'updateScoresActionButtonsState'|'refreshScoresDrawer'> & {
        promptForLibraryFolderChoice:PianoTrainerLibraryDialogs.Service['promptForLibraryFolderChoice'];initScoresDrawerShell():void;init():void;dispose():void;
    };
    loadScoreIntoApp?: (rawData: PianoTrainerDomain.ScoreRawData, options?: PianoTrainerDomain.ScoreLoadOptions) => Promise<void>;
    openScoreFilePicker?: () => void;
}
