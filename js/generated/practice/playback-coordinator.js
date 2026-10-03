"use strict";
// Moved from 3a76224. Mode decisions stay in this single coordinator for P7a.
var PianoTrainerPlaybackCoordinator;
(function (PianoTrainerPlaybackCoordinator) {
    PianoTrainerPlaybackCoordinator.FOLLOW_ME_MIN_WAIT_RATIO = 0.6;
    function create(ports) {
        const state = ports.state;
        let epoch = 0, disposed = false;
        function checkWaitModeAdvance() {
            if (!state.isPlaying || (state.mode !== 'wait' && state.mode !== 'follow') || !state.isAudioBusy)
                return;
            if (state.expectedNotes.length === 0)
                return;
            const allHit = state.expectedNotes.every(n => n.hit);
            if (allHit) {
                state.isAudioBusy = false;
                state.pendingAudio.forEach(audio => {
                    ports.audio.schedule(audio.midi, audio.durationMs, audio.velocity ?? 100, { toLocalAudio: !!audio.toLocalAudio, toMidiOut: !!audio.toMidiOut });
                });
                state.pendingAudio = [];
                // Keep practicing-hand sustain visuals active in wait/follow modes so notes that
                // legitimately ring across later beats remain visible until their visual
                // duration ends. We only clear stale held-correct states when a note is no
                // longer expected or visually sustained.
                ports.practice.startSustains();
                const followInfo = state.followAdvanceInfo || null;
                const shouldFollow = state.mode === 'follow' && followInfo && Number.isFinite(followInfo.waitSeconds);
                if (shouldFollow) {
                    const fullWaitSeconds = Math.max(0, followInfo.waitSeconds);
                    const rawRemainingSeconds = Number.isFinite(state.anchorTime)
                        ? (state.anchorTime - ports.clock.nowSeconds())
                        : fullWaitSeconds;
                    // Keep the original beat grid when the player is on time or early.
                    // If the player arrives late, do not collapse the next delay into a tiny
                    // catch-up burst. Let Follow Me breathe from the player's actual hit time.
                    let effectiveWaitSeconds = rawRemainingSeconds > 0
                        ? rawRemainingSeconds
                        : fullWaitSeconds;
                    const minimumComfortWaitSeconds = fullWaitSeconds * PianoTrainerPlaybackCoordinator.FOLLOW_ME_MIN_WAIT_RATIO;
                    if (effectiveWaitSeconds < minimumComfortWaitSeconds) {
                        effectiveWaitSeconds = fullWaitSeconds;
                    }
                    effectiveWaitSeconds = Math.max(0, effectiveWaitSeconds);
                    ports.metronome.scheduleMetronomeForPlaybackWindow(ports.clock.nowSeconds(), followInfo.currentMeasureIdx, followInfo.currentTimestamp, effectiveWaitSeconds, followInfo.beatsToWait);
                    const delayMs = Math.max(0, Math.round(effectiveWaitSeconds * 1000));
                    ports.clock.setTimer(() => {
                        if (state.isPlaying && state.mode === 'follow') {
                            ports.score.update();
                            ports.ui.scroll();
                            playbackLoop();
                        }
                    }, delayMs);
                    return;
                }
                ports.clock.setTimer(() => {
                    if (state.isPlaying && state.mode === 'wait') {
                        ports.score.update();
                        ports.ui.scroll();
                        playbackLoop();
                    }
                }, 10);
            }
        }
        async function startPlaybackFromToolbar() {
            if (!ports.score.hasCursor() || state.isPlaying)
                return;
            disposed = false;
            const generation = epoch;
            if (state.fullscreenOnPlay && !ports.ui.isFullscreenActive()) {
                await ports.ui.requestFullscreen();
                if (generation !== epoch)
                    return;
            }
            await ports.audio.ensureReady();
            if (generation !== epoch)
                return;
            state.isPlaying = true;
            ports.ui.updatePlayPause();
            ports.ui.hidePanels();
            ports.transport.stop();
            ports.metronome.clearScheduledMetronomeEvents();
            ports.metronome.stopWaitModeMetronome();
            state.lastLedPreviewEvents = [];
            state.ledPreviewTraversalIndex = -1;
            // WARNING:
            // Building the LED preview timeline temporarily resets/traverses the OSMD cursor.
            // Preserve the user's pre-play viewport so auto-scroll does not jump to measure 1 during count-in.
            ports.ui.preserveScroll(() => {
                ports.ensureTimeline();
            });
            ports.audio.applyLatencyProfile();
            ports.metronome.doCountInAndStart(() => {
                state.anchorTime = ports.clock.nowSeconds();
                ports.score.show();
                ports.ui.scroll();
                ports.transport.setBpm(state.baseBpm * state.speedPercent);
                ports.transport.start();
                if (state.mode === 'wait' && ports.controls.isMetronomeEnabled()) {
                    ports.metronome.startWaitModeMetronome(ports.score.hasCursor() ? ports.score.getMeasureIndex() : 0);
                }
                playbackLoop();
            });
        }
        function silencePlaybackOutputsImmediately() {
            ports.audio.silence();
            ports.midi.silence();
        }
        function stopPlaybackState({ pauseTransport = true } = {}) {
            ports.ui.cancelViewport();
            state.isPlaying = false;
            state.countInActive = false;
            state.lastLedPreviewEvents = [];
            state.ledPreviewTraversalIndex = -1;
            ports.transitions.clearTransient();
            if (pauseTransport) {
                ports.transport.pause();
            }
            else {
                ports.transport.stop();
            }
            ports.metronome.clearScheduledMetronomeEvents();
            ports.metronome.stopWaitModeMetronome();
            silencePlaybackOutputsImmediately();
            ports.metronome.clearTempoVisualPulse();
            ports.audio.applyLatencyProfile();
            ports.ui.updatePlayPause();
            if (state.ledOutputMode === 'midi') {
                ports.led.wipeHardware();
            }
            if (state.ledOutputMode === 'wled') {
                ports.led.clearOutputs().catch(() => { });
            }
        }
        function pausePlaybackFromToolbar() {
            stopPlaybackState({ pauseTransport: true });
        }
        function resetPlaybackForLoadedScore() {
            stopPlaybackState({ pauseTransport: false });
            ports.ui.clearSvgFeedback();
            state.pendingAudio = [];
            state.score.correct = 0;
            state.score.wrong = 0;
            ports.ui.updateScore();
            ports.transitions.clearVisuals();
        }
        function playbackLoop() {
            if (disposed || !state.isPlaying)
                return;
            if (ports.score.isEndReached()) {
                const isLoopEnabledAtEnd = ports.controls.isLoopEnabledAtEnd();
                if (!isLoopEnabledAtEnd) {
                    pausePlaybackFromToolbar();
                    ports.score.update();
                    ports.ui.scroll();
                }
                return;
            }
            const entries = ports.score.readEvent();
            if (entries.isEmpty) {
                ports.score.advance();
                ports.score.update();
                ports.clock.requestFrame(playbackLoop);
                return;
            }
            const currentTimestamp = ports.score.getTimestamp();
            const currentMeasureIdx = ports.score.getMeasureIndex();
            const tempoInBpm = ports.score.getTempo(currentMeasureIdx);
            if (tempoInBpm && tempoInBpm !== state.baseBpm) {
                state.baseBpm = tempoInBpm;
                ports.ui.updateTempoPercent(state.speedPercent * 100);
            }
            ports.practice.buildExpected(entries.entries, currentMeasureIdx, currentTimestamp);
            state.currentExpectedContext = {
                measureIndex: currentMeasureIdx,
                timestamp: currentTimestamp,
                signature: entries.signature
            };
            ports.ui.renderFeedback();
            ports.ui.renderEventKeyboard(entries, currentMeasureIdx, currentTimestamp);
            for (const e of entries.entries) {
                const handRole = ports.practice.getHandRole(e.staffId);
                const isRH = handRole === 'right';
                const isLH = handRole === 'left';
                const isOther = (!isRH && !isLH);
                const isPracticingThisHand = (isRH && state.practice.right) || (isLH && state.practice.left);
                const playbackLeftEnabled = !!state.playback.left;
                const playbackRightEnabled = !!state.playback.right;
                const isSelectedHandPlayback = (isRH && playbackRightEnabled) || (isLH && playbackLeftEnabled);
                const routeToLocalAudio = ((isRH || isLH) && isSelectedHandPlayback && state.audioEnabled.hands) ||
                    (isOther && state.audioEnabled.other);
                const routeToMidiOut = ((isRH || isLH) && isSelectedHandPlayback && state.midiOutEnabled.hands) ||
                    (isOther && state.midiOutEnabled.other);
                if (routeToLocalAudio || routeToMidiOut) {
                    for (const n of e.notes) {
                        if (!n.rest) {
                            if (!n.tieContinuation) {
                                const m = n.midi;
                                const combinedLength = n.combinedLengthWhole;
                                const noteDurationSeconds = (combinedLength * 4) * (60 / (state.baseBpm * state.speedPercent));
                                const durationMs = (noteDurationSeconds * 1000) * 0.9;
                                if ((state.mode === 'wait' || state.mode === 'follow') && state.expectedNotes.length > 0 && !isPracticingThisHand) {
                                    state.pendingAudio.push({ midi: m, durationMs, velocity: 100, toLocalAudio: routeToLocalAudio, toMidiOut: routeToMidiOut });
                                }
                                else {
                                    ports.audio.schedule(m, durationMs, 100, { toLocalAudio: routeToLocalAudio, toMidiOut: routeToMidiOut });
                                }
                            }
                        }
                    }
                }
            }
            ports.score.advance();
            const nextMeasureIdx = ports.score.getMeasureIndex();
            let nextTimestamp = ports.score.getTimestamp();
            const isEndReached = ports.score.isEndReached();
            const fallbackLength = entries.fallbackLengthWhole;
            if (isEndReached) {
                nextTimestamp = currentTimestamp + fallbackLength;
            }
            const beatsToWait = ports.timing.getTraversalBeatsToWait({
                currentMeasureIdx,
                currentTimestamp,
                nextMeasureIdx,
                nextTimestamp,
                fallbackLength,
                getMeasureTimingInfo: ports.timing.getMeasureTimingInfo
            });
            const currentRunningBpm = state.baseBpm * state.speedPercent;
            const waitSeconds = beatsToWait * (60 / currentRunningBpm);
            const playbackWindowStartSec = (state.mode === 'wait' || state.mode === 'follow') ? ports.clock.nowSeconds() : state.anchorTime;
            const shouldDeferFollowScheduling = state.mode === 'follow' && state.expectedNotes.length > 0;
            if (!shouldDeferFollowScheduling) {
                ports.metronome.scheduleMetronomeForPlaybackWindow(playbackWindowStartSec, currentMeasureIdx, currentTimestamp, waitSeconds, beatsToWait);
            }
            else {
                ports.metronome.clearScheduledMetronomeEvents();
                ports.metronome.clearTempoVisualPulse();
            }
            let timeToWaitMs = waitSeconds * 1000;
            const isLoopEnabled = ports.controls.isLoopEnabled();
            const maxLoop = ports.controls.readLoopMax();
            const minLoop = ports.controls.readLoopMin();
            if (isLoopEnabled && (isEndReached || (ports.score.getMeasureIndex() + 1 > maxLoop))) {
                ports.clock.setTimer(() => {
                    if (!state.isPlaying)
                        return;
                    ports.practice.processMisses();
                    ports.transport.stop();
                    ports.score.reset();
                    while (!ports.score.isEndReached() && ports.score.getMeasureIndex() < minLoop - 1) {
                        ports.score.advance();
                    }
                    ports.score.update();
                    ports.ui.scroll();
                    ports.transitions.clearVisuals();
                    const restartLoopPlayback = () => {
                        ports.ui.clearSvgFeedback();
                        state.pendingAudio = [];
                        state.score.correct = 0;
                        state.score.wrong = 0;
                        ports.ui.updateScore();
                        state.anchorTime = ports.clock.nowSeconds();
                        ports.transport.start();
                        playbackLoop();
                    };
                    if (state.loopCountInEnabled) {
                        ports.metronome.doCountInAndStart(restartLoopPlayback);
                    }
                    else {
                        restartLoopPlayback();
                    }
                }, timeToWaitMs);
                return;
            }
            if (state.mode === 'wait' || state.mode === 'follow') {
                state.anchorTime = ports.clock.nowSeconds() + waitSeconds;
            }
            else {
                state.anchorTime += waitSeconds;
            }
            timeToWaitMs = (state.anchorTime - ports.clock.nowSeconds()) * 1000;
            if (timeToWaitMs < 0) {
                timeToWaitMs = 0;
                if (state.mode === 'wait' || state.mode === 'follow') {
                    state.anchorTime = ports.clock.nowSeconds();
                }
            }
            if (state.mode === 'wait' || state.mode === 'follow') {
                state.isAudioBusy = true;
                state.followAdvanceInfo = state.mode === 'follow' ? {
                    currentMeasureIdx,
                    currentTimestamp,
                    waitSeconds,
                    beatsToWait
                } : null;
                if (state.expectedNotes.length > 0) {
                    const allExpectedAlreadyHit = state.expectedNotes.every(n => n.hit);
                    if (allExpectedAlreadyHit) {
                        // One-hand early-grace reservations can promote held notes to hit as soon as
                        // a new expected group is built. In wait/follow modes, that means this step
                        // is already satisfied before any fresh keydown event occurs, so we need to
                        // advance immediately instead of deadlocking on an already-hit group.
                        ports.clock.setTimer(() => {
                            if (!state.isPlaying || (state.mode !== 'wait' && state.mode !== 'follow'))
                                return;
                            checkWaitModeAdvance();
                        }, 0);
                    }
                    // Otherwise engine waits for user input.
                }
                else {
                    ports.practice.startSustains();
                    const advanceDelayMs = state.mode === 'follow' ? Math.max(0, timeToWaitMs) : 10;
                    if (state.mode === 'follow') {
                        ports.metronome.scheduleMetronomeForPlaybackWindow(playbackWindowStartSec, currentMeasureIdx, currentTimestamp, waitSeconds, beatsToWait);
                    }
                    ports.clock.setTimer(() => {
                        if (state.isPlaying && (state.mode === 'wait' || state.mode === 'follow')) {
                            ports.practice.processMisses();
                            ports.score.update();
                            ports.ui.scroll();
                            playbackLoop();
                        }
                    }, advanceDelayMs);
                }
            }
            else {
                ports.practice.startSustains();
                ports.clock.setTimer(() => {
                    if (state.isPlaying) {
                        ports.practice.processMisses();
                        ports.score.update();
                        ports.ui.scroll();
                        playbackLoop();
                    }
                }, timeToWaitMs);
            }
        }
        function resetPlaybackFromToolbar() {
            ports.ui.cancelViewport();
            state.isPlaying = false;
            state.countInActive = false;
            ports.transport.stop();
            ports.metronome.clearScheduledMetronomeEvents();
            ports.metronome.stopWaitModeMetronome();
            silencePlaybackOutputsImmediately();
            ports.metronome.clearTempoVisualPulse();
            ports.audio.applyLatencyProfile();
            ports.ui.clearSvgFeedback();
            ports.transitions.clearTransient();
            state.score.correct = 0;
            state.score.wrong = 0;
            ports.ui.updateScore();
            ports.score.reset();
            const isLoopEnabled = ports.controls.isLoopEnabled();
            if (isLoopEnabled) {
                const minLoop = ports.controls.readLoopMin();
                while (!ports.score.isEndReached() && ports.score.getMeasureIndex() < minLoop - 1) {
                    ports.score.advance();
                }
            }
            ports.score.update();
            ports.ui.scroll();
            state.ledPreviewTraversalIndex = -1;
            state.lastLedPreviewEvents = [];
            ports.transitions.clearVisuals();
            if (state.ledOutputMode === 'wled') {
                ports.led.clearOutputs().catch(() => { });
            }
            ports.ui.hidePanels();
            ports.ui.updatePlayPause();
        }
        function enforceLooperBounds() {
            if (!ports.controls.isLoopEnabled() || !ports.score.hasCursor())
                return;
            const minLoop = state.looper.min;
            const maxLoop = state.looper.max;
            const current = ports.score.getMeasureIndex() + 1;
            if (current < minLoop || current > maxLoop) {
                ports.score.reset();
                while (!ports.score.isEndReached() && ports.score.getMeasureIndex() < minLoop - 1) {
                    ports.score.advance();
                }
                ports.score.update();
                ports.ui.scroll();
            }
        }
        function dispose() {
            if (disposed)
                return;
            disposed = true;
            epoch++;
            stopPlaybackState({ pauseTransport: false });
            ports.clock.dispose();
            ports.metronome.dispose();
        }
        return { checkWaitModeAdvance, startPlaybackFromToolbar, silencePlaybackOutputsImmediately,
            stopPlaybackState, pausePlaybackFromToolbar, resetPlaybackForLoadedScore, resetPlaybackFromToolbar,
            playbackLoop, enforceLooperBounds, dispose };
    }
    PianoTrainerPlaybackCoordinator.create = create;
})(PianoTrainerPlaybackCoordinator || (PianoTrainerPlaybackCoordinator = {}));
//# sourceMappingURL=playback-coordinator.js.map