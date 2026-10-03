// Existing score-library UI; native DOM and commands are isolated from practice.
namespace PianoTrainerLibraryList {
    type Folder = PianoTrainerDomain.LibraryFolder;
    type Score = PianoTrainerDomain.LibraryScore;
    export interface FolderOption {
        value: string | null;
        label: string;
    }
    export interface Ports {
        lifetime: PianoTrainerLibraryControlsState.Lifetime;
        state: PianoTrainerLibraryControlsState.State;
        document: Document;
        library: PianoTrainerScoreLibrary.Service;
        selection: PianoTrainerLibraryControlsState.Selection;
        format: Pick<PianoTrainerMusicXmlIO.Service, 'getScoreDisplayTitle'>;
        prompt(message: string, value?: string): string | null;
        alert(message: unknown): void;
        confirm(message: string): boolean;
        reportError(message: string, error?: unknown): void;
        window: Window;
        dialogs: PianoTrainerLibraryDialogs.Service;
        refreshScoresDrawer(): Promise<void>;
        createLibraryFolder(): Promise<void>;
        openScoresImportPicker(): void;
        closeScoresDrawer(): void;
        loadScoreIntoApp(raw: PianoTrainerDomain.ScoreRawData, options: PianoTrainerDomain.ScoreLoadOptions): Promise<void>;
        getScoreLibraryFolderLabel: typeof PianoTrainerScoreLibrary.getScoreLibraryFolderLabel;
    }
    export function create(ports: Ports) {
        const document = ports.document;
        const rowBindings: {
            node: HTMLElement;
            event: string;
            handler: EventListener;
        }[] = [];
        function bind(node: HTMLElement, event: string, handler: EventListener) { node.addEventListener(event, handler); rowBindings.push({ node, event, handler }); }
        function dispose() { for (const { node, event, handler } of rowBindings)
            node.removeEventListener(event, handler); rowBindings.length = 0; }
        const state = ports.state;
        const { getFolderLibrarySelectionSet, setFolderLibrarySelection, clearFolderLibrarySelection, isFolderLibraryManageMode, setFolderLibraryManageMode, toggleFolderLibrarySelection, getScoreLibrarySelectionSet, setScoreLibrarySelection, isScoreLibraryManageMode, setScoreLibraryManageMode, toggleScoreLibrarySelection } = ports.selection;
        const { getScoreDisplayTitle } = ports.format;
        const { buildActionMenu, promptForLibraryFolderChoice } = ports.dialogs;
        const { refreshScoresDrawer, createLibraryFolder, openScoresImportPicker, closeScoresDrawer, loadScoreIntoApp, getScoreLibraryFolderLabel } = ports;
        const { shouldShowScoreFileName } = PianoTrainerLibraryView;
        function isSystemFolderOption(folderId: string | null) {
            return folderId === '__all__' || folderId === '__unfiled__' || folderId == null;
        }
        function showFolderRowActionMenu(folder: Folder) {
            return buildActionMenu({
                titleText: String(folder?.name || 'New Folder').trim() || 'New Folder',
                items: [
                    { value: 'rename', label: 'Rename' },
                    { value: 'delete', label: 'Delete', danger: true }
                ]
            });
        }
        function createFoldersLibraryToolbar({ folders = [], activeFolderId = '__all__' }: {
            folders?: Folder[];
            activeFolderId?: string | null;
        } = {}) {
            const toolbar = document.createElement('div');
            const realFolders = (folders || []).filter(folder => folder && folder.id);
            const manageMode = isFolderLibraryManageMode();
            toolbar.className = `scores-library-toolbar${manageMode ? ' is-manage-mode' : ''}`;
            const info = document.createElement('div');
            info.className = 'scores-library-toolbar-info';
            toolbar.appendChild(info);
            const actions = document.createElement('div');
            actions.className = 'scores-library-toolbar-actions';
            toolbar.appendChild(actions);
            const selectedSet = getFolderLibrarySelectionSet();
            const selectedCount = selectedSet.size;
            if (!manageMode) {
                info.textContent = 'Folders';
                const newFolderBtn = document.createElement('button');
                newFolderBtn.type = 'button';
                newFolderBtn.className = 'scores-toolbar-button';
                newFolderBtn.textContent = 'New Folder';
                bind(newFolderBtn, 'click', createLibraryFolder);
                actions.appendChild(newFolderBtn);
                const manageBtn = document.createElement('button');
                manageBtn.type = 'button';
                manageBtn.className = 'scores-toolbar-button';
                manageBtn.textContent = 'Manage';
                manageBtn.disabled = realFolders.length === 0;
                bind(manageBtn, 'click', async () => {
                    const uiGeneration = ports.lifetime.capture();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    setFolderLibraryManageMode(true);
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                });
                actions.appendChild(manageBtn);
                return toolbar;
            }
            info.textContent = selectedCount > 0
                ? `${selectedCount} selected`
                : 'Select folders to delete';
            const selectAllBtn = document.createElement('button');
            selectAllBtn.type = 'button';
            selectAllBtn.className = 'scores-toolbar-button';
            const allVisibleSelected = realFolders.length > 0 && realFolders.every(folder => selectedSet.has(folder.id));
            selectAllBtn.textContent = allVisibleSelected ? 'Deselect All' : 'Select All';
            bind(selectAllBtn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                if (allVisibleSelected) {
                    clearFolderLibrarySelection();
                }
                else {
                    setFolderLibrarySelection(realFolders.map(folder => folder.id));
                }
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            });
            actions.appendChild(selectAllBtn);
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'scores-toolbar-button scores-toolbar-button-danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.disabled = selectedCount === 0;
            bind(deleteBtn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const selectedIds = Array.from(getFolderLibrarySelectionSet());
                if (!selectedIds.length)
                    return;
                const selectedFolders = realFolders.filter(folder => selectedIds.includes(folder.id));
                const selectedScores = (await ports.library.getAllScores()).filter(score => selectedIds.includes(score.folderId!));
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const confirmed = ports.confirm(`Delete ${selectedFolders.length} selected folder${selectedFolders.length === 1 ? '' : 's'}? ` +
                    `Any scores inside ${selectedFolders.length === 1 ? 'it will' : 'them will'} also be deleted.`);
                if (!confirmed)
                    return;
                try {
                    await ports.library.deleteFoldersAndScores(selectedIds);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    if (state.currentScoreLibraryId && selectedScores.some(score => score.id === state.currentScoreLibraryId)) {
                        state.currentScoreLibraryId = null;
                    }
                    if (selectedIds.includes(state.scoreLibrarySelectedFolderId!)) {
                        state.scoreLibrarySelectedFolderId = '__all__';
                    }
                    setFolderLibraryManageMode(false);
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                }
                catch (err) {
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    ports.reportError('Could not delete selected folders', err);
                    ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not delete the selected folders.'));
                }
            });
            actions.appendChild(deleteBtn);
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'scores-toolbar-button';
            cancelBtn.textContent = 'Cancel';
            bind(cancelBtn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                setFolderLibraryManageMode(false);
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            });
            actions.appendChild(cancelBtn);
            return toolbar;
        }
        function createFolderListRow(option: FolderOption, { activeFolderId = '__all__', folders = [], showQuickAction = true }: {
            activeFolderId?: string | null;
            folders?: Folder[];
            showQuickAction?: boolean;
        } = {}) {
            const isManageMode = isFolderLibraryManageMode();
            const isSystem = isSystemFolderOption(option.value);
            const isActive = String(activeFolderId) === String(option.value);
            if (isManageMode && !isSystem) {
                const selectedSet = getFolderLibrarySelectionSet();
                const row = document.createElement('button');
                row.type = 'button';
                row.className = 'scores-folder-list-item scores-manage-row-button';
                row.setAttribute('aria-pressed', selectedSet.has(option.value!) ? 'true' : 'false');
                if (selectedSet.has(option.value!))
                    row.classList.add('is-selected');
                const indicator = document.createElement('span');
                indicator.className = 'scores-select-indicator';
                indicator.textContent = selectedSet.has(option.value!) ? '✓' : '';
                row.appendChild(indicator);
                const label = document.createElement('span');
                label.textContent = option.label;
                row.appendChild(label);
                bind(row, 'click', async () => {
                    const uiGeneration = ports.lifetime.capture();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    toggleFolderLibrarySelection(option.value!);
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                });
                return row;
            }
            const row = document.createElement('div');
            row.className = 'scores-item-row';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'scores-folder-list-item';
            if (isActive)
                btn.classList.add('is-active');
            btn.textContent = option.label;
            bind(btn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                state.scoreLibrarySelectedFolderId = option.value;
                state.scoreLibraryView = 'scores';
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            });
            row.appendChild(btn);
            if (!showQuickAction || isSystem || isManageMode) {
                return row;
            }
            const folder = (folders || []).find(item => item.id === option.value);
            if (!folder)
                return row;
            const actionBtn = document.createElement('button');
            actionBtn.type = 'button';
            actionBtn.className = 'scores-row-action-button';
            actionBtn.setAttribute('aria-label', `Actions for folder ${option.label}`);
            actionBtn.textContent = '⋯';
            bind(actionBtn, 'click', async (e) => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                e.preventDefault();
                e.stopPropagation();
                const action = await showFolderRowActionMenu(folder);
                if (!ports.lifetime.current(uiGeneration))
                    return;
                if (action === 'rename') {
                    const nextName = ports.prompt('Rename folder:', folder.name || 'New Folder');
                    if (nextName == null)
                        return;
                    try {
                        await ports.library.renameFolder(folder.id, nextName);
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        await refreshScoresDrawer();
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                    }
                    catch (err) {
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        ports.reportError('Could not rename folder', err);
                        ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not rename that folder.'));
                    }
                    return;
                }
                if (action === 'delete') {
                    const folderScores = (await ports.library.getAllScores()).filter(score => score.folderId === folder.id);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    const confirmed = ports.confirm(`Delete folder "${folder.name || 'New Folder'}"? ` +
                        `${folderScores.length ? `This will also delete ${folderScores.length} score${folderScores.length === 1 ? '' : 's'} inside it.` : 'This cannot be undone.'}`);
                    if (!confirmed)
                        return;
                    try {
                        await ports.library.deleteFolderAndScores(folder.id);
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        if (state.currentScoreLibraryId && folderScores.some(score => score.id === state.currentScoreLibraryId)) {
                            state.currentScoreLibraryId = null;
                        }
                        if (state.scoreLibrarySelectedFolderId === folder.id) {
                            state.scoreLibrarySelectedFolderId = '__all__';
                        }
                        await refreshScoresDrawer();
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                    }
                    catch (err) {
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        ports.reportError('Could not delete folder', err);
                        ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not delete that folder.'));
                    }
                }
            });
            row.appendChild(actionBtn);
            return row;
        }
        function formatScorePaneSummary(folderId: string | null, folders: Folder[], scoreCount: number) {
            const countLabel = `${scoreCount} score${scoreCount === 1 ? '' : 's'}`;
            const folderLabel = getScoreLibraryFolderLabel(folderId, folders);
            return `${countLabel} • ${folderLabel}`;
        }
        function createScoresLibraryToolbar({ filteredScores = [], folders = [], activeFolderId = '__all__' }: {
            filteredScores?: Score[];
            folders?: Folder[];
            activeFolderId?: string | null;
        } = {}) {
            const toolbar = document.createElement('div');
            const manageMode = isScoreLibraryManageMode();
            toolbar.className = `scores-library-toolbar${manageMode ? ' is-manage-mode' : ''}`;
            const info = document.createElement('div');
            info.className = 'scores-library-toolbar-info';
            toolbar.appendChild(info);
            const actions = document.createElement('div');
            actions.className = 'scores-library-toolbar-actions';
            toolbar.appendChild(actions);
            const selectedSet = getScoreLibrarySelectionSet();
            const selectedCount = selectedSet.size;
            if (!manageMode) {
                info.textContent = '';
                const addFilesBtn = document.createElement('button');
                addFilesBtn.type = 'button';
                addFilesBtn.className = 'scores-toolbar-button';
                addFilesBtn.textContent = 'Add File(s)';
                bind(addFilesBtn, 'click', openScoresImportPicker);
                actions.appendChild(addFilesBtn);
                const manageBtn = document.createElement('button');
                manageBtn.type = 'button';
                manageBtn.className = 'scores-toolbar-button';
                manageBtn.textContent = 'Manage';
                bind(manageBtn, 'click', async () => {
                    const uiGeneration = ports.lifetime.capture();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    setScoreLibraryManageMode(true);
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                });
                actions.appendChild(manageBtn);
                return toolbar;
            }
            info.textContent = selectedCount > 0
                ? `${selectedCount} selected`
                : 'Select scores to move or delete';
            const selectAllBtn = document.createElement('button');
            selectAllBtn.type = 'button';
            selectAllBtn.className = 'scores-toolbar-button';
            const allVisibleSelected = filteredScores.length > 0 && filteredScores.every(score => selectedSet.has(score.id));
            selectAllBtn.textContent = allVisibleSelected ? 'Deselect All' : 'Select All';
            bind(selectAllBtn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                if (allVisibleSelected) {
                    const next = getScoreLibrarySelectionSet();
                    filteredScores.forEach(score => next.delete(score.id));
                    setScoreLibrarySelection(Array.from(next));
                }
                else {
                    const next = getScoreLibrarySelectionSet();
                    filteredScores.forEach(score => next.add(score.id));
                    setScoreLibrarySelection(Array.from(next));
                }
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            });
            actions.appendChild(selectAllBtn);
            const moveBtn = document.createElement('button');
            moveBtn.type = 'button';
            moveBtn.className = 'scores-toolbar-button';
            moveBtn.textContent = 'Move';
            moveBtn.disabled = selectedCount === 0;
            bind(moveBtn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const selectedIds = Array.from(getScoreLibrarySelectionSet());
                if (!selectedIds.length)
                    return;
                const selectedFolderId = await promptForLibraryFolderChoice({
                    title: `Move ${selectedIds.length} selected score${selectedIds.length === 1 ? '' : 's'} to which folder?`,
                    folders
                });
                if (!ports.lifetime.current(uiGeneration))
                    return;
                if (selectedFolderId === '__cancel__')
                    return;
                try {
                    await ports.library.moveScoresToFolder(selectedIds, selectedFolderId);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    setScoreLibraryManageMode(false);
                    state.scoreLibrarySelectedFolderId = selectedFolderId ?? '__unfiled__';
                    state.scoreLibraryView = ports.window.innerWidth >= 900 ? 'folders' : 'scores';
                    if (state.currentScoreLibraryId && selectedIds.includes(state.currentScoreLibraryId)) {
                        const moved = await ports.library.getScoreById(state.currentScoreLibraryId);
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        if (moved)
                            state.currentScoreTitle = moved.title || state.currentScoreTitle;
                    }
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                }
                catch (err) {
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    ports.reportError('Could not move selected scores', err);
                    ports.alert('Could not move the selected scores.');
                }
            });
            actions.appendChild(moveBtn);
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'scores-toolbar-button scores-toolbar-button-danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.disabled = selectedCount === 0;
            bind(deleteBtn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                const selectedIds = Array.from(getScoreLibrarySelectionSet());
                if (!selectedIds.length)
                    return;
                const confirmed = ports.confirm(`Delete ${selectedIds.length} selected score${selectedIds.length === 1 ? '' : 's'}? This cannot be undone.`);
                if (!confirmed)
                    return;
                try {
                    await ports.library.deleteScores(selectedIds);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    if (state.currentScoreLibraryId && selectedIds.includes(state.currentScoreLibraryId)) {
                        state.currentScoreLibraryId = null;
                    }
                    setScoreLibraryManageMode(false);
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                }
                catch (err) {
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    ports.reportError('Could not delete selected scores', err);
                    ports.alert('Could not delete the selected scores.');
                }
            });
            actions.appendChild(deleteBtn);
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'scores-toolbar-button';
            cancelBtn.textContent = 'Cancel';
            bind(cancelBtn, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                setScoreLibraryManageMode(false);
                await refreshScoresDrawer();
                if (!ports.lifetime.current(uiGeneration))
                    return;
            });
            actions.appendChild(cancelBtn);
            return toolbar;
        }
        function showScoreRowActionMenu(score: Score) {
            return buildActionMenu({
                titleText: String(score?.title || getScoreDisplayTitle(score?.fileName || '') || 'Untitled Score').trim() || 'Untitled Score',
                items: [
                    { value: 'rename', label: 'Rename' },
                    { value: 'move', label: 'Move' },
                    { value: 'delete', label: 'Delete', danger: true }
                ]
            });
        }
        function createScoreRow(score: Score, { compact = false, manageMode = false }: {
            compact?: boolean;
            manageMode?: boolean;
        } = {}) {
            const resolvedTitle = String(score.title || getScoreDisplayTitle(score.fileName || '') || 'Untitled Score').trim() || 'Untitled Score';
            const resolvedFileName = String(score.fileName || '').trim();
            const showFileNameMeta = shouldShowScoreFileName(resolvedTitle, resolvedFileName);
            const metaText = showFileNameMeta ? resolvedFileName : '';
            const buildRowContent = ({ includeLoadedBadge = false } = {}) => {
                const content = document.createElement('div');
                content.className = 'scores-item-content';
                const title = document.createElement('div');
                title.className = 'scores-item-title';
                title.textContent = resolvedTitle;
                content.appendChild(title);
                if (metaText) {
                    const meta = document.createElement('div');
                    meta.className = 'scores-item-meta';
                    meta.textContent = metaText;
                    content.appendChild(meta);
                }
                if (includeLoadedBadge) {
                    const badge = document.createElement('div');
                    badge.className = 'scores-item-badge';
                    badge.textContent = 'Loaded';
                    content.appendChild(badge);
                }
                return content;
            };
            if (manageMode) {
                const selectedSet = getScoreLibrarySelectionSet();
                const row = document.createElement('button');
                row.type = 'button';
                row.className = `${compact ? 'scores-item-button is-compact' : 'scores-item-button'} scores-manage-row-button`;
                row.setAttribute('aria-pressed', selectedSet.has(score.id) ? 'true' : 'false');
                if (selectedSet.has(score.id))
                    row.classList.add('is-selected');
                const indicator = document.createElement('span');
                indicator.className = 'scores-select-indicator';
                indicator.textContent = selectedSet.has(score.id) ? '✓' : '';
                row.appendChild(indicator);
                row.appendChild(buildRowContent());
                bind(row, 'click', async () => {
                    const uiGeneration = ports.lifetime.capture();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    toggleScoreLibrarySelection(score.id);
                    await refreshScoresDrawer();
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                });
                return row;
            }
            const row = document.createElement('div');
            row.className = 'scores-item-row';
            const button = document.createElement('button');
            button.type = 'button';
            button.className = compact ? 'scores-item-button is-compact' : 'scores-item-button';
            const isLoaded = !!(state.currentScoreLibraryId && score.id === state.currentScoreLibraryId);
            if (isLoaded) {
                button.classList.add('is-loaded');
            }
            button.appendChild(buildRowContent({ includeLoadedBadge: isLoaded }));
            bind(button, 'click', async () => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                try {
                    const fullScore = await ports.library.getScoreById(score.id);
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    if (!fullScore)
                        return;
                    await loadScoreIntoApp(fullScore.rawData, {
                        fileName: fullScore.fileName,
                        fileType: fullScore.fileType,
                        libraryScoreId: fullScore.id,
                        title: fullScore.title
                    });
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    closeScoresDrawer();
                }
                catch (err) {
                    if (!ports.lifetime.current(uiGeneration))
                        return;
                    ports.reportError('Could not open library score', err);
                }
            });
            row.appendChild(button);
            const actionBtn = document.createElement('button');
            actionBtn.type = 'button';
            actionBtn.className = 'scores-row-action-button';
            actionBtn.setAttribute('aria-label', `Actions for ${resolvedTitle}`);
            actionBtn.textContent = '⋯';
            bind(actionBtn, 'click', async (e) => {
                const uiGeneration = ports.lifetime.capture();
                if (!ports.lifetime.current(uiGeneration))
                    return;
                e.preventDefault();
                e.stopPropagation();
                const action = await showScoreRowActionMenu(score);
                if (!ports.lifetime.current(uiGeneration))
                    return;
                if (action === 'rename') {
                    const nextTitle = ports.prompt('Rename score:', resolvedTitle);
                    if (nextTitle == null)
                        return;
                    try {
                        await ports.library.renameScore(score.id, nextTitle);
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        await refreshScoresDrawer();
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                    }
                    catch (err) {
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        ports.reportError('Could not rename score', err);
                        ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not rename that score.'));
                    }
                    return;
                }
                if (action === 'move') {
                    try {
                        const folders = await ports.library.getAllFolders();
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        const selectedFolderId = await promptForLibraryFolderChoice({
                            title: `Move "${resolvedTitle}" to which folder?`,
                            folders
                        });
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        if (selectedFolderId === '__cancel__')
                            return;
                        await ports.library.moveScoresToFolder([score.id], selectedFolderId);
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        state.scoreLibrarySelectedFolderId = selectedFolderId ?? '__unfiled__';
                        await refreshScoresDrawer();
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                    }
                    catch (err) {
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        ports.reportError('Could not move score', err);
                        ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not move that score.'));
                    }
                    return;
                }
                if (action === 'delete') {
                    const confirmed = ports.confirm(`Delete score "${resolvedTitle}"?`);
                    if (!confirmed)
                        return;
                    try {
                        await ports.library.deleteScores([score.id]);
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        if (state.currentScoreLibraryId === score.id) {
                            state.currentScoreLibraryId = null;
                        }
                        await refreshScoresDrawer();
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                    }
                    catch (err) {
                        if (!ports.lifetime.current(uiGeneration))
                            return;
                        ports.reportError('Could not delete score', err);
                        ports.alert(PianoTrainerLibraryControlsState.errorMessage(err, 'Could not delete that score.'));
                    }
                }
            });
            row.appendChild(actionBtn);
            return row;
        }
        return { createFoldersLibraryToolbar, createFolderListRow, createScoresLibraryToolbar, createScoreRow, formatScorePaneSummary, dispose };
    }
    export type Service = ReturnType<typeof create>;
}
