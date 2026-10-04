import type {PianoTrainerAudioRouting} from '../audio/audio-routing';
import type {PianoTrainerMetronome} from '../audio/metronome';
import type {PianoTrainerPlaybackClock} from '../audio/playback-clock';
import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerTiming} from '../domain/timing';
import {PianoTrainerModePolicy} from './mode-policy';
import type {PianoTrainerPlaybackState} from './playback-state';
import type {LegacyAppState} from '../state/model';
// One event loop. Pure policies decide mode rules; this factory owns effects.
export namespace PianoTrainerPlaybackCoordinator {
    export type State = Pick<LegacyAppState, 'mode' | 'isPlaying' | 'countInActive' | 'fullscreenOnPlay' |
        'baseBpm' | 'speedPercent' | 'lastLedPreviewEvents' | 'ledPreviewTraversalIndex' | 'pendingAudio' |
        'expectedNotes' | 'followAdvanceInfo' | 'anchorTime' | 'isAudioBusy' | 'currentExpectedContext' |
        'practice' | 'playback' | 'audioEnabled' | 'midiOutEnabled' | 'loopCountInEnabled' | 'score' | 'ledOutputMode' | 'looper'>;
    export interface Score {
        hasCursor(): boolean; isEndReached(): boolean; readEvent(): PianoTrainerDomain.PlaybackEvent;
        getTimestamp(): number; getMeasureIndex(): number; getTempo(index: number): number | undefined;
        advance(): void; reset(): void; update(): void; show(): void;
    }
    export interface Controls {
        isLoopEnabled(): boolean; isLoopEnabledAtEnd(): boolean;
        readLoopMin(): number; readLoopMax(): number; isMetronomeEnabled(): boolean;
    }
    export interface Ports {
        state: State; clock: PianoTrainerPlaybackClock.Service; score: Score;
        transport: {stop():void; start():void; pause():void; setBpm(value:number):void};
        controls: Controls;
        transitions: PianoTrainerPlaybackState.Service;
        metronome: Pick<PianoTrainerMetronome.Service, 'scheduleMetronomeForPlaybackWindow' | 'clearScheduledMetronomeEvents' |
            'clearTempoVisualPulse' | 'stopWaitModeMetronome' | 'startWaitModeMetronome' | 'doCountInAndStart' | 'dispose'>;
        audio: {schedule(midi:number, durationMs:number, velocity:number, destinations:PianoTrainerAudioRouting.Destinations):void;
            silence():void; ensureReady():Promise<unknown>; applyLatencyProfile():void;};
        midi: {silence():void};
        practice: {buildExpected(entries:Iterable<PianoTrainerDomain.PracticeSourceEntry>, measure:number, timestamp:number):void;
            getHandRole(staff:number|null):PianoTrainerDomain.HandRole|null; startSustains():void; processMisses():void;};
        timing: Pick<PianoTrainerTiming.Api, 'getTraversalBeatsToWait'> & {getMeasureTimingInfo(measure:number|undefined):PianoTrainerTiming.MeasureTimingInfo};
        ensureTimeline():void;
        led: {wipeHardware():void; clearOutputs():Promise<unknown>};
        ui: {scroll():void; cancelViewport():void; clearSvgFeedback():void; updatePlayPause():void; hidePanels():void;
            isFullscreenActive():boolean; requestFullscreen():Promise<unknown>; preserveScroll(callback:()=>void):void;
            renderFeedback():void; renderEventKeyboard(event:PianoTrainerDomain.PlaybackEvent, measure:number, timestamp:number):void;
            updateScore():void; updateTempoPercent(value:number):void;};
    }
    export function create(ports: Ports) {
        const state = ports.state;
        let epoch = 0, disposed = false;
        const policy = () => PianoTrainerModePolicy.forMode(state.mode);
        function scheduleAdvance(delayMs: number, guard: PianoTrainerModePolicy.AdvanceGuard, gradeMisses: boolean) {
            ports.clock.setTimer(() => {
                if (!PianoTrainerModePolicy.allowsAdvance(guard, state)) return;
                if (gradeMisses) ports.practice.processMisses();
                ports.score.update();
                ports.ui.scroll();
                playbackLoop();
            }, delayMs);
        }
        function checkWaitModeAdvance() {
            if (!state.isPlaying || !policy().waitsForInput || !state.isAudioBusy) return;

            if (state.expectedNotes.length === 0) return;

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
                const hitAdvance = policy().afterHit(followInfo);
                if (hitAdvance.kind === 'follow') {
                    const fullWaitSeconds = hitAdvance.fullWaitSeconds;
                    const rawRemainingSeconds = Number.isFinite(state.anchorTime)
                        ? (state.anchorTime - ports.clock.nowSeconds())
                        : fullWaitSeconds;

                    // Keep the original beat grid when the player is on time or early.
                    // If the player arrives late, do not collapse the next delay into a tiny
                    // catch-up burst. Let Follow Me breathe from the player's actual hit time.
                    const effectiveWaitSeconds = PianoTrainerModePolicy.followWaitSeconds(fullWaitSeconds, rawRemainingSeconds);

                    ports.metronome.scheduleMetronomeForPlaybackWindow(
                        ports.clock.nowSeconds(),
                        hitAdvance.info.currentMeasureIdx,
                        hitAdvance.info.currentTimestamp,
                        effectiveWaitSeconds,
                        hitAdvance.info.beatsToWait
                    );
                    scheduleAdvance(PianoTrainerModePolicy.followHitDelayMs(effectiveWaitSeconds), hitAdvance.guard, false);
                    return;
                }

                scheduleAdvance(hitAdvance.delayMs, hitAdvance.guard, false);
            }
        }

