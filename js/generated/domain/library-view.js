"use strict";
// Original score list presentation/filter rules.
var PianoTrainerLibraryView;
(function (PianoTrainerLibraryView) {
    function normalizeComparableScoreName(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/\.(musicxml|xml|mxl)$/i, '')
            .replace(/[^a-z0-9]+/g, '');
    }
    PianoTrainerLibraryView.normalizeComparableScoreName = normalizeComparableScoreName;
    function shouldShowScoreFileName(title, fileName) {
        const normalizedTitle = normalizeComparableScoreName(title);
        const normalizedFile = normalizeComparableScoreName(fileName);
        if (!normalizedFile)
            return false;
        if (!normalizedTitle)
            return true;
        if (normalizedTitle === normalizedFile)
            return false;
        if (normalizedTitle.startsWith(normalizedFile) || normalizedFile.startsWith(normalizedTitle))
            return false;
        return true;
    }
    PianoTrainerLibraryView.shouldShowScoreFileName = shouldShowScoreFileName;
    function getFilteredLibraryScores(scores, activeFolderId) {
        return (scores || []).filter(score => {
            if (activeFolderId === '__all__')
                return true;
            if (activeFolderId === '__unfiled__' || activeFolderId == null)
                return !score.folderId;
            return score.folderId === activeFolderId;
        });
    }
    PianoTrainerLibraryView.getFilteredLibraryScores = getFilteredLibraryScores;
})(PianoTrainerLibraryView || (PianoTrainerLibraryView = {}));
//# sourceMappingURL=library-view.js.map