"use strict";
// Protocol parsing and echo filtering have no DOM or device dependencies.
var PianoTrainerMidiInput;
(function (PianoTrainerMidiInput) {
    function decode(data, selectedChannel, receivedAtMs) {
        if (!data)
            return null;
        const status = data[0];
        const note = data[1];
        const velocity = data.length > 2 ? data[2] : 0;
        const messageChannel = (status & 0x0F) + 1;
        if (selectedChannel > 0 && messageChannel !== selectedChannel)
            return null;
        const command = status & 0xF0;
        if (command !== 0x90 && command !== 0x80)
            return null;
        // Web MIDI provides bytes. Guard malformed test/import sources before
        // they cross the domain boundary; retain the legacy two-byte release.
        if (!Number.isInteger(status) || status < 0 || status > 255 ||
            !Number.isInteger(note) || note < 0 || note > 127 ||
            !Number.isInteger(velocity) || velocity < 0 || velocity > 127)
            return null;
        return {
            kind: command === 0x90 && velocity > 0 ? 'note-on' : 'note-off',
            note, velocity, source: 'midi',
            // The mask above proves 1..16; configuration's Any=0 is not a channel.
            channel: messageChannel,
            receivedAtMs
        };
    }
    PianoTrainerMidiInput.decode = decode;
    function createEchoFilter(state, nowMs) {
        function remember(status, note, velocity) {
            const now = nowMs();
            state.recentMidiEchoes.push({ status, note, velocity, time: now });
            if (state.recentMidiEchoes.length > 256) {
                state.recentMidiEchoes = state.recentMidiEchoes.slice(-128);
            }
        }
        function isRecent(status, note, velocity) {
            const now = nowMs();
            state.recentMidiEchoes = state.recentMidiEchoes.filter(m => (now - m.time) < 120);
            return state.recentMidiEchoes.some(m => m.status === status && m.note === note && m.velocity === velocity && (now - m.time) < 120);
        }
        return { remember, isRecent };
    }
    PianoTrainerMidiInput.createEchoFilter = createEchoFilter;
})(PianoTrainerMidiInput || (PianoTrainerMidiInput = {}));
//# sourceMappingURL=midi-input.js.map