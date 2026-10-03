export function getUnknownErrorMessage(error: unknown): unknown {
    return typeof error === "object" && error !== null && "message" in error ? error.message : undefined;
}
export function isLikelyBrowserAccessIssue(err: unknown) {
    const message = String(getUnknownErrorMessage(err) || err || '').toLowerCase();
    return message.includes('failed to fetch') ||
        message.includes('networkerror') ||
        message.includes('load failed') ||
        message.includes('blocked') ||
        message.includes('mixed content') ||
        message.includes('connection refused') ||
        message.includes('cors');
}
export function getMidiPermissionHelpText() {
    return 'MIDI access appears blocked or unavailable. Allow MIDI/device access in your browser, then refresh. MIDI only works on the device running this browser.';
}
export function getWledPermissionHelpText(kind = 'wled') {
    if (kind === 'helper') {
        return 'DDP helper access failed. Allow local device access in your browser, then refresh. If access is already allowed, start the helper on this same device.';
    }
    return 'Browser access to local devices may be blocked. Allow local network or local device access for this site, then refresh and try WLED again.';
}
export function createPermissionHelp(document: Document) {
function setPermissionNote(elementId: string, message: unknown) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = String(message || '').trim();
    el.textContent = text;
    el.classList.toggle('hidden', !text);
}
function showMidiPermissionHelp(message: unknown) {
    setPermissionNote('midi-permission-help', message || '');
}
function clearMidiPermissionHelp() {
    setPermissionNote('midi-permission-help', '');
}
function showWledPermissionHelp(message: unknown) {
    setPermissionNote('wled-permission-help', message || '');
}
function clearWledPermissionHelp() {
    setPermissionNote('wled-permission-help', '');
}
return {showMidiPermissionHelp,clearMidiPermissionHelp,showWledPermissionHelp,clearWledPermissionHelp};
}
