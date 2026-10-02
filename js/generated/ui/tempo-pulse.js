"use strict";
// DOM lookup and the forced layout read stay at the UI boundary.
var PianoTrainerTempoPulse;
(function (PianoTrainerTempoPulse) {
    function create(getElement) {
        return { getTarget() {
                const element = getElement();
                return element ? {
                    restart() { element.classList.remove('metronome-pulse'); void element.offsetWidth; element.classList.add('metronome-pulse'); },
                    hide() { element.classList.remove('metronome-pulse'); }
                } : null;
            } };
    }
    PianoTrainerTempoPulse.create = create;
})(PianoTrainerTempoPulse || (PianoTrainerTempoPulse = {}));
//# sourceMappingURL=tempo-pulse.js.map