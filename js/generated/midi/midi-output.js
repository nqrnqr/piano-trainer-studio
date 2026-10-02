"use strict";
// One implementation: preserve the later legacy core's effective MIDI behavior.
var PianoTrainerMidiOutput;
(function (PianoTrainerMidiOutput) {
    function expressionValue(value) {
        const percent = Math.max(0, Math.min(100, Number(value) || 0));
        return Math.max(0, Math.min(127, Math.round((percent / 100) * 127)));
    }
    PianoTrainerMidiOutput.expressionValue = expressionValue;
    function create(ports) {
        const timers = new Set();
        const status = (base) => base + (ports.normalizeChannel(ports.getChannel() || 1) - 1);
        function noteOn(midi, velocity = 100) {
            const output = ports.getOutput();
            if (!output)
                return false;
            const messageStatus = status(0x90);
            const finalVelocity = ports.normalizeVelocity(velocity);
            ports.remember(messageStatus, midi, finalVelocity);
            output.send([messageStatus, midi, finalVelocity]);
            return true;
        }
        function noteOff(midi) {
            const output = ports.getOutput();
            if (!output)
                return false;
            const messageStatus = status(0x80);
            ports.remember(messageStatus, midi, 0);
            output.send([messageStatus, midi, 0]);
            return true;
        }
        function expression(value = ports.getVolume()) {
            const output = ports.getOutput();
            if (!output)
                return false;
            output.send([status(0xB0), 11, expressionValue(value)]);
            return true;
        }
        function scheduleNote(midi, durationMs, velocity = 100) {
            if (!noteOn(midi, velocity))
                return;
            const id = ports.setTimer(() => { timers.delete(id); noteOff(midi); }, Math.max(0, Number(durationMs) || 0));
            timers.add(id);
        }
        function silence() {
            const output = ports.getOutput();
            if (!output)
                return;
            const controlStatus = status(0xB0);
            output.send([controlStatus, 64, 0]);
            output.send([controlStatus, 123, 0]);
            output.send([controlStatus, 120, 0]);
        }
        function dispose() {
            for (const id of timers)
                ports.clearTimer(id);
            timers.clear();
        }
        return { noteOn, noteOff, expression, scheduleNote, silence, dispose, status, getOutput: ports.getOutput };
    }
    PianoTrainerMidiOutput.create = create;
})(PianoTrainerMidiOutput || (PianoTrainerMidiOutput = {}));
//# sourceMappingURL=midi-output.js.map