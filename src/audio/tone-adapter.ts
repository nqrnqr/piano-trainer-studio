import {PianoTrainerVelocity} from '../domain/velocity';
import type {LegacyAppState} from '../state/model';
// Tone resources, loading/unlock, latency profile and playback voices.
// Factory creation allocates nothing. init is called at the old core startup slot.
export namespace PianoTrainerAudioOutput {
    export type State = Pick<LegacyAppState, 'mode' | 'lowLatencyPlaybackEnabled' | 'audioEnabled'>;
    export interface LiveOptions {
        lowLatencyLive?: boolean;
        retrigger?: boolean;
    }
    export interface Ports {
        tone: PianoTrainerToneVendor.Api;
        state: State;
        sampleExtension(): 'ogg' | 'mp3';
        setTimer(callback: () => void, delayMs: number): number;
        clearTimer(id: number): void;
        warn(message: string, error: unknown): void;
    }
    const FOLLOW_ME_TONE_LATENCY_PROFILE = Object.freeze({ lookAhead: 0.005, updateInterval: 0.005, latencyHint: 0.001 });
    export function create(ports: Ports) {
        const Tone = ports.tone, state = ports.state;
        const normalizeLiveVelocity = PianoTrainerVelocity.normalizeLiveVelocity;
        let masterPianoVolume: PianoTrainerToneVendor.Volume | null = null;
        let lowLatencyPlaybackSynth: PianoTrainerToneVendor.Voice | null = null;
        let pianoSampler: PianoTrainerToneVendor.Voice | null = null;
        let pianoSamplerReady = false;
        let pianoSamplerReadyPromise: Promise<boolean> | null = null;
        let DEFAULT_TONE_LATENCY_PROFILE: ReturnType<typeof captureToneLatencyProfile> | null = null;
        let disposed = false, epoch = 0;
        // Voice assertions below follow init and a disposal/epoch guard.
        const releaseTimers = new Set<number>();
        function init() {
            if (masterPianoVolume)
                return;
            disposed = false;
            DEFAULT_TONE_LATENCY_PROFILE = captureToneLatencyProfile();
            const PIANO_SAMPLE_EXTENSION = ports.sampleExtension();
            masterPianoVolume = new Tone.Volume(0).toDestination();
            lowLatencyPlaybackSynth = new Tone.PolySynth(Tone.Synth, {
                maxPolyphony: 24,
                volume: -6,
                options: {
                    oscillator: { type: 'triangle' },
                    envelope: {
                        attack: 0.001,
                        decay: 0.08,
                        sustain: 0.18,
                        release: 0.12
                    }
                }
            }).connect(masterPianoVolume);
            pianoSampler = new Tone.Sampler({
                urls: {
                    "A0": `A0.${PIANO_SAMPLE_EXTENSION}`, "C1": `C1.${PIANO_SAMPLE_EXTENSION}`, "D#1": `Ds1.${PIANO_SAMPLE_EXTENSION}`, "F#1": `Fs1.${PIANO_SAMPLE_EXTENSION}`,
                    "A1": `A1.${PIANO_SAMPLE_EXTENSION}`, "C2": `C2.${PIANO_SAMPLE_EXTENSION}`, "D#2": `Ds2.${PIANO_SAMPLE_EXTENSION}`, "F#2": `Fs2.${PIANO_SAMPLE_EXTENSION}`,
                    "A2": `A2.${PIANO_SAMPLE_EXTENSION}`, "C3": `C3.${PIANO_SAMPLE_EXTENSION}`, "D#3": `Ds3.${PIANO_SAMPLE_EXTENSION}`, "F#3": `Fs3.${PIANO_SAMPLE_EXTENSION}`,
                    "A3": `A3.${PIANO_SAMPLE_EXTENSION}`, "C4": `C4.${PIANO_SAMPLE_EXTENSION}`, "D#4": `Ds4.${PIANO_SAMPLE_EXTENSION}`, "F#4": `Fs4.${PIANO_SAMPLE_EXTENSION}`,
                    "A4": `A4.${PIANO_SAMPLE_EXTENSION}`, "C5": `C5.${PIANO_SAMPLE_EXTENSION}`, "D#5": `Ds5.${PIANO_SAMPLE_EXTENSION}`, "F#5": `Fs5.${PIANO_SAMPLE_EXTENSION}`,
                    "A5": `A5.${PIANO_SAMPLE_EXTENSION}`, "C6": `C6.${PIANO_SAMPLE_EXTENSION}`, "D#6": `Ds6.${PIANO_SAMPLE_EXTENSION}`, "F#6": `Fs6.${PIANO_SAMPLE_EXTENSION}`,
                    "A6": `A6.${PIANO_SAMPLE_EXTENSION}`, "C7": `C7.${PIANO_SAMPLE_EXTENSION}`, "D#7": `Ds7.${PIANO_SAMPLE_EXTENSION}`, "F#7": `Fs7.${PIANO_SAMPLE_EXTENSION}`,
                    "A7": `A7.${PIANO_SAMPLE_EXTENSION}`, "C8": `C8.${PIANO_SAMPLE_EXTENSION}`
                },
                release: 1,
                baseUrl: "assets/audio/salamander/"
            }).connect(masterPianoVolume);
        }
        function scheduleRelease(callback: () => void, delayMs: number) {
            const currentEpoch = epoch;
            const id = ports.setTimer(() => {
                releaseTimers.delete(id);
                if (!disposed && currentEpoch === epoch) callback();
            }, delayMs);
            releaseTimers.add(id);
        }
        function getToneContextHandle() {
            try {
                return typeof Tone?.getContext === 'function' ? Tone.getContext() : Tone?.context;
            }
            catch (_) {
                return null;
            }
        }
        function captureToneLatencyProfile() {
            const ctx = getToneContextHandle();
            return {
                lookAhead: Number.isFinite(Number(ctx?.lookAhead)) ? Number(ctx!.lookAhead) : null,
                updateInterval: Number.isFinite(Number(ctx?.updateInterval)) ? Number(ctx!.updateInterval) : null,
                latencyHint: ctx?.latencyHint ?? null
            };
        }
        function applyToneLatencyProfileForMode(mode = state.mode) {
            const ctx = getToneContextHandle();
            if (!ctx)
                return;
            const useFollowProfile = mode === 'follow';
            const nextProfile = useFollowProfile ? FOLLOW_ME_TONE_LATENCY_PROFILE : DEFAULT_TONE_LATENCY_PROFILE;
            try {
                if (!nextProfile)
                    return;
                if (nextProfile.lookAhead != null && 'lookAhead' in ctx) {
                    Reflect.set(ctx, 'lookAhead', nextProfile.lookAhead);
                }
                if (nextProfile.updateInterval != null && 'updateInterval' in ctx) {
                    Reflect.set(ctx, 'updateInterval', nextProfile.updateInterval);
                }
                if (nextProfile.latencyHint != null && 'latencyHint' in ctx) {
                    // Bundled Tone exposes a getter only. The old sloppy script
                    // silently ignored that write; Reflect.set preserves it in TS.
                    Reflect.set(ctx, 'latencyHint', nextProfile.latencyHint);
                }
            }
            catch (err) {
                ports.warn('Could not apply Tone.js latency profile for mode.', err);
            }
        }
        function ensurePianoSamplerLoaded() {
            if (disposed)
                return Promise.resolve(false);
            init();
            if (pianoSamplerReady)
                return Promise.resolve(true);
            if (!pianoSamplerReadyPromise) {
                const currentEpoch = epoch;
                pianoSamplerReadyPromise = Promise.resolve(typeof Tone.loaded === 'function' ? Tone.loaded() : null)
                    .then(() => {
                        if (disposed || currentEpoch !== epoch)
                            return false;
                        pianoSamplerReady = true;
                        return true;
                    })
                    .catch((err) => {
                        ports.warn('Piano sampler assets did not finish loading.', err);
                        throw err;
                    });
            }
            return pianoSamplerReadyPromise;
        }
        function getSamplerNoteName(midi: unknown) {
            const value = Number(midi);
            if (!Number.isFinite(value))
                return null;
            try {
                return Tone.Frequency(value, 'midi').toNote();
            }
            catch (_) {
                return null;
            }
        }
        function shouldUseLowLatencyPlaybackPath() {
            if (!state.lowLatencyPlaybackEnabled)
                return false;
            return state.mode === 'follow' || state.mode === 'realtime';
        }
        function playLowLatencyPlaybackNote(midi: number, velocity: unknown = 100, durationMs: number | null = null) {
            if (disposed)
                return;
            init();
            const noteName = getSamplerNoteName(midi);
            if (!noteName)
                return;
            const normalized = normalizeLiveVelocity(velocity);
            const liveTime = getLiveAudioTime();
            if (Number.isFinite(durationMs) && durationMs! > 0) {
                lowLatencyPlaybackSynth!.triggerAttackRelease(noteName, Math.max(0.01, durationMs! / 1000), liveTime, normalized.gain);
                return;
            }
            lowLatencyPlaybackSynth!.triggerRelease(noteName, liveTime);
            lowLatencyPlaybackSynth!.triggerAttack(noteName, liveTime, normalized.gain);
        }
        function playScheduledPlaybackNote(midi: number, velocity: unknown = 100, durationMs: number | null = null) {
            if (shouldUseLowLatencyPlaybackPath()) {
                playLowLatencyPlaybackNote(midi, velocity, durationMs);
                return;
            }
            playLocalPianoNote(midi, velocity, durationMs);
        }
        async function ensureLiveAudioReady() {
            const currentEpoch = epoch;
            try {
                await ensurePianoSamplerLoaded().catch(() => false);
                if (disposed || currentEpoch !== epoch) return;
                if (Tone.context.state !== 'running') {
                    await Tone.start();
                    if (disposed || currentEpoch !== epoch) return;
                    await Tone.context.resume();
                }
            }
            catch (err) {
                ports.warn('Could not resume Tone.js audio context from user gesture.', err);
            }
        }
        function getLiveAudioTime() {
            if (typeof Tone?.immediate === 'function')
                return Tone.immediate();
            return Tone.now();
        }
        function playLocalPianoNote(midi: number, velocity: unknown = 100, durationMs: number | null = null, options: LiveOptions = {}) {
            if (disposed)
                return;
            init();
            if (!Number.isFinite(midi) || midi < 0)
                return;
            const noteName = getSamplerNoteName(midi);
            if (!noteName)
                return;
            if (!pianoSamplerReady) {
                const currentEpoch = epoch;
                ensurePianoSamplerLoaded()
                    .then(() => {
                        if (disposed || epoch !== currentEpoch)
                            return;
                        if (!state.audioEnabled?.virtual && !state.audioEnabled?.instrument && !state.audioEnabled?.left && !state.audioEnabled?.right && !state.audioEnabled?.other)
                            return;
                        playLocalPianoNote(midi, velocity, durationMs, options);
                    })
                    .catch(() => { });
                return;
            }
            const normalized = normalizeLiveVelocity(velocity);
            const liveTime = getLiveAudioTime();
            if (options.lowLatencyLive || options.retrigger !== false) {
                pianoSampler!.triggerRelease(noteName, liveTime);
            }
            pianoSampler!.triggerAttack(noteName, liveTime, normalized.gain);
            if (Number.isFinite(durationMs) && durationMs! > 0) {
                scheduleRelease(() => pianoSampler!.triggerRelease(noteName, getLiveAudioTime()), durationMs!);
            }
        }
        function releaseLocalPianoNote(midi: number) {
            const noteName = getSamplerNoteName(midi);
            if (noteName)
                pianoSampler?.triggerRelease(noteName, getLiveAudioTime());
        }
        function silence() {
            try {
                pianoSampler?.releaseAll?.();
                lowLatencyPlaybackSynth?.releaseAll?.();
            }
            catch (error) {
                ports.warn('Could not release Tone.js playback voices immediately.', error);
            }
        }
        function releaseLowLatencyPlayback() {
            try { lowLatencyPlaybackSynth?.releaseAll?.(); }
            catch (_) { }
        }
        function setPianoVolume(percent: number) {
            if (!masterPianoVolume)
                return;
            if (percent === 0)
                masterPianoVolume.volume.value = -Infinity;
            else
                masterPianoVolume.volume.value = 20 * Math.log10(percent / 100);
        }
        function resumeWithoutWaiting() {
            if (Tone.context.state !== 'running') Tone.context.resume();
        }
        function dispose() {
            disposed = true;
            epoch++;
            for (const id of releaseTimers)
                ports.clearTimer(id);
            releaseTimers.clear();
            silence();
            pianoSampler?.dispose();
            lowLatencyPlaybackSynth?.dispose();
            masterPianoVolume?.dispose();
            pianoSampler = null;
            lowLatencyPlaybackSynth = null;
            masterPianoVolume = null;
            pianoSamplerReady = false;
            pianoSamplerReadyPromise = null;
        }
        return { init, dispose, ensurePianoSamplerLoaded, ensureLiveAudioReady, applyToneLatencyProfileForMode,
            getLiveAudioTime, getSamplerNoteName, playLocalPianoNote, playLowLatencyPlaybackNote,
            playScheduledPlaybackNote, shouldUseLowLatencyPlaybackPath, releaseLocalPianoNote,
            silence, releaseLowLatencyPlayback, setPianoVolume, resumeWithoutWaiting, isReady: () => pianoSamplerReady };
    }
    export type Service = ReturnType<typeof create>;
}
