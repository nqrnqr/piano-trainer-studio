// File/load metadata. Original and rendered sources remain separate.
namespace PianoTrainerDomain {
    export interface ScoreFile {
        rawData: ScoreRawData; fileName: string; fileType: string; title: string;
    }
    export interface ScoreLoadOptions {
        fileName?: string; fileType?: string; libraryScoreId?: string | null; title?: string | null;
        originalRawData?: ScoreRawData; originalFileName?: string; originalFileType?: string; skipTransposeReset?: boolean;
    }
}
