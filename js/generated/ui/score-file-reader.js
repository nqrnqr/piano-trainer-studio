"use strict";
// One-shot native file reads. Explicit disposal aborts only this service's readers.
var PianoTrainerScoreFileReader;
(function (PianoTrainerScoreFileReader) {
    function create(ports) {
        const pending = new Set();
        function readScoreFile(file) {
            return new Promise((resolve, reject) => {
                const reader = ports.createReader();
                pending.add(reader);
                reader.onerror = () => { pending.delete(reader); reject(reader.error || new Error('Could not read score file.')); };
                reader.onabort = () => { pending.delete(reader); reject(new DOMException('Score file read aborted.', 'AbortError')); };
                reader.onload = () => {
                    pending.delete(reader);
                    // Native load follows a completed readAsText/readAsArrayBuffer.
                    resolve({ rawData: reader.result, fileName: file.name || 'Untitled Score',
                        fileType: ports.format.getScoreFileTypeFromName(file.name || ''), title: ports.format.getScoreDisplayTitle(file.name || '') });
                };
                if ((file.name || '').match(/\.(mxl)$/i))
                    reader.readAsArrayBuffer(file);
                else
                    reader.readAsText(file);
            });
        }
        function dispose() { for (const reader of pending)
            reader.abort(); pending.clear(); }
        return { readScoreFile, dispose };
    }
    PianoTrainerScoreFileReader.create = create;
})(PianoTrainerScoreFileReader || (PianoTrainerScoreFileReader = {}));
//# sourceMappingURL=score-file-reader.js.map