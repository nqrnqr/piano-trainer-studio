// Original toolbar slot. P9 supplies the dependencies from bootstrap.
const toolbarUi = PianoTrainerToolbar.create({document, window, storage: localStorage, state: AppState,
    refreshScoresDrawer: () => refreshScoresDrawer()});
toolbarUi.init();
const positionScoresPanel = toolbarUi.positionScoresPanel;
const syncToolbarButtonStates = toolbarUi.syncToolbarButtonStates;
const hideToolbarPanels = toolbarUi.hideToolbarPanels;
const closeToolbarPanel = toolbarUi.closeToolbarPanel;
const isAnyToolbarPanelOpen = toolbarUi.isAnyToolbarPanelOpen;
window.ToolbarUI = {syncToolbarButtonStates, showToolbarPanel: toolbarUi.showToolbarPanel,
    closeToolbarPanel, hideToolbarPanels, toggleToolbarPanel: toolbarUi.toggleToolbarPanel,
    isAnyToolbarPanelOpen, positionScoresPanel, init: toolbarUi.init, dispose: toolbarUi.dispose};
window.IntroUI = {maybeShowFirstRunIntro: toolbarUi.maybeShowFirstRunIntro,
    showFirstRunIntro: toolbarUi.showFirstRunIntro, closeFirstRunIntro: toolbarUi.closeFirstRunIntro,
    markFirstRunIntroSeen: toolbarUi.markFirstRunIntroSeen};
