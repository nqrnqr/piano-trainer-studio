import type {PianoTrainerDomain} from '../domain/model';
import type {LegacyAppState} from '../state/model';
// Pure mode decisions. The coordinator owns clocks, state writes and side effects.
export namespace PianoTrainerModePolicy {
    export const FOLLOW_ME_MIN_WAIT_RATIO = 0.6;
    export type AdvanceGuard = 'wait' | 'follow' | 'input-modes' | 'playing';
    export interface Position {readonly measureIndex: number; readonly timestampWhole: number;}
    export interface Window {readonly displayed: Position; readonly waitSeconds: number; readonly beatsToWait: number;}
    export type HitAdvance = {kind: 'wait'; delayMs: number; guard: 'wait'} |
        {kind: 'follow'; info: PianoTrainerDomain.FollowAdvanceInfo; fullWaitSeconds: number; guard: 'follow'};
    export type GroupDecision = {kind: 'input'; alreadyHit: boolean} | {kind: 'input-gap'} | {kind: 'timed'};
    export interface Policy {
        readonly kind: PianoTrainerDomain.PracticeMode;
        readonly waitsForInput: boolean;
        readonly usesRelativeAnchor: boolean;
        readonly startsWaitMetronome: boolean;
        deferAccompaniment(expectedCount: number, practicingHand: boolean): boolean;
        deferMetronome(expectedCount: number): boolean;
        followInfo(window: Window): PianoTrainerDomain.FollowAdvanceInfo | null;
        afterHit(info: PianoTrainerDomain.FollowAdvanceInfo | null): HitAdvance;
        group(notes: readonly {hit: boolean}[]): GroupDecision;
    }
    function waitAdvance(): HitAdvance { return {kind: 'wait', delayMs: 10, guard: 'wait'}; }
    function inputGroup(notes: readonly {hit: boolean}[]): GroupDecision {
        return notes.length > 0 ? {kind: 'input', alreadyHit: notes.every(note => note.hit)} : {kind: 'input-gap'};
    }
    function deferInputAccompaniment(expectedCount: number, practicingHand: boolean) {
        return expectedCount > 0 && !practicingHand;
    }
    export const wait: Policy = {
        kind: 'wait', waitsForInput: true, usesRelativeAnchor: true, startsWaitMetronome: true,
        deferAccompaniment: deferInputAccompaniment, deferMetronome: () => false,
        followInfo: () => null, afterHit: waitAdvance, group: inputGroup
    };
    export const follow: Policy = {
        kind: 'follow', waitsForInput: true, usesRelativeAnchor: true, startsWaitMetronome: false,
        deferAccompaniment: deferInputAccompaniment, deferMetronome: expectedCount => expectedCount > 0,
        followInfo: window => ({currentMeasureIdx: window.displayed.measureIndex, currentTimestamp: window.displayed.timestampWhole,
            waitSeconds: window.waitSeconds, beatsToWait: window.beatsToWait}),
        afterHit: info => info && Number.isFinite(info.waitSeconds)
            ? {kind: 'follow', info, fullWaitSeconds: Math.max(0, info.waitSeconds), guard: 'follow'} : waitAdvance(),
        group: inputGroup
    };
    export const realtime: Policy = {
        kind: 'realtime', waitsForInput: false, usesRelativeAnchor: false, startsWaitMetronome: false,
        deferAccompaniment: () => false, deferMetronome: () => false,
        followInfo: () => null, afterHit: waitAdvance, group: () => ({kind: 'timed'})
    };
    export function forMode(mode: string): Policy {
        // Preserve the legacy non-Wait/non-Follow branch for an invalid saved string.
        return mode === 'wait' ? wait : mode === 'follow' ? follow : realtime;
    }
    export function followWaitSeconds(fullWaitSeconds: number, rawRemainingSeconds: number) {
        let effectiveWaitSeconds = rawRemainingSeconds > 0 ? rawRemainingSeconds : fullWaitSeconds;
        if (effectiveWaitSeconds < fullWaitSeconds * FOLLOW_ME_MIN_WAIT_RATIO) effectiveWaitSeconds = fullWaitSeconds;
        return Math.max(0, effectiveWaitSeconds);
    }
    export function followHitDelayMs(waitSeconds: number) { return Math.max(0, Math.round(waitSeconds * 1000)); }
    export function inputGap(mode: string, timeToWaitMs: number) {
        // Called after sustain effects in an already-selected input-mode branch.
        return {delayMs: mode === 'follow' ? Math.max(0, timeToWaitMs) : 10, repeatMetronome: mode === 'follow'};
    }
    export function allowsAdvance(guard: AdvanceGuard, state: Readonly<Pick<LegacyAppState, 'isPlaying' | 'mode'>>) {
        if (guard === 'wait') return state.isPlaying && state.mode === 'wait';
        if (guard === 'follow') return state.isPlaying && state.mode === 'follow';
        if (guard === 'input-modes') return state.isPlaying && (state.mode === 'wait' || state.mode === 'follow');
        return state.isPlaying;
    }
}
