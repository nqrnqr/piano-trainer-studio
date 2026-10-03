// Presentation priority shared by the keyboard and optional preview output.
namespace PianoTrainerKeyboardState {
    export function priority(state: string | null | undefined) {
        if (!state) return 0;
        if (state === 'expected-l' || state === 'expected-r') return 5;
        if (state === 'future1-l' || state === 'future1-r' || state === 'future2-l' || state === 'future2-r') return 4;
        if (state === 'pressed-l' || state === 'pressed-r') return 2;
        if (state === 'wrong' || state === 'active') return 1;
        return 0;
    }
    export function choose(current: string | null, candidate: string | null) {
        return priority(candidate) > priority(current) ? candidate : current;
    }
    export function applyPreview(base: Map<number, string>, events: PianoTrainerDomain.PreviewEvent[] | null | undefined) {
        const states = new Map(base);
        (events || []).forEach(event => {
            event.notes.forEach(note => {
                const current = states.get(note.midi) || null;
                const next = choose(current, note.state);
                if (next && next !== current) states.set(note.midi, next);
            });
        });
        return states;
    }
}
