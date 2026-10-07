import {PianoTrainerLibraryView} from '../domain/library-view';
import type {PianoTrainerScoreLibrary} from '../score/score-library';
import type {PianoTrainerLibraryActions} from './library-actions';
import type {PianoTrainerLibraryControlsState} from './library-controls-state';
import type {PianoTrainerLibraryList} from './library-list';
// Existing score-library UI; native DOM and commands are isolated from practice.
export namespace PianoTrainerScoresDrawer {
    export interface Toolbar {
        closeToolbarPanel(panel: HTMLElement): void;
        showToolbarPanel(panel: HTMLElement): void;
    }
    export interface Ports {
        document: Document;
        window: Window;
        state: PianoTrainerLibraryControlsState.State;
        lifetime: PianoTrainerLibraryControlsState.Lifetime;
        library: PianoTrainerScoreLibrary.Service;
        rows: PianoTrainerLibraryList.Service;
        selection: PianoTrainerLibraryControlsState.Selection;
        getToolbar(): Toolbar | undefined;
        getScoreLibraryFolderLabel: typeof PianoTrainerScoreLibrary.getScoreLibraryFolderLabel;
        reportError(message: string, error?: unknown): void;
        reportWarning(message: string, error: unknown): void;
        actions: PianoTrainerLibraryActions.Service;
        positionScoresPanel(): void;
        openScoreFilePicker(): void;
    }
    export function create(ports: Ports) {
        const document = ports.document;
        const state = ports.state;
        const { createFoldersLibraryToolbar, createFolderListRow, createScoresLibraryToolbar, createScoreRow } = ports.rows;
        const { getFilteredLibraryScores } = PianoTrainerLibraryView;
        const { isScoreLibraryManageMode } = ports.selection;
        const { getScoreLibraryFolderLabel } = ports;
        function appendEmptyMessage(empty: HTMLElement, folderId: string | null, folders: Parameters<typeof getScoreLibraryFolderLabel>[1]) {
            if (folderId === '__all__') {
                empty.textContent = 'No saved scores yet. Add files to the library or save the current score.';
                return;
            }
            const name = document.createElement('span');
            name.textContent = getScoreLibraryFolderLabel(folderId, folders);
            if (folderId && folderId !== '__all__' && folderId !== '__unfiled__') name.setAttribute('data-i18n-skip', '');
            empty.append('No scores in ', name, ' yet.');
        }
        function optional<T extends HTMLElement>(id: string, type: {
            new (): T;
        }): T | null {
            const node = document.getElementById(id);
            if (node && !(node instanceof type))
                throw Error('Invalid score control: ' + id);
            return node;
        }
        const frames = new Set<number>();
        function requestOwnedFrame(callback: FrameRequestCallback) {
            const token = ports.lifetime.capture();
            if (!ports.lifetime.current(token))
                return 0;
            let id = 0;
            id = ports.window.requestAnimationFrame(time => {
                frames.delete(id);
                if (ports.lifetime.current(token))
                    callback(time);
            });
            frames.add(id);
            return id;
        }
        function closeScoresDrawer() {
            if (!ports.lifetime.current(ports.lifetime.capture()))
                return;
            const panel = document.getElementById('scores-panel');
            if (!panel)
                return;
            if (ports.getToolbar() && typeof ports.getToolbar()!.closeToolbarPanel === 'function') {
                ports.getToolbar()!.closeToolbarPanel(panel);
                return;
            }
            panel.classList.remove('is-open', 'is-closing');
            panel.classList.add('hidden');
        }
        function openScoresImportPicker() {
            if (!ports.lifetime.current(ports.lifetime.capture()))
                return;
            const input = optional('score-import-input', HTMLInputElement);
            if (!input)
                return;
            input.value = '';
            input.click();
        }
        function ensureScoresDrawerOpen() {
            if (!ports.lifetime.current(ports.lifetime.capture()))
                return;
            const panel = document.getElementById('scores-panel');
            if (!panel)
                return;
            if (ports.getToolbar() && typeof ports.getToolbar()!.showToolbarPanel === 'function') {
                ports.getToolbar()!.showToolbarPanel(panel);
                return;
            }
            panel.classList.remove('hidden', 'is-closing');
            requestOwnedFrame(() => {
                panel.classList.add('is-open');
            });
        }
        function updateScoresActionButtonsState() {
            if (!ports.lifetime.current(ports.lifetime.capture()))
                return;
            const btnSaveCurrent = optional('btn-scores-save-current', HTMLButtonElement);
            if (!btnSaveCurrent)
                return;
            btnSaveCurrent.disabled = state.currentScoreData == null;
            btnSaveCurrent.title = state.currentScoreData == null
                ? 'Open a score first, then save it into the library.'
                : 'Save the currently loaded score into your library.';
        }
        async function refreshScoresDrawer() {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
                return;
            const libraryList = document.getElementById('scores-library-list');
            updateScoresActionButtonsState();
            if (!libraryList)
                return;
            try {
                await ports.library.init();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                try {
                    await ports.library.importStarterLibraryOnce();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                }
                catch (err) {
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    ports.reportWarning('Could not import starter library', err);
                }
                const [folders, scores] = await Promise.all([
                    ports.library.getAllFolders(),
                    ports.library.getAllScores()
                ]);
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const validFolderIds = new Set(['__all__', '__unfiled__', ...folders.map(folder => folder.id)]);
                if (!validFolderIds.has(state.scoreLibrarySelectedFolderId!)) {
                    state.scoreLibrarySelectedFolderId = '__all__';
                }
                if (!['folders', 'scores'].includes(state.scoreLibraryView)) {
                    state.scoreLibraryView = 'folders';
                }
                ports.rows.dispose();
                libraryList.innerHTML = '';
                const isSplitView = ports.window.innerWidth >= 900;
                const filterOptions = [
                    { value: '__all__', label: 'All Scores' },
                    { value: '__unfiled__', label: 'Unfiled' },
                    ...folders.map(folder => ({ value: folder.id, label: folder.name || 'New Folder' }))
                ];
                const activeFolderId = state.scoreLibrarySelectedFolderId;
                const getFilteredScores = () => getFilteredLibraryScores(scores, activeFolderId);
                if (isSplitView) {
                    const shell = document.createElement('div');
                    shell.className = 'scores-split-shell';
                    libraryList.appendChild(shell);
                    const foldersPane = document.createElement('div');
                    foldersPane.className = 'scores-split-pane scores-split-folders';
                    shell.appendChild(foldersPane);
                    const foldersHeader = document.createElement('div');
                    foldersHeader.className = 'scores-split-pane-header scores-split-pane-header-row';
                    foldersHeader.appendChild(createFoldersLibraryToolbar({ folders, activeFolderId }));
                    foldersPane.appendChild(foldersHeader);
                    const foldersList = document.createElement('div');
                    foldersList.className = 'scores-split-list';
                    foldersPane.appendChild(foldersList);
                    filterOptions.forEach(option => {
                        foldersList.appendChild(createFolderListRow(option, {
                            activeFolderId,
                            folders,
                            showQuickAction: true
                        }));
                    });
                    const scoresPane = document.createElement('div');
                    scoresPane.className = 'scores-split-pane scores-split-scores';
                    shell.appendChild(scoresPane);
                    const filteredScores = getFilteredScores();
                    const scoresHeader = document.createElement('div');
                    scoresHeader.className = 'scores-split-pane-header scores-split-pane-header-summary';
                    const summaryFolder = document.createElement('span');
                    summaryFolder.textContent = getScoreLibraryFolderLabel(activeFolderId, folders);
                    if (activeFolderId && activeFolderId !== '__all__' && activeFolderId !== '__unfiled__') summaryFolder.setAttribute('data-i18n-skip', '');
                    scoresHeader.append(`${filteredScores.length} score${filteredScores.length === 1 ? '' : 's'} • `, summaryFolder);
                    scoresPane.appendChild(scoresHeader);
                    const scoresList = document.createElement('div');
                    scoresList.className = 'scores-split-list';
                    scoresPane.appendChild(scoresList);
                    scoresList.appendChild(createScoresLibraryToolbar({
                        filteredScores,
                        folders,
                        activeFolderId
                    }));
                    if (!filteredScores.length) {
                        const empty = document.createElement('div');
                        empty.className = 'scores-folder-empty';
                        appendEmptyMessage(empty, activeFolderId, folders);
                        scoresList.appendChild(empty);
                    }
                    else {
                        filteredScores.forEach(score => scoresList.appendChild(createScoreRow(score, { manageMode: isScoreLibraryManageMode() })));
                    }
                    return;
                }
                const browserShell = document.createElement('div');
                browserShell.className = 'scores-browser-shell';
                libraryList.appendChild(browserShell);
                const browserHeader = document.createElement('div');
                browserHeader.className = 'scores-browser-header';
                browserShell.appendChild(browserHeader);
                const browserBody = document.createElement('div');
                browserBody.className = 'scores-browser-body';
                browserShell.appendChild(browserBody);
                if (state.scoreLibraryView === 'folders') {
                    const title = document.createElement('div');
                    title.className = 'scores-browser-title';
                    title.textContent = 'Folders';
                    browserHeader.appendChild(title);
                    browserBody.appendChild(createFoldersLibraryToolbar({
                        folders,
                        activeFolderId
                    }));
                    const folderList = document.createElement('div');
                    folderList.className = 'scores-browser-list';
                    browserBody.appendChild(folderList);
                    filterOptions.forEach(option => {
                        folderList.appendChild(createFolderListRow(option, {
                            activeFolderId,
                            folders,
                            showQuickAction: true
                        }));
                    });
                    return;
                }
                const backButton = document.createElement('button');
                backButton.type = 'button';
                backButton.className = 'scores-browser-back';
                backButton.textContent = '← Back';
                backButton.addEventListener('click', async () => {
                    const uiGeneration = ports.lifetime.capture();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    state.scoreLibraryView = 'folders';
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                });
                browserHeader.appendChild(backButton);
                const title = document.createElement('div');
                title.className = 'scores-browser-title';
                title.textContent = getScoreLibraryFolderLabel(activeFolderId, folders);
                if (activeFolderId && activeFolderId !== '__all__' && activeFolderId !== '__unfiled__') title.setAttribute('data-i18n-skip', '');
                browserHeader.appendChild(title);
                const filteredScores = getFilteredScores();
                browserBody.appendChild(createScoresLibraryToolbar({
                    filteredScores,
                    folders,
                    activeFolderId
                }));
                const scoresList = document.createElement('div');
                scoresList.className = 'scores-browser-list';
                browserBody.appendChild(scoresList);
                if (!filteredScores.length) {
                    const empty = document.createElement('div');
                    empty.className = 'scores-folder-empty';
                    appendEmptyMessage(empty, activeFolderId, folders);
                    scoresList.appendChild(empty);
                }
                else {
                    filteredScores.forEach(score => scoresList.appendChild(createScoreRow(score, { manageMode: isScoreLibraryManageMode() })));
                }
            }
            catch (err) {
                if (!ports.lifetime.current(uiGeneration))
                    return;
                ports.reportError('Could not refresh scores drawer', err);
                ports.rows.dispose();
                libraryList.innerHTML = '<div class="scores-empty-state">Could not load the library.</div>';
            }
        }
        let initialized = false, resizeFrame: number | null = null;
        const bindings: {
            target: EventTarget;
            event: string;
            handler: EventListener;
            marker?: string;
        }[] = [];
        function bind(node: HTMLElement | null, event: string, marker: string, handler: EventListener) {
            if (!node || node.dataset[marker])
                return;
            node.dataset[marker] = 'true';
            node.addEventListener(event, handler);
            bindings.push({ target: node, event, handler, marker });
        }
        const onPositionResize = () => { if (ports.lifetime.current(ports.lifetime.capture()))
            ports.positionScoresPanel(); };
        const onLayoutResize = () => {
            if (!ports.lifetime.current(ports.lifetime.capture()))
                return;
            if (resizeFrame) {
                ports.window.cancelAnimationFrame(resizeFrame);
                frames.delete(resizeFrame);
            }
            resizeFrame = requestOwnedFrame(() => { resizeFrame = null; void refreshScoresDrawer(); });
        };
        function init() {
            if (initialized)
                return;
            initialized = true;
            const btnOpen = optional('btn-scores-open-file', HTMLButtonElement), btnImport = optional('btn-scores-import-files', HTMLButtonElement), btnSave = optional('btn-scores-save-current', HTMLButtonElement), btnExport = optional('btn-scores-export-library', HTMLButtonElement), btnBackup = optional('btn-scores-import-library', HTMLButtonElement), input = optional('score-import-input', HTMLInputElement), backup = optional('library-backup-input', HTMLInputElement);
            bind(btnOpen, 'click', 'boundScoresOpen', () => {
                ports.openScoreFilePicker();
            });
            if (input)
                bind(btnImport, 'click', 'boundScoresImport', openScoresImportPicker);
            bind(input, 'change', 'boundScoresImportInput', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const token = ports.lifetime.capture();
                try {
                    await ports.actions.importFilesToLibrary(input!.files);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                }
                finally {
                    if (ports.lifetime.current(token))
                        input!.value = '';
                }
            });
            bind(btnSave, 'click', 'boundScoresSaveCurrent', ports.actions.saveCurrentScoreToLibrary);
            bind(btnExport, 'click', 'boundScoresExportLibrary', ports.actions.exportScoreLibraryBackup);
            if (backup)
                bind(btnBackup, 'click', 'boundScoresImportLibrary', () => { backup.value = ''; backup.click(); });
            bind(backup, 'change', 'boundScoresBackupInput', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const token = ports.lifetime.capture();
                try {
                    const [file] = backup!.files || [];
                    await ports.actions.importScoreLibraryBackupFile(file);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                }
                finally {
                    if (ports.lifetime.current(token))
                        backup!.value = '';
                }
            });
            ports.positionScoresPanel();
            ports.window.addEventListener('resize', onPositionResize);
            bindings.push({ target: ports.window, event: 'resize', handler: onPositionResize });
            void refreshScoresDrawer();
            ports.window.addEventListener('resize', onLayoutResize);
            bindings.push({ target: ports.window, event: 'resize', handler: onLayoutResize });
        }
        function dispose() {
            if (initialized) {
                initialized = false;
                for (const { target, event, handler, marker } of bindings) {
                    target.removeEventListener(event, handler);
                    if (marker && target instanceof HTMLElement && target.dataset[marker] === 'true')
                        delete target.dataset[marker];
                }
                bindings.length = 0;
            }
            for (const id of frames)
                ports.window.cancelAnimationFrame(id);
            frames.clear();
            resizeFrame = null;
        }
        return { closeScoresDrawer, openScoresImportPicker, ensureScoresDrawerOpen, updateScoresActionButtonsState, refreshScoresDrawer, init, dispose };
    }
    export type Service = ReturnType<typeof create>;
}
