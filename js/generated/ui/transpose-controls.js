"use strict";
// Transpose DOM IDs, input values and one owned set of native listeners.
var PianoTrainerTransposeControls;
(function (PianoTrainerTransposeControls) {
    function create(ports) {
        const document = ports.document;
        function optional(id, type) {
            const element = document.getElementById(id);
            if (element && !(element instanceof type))
                throw new Error(`Invalid transpose control: ${id}`);
            return element;
        }
        const panel = optional('transpose-popup', HTMLElement), sourceLabel = optional('transpose-current-key', HTMLElement), modeSelect = optional('transpose-mode', HTMLSelectElement), targetKeySelect = optional('transpose-target-key', HTMLSelectElement), semitoneInput = optional('transpose-semitones', HTMLInputElement), semitoneValue = optional('transpose-semitones-value', HTMLElement), updateKeySignatureCheckbox = optional('transpose-update-key-signature', HTMLInputElement), applyButton = optional('btn-transpose-apply', HTMLButtonElement), resetButton = optional('btn-transpose-reset', HTMLButtonElement), statusEl = optional('transpose-status', HTMLElement);
        const modeRows = Array.from(document.querySelectorAll('[data-transpose-mode-row]'));
        const commands = ports.commands;
        let initialized = false;
        function setStatus(text, isError = false) {
            if (!statusEl)
                return;
            statusEl.textContent = text || '';
            statusEl.classList.toggle('is-error', !!isError);
        }
        function syncUiFromState() {
            const state = commands.ensureTransposeState();
            if (sourceLabel)
                sourceLabel.textContent = state.sourceKeyLabel || 'Unknown';
            if (modeSelect)
                modeSelect.value = state.mode || 'key';
            if (targetKeySelect && state.targetKey)
                targetKeySelect.value = state.targetKey;
            if (semitoneInput)
                semitoneInput.value = String(Number(state.semitones || 0));
            if (semitoneValue)
                semitoneValue.textContent = String(Number(state.semitones || 0));
            if (updateKeySignatureCheckbox)
                updateKeySignatureCheckbox.checked = state.updateKeySignature !== false;
            const enabled = !!state.available;
            for (const control of [modeSelect, targetKeySelect, semitoneInput, updateKeySignatureCheckbox, applyButton, resetButton])
                if (control)
                    control.disabled = !enabled;
            modeRows.forEach(row => row.classList.toggle('hidden', row.getAttribute('data-transpose-mode-row') !== state.mode));
            if (!enabled)
                setStatus(state.disableReason || 'Load a MusicXML-based score to enable transpose.');
            else if (state.active)
                setStatus(`Applied: ${state.activeLabel || 'Transposed score'}`);
            else
                setStatus('Ready. Transpose is applied from the original source score each time. \nTanspose by Key Signature or by Semitones');
        }
        const onMode = () => { commands.ensureTransposeState().mode = modeSelect.value === 'semitone' ? 'semitone' : 'key'; syncUiFromState(); };
        const onTarget = () => { commands.ensureTransposeState().targetKey = targetKeySelect.value; };
        const onSemitones = () => { const state = commands.ensureTransposeState(); state.semitones = Number(semitoneInput.value || 0); if (semitoneValue)
            semitoneValue.textContent = String(state.semitones); };
        const onSignature = () => { commands.ensureTransposeState().updateKeySignature = !!updateKeySignatureCheckbox.checked; };
        const onApply = () => commands.applyTranspose(), onReset = () => commands.resetTranspose();
        const bindings = [[modeSelect, 'change', onMode], [targetKeySelect, 'change', onTarget],
            [semitoneInput, 'input', onSemitones], [updateKeySignatureCheckbox, 'change', onSignature], [applyButton, 'click', onApply], [resetButton, 'click', onReset]];
        function init() {
            if (initialized)
                return;
            initialized = true;
            for (const [element, event, handler] of bindings)
                element?.addEventListener(event, handler);
            const engine = ports.getEngine();
            if (targetKeySelect && engine)
                targetKeySelect.innerHTML = engine.getKeyPresets().map(preset => `<option value="${preset.value}">${preset.label}</option>`).join('');
            syncUiFromState();
        }
        function dispose() { if (initialized) {
            initialized = false;
            for (const [element, event, handler] of bindings)
                element?.removeEventListener(event, handler);
        } }
        return { init, dispose, setStatus, syncUiFromState, getPanel: () => panel };
    }
    PianoTrainerTransposeControls.create = create;
})(PianoTrainerTransposeControls || (PianoTrainerTransposeControls = {}));
//# sourceMappingURL=transpose-controls.js.map