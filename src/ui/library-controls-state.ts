import type {LegacyAppState} from '../state/model';
// Narrow drawer state, selection ownership and disposal tokens for this UI group.
export namespace PianoTrainerLibraryControlsState {
    export type State = Pick<LegacyAppState, 'currentScoreData' | 'currentScoreFileName' | 'currentScoreFileType' | 'currentScoreTitle' | 'currentScoreLibraryId' | 'scoreLibrarySelectedFolderId' | 'scoreLibraryView' | 'scoreLibraryManageMode' | 'scoreLibrarySelectedScoreIds' | 'scoreLibrarySelectedFolderIds' | 'scoreLibraryFolderManageMode'>;
    export function createLifetime() {
        let generation = 0, active = true;
        return { capture: () => generation, current: (token: number) => active && token === generation,
            init: () => { active = true; }, dispose: () => { if (active) {
                active = false;
                generation++;
            } } };
    }
    export type Lifetime = ReturnType<typeof createLifetime>;
    export function errorMessage(error: unknown, fallback: string):unknown { const message = error == null ? undefined : Reflect.get(Object(error), 'message',error); return message || fallback; }
    export function create(state: State) {
        function getFolderLibrarySelectionSet() { return new Set((state.scoreLibrarySelectedFolderIds || []).filter(Boolean)); }
        function setFolderLibrarySelection(ids: string[]) { state.scoreLibrarySelectedFolderIds = Array.from(new Set((ids || []).filter(Boolean))); }
        function clearFolderLibrarySelection() { state.scoreLibrarySelectedFolderIds = []; }
        function isFolderLibraryManageMode() { return !!state.scoreLibraryFolderManageMode; }
        function setFolderLibraryManageMode(enabled: boolean) { state.scoreLibraryFolderManageMode = !!enabled; if (!state.scoreLibraryFolderManageMode)
            clearFolderLibrarySelection(); }
        function toggleFolderLibrarySelection(id: string) { const next = getFolderLibrarySelectionSet(); if (next.has(id))
            next.delete(id);
        else
            next.add(id); setFolderLibrarySelection(Array.from(next)); }
        function getScoreLibrarySelectionSet() { return new Set((state.scoreLibrarySelectedScoreIds || []).filter(Boolean)); }
        function setScoreLibrarySelection(ids: string[]) { state.scoreLibrarySelectedScoreIds = Array.from(new Set((ids || []).filter(Boolean))); }
        function clearScoreLibrarySelection() { state.scoreLibrarySelectedScoreIds = []; }
        function isScoreLibraryManageMode() { return !!state.scoreLibraryManageMode; }
        function setScoreLibraryManageMode(enabled: boolean) { state.scoreLibraryManageMode = !!enabled; if (!state.scoreLibraryManageMode)
            clearScoreLibrarySelection(); }
        function toggleScoreLibrarySelection(id: string) { const next = getScoreLibrarySelectionSet(); if (next.has(id))
            next.delete(id);
        else
            next.add(id); setScoreLibrarySelection(Array.from(next)); }
        return { getFolderLibrarySelectionSet, setFolderLibrarySelection, clearFolderLibrarySelection, isFolderLibraryManageMode, setFolderLibraryManageMode, toggleFolderLibrarySelection,
            getScoreLibrarySelectionSet, setScoreLibrarySelection, clearScoreLibrarySelection, isScoreLibraryManageMode, setScoreLibraryManageMode, toggleScoreLibrarySelection };
    }
    export type Selection = ReturnType<typeof create>;
}
