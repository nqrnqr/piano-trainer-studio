"use strict";
// Original state slot. P9 bootstrap will allocate these explicitly per application.
const appMetadata = PianoTrainerAppState.readMetadata({ manifest: window.__PT_APP_MANIFEST__, assetVersion: window.__PT_ASSET_VERSION__,
    getManifestUrl: () => localStorage.getItem(UPDATE_MANIFEST_URL_STORAGE_KEY) });
const APP_VERSION = appMetadata.version;
const UPDATE_MANIFEST_URL = appMetadata.manifestUrl;
const UPDATE_RELEASES_URL = appMetadata.releaseUrl;
const AppState = PianoTrainerAppState.create();
//# sourceMappingURL=app-state.js.map