"use strict";
// Shared browser/device access messages, independent of LED startup.
function getUnknownErrorMessage(error) {
    return typeof error === "object" && error !== null && "message" in error ? error.message : undefined;
}
function setPermissionNote(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el)
        return;
    const text = String(message || '').trim();
    el.textContent = text;
    el.classList.toggle('hidden', !text);
}
function showMidiPermissionHelp(message) {
    setPermissionNote('midi-permission-help', message || '');
}
function clearMidiPermissionHelp() {
    setPermissionNote('midi-permission-help', '');
}
function showWledPermissionHelp(message) {
    setPermissionNote('wled-permission-help', message || '');
}
function clearWledPermissionHelp() {
    setPermissionNote('wled-permission-help', '');
}
function isLikelyBrowserAccessIssue(err) {
    const message = String(getUnknownErrorMessage(err) || err || '').toLowerCase();
    return message.includes('failed to fetch') ||
        message.includes('networkerror') ||
        message.includes('load failed') ||
        message.includes('blocked') ||
        message.includes('mixed content') ||
        message.includes('connection refused') ||
        message.includes('cors');
}
function getMidiPermissionHelpText() {
    return 'MIDI access appears blocked or unavailable. Allow MIDI/device access in your browser, then refresh. MIDI only works on the device running this browser.';
}
function getWledPermissionHelpText(kind = 'wled') {
    if (kind === 'helper') {
        return 'DDP helper access failed. Allow local device access in your browser, then refresh. If access is already allowed, start the helper on this same device.';
    }
    return 'Browser access to local devices may be blocked. Allow local network or local device access for this site, then refresh and try WLED again.';
}
window.showMidiPermissionHelp = showMidiPermissionHelp;
window.clearMidiPermissionHelp = clearMidiPermissionHelp;
window.showWledPermissionHelp = showWledPermissionHelp;
window.clearWledPermissionHelp = clearWledPermissionHelp;
//# sourceMappingURL=permission-help.js.map