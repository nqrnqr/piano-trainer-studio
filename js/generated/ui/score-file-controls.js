"use strict";
// Required file input and native target guards; import effects go through commands.
var PianoTrainerScoreFileControls;
(function (PianoTrainerScoreFileControls) {
    function create(ports) {
        let initialized = false;
        function openScoreFilePicker() { ports.resumeAudio(); ports.input.click(); }
        async function handleDirectScoreFileSelection(file) {
            if (!file)
                return;
            const converter = ports.getConverter();
            if (converter && typeof converter.isConverterImportFileName === 'function' && converter.isConverterImportFileName(file.name || '')) {
                const converted = await converter.convertFileToScore(file);
                await ports.load(converted.rawData, converted);
                ports.closeDrawer();
                return;
            }
            const scoreFile = await ports.readFile(file);
            await ports.load(scoreFile.rawData, scoreFile);
            ports.closeDrawer();
        }
        async function onChange(event) {
            if (!(event.target instanceof HTMLInputElement))
                return;
            const input = event.target;
            const file = input.files?.[0];
            try {
                await handleDirectScoreFileSelection(file);
            }
            finally {
                input.value = '';
            }
        }
        function init() { if (!initialized) {
            initialized = true;
            ports.input.addEventListener('change', onChange);
        } }
        function dispose() { if (initialized) {
            initialized = false;
            ports.input.removeEventListener('change', onChange);
        } }
        return { init, dispose, openScoreFilePicker, handleDirectScoreFileSelection };
    }
    PianoTrainerScoreFileControls.create = create;
})(PianoTrainerScoreFileControls || (PianoTrainerScoreFileControls = {}));
//# sourceMappingURL=score-file-controls.js.map