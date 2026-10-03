"use strict";
// Temporary diagnostics composition; vendor snapshots stay outside the UI factory.
const feedbackDebug = PianoTrainerFeedbackDebug.create({ document, state: AppState,
    getSvg: () => GeometryEngine.getSvg(), ensureGroup: id => GeometryEngine.ensureGroup(id),
    readEnabled: () => getStoredBool(SETTINGS_DEBUG_STORAGE_KEY, false),
    saveEnabled: enabled => setStoredBool(SETTINGS_DEBUG_STORAGE_KEY, enabled),
    publishStickyEnabled: enabled => { window.debugStickyAnchors = enabled; },
    setInterval: (callback, delay) => window.setInterval(callback, delay), clearInterval: id => window.clearInterval(id),
    now: () => new Date(), log: (...args) => console.log(...args), warn: (...args) => console.warn(...args), error: (...args) => console.error(...args) });
window.FeedbackDebug = Object.assign(feedbackDebug, PianoTrainerOsmdDebugObservation);
const debugLogEvent = (label, payload = {}) => feedbackDebug.debugLogEvent(label, payload);
const describeLogicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeLogicalNoteForDebug;
const describeGraphicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeGraphicalNoteForDebug;
const debugLogAnchorResolution = (label, payload = {}) => feedbackDebug.debugLogAnchorResolution(label, payload);
const isDebugEnabled = () => feedbackDebug.isDebugEnabled();
const syncDebugCheckbox = () => feedbackDebug.syncDebugCheckbox();
const setDebugEnabled = (enabled, options = {}) => feedbackDebug.setDebugEnabled(enabled, options);
window.forcePianoTrainerDebugStatus = tag => feedbackDebug.forcePianoTrainerDebugStatus(tag);
window.setDebugStickyFrames = count => feedbackDebug.setDebugStickyFrames(count);
window.clearStickyDebug = () => feedbackDebug.clearStickyDebug();
Object.defineProperty(window, 'debugAnchors', {
    get: () => AppState.debugPersistentAnchors,
    set: (value) => feedbackDebug.setDebugEnabled(!!value, { clearHistory: !value, logChange: !!value, reason: 'window.debugAnchors' })
});
for (const flag of ['debugEventFlow', 'debugMatchLogs', 'debugAnchorResolution']) {
    Object.defineProperty(window, flag, { get: () => AppState[flag], set: (value) => {
            AppState[flag] = !!value;
            feedbackDebug.syncDebugCheckbox();
        } });
}
feedbackDebug.init();
//# sourceMappingURL=feedback-debug.js.map