"use strict";
// Settings file/download dialogs live at the UI boundary.
function downloadSettingsBackup() {
    try {
        const payload = buildSettingsBackupPayload();
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeDate = new Date().toISOString().slice(0, 10);
        link.href = url;
        link.download = `Piano-Trainer-Settings-Backup-${safeDate}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }
    catch (err) {
        console.warn('Settings backup export failed', err);
        window.alert('Could not export settings backup.');
    }
}
function handleSettingsBackupImportFile(file) {
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const payload = JSON.parse(String(reader.result || '{}'));
            importSettingsBackupPayload(payload);
            window.alert('Settings imported. The app will now reload to apply them.');
            window.location.reload();
        }
        catch (err) {
            console.warn('Settings backup import failed', err);
            window.alert('Invalid settings backup file.');
        }
    };
    reader.readAsText(file);
}
//# sourceMappingURL=settings-controls.js.map