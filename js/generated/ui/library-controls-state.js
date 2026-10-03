"use strict";
// Narrow drawer state, selection ownership and disposal tokens for this UI group.
var PianoTrainerLibraryControlsState;
(function (PianoTrainerLibraryControlsState) {
    function createLifetime() {
        let generation = 0, active = true;
        return { capture: () => generation, current: (token) => active && token === generation,
            init: () => { active = true; }, dispose: () => {
                if (active) {
                    active = false;
                    generation++;
                }
            } };
    }
    PianoTrainerLibraryControlsState.createLifetime = createLifetime;
    function errorMessage(error, fallback) { const message = error == null ? undefined : Reflect.get(Object(error), 'message', error); return message || fallback; }
    PianoTrainerLibraryControlsState.errorMessage = errorMessage;
    function create(state) {
        function getFolderLibrarySelectionSet() { return new Set((state.scoreLibrarySelectedFolderIds || []).filter(Boolean)); }
        function setFolderLibrarySelection(ids) { state.scoreLibrarySelectedFolderIds = Array.from(new Set((ids || []).filter(Boolean))); }
        function clearFolderLibrarySelection() { state.scoreLibrarySelectedFolderIds = []; }
        function isFolderLibraryManageMode() { return !!state.scoreLibraryFolderManageMode; }
        function setFolderLibraryManageMode(enabled) {
            state.scoreLibraryFolderManageMode = !!enabled;
            if (!state.scoreLibraryFolderManageMode)
                clearFolderLibrarySelection();
        }
        function toggleFolderLibrarySelection(id) {
            const next = getFolderLibrarySelectionSet();
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            setFolderLibrarySelection(Array.from(next));
        }
        function getScoreLibrarySelectionSet() { return new Set((state.scoreLibrarySelectedScoreIds || []).filter(Boolean)); }
        function setScoreLibrarySelection(ids) { state.scoreLibrarySelectedScoreIds = Array.from(new Set((ids || []).filter(Boolean))); }
        function clearScoreLibrarySelection() { state.scoreLibrarySelectedScoreIds = []; }
        function isScoreLibraryManageMode() { return !!state.scoreLibraryManageMode; }
        function setScoreLibraryManageMode(enabled) {
            state.scoreLibraryManageMode = !!enabled;
            if (!state.scoreLibraryManageMode)
                clearScoreLibrarySelection();
        }
        function toggleScoreLibrarySelection(id) {
            const next = getScoreLibrarySelectionSet();
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            setScoreLibrarySelection(Array.from(next));
        }
        return { getFolderLibrarySelectionSet, setFolderLibrarySelection, clearFolderLibrarySelection, isFolderLibraryManageMode, setFolderLibraryManageMode, toggleFolderLibrarySelection,
            getScoreLibrarySelectionSet, setScoreLibrarySelection, clearScoreLibrarySelection, isScoreLibraryManageMode, setScoreLibraryManageMode, toggleScoreLibrarySelection };
    }
    PianoTrainerLibraryControlsState.create = create;
})(PianoTrainerLibraryControlsState || (PianoTrainerLibraryControlsState = {}));
//# sourceMappingURL=library-controls-state.js.map