"use strict";
// DOM reads stay at the UI boundary. Factories do not bind listeners.
var PianoTrainerPlaybackControls;
(function (PianoTrainerPlaybackControls) {
    function create(ports) {
        function input(id) {
            const element = ports.getElement(id);
            if (!(element instanceof HTMLInputElement))
                throw new Error(`Missing required playback input: ${id}`);
            return element;
        }
        return {
            isLoopEnabled: () => input('check-looper').checked,
            isLoopEnabledAtEnd: () => {
                const element = ports.getElement('check-looper');
                return element instanceof HTMLInputElement && element.checked;
            },
            readLoopMin: () => parseInt(input('val-loop-min').value),
            readLoopMax: () => parseInt(input('val-loop-max').value),
            isMetronomeEnabled: () => {
                const element = ports.getElement('check-metronome');
                return element instanceof HTMLInputElement && element.checked;
            }
        };
    }
    PianoTrainerPlaybackControls.create = create;
})(PianoTrainerPlaybackControls || (PianoTrainerPlaybackControls = {}));
//# sourceMappingURL=playback-controls.js.map