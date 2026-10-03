"use strict";
// Pure mode decisions. The coordinator owns clocks, state writes and side effects.
var PianoTrainerModePolicy;
(function (PianoTrainerModePolicy) {
    PianoTrainerModePolicy.FOLLOW_ME_MIN_WAIT_RATIO = 0.6;
    function waitAdvance() { return { kind: 'wait', delayMs: 10, guard: 'wait' }; }
    function inputGroup(notes) {
        return notes.length > 0 ? { kind: 'input', alreadyHit: notes.every(note => note.hit) } : { kind: 'input-gap' };
    }
    function deferInputAccompaniment(expectedCount, practicingHand) {
        return expectedCount > 0 && !practicingHand;
    }
    PianoTrainerModePolicy.wait = {
        kind: 'wait', waitsForInput: true, usesRelativeAnchor: true, startsWaitMetronome: true,
        deferAccompaniment: deferInputAccompaniment, deferMetronome: () => false,
        followInfo: () => null, afterHit: waitAdvance, group: inputGroup
    };
    PianoTrainerModePolicy.follow = {
        kind: 'follow', waitsForInput: true, usesRelativeAnchor: true, startsWaitMetronome: false,
        deferAccompaniment: deferInputAccompaniment, deferMetronome: expectedCount => expectedCount > 0,
        followInfo: window => ({ currentMeasureIdx: window.displayed.measureIndex, currentTimestamp: window.displayed.timestampWhole,
            waitSeconds: window.waitSeconds, beatsToWait: window.beatsToWait }),
        afterHit: info => info && Number.isFinite(info.waitSeconds)
            ? { kind: 'follow', info, fullWaitSeconds: Math.max(0, info.waitSeconds), guard: 'follow' } : waitAdvance(),
        group: inputGroup
    };
    PianoTrainerModePolicy.realtime = {
        kind: 'realtime', waitsForInput: false, usesRelativeAnchor: false, startsWaitMetronome: false,
        deferAccompaniment: () => false, deferMetronome: () => false,
        followInfo: () => null, afterHit: waitAdvance, group: () => ({ kind: 'timed' })
    };
    function forMode(mode) {
        // Preserve the legacy non-Wait/non-Follow branch for an invalid saved string.
        return mode === 'wait' ? PianoTrainerModePolicy.wait : mode === 'follow' ? PianoTrainerModePolicy.follow : PianoTrainerModePolicy.realtime;
    }
    PianoTrainerModePolicy.forMode = forMode;
    function followWaitSeconds(fullWaitSeconds, rawRemainingSeconds) {
        let effectiveWaitSeconds = rawRemainingSeconds > 0 ? rawRemainingSeconds : fullWaitSeconds;
        if (effectiveWaitSeconds < fullWaitSeconds * PianoTrainerModePolicy.FOLLOW_ME_MIN_WAIT_RATIO)
            effectiveWaitSeconds = fullWaitSeconds;
        return Math.max(0, effectiveWaitSeconds);
    }
    PianoTrainerModePolicy.followWaitSeconds = followWaitSeconds;
    function followHitDelayMs(waitSeconds) { return Math.max(0, Math.round(waitSeconds * 1000)); }
    PianoTrainerModePolicy.followHitDelayMs = followHitDelayMs;
    function inputGap(mode, timeToWaitMs) {
        // Called after sustain effects in an already-selected input-mode branch.
        return { delayMs: mode === 'follow' ? Math.max(0, timeToWaitMs) : 10, repeatMetronome: mode === 'follow' };
    }
    PianoTrainerModePolicy.inputGap = inputGap;
    function allowsAdvance(guard, state) {
        if (guard === 'wait')
            return state.isPlaying && state.mode === 'wait';
        if (guard === 'follow')
            return state.isPlaying && state.mode === 'follow';
        if (guard === 'input-modes')
            return state.isPlaying && (state.mode === 'wait' || state.mode === 'follow');
        return state.isPlaying;
    }
    PianoTrainerModePolicy.allowsAdvance = allowsAdvance;
})(PianoTrainerModePolicy || (PianoTrainerModePolicy = {}));
//# sourceMappingURL=mode-policy.js.map