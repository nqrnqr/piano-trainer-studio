import type {createServices} from '../app/services';

export function createSettingsChecks(getServices:() => ReturnType<typeof createServices>) {
    return Object.freeze({
        initFiles:() => getServices().settingsFiles.init(),
        disposeFiles:() => getServices().settingsFiles.dispose(),
        importFile:(file:File|null) => getServices().settingsFiles.handleSettingsBackupImportFile(file),
        readBackup:() => structuredClone(getServices().settingsBackup.buildSettingsBackupPayload()),
        importBackup:(payload:unknown) => getServices().settingsBackup.importSettingsBackupPayload(payload)
    });
}
