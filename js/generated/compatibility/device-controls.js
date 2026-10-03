"use strict";
// Transitional connections/update composition; no listener/fetch side effects here.
const connectionStatus = PianoTrainerConnectionStatus.create({ document, state: AppState,
    getPort: (direction, id) => getLegacyMidiPort(direction, id), syncMidiOutChannelVisibility: () => syncMidiOutChannelVisibility(),
    syncWledStatus: () => syncWledStatus() });
const updateConnectionStatuses = connectionStatus.updateConnectionStatuses;
const refreshConnectionStatuses = connectionStatus.refreshConnectionStatuses;
const updateController = PianoTrainerUpdateController.create({ state: AppState, version: APP_VERSION,
    releaseUrl: UPDATE_RELEASES_URL, manifestUrl: UPDATE_MANIFEST_URL, storage: localStorage,
    keys: { assetOverride: ASSET_VERSION_OVERRIDE_STORAGE_KEY, manifestUrl: UPDATE_MANIFEST_URL_STORAGE_KEY },
    location: window.location, replaceHistory: path => window.history.replaceState({}, '', path),
    fetch: (url, options) => fetch(url, options), createAbortController: () => new AbortController(), nowMs: () => Date.now(),
    getErrorMessage: getUnknownErrorMessage, setChecking: () => updateControls.setChecking(), syncControls: () => updateControls.syncUpdateControls() });
const updateControls = PianoTrainerUpdateControls.create({ document, state: AppState, version: APP_VERSION, commands: updateController,
    open: (url, target, features) => { window.open(url, target, features); }, alert: message => window.alert(message), confirm: message => window.confirm(message) });
// LED calls init during ordinary setting changes: preserve its state refresh/check each time.
const initUpdateControls = updateControls.init;
const checkForUpdates = updateController.checkForUpdates;
const compareSemverLoose = PianoTrainerVersion.compareSemverLoose;
//# sourceMappingURL=device-controls.js.map