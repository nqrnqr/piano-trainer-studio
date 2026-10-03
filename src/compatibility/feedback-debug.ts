// Temporary diagnostics composition; vendor snapshots stay outside the UI factory.
const feedbackDebug = PianoTrainerFeedbackDebug.create({document, state: AppState,
    getSvg: () => GeometryEngine.getSvg(), ensureGroup: id => GeometryEngine.ensureGroup(id),
    readEnabled: () => getStoredBool(SETTINGS_DEBUG_STORAGE_KEY, false),
    saveEnabled: enabled => setStoredBool(SETTINGS_DEBUG_STORAGE_KEY, enabled),
    publishStickyEnabled: enabled => {window.debugStickyAnchors = enabled;},
    setInterval: (callback, delay) => window.setInterval(callback, delay), clearInterval: id => window.clearInterval(id),
    now: () => new Date(), log: (...args) => console.log(...args), warn: (...args) => console.warn(...args), error: (...args) => console.error(...args)});
window.FeedbackDebug = Object.assign(feedbackDebug, PianoTrainerOsmdDebugObservation);
const debugLogEvent = (label: string, payload: Readonly<Record<string, unknown>> = {}) => feedbackDebug.debugLogEvent(label, payload);
const describeLogicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeLogicalNoteForDebug;
const describeGraphicalNoteForDebug = PianoTrainerOsmdDebugObservation.describeGraphicalNoteForDebug;
const debugLogAnchorResolution = (label: string, payload: Readonly<Record<string, unknown>> = {}) => feedbackDebug.debugLogAnchorResolution(label, payload);
const isDebugEnabled = () => feedbackDebug.isDebugEnabled();
const syncDebugCheckbox = () => feedbackDebug.syncDebugCheckbox();
const setDebugEnabled = (enabled: boolean, options: PianoTrainerFeedbackDebug.Options = {}) => feedbackDebug.setDebugEnabled(enabled, options);
window.forcePianoTrainerDebugStatus = tag => feedbackDebug.forcePianoTrainerDebugStatus(tag);
window.setDebugStickyFrames = count => feedbackDebug.setDebugStickyFrames(count);
window.clearStickyDebug = () => feedbackDebug.clearStickyDebug();
Object.defineProperty(window, 'debugAnchors', {
    get: () => AppState.debugPersistentAnchors,
    set: (value: unknown) => feedbackDebug.setDebugEnabled(!!value, {clearHistory: !value, logChange: !!value, reason: 'window.debugAnchors'})
});
for (const flag of ['debugEventFlow', 'debugMatchLogs', 'debugAnchorResolution'] as const) {
    Object.defineProperty(window, flag, {get: () => AppState[flag], set: (value: unknown) => {
        AppState[flag] = !!value; feedbackDebug.syncDebugCheckbox();
    }});
}
feedbackDebug.init();
interface Window {
    debugStickyAnchors?: boolean;
    forcePianoTrainerDebugStatus?: (tag?: string) => ReturnType<PianoTrainerFeedbackDebug.Service['forcePianoTrainerDebugStatus']>;
    setDebugStickyFrames?: (count: string | number) => number;
}
