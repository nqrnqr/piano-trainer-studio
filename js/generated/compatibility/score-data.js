"use strict";
// Cold composition in the original core order. P9 replaces classic forwards.
const scoreFormat = PianoTrainerMusicXmlIO.create({
    getNormalizer: () => window.MidiImport && typeof window.MidiImport.normalizeScoreToMusicXml === 'function'
        ? (rawData, options) => window.MidiImport.normalizeScoreToMusicXml(rawData, options) : null,
    warn: (message, error) => console.warn(message, error)
});
const scoreFileReader = PianoTrainerScoreFileReader.create({ createReader: () => new FileReader(), format: scoreFormat });
const scoreLoader = PianoTrainerScoreLoader.create({
    state: AppState, format: scoreFormat, score: osmdAdapter,
    resetPlayback: () => resetPlaybackForLoadedScore(),
    resetTempo: () => { if (typeof updateTempo === 'function')
        updateTempo('percent', 100); },
    render: () => renderScoreAndRefreshGeometry(), initSongUI: () => initSongUI(), scroll: () => handleAutoScroll(),
    getLibrary: () => window.ScoreLibrary, refreshLibrary: () => refreshScoresDrawer(),
    notifyTranspose: skipReset => {
        const transpose = window.TransposeUI;
        if (transpose && typeof transpose.handleScoreLoaded === 'function') {
            if (!skipReset)
                transpose.handleScoreLoaded();
            else {
                transpose.refreshAvailabilityFromCurrentScore();
                transpose.syncUiFromState();
            }
        }
    },
    success: () => {
        console.error('File loaded successfully.');
        if (AppState.debugEventFlow || AppState.debugMatchLogs || AppState.debugAnchorResolution || AppState.debugPersistentAnchors) {
            console.error('[PianoTrainer debug LOAD] console logging active', {
                debugAnchors: AppState.debugPersistentAnchors, debugEventFlow: AppState.debugEventFlow, debugMatchLogs: AppState.debugMatchLogs,
                debugStickyFrames: AppState.debugStickyFrameLimit, expectedNotes: AppState.expectedNotes ? AppState.expectedNotes.length : null,
                ts: new Date().toISOString()
            });
        }
    },
    reportError: error => {
        console.error('OSMD Load Error:', error);
        const message = error && (typeof error === 'object' || typeof error === 'function') && 'message' in error ? error.message : null;
        alert(message ? String(message) : 'Error loading score file.');
    }
});
const scoreFileInput = document.getElementById('file-input');
if (!(scoreFileInput instanceof HTMLInputElement))
    throw new Error('Missing required score file input: file-input');
const scoreFileControls = PianoTrainerScoreFileControls.create({
    input: scoreFileInput, resumeAudio: () => audioOutput.resumeWithoutWaiting(), readFile: file => scoreFileReader.readScoreFile(file),
    load: (rawData, options) => scoreLoader.loadScoreIntoApp(rawData, options), getConverter: () => window.MidiImport,
    closeDrawer: () => { if (window.ScoresUI && typeof window.ScoresUI.closeScoresDrawer === 'function')
        window.ScoresUI.closeScoresDrawer(); }
});
const getScoreFileTypeFromName = scoreFormat.getScoreFileTypeFromName;
const getScoreDisplayTitle = scoreFormat.getScoreDisplayTitle;
const readScoreFile = scoreFileReader.readScoreFile;
const loadScoreIntoApp = scoreLoader.loadScoreIntoApp;
const openScoreFilePicker = scoreFileControls.openScoreFilePicker;
const handleDirectScoreFileSelection = scoreFileControls.handleDirectScoreFileSelection;
window.loadScoreIntoApp = loadScoreIntoApp;
window.openScoreFilePicker = openScoreFilePicker;
//# sourceMappingURL=score-data.js.map