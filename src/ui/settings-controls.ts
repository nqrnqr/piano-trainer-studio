import {PianoTrainerSettingsBackup} from '../state/settings-backup';
// Settings commands keep ordinary file/dialog behavior; disposal owns readers and downloads.
export namespace PianoTrainerSettingsFiles {
    export interface Ports {
        document: Document;
        createReader(): FileReader;
        createBlob(parts: BlobPart[], options: BlobPropertyBag): Blob;
        createObjectURL(blob: Blob): string;
        revokeObjectURL(url: string): void;
        now(): Date;
        buildPayload(): PianoTrainerSettingsBackup.Payload;
        importPayload(payload: unknown): void;
        alert(message: string): void;
        reload(): void;
        warn(message: string, error: unknown): void;
    }
    export function create(ports: Ports) {
        const readers = new Set<FileReader>(), links = new Set<HTMLAnchorElement>(), urls = new Set<string>();
        let initialized = false, generation = 0;
        function init() {initialized = true;}
        function downloadSettingsBackup() {
            if (!initialized) return;
            try {
                const payload = ports.buildPayload();
                const blob = ports.createBlob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
                const url = ports.createObjectURL(blob); urls.add(url);
                const link = ports.document.createElement('a'); links.add(link);
                const safeDate = ports.now().toISOString().slice(0, 10);
                link.href = url;
                link.download = `Piano-Trainer-Settings-Backup-${safeDate}.json`;
                ports.document.body.appendChild(link);
                link.click(); link.remove(); links.delete(link);
                ports.revokeObjectURL(url); urls.delete(url);
            } catch (err) {
                ports.warn('Settings backup export failed', err);
                ports.alert('Could not export settings backup.');
            }
        }
        function handleSettingsBackupImportFile(file: File | null | undefined) {
            if (!initialized || !file) return;
            const reader = ports.createReader(), token = generation;
            readers.add(reader);
            reader.onload = () => {
                if (token !== generation || !readers.has(reader)) return;
                readers.delete(reader);
                try {
                    const payload: unknown = JSON.parse(String(reader.result || '{}'));
                    ports.importPayload(payload);
                    ports.alert('Settings imported. The app will now reload to apply them.');
                    ports.reload();
                } catch (err) {
                    ports.warn('Settings backup import failed', err);
                    ports.alert('Invalid settings backup file.');
                }
            };
            // Native read errors/aborts remain silent as in the original commands.
            reader.onloadend = () => {readers.delete(reader);};
            try {reader.readAsText(file);} catch (error) {readers.delete(reader); throw error;}
        }
        function dispose() {
            generation++; initialized = false;
            for (const reader of readers) {
                reader.onload = null; reader.onloadend = null;
                reader.abort();
            }
            readers.clear();
            for (const link of links) link.remove();
            links.clear();
            for (const url of urls) ports.revokeObjectURL(url);
            urls.clear();
        }
        return {init, dispose, downloadSettingsBackup, handleSettingsBackupImportFile};
    }
    export type Service = ReturnType<typeof create>;
}
