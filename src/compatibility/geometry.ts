// Transitional public names for legacy practice/debug. Rendering owns the
// implementations; P6/P9 replace these consumers with explicit narrow ports.
const geometryEngine = PianoTrainerGeometry.create({
    score: {
        getGraphicalNote: (note, measure, staff) => osmdAdapter.getGraphicalNote(note, measure, staff),
        getMeasureBox: (measure, staff, units) => osmdAdapter.getMeasureBox(measure, staff, units),
        getCursorElement: () => osmdAdapter.getCursorElement(),
        getCurrentMeasureIndex: () => osmdAdapter.getCurrentMeasureIndex(),
        getStaffTopY: (measure, staff) => osmdAdapter.getStaffTopY(measure, staff)
    },
    document,
    getSvg: () => document.querySelector<SVGSVGElement>('#osmd-container svg'),
    getComputedStyle: node => window.getComputedStyle(node),
    clearOverlays: () => {
        feedbackOverlay.clear(); loopOverlay.clear(); window.FeedbackDebug?.clearSvgDebug();
    },
    fallbackHands: () => AppState.hands,
    describeNote: (note, measure, staff) => describeLogicalNoteForDebug(note, measure, staff),
    describeGraphicalNote: note => describeGraphicalNoteForDebug(note),
    debugLog: (name, detail) => debugLogAnchorResolution(name, detail)
});
const feedbackOverlay = PianoTrainerFeedbackOverlay.create({
    state: AppState, document, getSvg: () => geometryEngine.getSvg(),
    ensureGroup: id => geometryEngine.ensureGroup(id),
    getCurrentContextKey: () => getCurrentFeedbackContext().key
});
const loopOverlay = PianoTrainerLoopOverlay.create({
    bounds: AppState.looper, document, getSvg: () => geometryEngine.getSvg(),
    ensureGroup: id => geometryEngine.ensureGroup(id),
    enabled: () => {
        const control = document.getElementById('check-looper');
        if (!(control instanceof HTMLInputElement)) throw new Error('Missing required loop control: check-looper');
        return control.checked;
    },
    measureCount: () => osmdAdapter.getMeasureCount(),
    measureBox: (index, staff) => geometryEngine.getMeasureBox(index, staff)
});
const GeometryEngine = Object.assign(geometryEngine, {
    getFeedbackGroup: () => feedbackOverlay.getGroup(),
    getLooperGroup: () => loopOverlay.getGroup(),
    clearSvgFeedback: () => feedbackOverlay.clear(),
    clearSvgLooper: () => loopOverlay.clear(),
    drawFeedbackMarker: (anchor: PianoTrainerDomain.SvgPoint | null, correct: boolean) => feedbackOverlay.drawMarker(anchor, correct),
    drawStoredFeedbackMarker: (marker: PianoTrainerDomain.FeedbackMarker) => feedbackOverlay.drawStoredMarker(marker),
    renderLooper: () => loopOverlay.render()
});
function renderFeedbackOverlay() { feedbackOverlay.render(); }
function resolveFeedbackAnchor(midi: number, staffId: number | null, measure: number | null = null,
    anchor: PianoTrainerDomain.SvgPoint | number | null = null) {
    return geometryEngine.resolveFeedbackAnchor(midi, staffId, measure, anchor);
}
function getCursorSvgX() { return geometryEngine.getCursorSvgX(); }
