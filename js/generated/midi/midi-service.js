"use strict";
// Web MIDI is confined to this device boundary. UI and practice receive ports.
var PianoTrainerMidiService;
(function (PianoTrainerMidiService) {
    function create(ports) {
        let access = null;
        let activeInput = null;
        let activeCallback = null;
        let pending = null;
        let epoch = 0;
        function detachInput() {
            if (activeInput && activeInput.onmidimessage === activeCallback)
                activeInput.onmidimessage = null;
            activeInput = null;
            activeCallback = null;
        }
        function selectInput(id) {
            detachInput();
            if (id === 'none')
                return;
            const input = access?.inputs.get(id);
            if (!input)
                return;
            activeInput = input;
            activeCallback = event => {
                const data = event.data;
                if (!data)
                    return;
                const status = data[0];
                const note = data[1];
                const velocity = data.length > 2 ? data[2] : 0;
                // Preserve pruning/filter order for every message, including CC.
                if (ports.isEcho(status, note, velocity))
                    return;
                const decoded = PianoTrainerMidiInput.decode(data, ports.selectedInputChannel(), ports.nowMs());
                if (decoded)
                    ports.dispatch(decoded);
            };
            input.onmidimessage = activeCallback;
        }
        function isInputBound(id) {
            return !!activeInput && activeInput.id === id && activeInput === access?.inputs.get(id)
                && activeInput.onmidimessage === activeCallback;
        }
        const onStateChange = () => {
            ports.onDevicesChanged();
            // Clear removed device listeners; also handle a replacement port with
            // the same ID. Reconnection UI can select the saved ID on the next event.
            if (activeInput && !isInputBound(activeInput.id))
                selectInput(activeInput.id);
        };
        function init() {
            if (pending)
                return pending;
            if (access || !ports.requestAccess)
                return Promise.resolve();
            const currentEpoch = epoch;
            const requestAccess = ports.requestAccess;
            const work = (async () => {
                try {
                    const nextAccess = await requestAccess();
                    if (epoch !== currentEpoch)
                        return;
                    access = nextAccess;
                    ports.onReady();
                    if (epoch === currentEpoch && access === nextAccess)
                        nextAccess.onstatechange = onStateChange;
                }
                catch (error) {
                    if (epoch === currentEpoch)
                        ports.onAccessError(error);
                }
            })();
            const tracked = work.finally(() => { if (pending === tracked)
                pending = null; });
            pending = tracked;
            return tracked;
        }
        function dispose() {
            epoch++;
            detachInput();
            if (access?.onstatechange === onStateChange)
                access.onstatechange = null;
            access = null;
            pending = null;
        }
        function getPort(direction, id) {
            return direction === 'input' ? access?.inputs.get(id) : access?.outputs.get(id);
        }
        function getOutput(id) { return access?.outputs.get(id); }
        function listInputs() { return access ? Array.from(access.inputs.values()) : []; }
        function listOutputs() { return access ? Array.from(access.outputs.values()) : []; }
        const isReady = () => access !== null;
        return { init, dispose, selectInput, isInputBound, getPort, getOutput, listInputs, listOutputs, isReady };
    }
    PianoTrainerMidiService.create = create;
})(PianoTrainerMidiService || (PianoTrainerMidiService = {}));
//# sourceMappingURL=midi-service.js.map