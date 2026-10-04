import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerMusicXmlIO} from './musicxml-io';
import type {LegacyAppState} from '../state/model';
// Preserve load effects and promise completion. Raw MXL remains the render source.
export namespace PianoTrainerScoreLoader {
    export type State = Pick<LegacyAppState, 'ledPreviewTimeline' | 'ledPreviewTimelineDirty' | 'ledPreviewTraversalIndex' |
        'lastLedPreviewEvents' | 'currentScoreData' | 'currentScoreOriginalData' | 'currentScoreFileName' |
        'currentScoreOriginalFileName' | 'currentScoreFileType' | 'currentScoreOriginalFileType' | 'currentScoreLibraryId' | 'currentScoreTitle'>;
    export interface Ports {
        beginLoad?(): void;
        prepareDisplay?(rawData: PianoTrainerDomain.ScoreRawData, options: PianoTrainerDomain.ScoreLoadOptions, isActive: () => boolean): Promise<void>;
        state: State; format: PianoTrainerMusicXmlIO.Service;
        score: {load(rawData: PianoTrainerDomain.ScoreRawData): Promise<unknown>; hasCursor(): boolean; reset(): void; showCursor(): void; updateCursor(): void};
        resetPlayback(): void; resetTempo(): void; render(): void; initSongUI(): void; scroll(): void;
        getLibrary(): {markScoreOpened(id: string): Promise<unknown>} | undefined;
        refreshLibrary(): Promise<void>; notifyTranspose(skipReset: boolean): void;
        success(): void; reportError(error: unknown): void;
    }
    export function create(ports: Ports) {
        const state = ports.state, format = ports.format;
        let disposed = false;
        let generation = 0, vendorLoad: Promise<unknown> = Promise.resolve();
        function assertActive(token: number) {
            if (disposed || token !== generation) throw new DOMException('Score loading expired.', 'AbortError');
        }
        async function loadScoreIntoApp(rawData: PianoTrainerDomain.ScoreRawData, {
            fileName = 'Untitled Score', fileType = 'xml', libraryScoreId = null, title = null,
            originalRawData = undefined, originalFileName = undefined, originalFileType = undefined, skipTransposeReset = false
        }: PianoTrainerDomain.ScoreLoadOptions = {}) {
            const token = ++generation;
            try {
                assertActive(token);
                ports.beginLoad?.();
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
                assertActive(token);
                const osmdLoadPayload = format.getOsmdLoadPayload(osmdSourceRawData, fileType, fileName);
                const load = vendorLoad.then(() => {assertActive(token); return ports.score.load(osmdLoadPayload);});
                vendorLoad = load.catch(() => {});
                await load;
                assertActive(token);
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
                await ports.prepareDisplay?.(rawData, {fileName, fileType}, () => !disposed && token === generation);
                assertActive(token);
                const library = libraryScoreId ? ports.getLibrary() : undefined;
                if (libraryScoreId && library) {
                    await library.markScoreOpened(libraryScoreId);
                    assertActive(token);
                    await ports.refreshLibrary();
                    assertActive(token);
                }
                ports.notifyTranspose(skipTransposeReset);
                ports.success();
            } catch (error) {
                if (!disposed && token === generation) ports.reportError(error);
                throw error;
            }
        }
        function dispose() { disposed = true; generation++; }
        return {loadScoreIntoApp, dispose};
    }
}
