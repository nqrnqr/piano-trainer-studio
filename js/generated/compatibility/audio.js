"use strict";
// Transitional classic composition. P9 gives bootstrap ownership of lifecycle.
const audioOutput = PianoTrainerAudioOutput.create({
    tone: Tone, state: AppState,
    sampleExtension: () => getPreferredPianoSampleExtension(),
    setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
    clearTimer: id => window.clearTimeout(id),
    warn: (message, error) => console.warn(message, error)
});
const audioRouting = PianoTrainerAudioRouting.create({
    state: AppState, audio: audioOutput, midi: midiOutput,
    setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
    clearTimer: id => window.clearTimeout(id)
});
function applyToneLatencyProfileForMode(mode = AppState.mode) { audioOutput.applyToneLatencyProfileForMode(mode); }
function ensurePianoSamplerLoaded() { return audioOutput.ensurePianoSamplerLoaded(); }
function ensureLiveAudioReady() { return audioOutput.ensureLiveAudioReady(); }
function getLiveAudioTime() { return audioOutput.getLiveAudioTime(); }
function schedulePlaybackForDestinations(midi, durationMs, velocity = 100, options = {}) {
    audioRouting.schedulePlaybackForDestinations(midi, durationMs, velocity, options);
}
//# sourceMappingURL=audio.js.map