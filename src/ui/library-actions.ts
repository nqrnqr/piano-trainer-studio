import {PianoTrainerDomain} from '../domain/model';
import {PianoTrainerMusicXmlIO} from '../score/musicxml-io';
import {PianoTrainerScoreConversion} from '../score/score-conversion';
import {PianoTrainerScoreLibrary} from '../score/score-library';
import {PianoTrainerLibraryControlsState} from './library-controls-state';
import {PianoTrainerLibraryDialogs} from './library-dialogs';
// Existing score-library UI; native DOM and commands are isolated from practice.
export namespace PianoTrainerLibraryActions {
    export interface Ports {
        lifetime: PianoTrainerLibraryControlsState.Lifetime;
        state: PianoTrainerLibraryControlsState.State;
        document: Document;
        library: PianoTrainerScoreLibrary.Service;
        selection: PianoTrainerLibraryControlsState.Selection;
        format: Pick<PianoTrainerMusicXmlIO.Service, 'getScoreDisplayTitle' | 'getScoreFileTypeFromName'>;
        prompt(message: string, value?: string): string | null;
        alert(message: unknown): void;
        reportError(message: string, error?: unknown): void;
        dialogs: PianoTrainerLibraryDialogs.Service;
        refreshScoresDrawer(): Promise<void>;
        ensureScoresDrawerOpen(): void;
        getConverter(): PianoTrainerScoreConversion.Service | undefined;
        readScoreFile(file: File): Promise<PianoTrainerDomain.ScoreFile>;
        now(): number;
        url: Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;
    }
    export function create(ports: Ports) {
        const document = ports.document;
        const state = ports.state;
        const {setFolderLibraryManageMode,setScoreLibraryManageMode} = ports.selection;
        const { getScoreDisplayTitle, getScoreFileTypeFromName } = ports.format;
        const { promptForLibraryFolderChoice } = ports.dialogs;
        const { refreshScoresDrawer, ensureScoresDrawerOpen, readScoreFile } = ports;
        async function importFilesToLibrary(files: FileList | readonly File[] | null | undefined) {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
                return;
            const incoming = Array.from(files || []).filter(Boolean);
            if (!incoming.length)
                return;
            try {
                const folders = await ports.library.getAllFolders();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const selectedFolderId = await promptForLibraryFolderChoice({
                    title: 'Add files to which folder?',
                    folders
                });
                if (!ports.lifetime.current(uiGeneration))
                    return;
                if (selectedFolderId === '__cancel__')
                    return;
                for (const file of incoming) {
                    const useConverter = ports.getConverter() && typeof ports.getConverter()!.isConverterImportFileName === 'function'
                        && ports.getConverter()!.isConverterImportFileName(file.name || '');
                    const scoreFile = useConverter
                        ? await ports.getConverter()!.convertFileToScore(file)
                        : await readScoreFile(file);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    await ports.library.saveScore({
                        title: scoreFile.title,
                        folderId: selectedFolderId,
                        fileName: scoreFile.fileName,
                        fileType: scoreFile.fileType,
                        rawData: scoreFile.rawData
                    });
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                }
                setScoreLibraryManageMode(false);
                setFolderLibraryManageMode(false);
                state.scoreLibrarySelectedFolderId = selectedFolderId ?? '__unfiled__';
                state.scoreLibraryView = 'scores';
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                ensureScoresDrawerOpen();
            }
            catch (err) {
                if (!ports.lifetime.current(uiGeneration))
                    return;
                ports.reportError('Could not import score files', err);
                ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not import one or more score files.'));
            }
        }
        async function saveCurrentScoreToLibrary() {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
                return;
            if (state.currentScoreData == null) {
                ports.alert('Load a score first, then save it to the library.');
                return;
            }
            const defaultTitle = state.currentScoreTitle || getScoreDisplayTitle(state.currentScoreFileName || 'Untitled Score');
            const title = ports.prompt('Save to library as:', defaultTitle);
            if (title == null)
                return;
            try {
                const folders = await ports.library.getAllFolders();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const selectedFolderId = await promptForLibraryFolderChoice({
                    title: 'Save into which folder?',
                    folders
                });
                if (!ports.lifetime.current(uiGeneration))
                    return;
                if (selectedFolderId === '__cancel__')
                    return;
                const saved = await ports.library.saveScore({
                    title,
                    folderId: selectedFolderId,
                    fileName: state.currentScoreFileName || `${title}.xml`,
                    fileType: state.currentScoreFileType || getScoreFileTypeFromName(state.currentScoreFileName || ''),
                    rawData: state.currentScoreData,
                    lastOpenedAt: ports.now()
                });
                if (!ports.lifetime.current(uiGeneration))
                    return;
                state.currentScoreLibraryId = saved.id;
                state.currentScoreTitle = saved.title;
                setScoreLibraryManageMode(false);
                setFolderLibraryManageMode(false);
                state.scoreLibrarySelectedFolderId = selectedFolderId ?? '__unfiled__';
                state.scoreLibraryView = 'scores';
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            }
            catch (err) {
                if (!ports.lifetime.current(uiGeneration))
                    return;
                ports.reportError('Could not save current score', err);
                ports.alert('Could not save the current score to the library.');
            }
        }
        async function createLibraryFolder() {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
                return;
            const folderName = ports.prompt('New folder name:');
            if (folderName == null)
                return;
            try {
                const folder = await ports.library.createFolder(folderName);
                if (!ports.lifetime.current(uiGeneration))
                    return;
                setFolderLibraryManageMode(false);
                state.scoreLibrarySelectedFolderId = folder.id;
                state.scoreLibraryView = 'scores';
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            }
            catch (err) {
                if (!ports.lifetime.current(uiGeneration))
                    return;
                ports.reportError('Could not create library folder', err);
                ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not create that folder.'));
            }
        }
        async function exportScoreLibraryBackup() {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
                return;
            try {
                const payload = await ports.library.exportBackup();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = ports.url.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Scores-Library-Backup.json';
                link.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
                document.body.appendChild(link);
                link.click();
                link.remove();
                ports.url.revokeObjectURL(url);
            }
            catch (err) {
                if (!ports.lifetime.current(uiGeneration))
                    return;
                ports.reportError('Could not export score library', err);
                ports.alert('Could not export the library backup.');
            }
        }
        async function importScoreLibraryBackupFile(file: File | null | undefined) {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
                return;
            if (!file)
                return;
            try {
                const text = await file.text();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const payload: unknown = JSON.parse(text);
                await ports.library.importBackup(payload);
                if (!ports.lifetime.current(uiGeneration))
                    return;
                setScoreLibraryManageMode(false);
                setFolderLibraryManageMode(false);
                state.scoreLibraryView = 'folders';
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            }
            catch (err) {
                if (!ports.lifetime.current(uiGeneration))
                    return;
                ports.reportError('Could not import library backup', err);
                ports.alert('Invalid library backup file.');
            }
        }
        return { importFilesToLibrary, saveCurrentScoreToLibrary, createLibraryFolder, exportScoreLibraryBackup, importScoreLibraryBackupFile };
    }
    export type Service = ReturnType<typeof create>;
}
