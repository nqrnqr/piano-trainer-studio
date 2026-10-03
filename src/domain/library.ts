// Existing v1 database records; no schema migration.
namespace PianoTrainerDomain {
    export interface LibraryFolder {
        id: string;
        name: string;
        createdAt: number;
        updatedAt: number;
    }
    export interface LibraryScore {
        id: string;
        title: string;
        folderId: string | null;
        fileName: string;
        fileType: string;
        rawData: ScoreRawData;
        createdAt: number;
        updatedAt: number;
        lastOpenedAt: number | null;
    }
    export interface SaveLibraryScore {
        title?: string | null;
        folderId?: string | null;
        fileName?: string;
        fileType?: string;
        rawData: ScoreRawData;
        lastOpenedAt?: number | null;
    }
}
