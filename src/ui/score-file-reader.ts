// One-shot native file reads. Explicit disposal aborts only this service's readers.
namespace PianoTrainerScoreFileReader {
    export interface Ports {
        createReader(): FileReader;
        format: Pick<PianoTrainerMusicXmlIO.Service, 'getScoreFileTypeFromName' | 'getScoreDisplayTitle'>;
    }
    export function create(ports: Ports) {
        const pending = new Set<FileReader>();
        function readFile<T>(file: File, binary: boolean, failureMessage: string, build: (result: string | ArrayBuffer) => T): Promise<T> {
            return new Promise((resolve, reject) => {
                const reader = ports.createReader();
                pending.add(reader);
                reader.onerror = () => {pending.delete(reader); reject(reader.error || new Error(failureMessage));};
                reader.onabort = () => {pending.delete(reader); reject(new DOMException('Score file read aborted.', 'AbortError'));};
                reader.onload = () => {
                    pending.delete(reader);
                    // Native load follows a completed readAsText/readAsArrayBuffer.
                    resolve(build(reader.result!));
                };
                if (binary) reader.readAsArrayBuffer(file);
                else reader.readAsText(file);
            });
        }
        function readScoreFile(file: File): Promise<PianoTrainerDomain.ScoreFile> {
            return readFile(file, !!(file.name || '').match(/\.(mxl)$/i), 'Could not read score file.', rawData => ({rawData,
                fileName:file.name || 'Untitled Score', fileType:ports.format.getScoreFileTypeFromName(file.name || ''),
                title:ports.format.getScoreDisplayTitle(file.name || '')}));
        }
        function readArrayBuffer(file: File): Promise<ArrayBuffer> {
            // This successful native read used readAsArrayBuffer, never readAsText.
            return readFile(file, true, 'Could not read that file.', result => result as ArrayBuffer);
        }
        function dispose() {for (const reader of pending) reader.abort(); pending.clear();}
        return {readScoreFile, readArrayBuffer, dispose};
    }
}
