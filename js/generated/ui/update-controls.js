"use strict";
// App update controls have no LED hardware ownership.
function getUpdateCheckButton() {
    const button = document.getElementById("btn-check-updates");
    return button instanceof HTMLButtonElement ? button : null;
}
function compareSemverLoose(a, b) {
    const parse = (value) => String(value || '')
        .trim()
        .replace(/^[^\d]*/, '')
        .split(/[\.-]/)
        .map(part => {
        const n = Number(part);
        return Number.isFinite(n) ? n : 0;
    });
    const aa = parse(a);
    const bb = parse(b);
    const len = Math.max(aa.length, bb.length, 3);
    for (let i = 0; i < len; i++) {
        const av = aa[i] || 0;
        const bv = bb[i] || 0;
        if (av > bv)
            return 1;
        if (av < bv)
            return -1;
    }
    return 0;
}
function getAppVersionDisplayText() {
    return `Version: ${APP_VERSION || 'unknown'}`;
}
function buildUpdateStatusText() {
    if (AppState.updateStatus)
        return AppState.updateStatus;
    if (!AppState.updateManifestUrl)
        return 'Update checks are not configured yet.';
    return 'Update status: not checked yet.';
}
function isLocalAppRuntime() {
    const host = String(window.location.hostname || '').toLowerCase();
    return window.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';
}
function getUpdateActionUrl() {
    const downloadUrl = String(AppState.updateInfo?.downloadUrl || '').trim();
    const releaseUrl = String(AppState.updateInfo?.releaseUrl || '').trim();
    return downloadUrl || releaseUrl || UPDATE_RELEASES_URL || '';
}
function getRequestedAssetVersion() {
    try {
        const url = new URL(window.location.href);
        return String(url.searchParams.get('appv') || '').trim();
    }
    catch (_) {
        return '';
    }
}
function setAssetVersionOverride(version) {
    const normalized = String(version || '').trim();
    if (!normalized) {
        localStorage.removeItem(ASSET_VERSION_OVERRIDE_STORAGE_KEY);
        return;
    }
    localStorage.setItem(ASSET_VERSION_OVERRIDE_STORAGE_KEY, normalized);
}
function clearAssetVersionOverrideIfCurrent() {
    const requested = getRequestedAssetVersion();
    const stored = String(localStorage.getItem(ASSET_VERSION_OVERRIDE_STORAGE_KEY) || '').trim();
    if (requested && compareSemverLoose(APP_VERSION, requested) >= 0) {
        localStorage.removeItem(ASSET_VERSION_OVERRIDE_STORAGE_KEY);
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete('appv');
            url.searchParams.delete('t');
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        }
        catch (_) { }
        return;
    }
    if (stored && compareSemverLoose(APP_VERSION, stored) >= 0) {
        localStorage.removeItem(ASSET_VERSION_OVERRIDE_STORAGE_KEY);
    }
}
function forceReloadToVersion(version) {
    const normalized = String(version || '').trim();
    if (!normalized) {
        window.location.reload();
        return;
    }
    setAssetVersionOverride(normalized);
    try {
        const url = new URL(window.location.href);
        url.searchParams.set('appv', normalized);
        url.searchParams.set('t', String(Date.now()));
        window.location.replace(url.toString());
    }
    catch (_) {
        window.location.reload();
    }
}
function syncUpdateControls() {
    const versionEl = document.getElementById('app-version-display');
    const statusEl = document.getElementById('update-status');
    const button = getUpdateCheckButton();
    if (versionEl)
        versionEl.textContent = getAppVersionDisplayText();
    if (statusEl)
        statusEl.textContent = buildUpdateStatusText();
    if (button) {
        button.disabled = false;
        if (AppState.updateInfo?.updateAvailable) {
            button.textContent = isLocalAppRuntime() ? 'Download Latest' : 'Reload to Update';
        }
        else if (AppState.updateInfo && AppState.updateInfo.remoteVersion) {
            button.textContent = 'Up to Date';
        }
        else {
            button.textContent = 'Check for Updates';
        }
    }
}
async function checkForUpdates({ manual = false } = {}) {
    const button = getUpdateCheckButton();
    if (button)
        button.disabled = true;
    if (!AppState.updateManifestUrl) {
        AppState.updateLastCheckedAt = Date.now();
        AppState.updateInfo = null;
        AppState.updateStatus = 'Update checks are not configured yet.';
        syncUpdateControls();
        return;
    }
    try {
        const response = await fetch(`${AppState.updateManifestUrl}${AppState.updateManifestUrl.includes('?') ? '&' : '?'}t=${Date.now()}`, {
            cache: 'no-store'
        });
        if (!response.ok)
            throw new Error(`Manifest HTTP ${response.status}`);
        const rawManifest = await response.json();
        const manifest = typeof rawManifest === "object" && rawManifest !== null
            ? rawManifest : null;
        const remoteVersion = String(manifest?.version || '').trim();
        const releaseUrl = String(manifest?.releaseUrl || UPDATE_RELEASES_URL || '').trim();
        const downloadUrl = String(manifest?.downloadUrl || '').trim();
        const updateAvailable = remoteVersion ? compareSemverLoose(remoteVersion, APP_VERSION) > 0 : false;
        AppState.updateInfo = {
            currentVersion: APP_VERSION,
            remoteVersion,
            updateAvailable,
            releaseUrl,
            downloadUrl
        };
        AppState.updateLastCheckedAt = Date.now();
        if (!remoteVersion) {
            AppState.updateStatus = 'Update manifest is missing a version value.';
        }
        else if (updateAvailable) {
            AppState.updateStatus = `Update available: ${remoteVersion}.`;
            if (!manual && !isLocalAppRuntime()) {
                AppState.updateStatus = `Updating to ${remoteVersion}...`;
                syncUpdateControls();
                forceReloadToVersion(remoteVersion);
                return;
            }
        }
        else {
            AppState.updateStatus = 'Up to date.';
            clearAssetVersionOverrideIfCurrent();
        }
    }
    catch (err) {
        AppState.updateLastCheckedAt = Date.now();
        AppState.updateInfo = null;
        AppState.updateStatus = manual
            ? `Update check failed: ${getUnknownErrorMessage(err) || String(err)}`
            : 'Update check unavailable.';
    }
    finally {
        syncUpdateControls();
    }
}
function initUpdateControls() {
    AppState.updateManifestUrl = String(localStorage.getItem(UPDATE_MANIFEST_URL_STORAGE_KEY) || UPDATE_MANIFEST_URL || '').trim();
    AppState.updateStatus = '';
    clearAssetVersionOverrideIfCurrent();
    const button = getUpdateCheckButton();
    if (button && !button.dataset.boundCheckUpdates) {
        button.dataset.boundCheckUpdates = 'true';
        button.addEventListener('click', async () => {
            if (AppState.updateInfo?.updateAvailable) {
                if (isLocalAppRuntime()) {
                    const releaseUrl = getUpdateActionUrl();
                    if (releaseUrl)
                        window.open(releaseUrl, '_blank', 'noopener');
                    else
                        window.alert('No release URL is configured yet.');
                    return;
                }
                const shouldReload = window.confirm(`Version ${AppState.updateInfo.remoteVersion} is available. Reload now?`);
                if (shouldReload)
                    forceReloadToVersion(AppState.updateInfo.remoteVersion);
                return;
            }
            await checkForUpdates({ manual: true });
        });
    }
    syncUpdateControls();
    checkForUpdates({ manual: false }).catch(() => { });
}
//# sourceMappingURL=update-controls.js.map