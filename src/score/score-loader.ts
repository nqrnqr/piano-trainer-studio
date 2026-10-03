// Preserve load effects and promise completion. Raw MXL remains the render source.
namespace PianoTrainerScoreLoader {
    export type State = Pick<LegacyAppState, 'ledPreviewTimeline' | 'ledPreviewTimelineDirty' | 'ledPreviewTraversalIndex' |
        'lastLedPreviewEvents' | 'currentScoreData' | 'currentScoreOriginalData' | 'currentScoreFileName' |
        'currentScoreOriginalFileName' | 'currentScoreFileType' | 'currentScoreOriginalFileType' | 'currentScoreLibraryId' | 'currentScoreTitle'>;
    export interface Ports {
        state: State; format: PianoTrainerMusicXmlIO.Service;
        score: {load(rawData: PianoTrainerDomain.ScoreRawData): Promise<unknown>; hasCursor(): boolean; reset(): void; showCursor(): void; updateCursor(): void};
        resetPlayback(): void; resetTempo(): void; render(): void; initSongUI(): void; scroll(): void;
        getLibrary(): {markScoreOpened(id: string): Promise<unknown>} | undefined;
        refreshLibrary(): Promise<void>; notifyTranspose(skipReset: boolean): void;
        success(): void; reportError(error: unknown): void;
    }
    export function create(ports: Ports) {
        const state = ports.state, format = ports.format;
        async function loadScoreIntoApp(rawData: PianoTrainerDomain.ScoreRawData, {
            fileName = 'Untitled Score', fileType = 'xml', libraryScoreId = null, title = null,
            originalRawData = undefined, originalFileName = undefined, originalFileType = undefined, skipTransposeReset = false
        }: PianoTrainerDomain.ScoreLoadOptions = {}) {
            try {
                ports.resetPlayback();
                if (!skipTransposeReset) ports.resetTempo();
                const resolvedOriginalRawData = originalRawData !== undefined ? originalRawData : rawData;
                const resolvedOriginalFileName = originalFileName !== undefined ? originalFileName : (fileName || 'Untitled Score');
                const resolvedOriginalFileType = originalFileType !== undefined ? originalFileType : (fileType || format.getScoreFileTypeFromName(fileName));
                const transposeSourceRawData = format.cloneScoreRawData(resolvedOriginalRawData);
                const osmdSourceRawData = format.cloneScoreRawData(rawData);
                const canonicalOriginalMusicXml = await format.getCanonicalMusicXmlForTranspose(transposeSourceRawData, {
                    fileName: resolvedOriginalFileName, fileType: resolvedOriginalFileType
                });
                const osmdLoadPayload = format.getOsmdLoadPayload(osmdSourceRawData, fileType, fileName);
                await ports.score.load(osmdLoadPayload);
                ports.render();
                ports.initSongUI();
                if (ports.score.hasCursor()) {
                    ports.score.reset(); ports.score.showCursor(); ports.score.updateCursor(); ports.scroll();
                }
                state.ledPreviewTimeline = [];
                state.ledPreviewTimelineDirty = true;
                state.ledPreviewTraversalIndex = -1;
                state.lastLedPreviewEvents = [];
                state.currentScoreData = rawData;
                state.currentScoreOriginalData = canonicalOriginalMusicXml || resolvedOriginalRawData;
                state.currentScoreFileName = fileName || 'Untitled Score';
                state.currentScoreOriginalFileName = resolvedOriginalFileName;
                state.currentScoreFileType = fileType || format.getScoreFileTypeFromName(fileName);
                state.currentScoreOriginalFileType = resolvedOriginalFileType;
                state.currentScoreLibraryId = libraryScoreId ?? null;
                state.currentScoreTitle = title || format.getScoreDisplayTitle(fileName || '');
                const library = libraryScoreId ? ports.getLibrary() : undefined;
                if (libraryScoreId && library) {
                    await library.markScoreOpened(libraryScoreId);
                    await ports.refreshLibrary();
                }
                ports.notifyTranspose(skipTransposeReset);
                ports.success();
            } catch (error) {
                ports.reportError(error);
                throw error;
            }
        }
        return {loadScoreIntoApp};
    }
}
