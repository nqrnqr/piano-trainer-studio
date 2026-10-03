"use strict";
// Transitional composition. P9 replaces these callbacks with bootstrap imports.
const osmdAdapter = PianoTrainerOsmdAdapter.create({
    getRenderer: () => osmd,
    describeNote: (note, measure, staff) => describeLogicalNoteForDebug(note, measure, staff),
    describeGraphicalNote: note => describeGraphicalNoteForDebug(note),
    debugLog: (name, detail) => debugLogAnchorResolution(name, detail),
    reportError: (message, error) => console.error(message, error)
});
const getResolvedStaffAssignmentIdFromNote = osmdAdapter.resolveStaffIdFromNote;
const getResolvedStaffAssignmentIdFromEntry = osmdAdapter.resolveStaffIdFromEntry;
function requireScoreDisplayElement(id, type) {
    const element = document.getElementById(id);
    if (!(element instanceof type))
        throw new Error(`Missing required score display element: ${id}`);
    return element;
}
const ScoreDisplay = PianoTrainerScoreViewport.create({
    elements: {
        area: requireScoreDisplayElement('music-area', HTMLElement),
        wrapper: requireScoreDisplayElement('canvas-wrapper', HTMLElement),
        layout: requireScoreDisplayElement('select-score-layout', HTMLSelectElement),
        autoScroll: requireScoreDisplayElement('check-autoscroll', HTMLInputElement)
    },
    score: osmdAdapter, state: AppState, storage: localStorage,
    storageKey: TRAINER_SCORE_LAYOUT_STORAGE_KEY,
    getSvg: () => document.querySelector('#osmd-container svg'),
    getAnchor: (ref, measureIndex, staffIndex) => {
        const note = osmdAdapter.resolveNote(ref);
        return note ? GeometryEngine.getNoteAnchor(note, measureIndex, staffIndex) : null;
    },
    clearFeedbackPreserveScoring: () => clearFeedbackVisualStatePreserveScoring(),
    renderScoreAndRefreshGeometry: () => scoreRenderer.renderScoreAndRefreshGeometry(),
    requestFrame: callback => window.requestAnimationFrame(callback),
    cancelFrame: id => window.cancelAnimationFrame(id),
    prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
});
const scoreRenderer = PianoTrainerScoreRenderer.create({
    score: osmdAdapter, invalidateGeometry: () => GeometryEngine.invalidate(),
    afterRender: () => ScoreDisplay.afterRender(), renderFeedback: () => renderFeedbackOverlay(),
    renderLoop: () => GeometryEngine.renderLooper(),
    renderDebug: () => window.FeedbackDebug?.renderStickyDebug()
});
function getScoreNoteRef(note) { return osmdAdapter.noteRef(note); }
function renderScoreAndRefreshGeometry() { scoreRenderer.renderScoreAndRefreshGeometry(); }
function handleAutoScroll() { ScoreDisplay.autoScroll(); }
//# sourceMappingURL=score-rendering.js.map