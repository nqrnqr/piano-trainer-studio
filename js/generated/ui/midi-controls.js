"use strict";
// DOM/device selection and persistence live here, outside MIDI protocol/service.
var PianoTrainerMidiControls;
(function (PianoTrainerMidiControls) {
    function create(ports) {
        const { document, storage: localStorage, normalizeMidiChannel, normalizeMidiInputChannel, setStoredBool } = ports;
        const { MIDI_IN_CHANNEL_STORAGE_KEY, MIDI_IN_ID_STORAGE_KEY, MIDI_IN_NAME_STORAGE_KEY, MIDI_LED_LOW_VELOCITY_STORAGE_KEY, MIDI_LIGHTS_CHANNEL_STORAGE_KEY, MIDI_LIGHTS_ID_STORAGE_KEY, MIDI_LIGHTS_NAME_STORAGE_KEY, MIDI_OUT_CHANNEL_STORAGE_KEY, MIDI_OUT_ID_STORAGE_KEY, MIDI_OUT_NAME_STORAGE_KEY } = ports.keys;
        const state = ports.state;
        const bindings = [];
        let initialized = false;
        function getSelect(id) {
            const element = document.getElementById(id);
            return element instanceof HTMLSelectElement ? element : null;
        }
        function bindSelect(id, handler) {
            const select = getSelect(id);
            if (!select)
                return;
            const listener = (event) => {
                if (event.target instanceof HTMLSelectElement)
                    handler(event.target);
            };
            select.addEventListener('change', listener);
            bindings.push(() => select.removeEventListener('change', listener));
        }
        function populateMidiChannelSelect(selectId, selectedValue = 1, { includeAny = false } = {}) {
            const select = getSelect(selectId);
            if (!select)
                return;
            const safeValue = includeAny
                ? normalizeMidiInputChannel(selectedValue, 0)
                : normalizeMidiChannel(selectedValue, 1);
            select.innerHTML = '';
            if (includeAny) {
                const anyOption = document.createElement('option');
                anyOption.value = '0';
                anyOption.textContent = 'Any';
                if (safeValue === 0)
                    anyOption.selected = true;
                select.appendChild(anyOption);
            }
            for (let channel = 1; channel <= 16; channel++) {
                const option = document.createElement('option');
                option.value = String(channel);
                option.textContent = String(channel);
                if (channel === safeValue)
                    option.selected = true;
                select.appendChild(option);
            }
        }
        function syncMidiInputConfigVisibility() {
            const midiInSelect = getSelect('midi-in');
            const midiInConfig = document.getElementById('midi-in-config');
            const midiInChannelRow = document.getElementById('midi-in-channel-row');
            const midiInKeysRow = document.getElementById('midi-in-keys-row');
            const playerRangeLabel = document.getElementById('player-piano-range-label');
            if (!midiInSelect || !midiInConfig)
                return;
            const hasMidiIn = midiInSelect.value && midiInSelect.value !== 'none';
            midiInConfig.classList.toggle('hidden', !hasMidiIn);
            if (midiInChannelRow)
                midiInChannelRow.classList.toggle('hidden', !hasMidiIn);
            if (midiInKeysRow)
                midiInKeysRow.classList.toggle('hidden', !hasMidiIn);
            if (playerRangeLabel)
                playerRangeLabel.classList.add('hidden');
        }
        function syncMidiOutChannelVisibility() {
            const midiOutSelect = getSelect('midi-out');
            const channelRow = document.getElementById('midi-out-channel-row');
            if (!channelRow || !midiOutSelect)
                return;
            const hasMidiOut = midiOutSelect.value && midiOutSelect.value !== 'none';
            channelRow.classList.toggle('hidden', !hasMidiOut);
        }
        function getSelectedMidiOutChannel() {
            return normalizeMidiChannel(getSelect('midi-out-channel')?.value, state.midiOutChannel || 1);
        }
        function getSelectedMidiLightsChannel() {
            return normalizeMidiChannel(getSelect('midi-lights-channel')?.value, state.midiLightsChannel || 1);
        }
        function getSelectedMidiInChannel() {
            return normalizeMidiInputChannel(getSelect('midi-in-channel')?.value, state.midiInChannel || 0);
        }
        function populateMIDIDevices() {
            const midiInSelect = getSelect('midi-in');
            const midiOutSelect = getSelect('midi-out');
            const midiLightsSelect = getSelect('midi-lights');
            if (!midiInSelect || !midiOutSelect)
                return;
            const savedIn = localStorage.getItem(MIDI_IN_ID_STORAGE_KEY);
            const savedOut = localStorage.getItem(MIDI_OUT_ID_STORAGE_KEY);
            const savedLights = localStorage.getItem(MIDI_LIGHTS_ID_STORAGE_KEY);
            populateMidiChannelSelect('midi-in-channel', state.midiInChannel || 0, { includeAny: true });
            populateMidiChannelSelect('midi-out-channel', state.midiOutChannel || 1);
            populateMidiChannelSelect('midi-lights-channel', state.midiLightsChannel || 1);
            midiInSelect.innerHTML = '<option value="none">None</option>';
            midiOutSelect.innerHTML = '<option value="none">None</option>';
            if (midiLightsSelect)
                midiLightsSelect.innerHTML = '<option value="none">None</option>';
            if (!ports.service.isReady()) {
                ports.updateConnections();
                syncMidiInputConfigVisibility();
                syncMidiOutChannelVisibility();
                return;
            }
            ports.clearPermissionHelp();
            for (let input of ports.service.listInputs()) {
                const option = document.createElement('option');
                option.value = input.id;
                option.text = String(input.name);
                midiInSelect.appendChild(option);
            }
            for (let output of ports.service.listOutputs()) {
                const optOut = document.createElement('option');
                optOut.value = output.id;
                optOut.text = String(output.name);
                midiOutSelect.appendChild(optOut);
                const optLights = document.createElement('option');
                optLights.value = output.id;
                optLights.text = String(output.name);
                midiLightsSelect?.appendChild(optLights);
            }
            if (savedIn && [...midiInSelect.options].some(o => o.value === savedIn)) {
                midiInSelect.value = savedIn;
                if (!ports.service.isInputBound(savedIn)) {
                    midiInSelect.dispatchEvent(new Event('change'));
                }
            }
            if (savedOut && [...midiOutSelect.options].some(o => o.value === savedOut)) {
                midiOutSelect.value = savedOut;
            }
            if (midiLightsSelect && savedLights && [...midiLightsSelect.options].some(o => o.value === savedLights)) {
                midiLightsSelect.value = savedLights;
            }
            ports.updateConnections();
            syncMidiInputConfigVisibility();
            syncMidiOutChannelVisibility();
            ports.syncRouting();
            if (ports.optionalLedEnabled && ports.ledTest()) {
                ports.ledTest()?.syncControls();
            }
        }
        function init() {
            if (initialized)
                return;
            initialized = true;
            bindSelect('midi-in', target => {
                localStorage.setItem(MIDI_IN_ID_STORAGE_KEY, target.value);
                if (target.value !== 'none') {
                    const selectedName = target.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, '') || 'MIDI In';
                    localStorage.setItem(MIDI_IN_NAME_STORAGE_KEY, selectedName);
                }
                else {
                    localStorage.removeItem(MIDI_IN_NAME_STORAGE_KEY);
                }
                ports.service.selectInput(target.value);
                syncMidiInputConfigVisibility();
                ports.updateConnections();
            });
            bindSelect('midi-in-channel', target => {
                const nextChannel = normalizeMidiInputChannel(target.value, 0);
                target.value = String(nextChannel);
                state.midiInChannel = nextChannel;
                localStorage.setItem(MIDI_IN_CHANNEL_STORAGE_KEY, String(nextChannel));
            });
            bindSelect('midi-out', target => {
                localStorage.setItem(MIDI_OUT_ID_STORAGE_KEY, target.value);
                if (target.value !== 'none') {
                    const selectedName = target.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, '') || 'MIDI Out';
                    localStorage.setItem(MIDI_OUT_NAME_STORAGE_KEY, selectedName);
                }
                else {
                    localStorage.removeItem(MIDI_OUT_NAME_STORAGE_KEY);
                }
                ports.updateConnections();
                syncMidiOutChannelVisibility();
                ports.syncRouting();
                ports.sendExpression();
            });
            bindSelect('midi-out-channel', target => {
                const nextChannel = normalizeMidiChannel(target.value, 1);
                target.value = String(nextChannel);
                state.midiOutChannel = nextChannel;
                localStorage.setItem(MIDI_OUT_CHANNEL_STORAGE_KEY, String(nextChannel));
                ports.syncRouting();
                ports.sendExpression();
            });
            if (ports.optionalLedEnabled)
                bindSelect('midi-lights-channel', target => {
                    const nextChannel = normalizeMidiChannel(target.value, 1);
                    target.value = String(nextChannel);
                    state.midiLightsChannel = nextChannel;
                    localStorage.setItem(MIDI_LIGHTS_CHANNEL_STORAGE_KEY, String(nextChannel));
                    ports.wipeLed();
                    ports.ledTest()?.stop({ statusText: getSelect('midi-lights')?.value === 'none' ? 'Select an LED MIDI device first.' : 'MIDI LED idle.' });
                    ports.renderKeyboard();
                });
            if (ports.optionalLedEnabled)
                bindSelect('midi-lights', target => {
                    localStorage.setItem(MIDI_LIGHTS_ID_STORAGE_KEY, target.value);
                    if (target.value !== 'none') {
                        const selectedName = target.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, '') || 'LED MIDI';
                        localStorage.setItem(MIDI_LIGHTS_NAME_STORAGE_KEY, selectedName);
                    }
                    else {
                        localStorage.removeItem(MIDI_LIGHTS_NAME_STORAGE_KEY);
                    }
                    ports.wipeLed();
                    ports.ledTest()?.stop({ statusText: target.value === 'none' ? 'Select an LED MIDI device first.' : 'MIDI LED idle.' });
                    ports.updateConnections();
                    ports.renderKeyboard();
                    ports.ledTest()?.syncControls();
                });
            const checkbox = document.getElementById('check-midi-led-low-velocity');
            if (ports.optionalLedEnabled && checkbox instanceof HTMLInputElement) {
                checkbox.checked = !!state.midiLedLowVelocity;
                const listener = (event) => {
                    if (!(event.target instanceof HTMLInputElement))
                        return;
                    state.midiLedLowVelocity = !!event.target.checked;
                    setStoredBool(MIDI_LED_LOW_VELOCITY_STORAGE_KEY, state.midiLedLowVelocity);
                    if (state.ledOutputMode === 'midi') {
                        ports.wipeLed();
                        ports.renderKeyboard();
                    }
                };
                checkbox.addEventListener('change', listener);
                bindings.push(() => checkbox.removeEventListener('change', listener));
            }
        }
        function dispose() {
            for (const unbind of bindings.splice(0))
                unbind();
            initialized = false;
        }
        function onReady() {
            ports.clearPermissionHelp();
            populateMidiChannelSelect('midi-in-channel', state.midiInChannel || 0, { includeAny: true });
            populateMidiChannelSelect('midi-out-channel', state.midiOutChannel || 1);
            populateMidiChannelSelect('midi-lights-channel', state.midiLightsChannel || 1);
            populateMIDIDevices();
            ports.refreshConnections();
            syncMidiInputConfigVisibility();
            syncMidiOutChannelVisibility();
        }
        function onDevicesChanged() {
            populateMIDIDevices();
            ports.refreshConnections();
            syncMidiInputConfigVisibility();
            syncMidiOutChannelVisibility();
            ports.syncRouting();
        }
        const getSelectedOutputId = () => getSelect('midi-out')?.value || 'none';
        return { init, dispose, onReady, onDevicesChanged, populateMIDIDevices, populateMidiChannelSelect,
            syncMidiInputConfigVisibility, syncMidiOutChannelVisibility, getSelectedMidiInChannel,
            getSelectedMidiOutChannel, getSelectedMidiLightsChannel, getSelectedOutputId };
    }
    PianoTrainerMidiControls.create = create;
})(PianoTrainerMidiControls || (PianoTrainerMidiControls = {}));
//# sourceMappingURL=midi-controls.js.map