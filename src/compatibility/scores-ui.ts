// Original drawer slot and Window API; P9 moves this composition to bootstrap.
const libraryUiLifetime = PianoTrainerLibraryControlsState.createLifetime();
const librarySelection = PianoTrainerLibraryControlsState.create(AppState);
const libraryDialogs = PianoTrainerLibraryDialogs.create({ document, library: ScoreLibrary, lifetime: libraryUiLifetime });
const libraryUiPorts = { document, window, state: AppState, library: ScoreLibrary, lifetime: libraryUiLifetime, selection: librarySelection,
    format: { getScoreDisplayTitle: (name = '') => getScoreDisplayTitle(name), getScoreFileTypeFromName: (name = '') => getScoreFileTypeFromName(name) },
    prompt: (...args: [
        string,
        string?
    ]) => window.prompt(...args), confirm: (message: string) => window.confirm(message), alert: (message: unknown) => window.alert(message),
    reportError: (...args: [
        string,
        unknown?
    ]) => console.error(...args) };
const libraryActions = PianoTrainerLibraryActions.create({ ...libraryUiPorts, dialogs: libraryDialogs, now: () => Date.now(), url: URL,
    refreshScoresDrawer: () => scoresDrawer.refreshScoresDrawer(), ensureScoresDrawerOpen: () => scoresDrawer.ensureScoresDrawerOpen(),
    getConverter: () => window.MidiImport, readScoreFile: file => readScoreFile(file) });
const libraryRows = PianoTrainerLibraryList.create({ ...libraryUiPorts, dialogs: libraryDialogs,
    refreshScoresDrawer: () => scoresDrawer.refreshScoresDrawer(), createLibraryFolder: () => libraryActions.createLibraryFolder(),
    openScoresImportPicker: () => scoresDrawer.openScoresImportPicker(), closeScoresDrawer: () => scoresDrawer.closeScoresDrawer(),
    getScoreLibraryFolderLabel, loadScoreIntoApp: (raw, options) => loadScoreIntoApp(raw, options) });
const scoresDrawer = PianoTrainerScoresDrawer.create({ ...libraryUiPorts, rows: libraryRows, actions: libraryActions,
    getToolbar: () => window.ToolbarUI, getScoreLibraryFolderLabel, positionScoresPanel: () => positionScoresPanel(), reportWarning: (message, error) => console.warn(message, error) });
const refreshScoresDrawer = () => scoresDrawer.refreshScoresDrawer();
function initScoresDrawerShell() { libraryUiLifetime.init(); scoresDrawer.init(); }
function disposeScoresUi() { libraryUiLifetime.dispose(); libraryDialogs.dispose(); libraryRows.dispose(); scoresDrawer.dispose(); }
initScoresDrawerShell();
positionScoresPanel();
syncToolbarButtonStates();
window.ScoresUI = { ...libraryActions, refreshScoresDrawer, promptForLibraryFolderChoice: libraryDialogs.promptForLibraryFolderChoice,
    initScoresDrawerShell, init: initScoresDrawerShell, dispose: disposeScoresUi, closeScoresDrawer: scoresDrawer.closeScoresDrawer,
    updateScoresActionButtonsState: scoresDrawer.updateScoresActionButtonsState };
