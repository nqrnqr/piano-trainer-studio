"use strict";
// Native settings buttons retain the existing file-command and confirmation flow.
var PianoTrainerSettingsActions;
(function (PianoTrainerSettingsActions) {
    function create(ports) {
        const dom = PianoTrainerControlDom.create(ports.document);
        let initialized = false, generation = 0;
        function init() {
            if (initialized)
                return;
            initialized = true;
            const token = generation;
            dom.on(dom.optionalButton('btn-backup-settings'), 'click', () => {
                if (token === generation)
                    ports.downloadSettingsBackup();
            });
            const button = dom.optionalButton('btn-import-settings'), input = dom.optionalInput('input-settings-import');
            if (button && input) {
                dom.on(button, 'click', () => { if (token === generation) {
                    input.value = '';
                    input.click();
                } });
                dom.onInput(input, 'change', node => {
                    if (token !== generation)
                        return;
                    const file = node.files && node.files[0];
                    ports.handleSettingsBackupImportFile(file);
                    input.value = '';
                });
            }
            dom.on(dom.optionalButton('btn-reset-preferences'), 'click', () => {
                if (token !== generation)
                    return;
                const confirmed = ports.confirm('Reset ALL saved Settings and Trainer preferences? This will erase all saved settings and restore defaults.');
                if (confirmed)
                    ports.restoreDefaultPreferences();
            });
        }
        function dispose() { generation++; initialized = false; dom.dispose(); }
        return { init, dispose };
    }
    PianoTrainerSettingsActions.create = create;
})(PianoTrainerSettingsActions || (PianoTrainerSettingsActions = {}));
//# sourceMappingURL=settings-actions.js.map