"use strict";
// Own the original MembraneSynth without allocating a node during composition.
var PianoTrainerMetronomeOutput;
(function (PianoTrainerMetronomeOutput) {
    function create(ports) {
        let synth = null;
        function init() {
            if (synth)
                return;
            synth = new ports.tone.MembraneSynth({ pitchDecay: 0.008, octaves: 1.5,
                oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 } }).toDestination();
        }
        function play(note, duration, time, gain) {
            synth.triggerAttackRelease(note, duration, time, gain);
        }
        function setVolumeDecibels(value) { synth.volume.value = value; }
        function dispose() { synth?.dispose(); synth = null; }
        return { init, play, setVolumeDecibels, dispose };
    }
    PianoTrainerMetronomeOutput.create = create;
})(PianoTrainerMetronomeOutput || (PianoTrainerMetronomeOutput = {}));
//# sourceMappingURL=metronome-output.js.map