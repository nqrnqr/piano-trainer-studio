// Temporary declarations for JS consumers; P8 migrates them before P9 bootstrap.
declare function initSongUI(): void;
declare function refreshScoresDrawer(): Promise<void>;
interface Window {
    MidiImport?: {
        isConverterImportFileName(name: string): boolean;
        convertFileToScore(file: File): Promise<PianoTrainerDomain.ScoreFile>;
        normalizeScoreToMusicXml(rawData: PianoTrainerDomain.ScoreRawData, options: PianoTrainerDomain.ScoreLoadOptions): Promise<string>;
    };
    ScoreLibrary?: {markScoreOpened(id: string): Promise<unknown>};
    TransposeUI?: {handleScoreLoaded(): void; refreshAvailabilityFromCurrentScore(): void; syncUiFromState(): void};
    ScoresUI?: {closeScoresDrawer(): void};
    loadScoreIntoApp?: (rawData: PianoTrainerDomain.ScoreRawData, options?: PianoTrainerDomain.ScoreLoadOptions) => Promise<void>;
    openScoreFilePicker?: () => void;
}
