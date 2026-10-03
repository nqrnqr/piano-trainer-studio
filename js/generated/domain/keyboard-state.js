"use strict";
// Presentation priority shared by the keyboard and optional preview output.
var PianoTrainerKeyboardState;
(function (PianoTrainerKeyboardState) {
    function priority(state) {
        if (!state)
            return 0;
        if (state === 'expected-l' || state === 'expected-r')
            return 5;
        if (state === 'future1-l' || state === 'future1-r' || state === 'future2-l' || state === 'future2-r')
            return 4;
        if (state === 'pressed-l' || state === 'pressed-r')
            return 2;
        if (state === 'wrong' || state === 'active')
            return 1;
        return 0;
    }
    PianoTrainerKeyboardState.priority = priority;
    function choose(current, candidate) {
        return priority(candidate) > priority(current) ? candidate : current;
    }
    PianoTrainerKeyboardState.choose = choose;
    function applyPreview(base, events) {
        const states = new Map(base);
        (events || []).forEach(event => {
            event.notes.forEach(note => {
                const current = states.get(note.midi) || null;
                const next = choose(current, note.state);
                if (next && next !== current)
                    states.set(note.midi, next);
            });
        });
        return states;
    }
    PianoTrainerKeyboardState.applyPreview = applyPreview;
})(PianoTrainerKeyboardState || (PianoTrainerKeyboardState = {}));
//# sourceMappingURL=keyboard-state.js.map