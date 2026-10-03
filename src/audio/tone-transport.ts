
// The old coordinator only controls Transport; it owns no Transport events.
export namespace PianoTrainerToneTransport {
    export function create(tone: Pick<PianoTrainerToneVendor.Api, 'Transport'>) {
        return {
            stop: () => { tone.Transport.stop(); },
            pause: () => { tone.Transport.pause(); },
            start: () => { tone.Transport.start(); },
            setBpm: (value: number) => { tone.Transport.bpm.value = value; }
        };
    }
}
