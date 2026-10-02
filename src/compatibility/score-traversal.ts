// Temporary classic-script forwards. Callbacks resolve the later legacy core
// functions lazily; the shared service has no hardware, DOM or vendor globals.
const sharedScoreTraversal = PianoTrainerScoreTraversal.create({
    state: AppState,
    getCursor: () => getLegacyTraversalCursor(),
    resolveStaffId: note => getResolvedStaffAssignmentIdFromNote(note),
    isPracticeHandEnabled: staffId => isPracticeHandEnabledForStaff(staffId),
    getHandRole: staffId => getAssignedHandRoleForStaff(staffId),
    isMidiInRange: midi => isMidiInPlayerRange(midi),
    debugLog: (name, detail) => debugLogEvent(name, detail)
});
const isRenderableAttackNote = PianoTrainerScoreTraversal.isRenderableAttackNote;
const makeLedPreviewEntrySignature = PianoTrainerScoreTraversal.makeEntrySignature;
const findMatchingLedPreviewTimelineIndex = PianoTrainerScoreTraversal.findMatchingTimelineIndex;
const describeEntryCollectionForLedDebug = sharedScoreTraversal.describeEntries;
const collectRenderablePreviewNotesFromEntries = sharedScoreTraversal.collectRenderablePreviewNotes;
const buildLedPreviewTimelineEvent = sharedScoreTraversal.buildTimelineEvent;
const restoreCursorToMeasureAndTimestamp = sharedScoreTraversal.restoreToMeasureAndTimestamp;
const ensureLedPreviewTimelineBuilt = sharedScoreTraversal.ensurePreviewTimelineBuilt;
const resolveLedPreviewTraversalIndex = sharedScoreTraversal.resolveTraversalIndex;
const collectFutureLedPreviewEvents = sharedScoreTraversal.collectFuturePreviewEvents;
