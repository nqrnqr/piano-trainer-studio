// Remaining toolbar JS composition; migrated with the final P8 controls.
interface Window {
    ToolbarUI?: Pick<PianoTrainerToolbar.Service, 'syncToolbarButtonStates'|'showToolbarPanel'|'closeToolbarPanel'|
        'hideToolbarPanels'|'toggleToolbarPanel'|'isAnyToolbarPanelOpen'|'positionScoresPanel'|'init'|'dispose'>;
    IntroUI?: Pick<PianoTrainerToolbar.Service, 'maybeShowFirstRunIntro'|'showFirstRunIntro'|'closeFirstRunIntro'|'markFirstRunIntroSeen'>;
}
