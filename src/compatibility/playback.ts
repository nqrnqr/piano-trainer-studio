// Temporary composition. The coordinator receives only domain data/commands.
const playbackClock = PianoTrainerPlaybackClock.create({
    nowSeconds: () => Tone.now(), monotonicMilliseconds: () => performance.now(),
    setTimer: (callback, delay) => window.setTimeout(callback, delay), clearTimer: id => window.clearTimeout(id),
    requestFrame: callback => window.requestAnimationFrame(callback), cancelFrame: id => window.cancelAnimationFrame(id)
});
const playbackTransport = PianoTrainerToneTransport.create(Tone);
const playbackControls = PianoTrainerPlaybackControls.create({getElement: id => document.getElementById(id)});
const playbackState = PianoTrainerPlaybackState.create({
    state: AppState, clearFeedbackPreserveScoring: practiceFeedback.clearPreserveScoring,
    clearTimer: id => window.clearTimeout(id), wipeHardware: () => wipeHardwareLEDs(),
    renderKeyboard: () => renderVirtualKeyboard()
});
const trainerPlayback = PianoTrainerPlaybackCoordinator.create({
    state: AppState, clock: playbackClock, transport: playbackTransport, controls: playbackControls,
    transitions: playbackState, metronome: trainerMetronome,
    score: {
        hasCursor: osmdAdapter.hasCursor, isEndReached: osmdAdapter.isEndReached,
        readEvent: () => osmdAdapter.readPlaybackEvent(entry => getResolvedStaffAssignmentIdFromEntry(entry)),
        getTimestamp: osmdAdapter.getCurrentTimestamp, getMeasureIndex: osmdAdapter.getCurrentMeasureIndex,
        getTempo: osmdAdapter.getPlaybackTempo, advance: osmdAdapter.advance, reset: osmdAdapter.reset,
        update: osmdAdapter.updateCursor, show: osmdAdapter.showCursor
    },
    audio: {
        schedule: audioRouting.schedulePlaybackForDestinations, silence: audioOutput.silence,
        ensureReady: audioOutput.ensureLiveAudioReady, applyLatencyProfile: () => audioOutput.applyToneLatencyProfileForMode()
    },
    midi: midiOutput,
    practice: {
        buildExpected: practiceExpectedNotes.build, getHandRole: staff => getAssignedHandRoleForStaff(staff),
        startSustains: practiceSustains.startVisualSustains, processMisses: practiceScoring.processMissedNotes
    },
    timing: {getTraversalBeatsToWait: options => window.PTTiming.getTraversalBeatsToWait(options),
        getMeasureTimingInfo: scoreMeasureTiming.getInfo},
    ensureTimeline: () => { sharedScoreTraversal.ensurePreviewTimelineBuilt(); },
    led: {wipeHardware: () => wipeHardwareLEDs(), clearOutputs: () => optionalLedOutput.clearOutputs()},
    ui: {
        scroll: () => handleAutoScroll(), cancelViewport: ScoreDisplay.cancel,
        clearSvgFeedback: GeometryEngine.clearSvgFeedback,
        updatePlayPause: () => updatePlayPauseButton(), hidePanels: () => hideToolbarPanels(),
        isFullscreenActive: () => isFullscreenActive(), requestFullscreen: () => requestAppFullscreen(),
        preserveScroll: callback => { preserveMusicAreaScroll(callback); },
        renderFeedback: () => renderFeedbackOverlay(),
        renderEventKeyboard: (event, measure, timestamp) => renderVirtualKeyboard(osmdAdapter.legacyEntriesForPlayback(event), measure, timestamp),
        updateScore: () => updateScoreDisplay(), updateTempoPercent: value => updateTempo('percent', value)
    }
});
const checkWaitModeAdvance = trainerPlayback.checkWaitModeAdvance;
const playbackLoop = trainerPlayback.playbackLoop;
const startPlaybackFromToolbar = trainerPlayback.startPlaybackFromToolbar;
const stopPlaybackState = trainerPlayback.stopPlaybackState;
const pausePlaybackFromToolbar = trainerPlayback.pausePlaybackFromToolbar;
const resetPlaybackForLoadedScore = trainerPlayback.resetPlaybackForLoadedScore;
const resetPlaybackFromToolbar = trainerPlayback.resetPlaybackFromToolbar;
const silencePlaybackOutputsImmediately = trainerPlayback.silencePlaybackOutputsImmediately;
const clearTransientPlaybackState = playbackState.clearTransient;
const clearVisuals = playbackState.clearVisuals;
const enforceLooperBounds = trainerPlayback.enforceLooperBounds;
const renderLooper = GeometryEngine.renderLooper;
