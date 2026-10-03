// Native update UI owns its button; async requests/navigation belong to the controller.
namespace PianoTrainerUpdateControls {
    export interface Ports {
        document: Document;
        state: Pick<LegacyAppState, 'updateStatus' | 'updateManifestUrl' | 'updateInfo'>;
        version: string;
        commands: Pick<PianoTrainerUpdateController.Service, 'init' | 'checkForUpdates' | 'isLocalAppRuntime' | 'getUpdateActionUrl' | 'forceReloadToVersion'>;
        open(url: string, target: string, features: string): void;
        alert(message: string): void;
        confirm(message: string): boolean;
    }
    export function create(ports: Ports) {
        const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
        let generation = 0, ownedButton: HTMLButtonElement | null = null;
        function getUpdateCheckButton(): HTMLButtonElement | null {
            const button = ports.document.getElementById("btn-check-updates");
            return button instanceof HTMLButtonElement ? button : null;
        }
        function getAppVersionDisplayText() {
            return `Version: ${ports.version || 'unknown'}`;
        }
        function buildUpdateStatusText() {
            if (state.updateStatus)
                return state.updateStatus;
            if (!state.updateManifestUrl)
                return 'Update checks are not configured yet.';
            return 'Update status: not checked yet.';
        }
        function syncUpdateControls() {
            const versionEl = ports.document.getElementById('app-version-display');
            const statusEl = ports.document.getElementById('update-status');
            const button = getUpdateCheckButton();
            if (versionEl)
                versionEl.textContent = getAppVersionDisplayText();
            if (statusEl)
                statusEl.textContent = buildUpdateStatusText();
            if (button) {
                button.disabled = false;
                if (state.updateInfo?.updateAvailable) {
                    button.textContent = ports.commands.isLocalAppRuntime() ? 'Download Latest' : 'Reload to Update';
                }
                else if (state.updateInfo && state.updateInfo.remoteVersion) {
                    button.textContent = 'Up to Date';
                }
                else {
                    button.textContent = 'Check for Updates';
                }
            }
        }
        function initUpdateControls() {
            ports.commands.init();
            const button = getUpdateCheckButton();
            if (button && !button.dataset.boundCheckUpdates) {
                button.dataset.boundCheckUpdates = 'true';
                const token = generation;
                ownedButton = button;
                dom.on(button, 'click', async () => {
                    if (token !== generation)
                        return;
                    if (state.updateInfo?.updateAvailable) {
                        if (ports.commands.isLocalAppRuntime()) {
                            const releaseUrl = ports.commands.getUpdateActionUrl();
                            if (releaseUrl)
                                ports.open(releaseUrl, '_blank', 'noopener');
                            else
                                ports.alert('No release URL is configured yet.');
                            return;
                        }
                        const shouldReload = ports.confirm(`Version ${state.updateInfo.remoteVersion} is available. Reload now?`);
                        if (shouldReload)
                            ports.commands.forceReloadToVersion(state.updateInfo.remoteVersion);
                        return;
                    }
                    await ports.commands.checkForUpdates({ manual: true });
                });
            }
            syncUpdateControls();
            ports.commands.checkForUpdates({ manual: false }).catch(() => { });
        }
        function setChecking() { const button = getUpdateCheckButton(); if (button)
            button.disabled = true; }
        function dispose() { generation++; dom.dispose(); if (ownedButton?.dataset.boundCheckUpdates === 'true')
            delete ownedButton.dataset.boundCheckUpdates; ownedButton = null; }
        return { init: initUpdateControls, dispose, syncUpdateControls, setChecking };
    }
    export type Service = ReturnType<typeof create>;
}
