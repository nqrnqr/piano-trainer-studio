"use strict";
// MIDI connection display remains available with optional LED disabled.
function updateConnectionStatusIndicator(elementId, state, labelText = null) {
    const el = document.getElementById(elementId);
    if (!el)
        return;
    const dot = el.querySelector('.status-dot');
    const label = el.querySelector('.status-label');
    if (!dot || !label)
        return;
    dot.classList.remove('status-connected', 'status-disconnected', 'status-none');
    el.classList.remove('status-connected-text', 'status-disconnected-text', 'status-none-text');
    let resolvedText = labelText;
    if (state === 'connected') {
        dot.classList.add('status-connected');
        el.classList.add('status-connected-text');
        resolvedText = resolvedText || 'Connected';
    }
    else if (state === 'disconnected') {
        dot.classList.add('status-disconnected');
        el.classList.add('status-disconnected-text');
        resolvedText = resolvedText || 'Disconnected';
    }
    else {
        dot.classList.add('status-none');
        el.classList.add('status-none-text');
        resolvedText = resolvedText || 'None';
    }
    label.textContent = resolvedText;
}
function getSelectedMidiInputState() {
    const midiInSelect = getMidiConnectionSelect('midi-in');
    const selectedId = midiInSelect?.value || 'none';
    if (selectedId === 'none')
        return 'none';
    const input = getLegacyMidiPort('input', selectedId);
    return input && input.state !== 'disconnected' ? 'connected' : 'disconnected';
}
function getSelectedMidiOutputState() {
    const midiOutSelect = getMidiConnectionSelect('midi-out');
    const selectedId = midiOutSelect?.value || 'none';
    if (selectedId === 'none')
        return 'none';
    const output = getLegacyMidiPort('output', selectedId);
    return output && output.state !== 'disconnected' ? 'connected' : 'disconnected';
}
function getSelectedLedMidiOutputState() {
    const midiLightsSelect = getMidiConnectionSelect('midi-lights');
    const selectedId = midiLightsSelect?.value || 'none';
    if (selectedId === 'none')
        return 'none';
    const output = getLegacyMidiPort('output', selectedId);
    return output && output.state !== 'disconnected' ? 'connected' : 'disconnected';
}
function updateConnectionStatuses() {
    if (typeof syncMidiOutChannelVisibility === 'function') {
        syncMidiOutChannelVisibility();
    }
    updateConnectionStatusIndicator('midi-in-connection-status', getSelectedMidiInputState());
    updateConnectionStatusIndicator('midi-out-connection-status', getSelectedMidiOutputState());
    let ledState = 'none';
    if (AppState.ledOutputMode === 'midi') {
        ledState = getSelectedLedMidiOutputState();
    }
    else if (AppState.ledOutputMode === 'wled') {
        if (!String(AppState.wledIp || '').trim()) {
            ledState = 'none';
        }
        else {
            ledState = AppState.wledConnectionState || 'disconnected';
        }
    }
    updateConnectionStatusIndicator('led-connection-status', ledState);
}
function refreshConnectionStatuses() {
    updateConnectionStatuses();
    syncWledStatus();
}
function getMidiConnectionSelect(id) {
    const element = document.getElementById(id);
    return element instanceof HTMLSelectElement ? element : null;
}
//# sourceMappingURL=connection-status.js.map