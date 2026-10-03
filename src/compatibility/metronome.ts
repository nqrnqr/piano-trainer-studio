// Transitional composition. OSMD/MIDI/Tone/DOM stay outside timing decisions.
const scoreMeasureTiming = PianoTrainerMeasureTiming.create({
    getMeasure: index => osmdAdapter.getSourceMeasure(index),
    getMeasureCount: () => osmdAdapter.getSourceMeasureCount(),
    getCursor: () => osmdAdapter.getTraversalCursor(),
    restoreToPosition: (measure, timestamp) => sharedScoreTraversal.restoreToMeasureAndTimestamp(measure, timestamp)
});
const metronomeClock = PianoTrainerPlaybackClock.create({
    nowSeconds: () => Tone.now(), monotonicMilliseconds: () => performance.now(),
    setTimer: (callback, delay) => window.setTimeout(callback, delay), clearTimer: id => window.clearTimeout(id),
    requestFrame: callback => window.requestAnimationFrame(callback), cancelFrame: id => window.cancelAnimationFrame(id)
});
const metronomeOutput = PianoTrainerMetronomeOutput.create({tone: Tone});
const tempoPulseUi = PianoTrainerTempoPulse.create(() => document.getElementById('btn-tempo'));
const trainerMetronome = PianoTrainerMetronome.create({
    state: AppState, clock: metronomeClock, audio: metronomeOutput,
    midi: {isAvailable: () => !!midiOutput.getOutput(),
        percussionClick: (note, velocity, duration) => midiOutput.percussionClick(note, velocity, duration)},
    timing: scoreMeasureTiming,
    isEnabled: () => { const checkbox = document.getElementById('check-metronome'); return checkbox instanceof HTMLInputElement && checkbox.checked; },
    getVolume: () => { const slider = document.getElementById('slider-metro-vol'); return slider instanceof HTMLInputElement ? slider.value : undefined; },
    getPulseTarget: tempoPulseUi.getTarget,
    getLiveAudioTime: () => getLiveAudioTime(),
    getCurrentMeasureIndex: () => osmdAdapter.getCurrentMeasureIndex(),
    getCountInBeats: measure => osmdAdapter.getCountInBeats(measure)
});
function getMeasureTimingInfo(index: number | undefined) { return scoreMeasureTiming.getInfo(index); }
const rebuildMeasureTimingCache = scoreMeasureTiming.rebuild;
const getMetronomeClickSpec = trainerMetronome.getMetronomeClickSpec;
const getMetronomeMidiClickSpec = trainerMetronome.getMetronomeMidiClickSpec;
const getMetronomeMidiVelocity = trainerMetronome.getMetronomeMidiVelocity;
const shouldUseMidiOutMetronome = trainerMetronome.shouldUseMidiOutMetronome;
const sendMidiOutMetronomeClick = trainerMetronome.sendMidiOutMetronomeClick;
const playMetronomeClick = trainerMetronome.playMetronomeClick;
const clearTempoVisualPulse = trainerMetronome.clearTempoVisualPulse;
const triggerTempoVisualPulse = trainerMetronome.triggerTempoVisualPulse;
const clearScheduledMetronomeEvents = trainerMetronome.clearScheduledMetronomeEvents;
const stopWaitModeMetronome = trainerMetronome.stopWaitModeMetronome;
const getMetronomeTimeSignatureNumerator = trainerMetronome.getMetronomeTimeSignatureNumerator;
const scheduleNextWaitModeMetronomeTick = trainerMetronome.scheduleNextWaitModeMetronomeTick;
const startWaitModeMetronome = trainerMetronome.startWaitModeMetronome;
const rebuildWaitModeMetronome = trainerMetronome.rebuildWaitModeMetronome;
const scheduleMetronomeForPlaybackWindow = trainerMetronome.scheduleMetronomeForPlaybackWindow;
const doCountInAndStart = trainerMetronome.doCountInAndStart;
