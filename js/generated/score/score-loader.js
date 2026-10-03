"use strict";
// Preserve load effects and promise completion. Raw MXL remains the render source.
var PianoTrainerScoreLoader;
(function (PianoTrainerScoreLoader) {
    function create(ports) {
        const state = ports.state, format = ports.format;
        async function loadScoreIntoApp(rawData, { fileName = 'Untitled Score', fileType = 'xml', libraryScoreId = null, title = null, originalRawData = undefined, originalFileName = undefined, originalFileType = undefined, skipTransposeReset = false } = {}) {
            try {
                ports.resetPlayback();
                if (!skipTransposeReset)
                    ports.resetTempo();
                const resolvedOriginalRawData = originalRawData !== undefined ? originalRawData : rawData;
                const resolvedOriginalFileName = originalFileName !== undefined ? originalFileName : (fileName || 'Untitled Score');
                const resolvedOriginalFileType = originalFileType !== undefined ? originalFileType : (fileType || format.getScoreFileTypeFromName(fileName));
                const transposeSourceRawData = format.cloneScoreRawData(resolvedOriginalRawData);
                const osmdSourceRawData = format.cloneScoreRawData(rawData);
                const canonicalOriginalMusicXml = await format.getCanonicalMusicXmlForTranspose(transposeSourceRawData, {
                    fileName: resolvedOriginalFileName, fileType: resolvedOriginalFileType
                });
                const osmdLoadPayload = format.getOsmdLoadPayload(osmdSourceRawData, fileType, fileName);
                await ports.score.load(osmdLoadPayload);
                ports.render();
                ports.initSongUI();
                if (ports.score.hasCursor()) {
                    ports.score.reset();
                    ports.score.showCursor();
                    ports.score.updateCursor();
                    ports.scroll();
                }
                state.ledPreviewTimeline = [];
                state.ledPreviewTimelineDirty = true;
                state.ledPreviewTraversalIndex = -1;
                state.lastLedPreviewEvents = [];
                state.currentScoreData = rawData;
                state.currentScoreOriginalData = canonicalOriginalMusicXml || resolvedOriginalRawData;
                state.currentScoreFileName = fileName || 'Untitled Score';
                state.currentScoreOriginalFileName = resolvedOriginalFileName;
                state.currentScoreFileType = fileType || format.getScoreFileTypeFromName(fileName);
                state.currentScoreOriginalFileType = resolvedOriginalFileType;
                state.currentScoreLibraryId = libraryScoreId ?? null;
                state.currentScoreTitle = title || format.getScoreDisplayTitle(fileName || '');
                const library = libraryScoreId ? ports.getLibrary() : undefined;
                if (libraryScoreId && library) {
                    await library.markScoreOpened(libraryScoreId);
                    await ports.refreshLibrary();
                }
                ports.notifyTranspose(skipTransposeReset);
                ports.success();
            }
            catch (error) {
                ports.reportError(error);
                throw error;
            }
        }
        return { loadScoreIntoApp };
    }
    PianoTrainerScoreLoader.create = create;
})(PianoTrainerScoreLoader || (PianoTrainerScoreLoader = {}));
//# sourceMappingURL=score-loader.js.map