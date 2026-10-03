import {PianoTrainerAudioOutput} from './tone-adapter';
import {PianoTrainerDomain} from '../domain/model';
import {PianoTrainerVelocity} from '../domain/velocity';
import {PianoTrainerMidiOutput} from '../midi/midi-output';
import {LegacyAppState} from '../state/model';
// Route commands only. Practice matching and coordinator timing stay outside.
export namespace PianoTrainerAudioRouting {
    export type State = Pick<LegacyAppState, 'audioEnabled' | 'midiOutEnabled' |
        'midiInBoost' | 'inputVelocityEnabled' | 'liveLowLatencyMonitoringEnabled'>;
    export interface Destinations { toLocalAudio?: boolean; toMidiOut?: boolean; }
    export interface Ports {
        state: State;
        audio: Pick<PianoTrainerAudioOutput.Service, 'playLocalPianoNote' |
            'playScheduledPlaybackNote' | 'releaseLocalPianoNote'>;
        midi: Pick<ReturnType<typeof PianoTrainerMidiOutput.create>, 'noteOn' | 'noteOff'>;
        setTimer(callback: () => void, delayMs: number): number;
        clearTimer(id: number): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        const releaseTimers = new Set<number>();
        let epoch = 0;
        function sourceRole(source: string) {
            if (source === 'midi') return 'instrument';
            if (source === 'ui') return 'virtual';
            return null;
        }
        function route(bucket: PianoTrainerDomain.AudioRouting, source: string) {
            const role = sourceRole(source);
            return role ? !!(bucket && bucket[role]) : false;
        }
        function monitoringVelocity(source: string, velocity = 100) {
            if (source !== 'midi') return velocity;
            const boostPercent = Math.max(50, Math.min(200, Number(state.midiInBoost) || 100));
            return Math.max(1, Math.min(127, Math.round((Number(velocity) || 100) * (boostPercent / 100))));
        }
        function monitorNoteOn(midi: number, source: string, velocity = 100) {
            const liveVelocity = (source === 'midi' && state.inputVelocityEnabled) ? velocity : 100;
            const localVelocity = monitoringVelocity(source, liveVelocity);
            if (route(state.audioEnabled, source)) {
                ports.audio.playLocalPianoNote(midi, localVelocity, null, {
                    lowLatencyLive: source === 'ui' ? true : !!state.liveLowLatencyMonitoringEnabled,
                    retrigger: true
                });
            }
            if (route(state.midiOutEnabled, source)) {
                // The old third scaleVolume argument was ignored by MIDI output.
                ports.midi.noteOn(midi, PianoTrainerVelocity.normalizeLiveVelocity(liveVelocity).midi);
            }
        }
        function monitorNoteOff(midi: number, source: string) {
            if (route(state.audioEnabled, source)) ports.audio.releaseLocalPianoNote(midi);
            if (route(state.midiOutEnabled, source)) ports.midi.noteOff(midi);
        }
        function schedulePlaybackForDestinations(midi: number, durationMs: number, velocity = 100, options: Destinations = {}) {
            if (!Number.isFinite(midi) || midi < 0) return;
            if (durationMs <= 0) return;
            if (options.toLocalAudio) ports.audio.playScheduledPlaybackNote(midi, velocity, durationMs);
            if (options.toMidiOut && ports.midi.noteOn(midi, velocity)) {
                const currentEpoch = epoch;
                const id = ports.setTimer(() => {
                    releaseTimers.delete(id);
                    if (currentEpoch === epoch) ports.midi.noteOff(midi);
                }, durationMs);
                releaseTimers.add(id);
            }
        }
        // Pause retains the old one-shot note-off callbacks. Only teardown cancels them.
        function dispose() {
            epoch++;
            for (const id of releaseTimers) ports.clearTimer(id);
            releaseTimers.clear();
        }
        return { monitorNoteOn, monitorNoteOff, schedulePlaybackForDestinations, dispose };
    }
}
