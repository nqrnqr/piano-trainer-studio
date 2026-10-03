"use strict";
// Read-only connection presentation; hardware observations enter through typed ports.
var PianoTrainerConnectionStatus;
(function (PianoTrainerConnectionStatus) {
    function create(ports) {
        function updateConnectionStatusIndicator(elementId, state, labelText = null) {
            const el = ports.document.getElementById(elementId);
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
            const input = ports.getPort('input', selectedId);
            return input && input.state !== 'disconnected' ? 'connected' : 'disconnected';
        }
        function getSelectedMidiOutputState() {
            const midiOutSelect = getMidiConnectionSelect('midi-out');
            const selectedId = midiOutSelect?.value || 'none';
            if (selectedId === 'none')
                return 'none';
            const output = ports.getPort('output', selectedId);
            return output && output.state !== 'disconnected' ? 'connected' : 'disconnected';
        }
        function getSelectedLedMidiOutputState() {
            const midiLightsSelect = getMidiConnectionSelect('midi-lights');
            const selectedId = midiLightsSelect?.value || 'none';
            if (selectedId === 'none')
                return 'none';
            const output = ports.getPort('output', selectedId);
            return output && output.state !== 'disconnected' ? 'connected' : 'disconnected';
        }
        function updateConnectionStatuses() {
            ports.syncMidiOutChannelVisibility();
            updateConnectionStatusIndicator('midi-in-connection-status', getSelectedMidiInputState());
            updateConnectionStatusIndicator('midi-out-connection-status', getSelectedMidiOutputState());
            let ledState = 'none';
            if (ports.state.ledOutputMode === 'midi') {
                ledState = getSelectedLedMidiOutputState();
            }
            else if (ports.state.ledOutputMode === 'wled') {
                if (!String(ports.state.wledIp || '').trim()) {
                    ledState = 'none';
                }
                else {
                    ledState = ports.state.wledConnectionState || 'disconnected';
                }
            }
            updateConnectionStatusIndicator('led-connection-status', ledState);
        }
        function refreshConnectionStatuses() {
            updateConnectionStatuses();
            ports.syncWledStatus();
        }
        function getMidiConnectionSelect(id) {
            const element = ports.document.getElementById(id);
            return element instanceof HTMLSelectElement ? element : null;
        }
        return { updateConnectionStatusIndicator, getSelectedMidiInputState, getSelectedMidiOutputState, getSelectedLedMidiOutputState, updateConnectionStatuses, refreshConnectionStatuses };
    }
    PianoTrainerConnectionStatus.create = create;
})(PianoTrainerConnectionStatus || (PianoTrainerConnectionStatus = {}));
//# sourceMappingURL=connection-status.js.map