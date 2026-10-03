// Transitional composition; bootstrap owns this service in the module entry.
const settingsFiles = PianoTrainerSettingsFiles.create({document, createReader: () => new FileReader(),
    createBlob: (parts, options) => new Blob(parts, options), createObjectURL: blob => URL.createObjectURL(blob),
    revokeObjectURL: url => URL.revokeObjectURL(url), now: () => new Date(), buildPayload: buildSettingsBackupPayload,
    importPayload: importSettingsBackupPayload, alert: message => window.alert(message), reload: () => window.location.reload(),
    warn: (message, error) => console.warn(message, error)});
settingsFiles.init();
const downloadSettingsBackup = settingsFiles.downloadSettingsBackup;
const handleSettingsBackupImportFile = settingsFiles.handleSettingsBackupImportFile;
