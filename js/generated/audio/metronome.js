"use strict";
// Moved from 1ec34ee without changing traversal, timing or cancellation rules.
var PianoTrainerMetronome;
(function (PianoTrainerMetronome) {
    function create(ports) {
        const state = ports.state;
        let lastTempoPulseAtMs = -Infinity;
        let tempoPulseTimeoutId = null, tempoPulseScheduleId = null;
        let scheduledMetronomeEventIds = [];
        let waitMetronomeTimeoutId = null;
        let waitMetronomeBeatCounter = 0, waitMetronomeNumerator = 4;
        let waitMetronomeNextClickAtSec = null;
        let waitMetronomeActiveMeasureIndex = -1;
        function getMetronomeClickSpec(isDownbeat) {
            if (isDownbeat && state.accentedDownbeatEnabled !== false) {
                return { note: 'G6', velocity: 0.95 };
            }
            return { note: 'C6', velocity: 0.7 };
        }
        function getMetronomeMidiClickSpec(isDownbeat) {
            if (isDownbeat && state.accentedDownbeatEnabled !== false) {
                return { note: 75, velocity: 118 };
            }
            return { note: 76, velocity: 92 };
        }
        function getMetronomeMidiVelocity(volumePercent, clickVelocity = 100) {
            const volumeScale = Math.max(0, Math.min(100, Number(volumePercent) || 0)) / 100;
            const baseVelocity = Math.max(1, Math.min(127, Math.round(Number(clickVelocity) || 100)));
            return Math.max(1, Math.min(127, Math.round(baseVelocity * volumeScale)));
        }
        function shouldUseMidiOutMetronome() {
            return !!state.metronomeMidiOutEnabled && !!ports.midi.isAvailable();
        }
        function sendMidiOutMetronomeClick(note, velocity = 100, durationMs = 80) {
            if (!ports.midi.isAvailable())
                return false;
            return ports.midi.percussionClick(note, getMetronomeMidiVelocity(ports.getVolume(), velocity), durationMs);
        }
        function playMetronomeClick(isDownbeat, timeSec = null) {
            const pulseTime = Number.isFinite(timeSec) ? timeSec : null;
            if (shouldUseMidiOutMetronome()) {
                const clickSpec = getMetronomeMidiClickSpec(isDownbeat);
                const delayMs = pulseTime == null ? 0 : Math.max(0, ((pulseTime - ports.clock.nowSeconds()) * 1000) - 2);
                ports.clock.setTimer(() => {
                    if (!ports.isEnabled())
                        return;
                    sendMidiOutMetronomeClick(clickSpec.note, clickSpec.velocity);
                }, delayMs);
                triggerTempoVisualPulse(pulseTime);
                return;
            }
            const clickSpec = getMetronomeClickSpec(isDownbeat);
            ports.audio.play(clickSpec.note, '64n', pulseTime ?? ports.clock.nowSeconds(), clickSpec.velocity);
            triggerTempoVisualPulse(pulseTime);
        }
        function clearTempoVisualPulse() {
            const tempoButton = ports.getPulseTarget();
            if (tempoButton)
                tempoButton.hide();
            if (tempoPulseTimeoutId) {
                ports.clock.clearTimer(tempoPulseTimeoutId);
                tempoPulseTimeoutId = null;
            }
            if (tempoPulseScheduleId) {
                ports.clock.clearTimer(tempoPulseScheduleId);
                tempoPulseScheduleId = null;
            }
        }
        function triggerTempoVisualPulse(time = null) {
            if (!state.visualPulseEnabled)
                return;
            const tempoButton = ports.getPulseTarget();
            if (!tempoButton)
                return;
            const firePulse = () => {
                tempoPulseScheduleId = null;
                const now = ports.clock.monotonicMilliseconds();
                if ((now - lastTempoPulseAtMs) < 120)
                    return;
                lastTempoPulseAtMs = now;
                tempoButton.restart();
                if (tempoPulseTimeoutId)
                    ports.clock.clearTimer(tempoPulseTimeoutId);
                tempoPulseTimeoutId = ports.clock.setTimer(() => {
                    tempoButton.hide();
                    tempoPulseTimeoutId = null;
                }, 170);
            };
            if (typeof time === 'number') {
                const delayMs = Math.max(0, ((time - ports.clock.nowSeconds()) * 1000) - 8);
                if (tempoPulseScheduleId)
                    ports.clock.clearTimer(tempoPulseScheduleId);
                tempoPulseScheduleId = ports.clock.setTimer(firePulse, delayMs);
            }
            else {
                firePulse();
            }
        }
        function clearScheduledMetronomeEvents() {
            if (!scheduledMetronomeEventIds.length)
                return;
            scheduledMetronomeEventIds.forEach((id) => ports.clock.clearTimer(id));
            scheduledMetronomeEventIds = [];
        }
        function stopWaitModeMetronome() {
            if (waitMetronomeTimeoutId) {
                ports.clock.clearTimer(waitMetronomeTimeoutId);
                waitMetronomeTimeoutId = null;
            }
            waitMetronomeBeatCounter = 0;
            waitMetronomeNumerator = 4;
            waitMetronomeNextClickAtSec = null;
            waitMetronomeActiveMeasureIndex = -1;
        }
        function getMetronomeTimeSignatureNumerator(measureIndex) {
            const timing = ports.timing.getInfo(Math.max(0, Number(measureIndex) || 0));
            return Math.max(1, Number(timing?.numerator) || 4);
        }
        function scheduleNextWaitModeMetronomeTick(referenceTimeSec = null) {
            if (waitMetronomeTimeoutId) {
                ports.clock.clearTimer(waitMetronomeTimeoutId);
                waitMetronomeTimeoutId = null;
            }
            if (!state.isPlaying || state.countInActive || state.mode !== 'wait')
                return;
            if (!ports.isEnabled())
                return;
            const currentRunningBpm = Math.max(1, state.baseBpm * state.speedPercent);
            const beatDurationSec = 60 / currentRunningBpm;
            const nowSec = ports.clock.nowSeconds();
            const targetTimeSec = Number.isFinite(referenceTimeSec)
                ? Math.max(nowSec, referenceTimeSec)
                : Math.max(nowSec, waitMetronomeNextClickAtSec ?? nowSec);
            waitMetronomeNextClickAtSec = targetTimeSec;
            const delayMs = Math.max(0, ((targetTimeSec - nowSec) * 1000) - 8);
            waitMetronomeTimeoutId = ports.clock.setTimer(() => {
                waitMetronomeTimeoutId = null;
                if (!state.isPlaying || state.countInActive || state.mode !== 'wait')
                    return;
                if (!ports.isEnabled())
                    return;
                const isDownbeat = waitMetronomeBeatCounter === 0;
                playMetronomeClick(isDownbeat);
                waitMetronomeBeatCounter = (waitMetronomeBeatCounter + 1) % Math.max(1, waitMetronomeNumerator || 4);
                waitMetronomeNextClickAtSec = targetTimeSec + beatDurationSec;
                scheduleNextWaitModeMetronomeTick(waitMetronomeNextClickAtSec);
            }, delayMs);
        }
        function startWaitModeMetronome(measureIndex) {
            if (!state.isPlaying || state.countInActive || state.mode !== 'wait')
                return;
            if (!ports.isEnabled()) {
                stopWaitModeMetronome();
                return;
            }
            waitMetronomeActiveMeasureIndex = Math.max(0, Number(measureIndex) || 0);
            waitMetronomeNumerator = getMetronomeTimeSignatureNumerator(waitMetronomeActiveMeasureIndex);
            waitMetronomeBeatCounter = 0;
            waitMetronomeNextClickAtSec = ports.clock.nowSeconds();
            scheduleNextWaitModeMetronomeTick(waitMetronomeNextClickAtSec);
        }
        function rebuildWaitModeMetronome(measureIndex = waitMetronomeActiveMeasureIndex) {
            stopWaitModeMetronome();
            if (!state.isPlaying || state.countInActive || state.mode !== 'wait')
                return;
            startWaitModeMetronome(measureIndex);
        }
        function scheduleMetronomeForPlaybackWindow(startTimeSec, currentMeasureIdx, currentTimestamp, windowLengthSec, beatsToWait) {
            clearScheduledMetronomeEvents();
            if (!state.isPlaying || state.countInActive) {
                stopWaitModeMetronome();
                return;
            }
            if (!ports.isEnabled()) {
                stopWaitModeMetronome();
                return;
            }
            if (state.mode === 'wait') {
                if (waitMetronomeTimeoutId == null && waitMetronomeNextClickAtSec == null) {
                    startWaitModeMetronome(currentMeasureIdx);
                }
                return;
            }
            stopWaitModeMetronome();
            if (!Number.isFinite(startTimeSec) || !Number.isFinite(currentTimestamp) || !Number.isFinite(windowLengthSec) || windowLengthSec < 0)
                return;
            const endTimestamp = currentTimestamp + ((Number.isFinite(beatsToWait) ? beatsToWait : 0) / 4);
            const epsilonWhole = 1e-7;
            let measureIndex = currentMeasureIdx;
            while (measureIndex < ports.timing.getCachedMeasureCount()) {
                const timing = ports.timing.getInfo(measureIndex);
                const measureStart = timing.startTimestamp;
                const measureEnd = measureStart + Math.max(timing.actualLengthWhole || 0, timing.nominalMeasureLengthWhole || 0);
                if (measureEnd <= currentTimestamp + epsilonWhole) {
                    measureIndex += 1;
                    continue;
                }
                if (measureStart >= endTimestamp - epsilonWhole) {
                    break;
                }
                const localStart = Math.max(currentTimestamp, measureStart);
                const localEnd = Math.min(endTimestamp, measureEnd);
                const firstBeatIndex = Math.max(0, Math.ceil(((localStart - measureStart) / timing.beatLengthWhole) - epsilonWhole));
                const maxBeatIndex = timing.numerator - 1;
                for (let beatIndex = firstBeatIndex; beatIndex <= maxBeatIndex; beatIndex++) {
                    const beatTimestamp = measureStart + (beatIndex * timing.beatLengthWhole);
                    if (beatTimestamp < localStart - epsilonWhole)
                        continue;
                    if (beatTimestamp >= localEnd - epsilonWhole)
                        continue;
                    const beatOffsetWhole = beatTimestamp - currentTimestamp;
                    const beatOffsetSec = (beatOffsetWhole * 4) * (windowLengthSec / Math.max(epsilonWhole, endTimestamp - currentTimestamp));
                    const clickTimeSec = startTimeSec + Math.max(0, beatOffsetSec);
                    const delayMs = Math.max(0, ((clickTimeSec - ports.clock.nowSeconds()) * 1000) - 8);
                    const isDownbeat = beatIndex === 0;
                    const timeoutId = ports.clock.setTimer(() => {
                        if (!state.isPlaying || state.countInActive)
                            return;
                        if (!ports.isEnabled())
                            return;
                        playMetronomeClick(isDownbeat, shouldUseMidiOutMetronome() ? null : ports.getLiveAudioTime());
                    }, delayMs);
                    scheduledMetronomeEventIds.push(timeoutId);
                }
                measureIndex += 1;
            }
        }
        function doCountInAndStart(callback) {
            const mIdx = ports.getCurrentMeasureIndex();
            const beats = ports.getCountInBeats(mIdx);
            const currentRunningBpm = state.baseBpm * state.speedPercent;
            const beatDurationSeconds = 60 / currentRunningBpm;
            let beatCount = 0;
            state.countInActive = true;
            function tick() {
                if (!state.isPlaying) {
                    state.countInActive = false;
                    return;
                }
                const isDownbeat = beatCount === 0;
                playMetronomeClick(isDownbeat);
                beatCount++;
                if (beatCount < beats) {
                    ports.clock.setTimer(tick, beatDurationSeconds * 1000);
                }
                else {
                    ports.clock.setTimer(() => {
                        if (!state.isPlaying) {
                            state.countInActive = false;
                            state.lastLedPreviewEvents = [];
                            state.ledPreviewTraversalIndex = -1;
                            return;
                        }
                        state.countInActive = false;
                        callback();
                    }, beatDurationSeconds * 1000);
                }
            }
            tick();
        }
        function dispose() {
            clearScheduledMetronomeEvents();
            stopWaitModeMetronome();
            clearTempoVisualPulse();
            ports.clock.dispose();
        }
        return { getMetronomeClickSpec, getMetronomeMidiClickSpec, getMetronomeMidiVelocity, shouldUseMidiOutMetronome, playMetronomeClick, clearTempoVisualPulse, triggerTempoVisualPulse, clearScheduledMetronomeEvents, stopWaitModeMetronome, getMetronomeTimeSignatureNumerator, scheduleNextWaitModeMetronomeTick, startWaitModeMetronome, rebuildWaitModeMetronome, scheduleMetronomeForPlaybackWindow, doCountInAndStart, sendMidiOutMetronomeClick, dispose, getWaitMeasureIndex: () => waitMetronomeActiveMeasureIndex, readResources: () => ({ windowEvents: scheduledMetronomeEventIds.length, waitTimer: waitMetronomeTimeoutId, pulseTimer: tempoPulseTimeoutId, pulseSchedule: tempoPulseScheduleId }) };
    }
    PianoTrainerMetronome.create = create;
})(PianoTrainerMetronome || (PianoTrainerMetronome = {}));
//# sourceMappingURL=metronome.js.map