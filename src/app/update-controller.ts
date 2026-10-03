import {PianoTrainerVersion} from '../domain/version';
import {LegacyAppState} from '../state/model';
// Preserve update checks/navigation order; explicit disposal aborts only owned requests.
export namespace PianoTrainerUpdateController {
    export interface Ports {
        state: Pick<LegacyAppState, 'updateManifestUrl' | 'updateLastCheckedAt' | 'updateInfo' | 'updateStatus'>;
        version: string;
        releaseUrl: string;
        manifestUrl: string;
        storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
        keys: {
            assetOverride: string;
            manifestUrl: string;
        };
        location: Pick<Location, 'href' | 'hostname' | 'protocol' | 'replace' | 'reload'>;
        replaceHistory(path: string): void;
        fetch(url: string, options: {
            cache: 'no-store';
            signal: AbortSignal;
        }): Promise<Pick<Response, 'ok' | 'status' | 'json'>>;
        createAbortController(): AbortController;
        nowMs(): number;
        getErrorMessage(error: unknown): unknown;
        setChecking(): void;
        syncControls(): void;
    }
    export function create(ports: Ports) {
        const state = ports.state, pending = new Set<AbortController>();
        let generation = 0;
        function isLocalAppRuntime() {
            const host = String(ports.location.hostname || '').toLowerCase();
            return ports.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';
        }
        function getUpdateActionUrl() {
            const downloadUrl = String(state.updateInfo?.downloadUrl || '').trim();
            const releaseUrl = String(state.updateInfo?.releaseUrl || '').trim();
            return downloadUrl || releaseUrl || ports.releaseUrl || '';
        }
        function getRequestedAssetVersion() {
            try {
                const url = new URL(ports.location.href);
                return String(url.searchParams.get('appv') || '').trim();
            }
            catch (_) {
                return '';
            }
        }
        function setAssetVersionOverride(version: unknown) {
            const normalized = String(version || '').trim();
            if (!normalized) {
                ports.storage.removeItem(ports.keys.assetOverride);
                return;
            }
            ports.storage.setItem(ports.keys.assetOverride, normalized);
        }
        function clearAssetVersionOverrideIfCurrent() {
            const requested = getRequestedAssetVersion();
            const stored = String(ports.storage.getItem(ports.keys.assetOverride) || '').trim();
            if (requested && PianoTrainerVersion.compareSemverLoose(ports.version, requested) >= 0) {
                ports.storage.removeItem(ports.keys.assetOverride);
                try {
                    const url = new URL(ports.location.href);
                    url.searchParams.delete('appv');
                    url.searchParams.delete('t');
                    ports.replaceHistory(url.pathname + url.search + url.hash);
                }
                catch (_) { }
                return;
            }
            if (stored && PianoTrainerVersion.compareSemverLoose(ports.version, stored) >= 0) {
                ports.storage.removeItem(ports.keys.assetOverride);
            }
        }
        function forceReloadToVersion(version: unknown) {
            const normalized = String(version || '').trim();
            if (!normalized) {
                ports.location.reload();
                return;
            }
            setAssetVersionOverride(normalized);
            try {
                const url = new URL(ports.location.href);
                url.searchParams.set('appv', normalized);
                url.searchParams.set('t', String(ports.nowMs()));
                ports.location.replace(url.toString());
            }
            catch (_) {
                ports.location.reload();
            }
        }
        async function checkForUpdates({ manual = false } = {}) {
            const token = generation;
            ports.setChecking();
            if (!state.updateManifestUrl) {
                state.updateLastCheckedAt = ports.nowMs();
                state.updateInfo = null;
                state.updateStatus = 'Update checks are not configured yet.';
                ports.syncControls();
                return;
            }
            const controller = ports.createAbortController();
            pending.add(controller);
            try {
                const response = await ports.fetch(`${state.updateManifestUrl}${state.updateManifestUrl.includes('?') ? '&' : '?'}t=${ports.nowMs()}`, {
                    cache: 'no-store', signal: controller.signal
                });
                if (token !== generation)
                    return;
                if (!response.ok)
                    throw new Error(`Manifest HTTP ${response.status}`);
                const rawManifest: unknown = await response.json();
                if (token !== generation)
                    return;
                const manifest = typeof rawManifest === "object" && rawManifest !== null
                    ? rawManifest as Record<string, unknown> : null;
                const remoteVersion = String(manifest?.version || '').trim();
                const releaseUrl = String(manifest?.releaseUrl || ports.releaseUrl || '').trim();
                const downloadUrl = String(manifest?.downloadUrl || '').trim();
                const updateAvailable = remoteVersion ? PianoTrainerVersion.compareSemverLoose(remoteVersion, ports.version) > 0 : false;
                state.updateInfo = {
                    currentVersion: ports.version,
                    remoteVersion,
                    updateAvailable,
                    releaseUrl,
                    downloadUrl
                };
                state.updateLastCheckedAt = ports.nowMs();
                if (!remoteVersion) {
                    state.updateStatus = 'Update manifest is missing a version value.';
                }
                else if (updateAvailable) {
                    state.updateStatus = `Update available: ${remoteVersion}.`;
                    if (!manual && !isLocalAppRuntime()) {
                        state.updateStatus = `Updating to ${remoteVersion}...`;
                        ports.syncControls();
                        forceReloadToVersion(remoteVersion);
                        return;
                    }
                }
                else {
                    state.updateStatus = 'Up to date.';
                    clearAssetVersionOverrideIfCurrent();
                }
            }
            catch (err) {
                if (token !== generation)
                    return;
                state.updateLastCheckedAt = ports.nowMs();
                state.updateInfo = null;
                state.updateStatus = manual
                    ? `Update check failed: ${ports.getErrorMessage(err) || String(err)}`
                    : 'Update check unavailable.';
            }
            finally {
                pending.delete(controller);
                if (token === generation)
                    ports.syncControls();
            }
        }
        function init() { state.updateManifestUrl = String(ports.storage.getItem(ports.keys.manifestUrl) || ports.manifestUrl || '').trim(); state.updateStatus = ''; clearAssetVersionOverrideIfCurrent(); }
        function dispose() { generation++; for (const controller of pending)
            controller.abort(); pending.clear(); }
        return { init, dispose, checkForUpdates, isLocalAppRuntime, getUpdateActionUrl, forceReloadToVersion, clearAssetVersionOverrideIfCurrent };
    }
    export type Service = ReturnType<typeof create>;
}
