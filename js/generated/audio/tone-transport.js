"use strict";
// The old coordinator only controls Transport; it owns no Transport events.
var PianoTrainerToneTransport;
(function (PianoTrainerToneTransport) {
    function create(tone) {
        return {
            stop: () => { tone.Transport.stop(); },
            pause: () => { tone.Transport.pause(); },
            start: () => { tone.Transport.start(); },
            setBpm: (value) => { tone.Transport.bpm.value = value; }
        };
    }
    PianoTrainerToneTransport.create = create;
})(PianoTrainerToneTransport || (PianoTrainerToneTransport = {}));
//# sourceMappingURL=tone-transport.js.map