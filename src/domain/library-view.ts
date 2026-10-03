// Original score list presentation/filter rules.
namespace PianoTrainerLibraryView {
    export function normalizeComparableScoreName(value: unknown) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/\.(musicxml|xml|mxl)$/i, '')
            .replace(/[^a-z0-9]+/g, '');
    }
    export function shouldShowScoreFileName(title: unknown, fileName: unknown) {
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
    export function getFilteredLibraryScores(scores: readonly PianoTrainerDomain.LibraryScore[] | null | undefined, activeFolderId: string | null) {
        return (scores || []).filter(score => {
            if (activeFolderId === '__all__')
                return true;
            if (activeFolderId === '__unfiled__' || activeFolderId == null)
                return !score.folderId;
            return score.folderId === activeFolderId;
        });
    }
}
