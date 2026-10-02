// Minimal used surface of the bundled Tone 14.8.49. Do not model internal nodes
// or widen the vendor to any; unsupported return values are deliberately unused.
declare namespace PianoTrainerToneVendor {
    interface Context {
        state: AudioContextState;
        resume(): Promise<unknown>;
        lookAhead?: number | string | null;
        updateInterval?: number | string | null;
        latencyHint?: string | number | null;
    }
    interface Volume {
        volume: {value: number};
        toDestination(): Volume;
        dispose(): void;
    }
    interface Voice {
        connect(destination: Volume): Voice;
        triggerAttack(note: string, time: number, gain: number): void;
        triggerRelease(note: string, time: number): void;
        triggerAttackRelease(note: string, duration: number, time: number, gain: number): void;
        releaseAll?(time?: number): void;
        dispose(): void;
    }
    interface PolySynthOptions {
        maxPolyphony: number;
        volume: number;
        options: {
            oscillator: {type: string};
            envelope: {attack: number; decay: number; sustain: number; release: number};
        };
    }
    interface SamplerOptions {urls: Record<string,string>; release: number; baseUrl: string;}
    interface MembraneVoice {
        volume: {value: number};
        toDestination(): MembraneVoice;
        triggerAttackRelease(note: string, duration: '64n', time: number, gain: number): void;
        dispose(): void;
    }
    interface MembraneOptions {
        pitchDecay: number; octaves: number; oscillator: {type:string};
        envelope: {attack:number;decay:number;sustain:number;release:number};
    }
    interface Api {
        context: Context;
        getContext?(): Context;
        loaded?(): Promise<unknown>;
        start(): Promise<unknown>;
        now(): number;
        immediate?(): number;
        Frequency(value: number, unit: 'midi'): {toNote(): string};
        Volume: new (volume: number) => Volume;
        Synth: unknown;
        PolySynth: new (voice: unknown, options: PolySynthOptions) => Voice;
        Sampler: new (options: SamplerOptions) => Voice;
        MembraneSynth: new (options: MembraneOptions) => MembraneVoice;
    }
}
declare const Tone: PianoTrainerToneVendor.Api;
