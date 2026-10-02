"use strict";
// Route commands only. Practice matching and coordinator timing stay outside.
var PianoTrainerAudioRouting;
(function (PianoTrainerAudioRouting) {
    function create(ports) {
        const state = ports.state;
        const releaseTimers = new Set();
        let epoch = 0;
        function sourceRole(source) {
            if (source === 'midi')
                return 'instrument';
            if (source === 'ui')
                return 'virtual';
            return null;
        }
        function route(bucket, source) {
            const role = sourceRole(source);
            return role ? !!(bucket && bucket[role]) : false;
        }
        function monitoringVelocity(source, velocity = 100) {
            if (source !== 'midi')
                return velocity;
            const boostPercent = Math.max(50, Math.min(200, Number(state.midiInBoost) || 100));
            return Math.max(1, Math.min(127, Math.round((Number(velocity) || 100) * (boostPercent / 100))));
        }
        function monitorNoteOn(midi, source, velocity = 100) {
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
        function monitorNoteOff(midi, source) {
            if (route(state.audioEnabled, source))
                ports.audio.releaseLocalPianoNote(midi);
            if (route(state.midiOutEnabled, source))
                ports.midi.noteOff(midi);
        }
        function schedulePlaybackForDestinations(midi, durationMs, velocity = 100, options = {}) {
            if (!Number.isFinite(midi) || midi < 0)
                return;
            if (durationMs <= 0)
                return;
            if (options.toLocalAudio)
                ports.audio.playScheduledPlaybackNote(midi, velocity, durationMs);
            if (options.toMidiOut && ports.midi.noteOn(midi, velocity)) {
                const currentEpoch = epoch;
                const id = ports.setTimer(() => {
                    releaseTimers.delete(id);
                    if (currentEpoch === epoch)
                        ports.midi.noteOff(midi);
                }, durationMs);
                releaseTimers.add(id);
            }
        }
        // Pause retains the old one-shot note-off callbacks. Only teardown cancels them.
        function dispose() {
            epoch++;
            for (const id of releaseTimers)
                ports.clearTimer(id);
            releaseTimers.clear();
        }
        return { monitorNoteOn, monitorNoteOff, schedulePlaybackForDestinations, dispose };
    }
    PianoTrainerAudioRouting.create = create;
})(PianoTrainerAudioRouting || (PianoTrainerAudioRouting = {}));
//# sourceMappingURL=audio-routing.js.map