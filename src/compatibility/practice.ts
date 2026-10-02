// Temporary classic forwards; lazy callbacks preserve the legacy startup order.
// Concrete score/audio/render/optional LED objects are composed only here.
const practiceFeedback = PianoTrainerFeedbackState.create({
    state: AppState,
    getTraversalPosition: () => osmdAdapter.readPositions().traversal,
    resolveAnchor: (midi, staffId, measureIndex, anchor) => GeometryEngine.resolveFeedbackAnchor(midi, staffId, measureIndex, anchor),
    renderOverlay: () => renderFeedbackOverlay(),
    clearOverlay: () => GeometryEngine.clearSvgFeedback(),
    clearDebug: () => {
        if (typeof window.clearStickyDebug === 'function') window.clearStickyDebug();
    },
    pushDebugFrame: frame => window.FeedbackDebug?.pushStickyDebugFrame?.(frame)
});
const practiceScoring = PianoTrainerScoring.create({
    state: AppState, feedback: practiceFeedback, updateDisplay: () => updateScoreDisplay()
});
const practiceMatching = PianoTrainerInputMatching.create({
    state: AppState, getCursorX: () => GeometryEngine.getCursorSvgX(),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});
const practiceEarlyGrace = PianoTrainerEarlyGrace.create({
    state: AppState, getHandRole: staff => getAssignedHandRoleForStaff(staff),
    isPracticeHandEnabled: staff => isPracticeHandEnabledForStaff(staff),
    getTimeline: () => sharedScoreTraversal.ensurePreviewTimelineBuilt(),
    findTimelineIndex: PianoTrainerScoreTraversal.findMatchingTimelineIndex,
    getBeatsToWait: options => window.PTTiming.getTraversalBeatsToWait(options),
    getMeasureTimingInfo: index => getMeasureTimingInfo(index)
});
const practiceExpectedNotes = PianoTrainerExpectedNotes.create({
    state: AppState, getHandRole: staff => getAssignedHandRoleForStaff(staff),
    isMidiInRange: midi => isMidiInPlayerRange(midi),
    getAnchor: (ref, measureIndex, staffIndex) => {
        const note = osmdAdapter.resolveNote(ref);
        return note ? GeometryEngine.getNoteAnchor(note, measureIndex, staffIndex) : null;
    },
    describeNote: (ref, measureIndex, staffIndex) => {
        const note = osmdAdapter.resolveNote(ref);
        return note ? describeLogicalNoteForDebug(note, measureIndex, staffIndex) : {};
    },
    feedback: practiceFeedback, scoring: practiceScoring,
    getTraversalTimestamp: () => osmdAdapter.readPositions().traversal?.timestampWhole ?? null,
    pushDebugFrame: frame => window.FeedbackDebug?.pushStickyDebugFrame?.(frame),
    debugAnchor: (name, detail) => debugLogAnchorResolution(name, detail),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});
const practiceSustains = PianoTrainerSustainState.create({
    state: AppState, renderKeyboard: () => renderVirtualKeyboard(),
    setTimer: (callback, delay) => window.setTimeout(callback, delay)
});
const practiceInput = PianoTrainerInputController.create({
    state: AppState, audio: audioRouting, matching: practiceMatching, early: practiceEarlyGrace,
    feedback: practiceFeedback, scoring: practiceScoring,
    selectCalibration: midi => selectLedCalibrationMidi(midi),
    renderKeyboard: () => renderVirtualKeyboard(), advanceAfterHit: () => checkWaitModeAdvance(),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});
function triggerVirtualKey(midi: number, down: boolean, source: PianoTrainerDomain.InputSource = 'midi', velocity = 100) {
    practiceInput.handle({kind: down ? 'note-on' : 'note-off', note: midi, velocity, source,
        channel: null, receivedAtMs: performance.now()});
}
const getFeedbackContextKey = practiceFeedback.getFeedbackContextKey;
const getCurrentFeedbackContext = practiceFeedback.getCurrentFeedbackContext;
const registerHeldIncorrectFeedback = practiceFeedback.registerHeldIncorrectFeedback;
const releaseHeldIncorrectFeedback = practiceFeedback.releaseHeldIncorrectFeedback;
const drawFeedbackNote = practiceFeedback.drawFeedbackNote;
const findExpectedMatchForMidi = practiceMatching.findExpectedMatchForMidi;
const findSatisfiedOrSustainedMatchForMidi = practiceMatching.findSatisfiedOrSustainedMatchForMidi;
const getCombinedTieLength = osmdAdapter.getCombinedTieLength;
function buildExpectedNotesFromEntries(entries: PianoTrainerScoreTraversal.VoiceEntry[], measureIndex: number, timestamp: number | null = null) {
    practiceExpectedNotes.build(osmdAdapter.readPracticeEntries(entries, entry => getResolvedStaffAssignmentIdFromEntry(entry)), measureIndex, timestamp);
}
const processMissedNotes = practiceScoring.processMissedNotes;
const getSinglePracticedHandRole = practiceEarlyGrace.getSinglePracticedHandRole;
const getRenderableNotesForHandFromTimelineEvent = practiceEarlyGrace.getRenderableNotesForHandFromTimelineEvent;
const findSingleHandPracticeTimelineWindow = practiceEarlyGrace.findSingleHandPracticeTimelineWindow;
const findNextSingleHandPracticeTimelineEvent = practiceEarlyGrace.findNextSingleHandPracticeTimelineEvent;
const getSingleHandPracticeBeatsUntilNextEvent = practiceEarlyGrace.getSingleHandPracticeBeatsUntilNextEvent;
const tryReserveSingleHandEarlyGrace = practiceEarlyGrace.tryReserveSingleHandEarlyGrace;
const tryReserveRealtimeUpcomingHeldNote = practiceEarlyGrace.tryReserveRealtimeUpcomingHeldNote;
const startVisualSustains = practiceSustains.startVisualSustains;
