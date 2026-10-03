"use strict";
// Settings commands keep ordinary file/dialog behavior; disposal owns readers and downloads.
var PianoTrainerSettingsFiles;
(function (PianoTrainerSettingsFiles) {
    function create(ports) {
        const readers = new Set(), links = new Set(), urls = new Set();
        let initialized = false, generation = 0;
        function init() { initialized = true; }
        function downloadSettingsBackup() {
            if (!initialized)
                return;
            try {
                const payload = ports.buildPayload();
                const blob = ports.createBlob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = ports.createObjectURL(blob);
                urls.add(url);
                const link = ports.document.createElement('a');
                links.add(link);
                const safeDate = ports.now().toISOString().slice(0, 10);
                link.href = url;
                link.download = `Piano-Trainer-Settings-Backup-${safeDate}.json`;
                ports.document.body.appendChild(link);
                link.click();
                link.remove();
                links.delete(link);
                ports.revokeObjectURL(url);
                urls.delete(url);
            }
            catch (err) {
                ports.warn('Settings backup export failed', err);
                ports.alert('Could not export settings backup.');
            }
        }
        function handleSettingsBackupImportFile(file) {
            if (!initialized || !file)
                return;
            const reader = ports.createReader(), token = generation;
            readers.add(reader);
            reader.onload = () => {
                if (token !== generation || !readers.has(reader))
                    return;
                readers.delete(reader);
                try {
                    const payload = JSON.parse(String(reader.result || '{}'));
                    ports.importPayload(payload);
                    ports.alert('Settings imported. The app will now reload to apply them.');
                    ports.reload();
                }
                catch (err) {
                    ports.warn('Settings backup import failed', err);
                    ports.alert('Invalid settings backup file.');
                }
            };
            // Native read errors/aborts remain silent as in the original commands.
            reader.onloadend = () => { readers.delete(reader); };
            try {
                reader.readAsText(file);
            }
            catch (error) {
                readers.delete(reader);
                throw error;
            }
        }
        function dispose() {
            generation++;
            initialized = false;
            for (const reader of readers) {
                reader.onload = null;
                reader.onloadend = null;
                reader.abort();
            }
            readers.clear();
            for (const link of links)
                link.remove();
            links.clear();
            for (const url of urls)
                ports.revokeObjectURL(url);
            urls.clear();
        }
        return { init, dispose, downloadSettingsBackup, handleSettingsBackupImportFile };
    }
    PianoTrainerSettingsFiles.create = create;
})(PianoTrainerSettingsFiles || (PianoTrainerSettingsFiles = {}));
//# sourceMappingURL=settings-controls.js.map