        async function startPlaybackFromToolbar() {
            if (!ports.score.hasCursor() || state.isPlaying) return;
            disposed = false;
            const generation = epoch;

            if (state.fullscreenOnPlay && !ports.ui.isFullscreenActive()) {
                await ports.ui.requestFullscreen();
                if (generation !== epoch) return;
            }

            await ports.audio.ensureReady();
            if (generation !== epoch) return;

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
                if (generation !== epoch) return;
                state.anchorTime = ports.clock.nowSeconds();
                ports.score.show();
                ports.ui.scroll();
                ports.transport.setBpm(state.baseBpm * state.speedPercent);
                ports.transport.start();
                if (policy().startsWaitMetronome && ports.controls.isMetronomeEnabled()) {
                    ports.metronome.startWaitModeMetronome(ports.score.hasCursor() ? ports.score.getMeasureIndex() : 0);
                }
                playbackLoop();
            });
        }

        function silencePlaybackOutputsImmediately() {
            ports.audio.silence();
            ports.midi.silence();
        }

        function stopPlaybackState({ pauseTransport = true }: {pauseTransport?: boolean} = {}) {
            ports.ui.cancelViewport();
            state.isPlaying = false;
            state.countInActive = false;
            state.lastLedPreviewEvents = [];
            state.ledPreviewTraversalIndex = -1;
            ports.transitions.clearTransient();

            if (pauseTransport) {
                ports.transport.pause();
            } else {
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
                ports.led.clearOutputs().catch(() => {});
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
            if (disposed || !state.isPlaying) return;
            const generation = epoch;

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

            // Numeric observations of the painted event; never a repeat restore token.
            const displayed: PianoTrainerModePolicy.Position = {timestampWhole: ports.score.getTimestamp(), measureIndex: ports.score.getMeasureIndex()};
            const currentTimestamp = displayed.timestampWhole;
            const currentMeasureIdx = displayed.measureIndex;

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
                                if (policy().deferAccompaniment(state.expectedNotes.length, isPracticingThisHand)) {
                                    state.pendingAudio.push({midi:m, durationMs, velocity:100, toLocalAudio:routeToLocalAudio, toMidiOut:routeToMidiOut});
                                } else {
                                    ports.audio.schedule(m, durationMs, 100, {toLocalAudio:routeToLocalAudio, toMidiOut:routeToMidiOut});
                                }
                            }
                        }
                    }
                }
            }

            ports.score.advance();

            // The actual iterator is now prefetched; OSMD keeps its complete repeat state.
            const prefetched: PianoTrainerModePolicy.Position = {measureIndex: ports.score.getMeasureIndex(), timestampWhole: ports.score.getTimestamp()};
            const nextMeasureIdx = prefetched.measureIndex;
            let nextTimestamp = prefetched.timestampWhole;
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
            const playbackWindowStartSec = policy().usesRelativeAnchor ? ports.clock.nowSeconds() : state.anchorTime;

            const deferMetronomeWindow = policy().deferMetronome(state.expectedNotes.length);
            if (!deferMetronomeWindow) {
                ports.metronome.scheduleMetronomeForPlaybackWindow(
                    playbackWindowStartSec,
                    currentMeasureIdx,
                    currentTimestamp,
                    waitSeconds,
                    beatsToWait
                );
            } else {
                ports.metronome.clearScheduledMetronomeEvents();
                ports.metronome.clearTempoVisualPulse();
            }

            let timeToWaitMs = waitSeconds * 1000;

            const isLoopEnabled = ports.controls.isLoopEnabled();
            const maxLoop = ports.controls.readLoopMax();
            const minLoop = ports.controls.readLoopMin();

            if (isLoopEnabled && (isEndReached || (ports.score.getMeasureIndex() + 1 > maxLoop))) {

                ports.clock.setTimer(() => {
                    if (!state.isPlaying) return;

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
                        if (generation !== epoch) return;
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
                    } else {
                        restartLoopPlayback();
                    }

                }, timeToWaitMs);

                return;
            }

            if (policy().usesRelativeAnchor) {
                state.anchorTime = ports.clock.nowSeconds() + waitSeconds;
            } else {
                state.anchorTime += waitSeconds;
            }

            timeToWaitMs = (state.anchorTime - ports.clock.nowSeconds()) * 1000;

            if (timeToWaitMs < 0) {
                timeToWaitMs = 0;
                if (policy().usesRelativeAnchor) {
                    state.anchorTime = ports.clock.nowSeconds();
                }
            }

            if (policy().waitsForInput) {
                state.isAudioBusy = true;
                state.followAdvanceInfo = policy().followInfo({displayed, waitSeconds, beatsToWait});
            }

            const groupDecision = policy().group(state.expectedNotes);
            if (groupDecision.kind === 'input') {
                if (groupDecision.alreadyHit) {
                    // Early-grace reservations can satisfy a group before a fresh keydown.
                    ports.clock.setTimer(() => {
                        if (!PianoTrainerModePolicy.allowsAdvance('input-modes', state)) return;
                        checkWaitModeAdvance();
                    }, 0);
                }
                // Otherwise engine waits for user input.
            } else if (groupDecision.kind === 'input-gap') {
                ports.practice.startSustains();
                const gap = PianoTrainerModePolicy.inputGap(state.mode, timeToWaitMs);
                if (gap.repeatMetronome) {
                    ports.metronome.scheduleMetronomeForPlaybackWindow(
                        playbackWindowStartSec,
                        currentMeasureIdx,
                        currentTimestamp,
                        waitSeconds,
                        beatsToWait
                    );
                }
                scheduleAdvance(gap.delayMs, 'input-modes', true);
            } else {
                ports.practice.startSustains();
                scheduleAdvance(timeToWaitMs, 'playing', true);
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
                ports.led.clearOutputs().catch(() => {});
            }
            ports.ui.hidePanels();
            ports.ui.updatePlayPause();
        }

        function enforceLooperBounds() {
            if (!ports.controls.isLoopEnabled() || !ports.score.hasCursor()) return;

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
            if (disposed) return;
            disposed = true; epoch++;
            stopPlaybackState({pauseTransport:false});
            ports.clock.dispose();
            ports.metronome.dispose();
        }
        function suspend() {
            epoch++;
            pausePlaybackFromToolbar();
            ports.clock.dispose();
            ports.metronome.dispose();
        }
        return {checkWaitModeAdvance, startPlaybackFromToolbar, silencePlaybackOutputsImmediately,
            stopPlaybackState, pausePlaybackFromToolbar, resetPlaybackForLoadedScore, resetPlaybackFromToolbar,
            playbackLoop, enforceLooperBounds, suspend, dispose};
    }
    export type Service = ReturnType<typeof create>;
}
