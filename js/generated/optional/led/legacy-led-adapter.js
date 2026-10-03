"use strict";
// The core depends on this output port. Hardware and LED UI stay in legacy JS.
var PianoTrainerOptionalLed;
(function (PianoTrainerOptionalLed) {
    function createNoop() {
        const noop = () => { };
        return { enabled: false, initControls: noop, initOutput: noop, refreshMapping: noop, invalidate: noop,
            positionCalibrationPanel: noop, render: noop, renderOutputs: noop,
            updateHardware: noop, wipeHardware: noop, clearOutputs: async () => { },
            start: noop, dispose: noop };
    }
    PianoTrainerOptionalLed.createNoop = createNoop;
    function createLegacy(ports) {
        let rafId = null;
        let running = false;
        let active = true;
        let generation = 0;
        function tick(token) {
            if (!running || token !== generation)
                return;
            if (ports.isCalibrating())
                ports.renderKeyboard();
            else
                ports.renderOutputs();
            rafId = ports.requestFrame(() => tick(token));
        }
        return {
            enabled: true,
            initControls: () => { active = true; ports.initControls(); },
            initOutput: () => { active = true; ports.initOutput(); },
            refreshMapping: () => ports.refreshMapping(),
            invalidate: () => ports.invalidate(),
            positionCalibrationPanel: () => ports.positionCalibrationPanel(),
            render: (states, depth) => ports.render(states, depth),
            renderOutputs: () => ports.renderOutputs(),
            updateHardware: (midi, next, previous) => ports.updateHardware(midi, next, previous),
            wipeHardware: () => ports.wipeHardware(),
            clearOutputs: () => ports.clearOutputs(),
            start() {
                if (running)
                    return;
                active = true;
                running = true;
                const token = generation;
                rafId = ports.requestFrame(() => tick(token));
            },
            dispose() {
                if (!active)
                    return;
                active = false;
                generation += 1;
                running = false;
                if (rafId !== null)
                    ports.cancelFrame(rafId);
                rafId = null;
                ports.stopHardwareResources();
            }
        };
    }
    PianoTrainerOptionalLed.createLegacy = createLegacy;
})(PianoTrainerOptionalLed || (PianoTrainerOptionalLed = {}));
//# sourceMappingURL=legacy-led-adapter.js.map