import type {PianoTrainerPerformance} from '../domain/performance-position';

// All distances here are scroll-container content coordinates in CSS pixels.
export namespace PianoTrainerTraditionalScroll {
    export interface Bounds {top: number; bottom: number;}
    export interface SystemBounds extends Bounds {
        systemId: number; layoutRevision: number; pageIndex: number;
        firstMeasureIndex: number; lastMeasureIndex: number; left: number; right: number;
    }
    export interface Position {
        scoreRevision: number; layoutRevision: number; systemId: number | null;
        traceStepIndex: number; measureIndex: number; timestampWhole: number | null;
        occurrenceId: number | null; eventId: number | null; runId: number | null;
        loopIteration: number | null; reason: PianoTrainerPerformance.Reason | null;
    }
    export type Kind = 'same' | 'adjacent' | 'align' | 'visibility' | 'navigation';
    export function classify(previous: Position | null, current: Position): Kind {
        if (!previous || previous.scoreRevision !== current.scoreRevision) return 'navigation';
        const freshEvent = current.eventId !== previous.eventId || current.runId !== previous.runId;
        if ((freshEvent && current.reason && current.reason !== 'advance')
            || (current.runId !== null && previous.runId !== null && current.runId !== previous.runId)
            || (current.loopIteration !== null && previous.loopIteration !== null && current.loopIteration !== previous.loopIteration)
            || current.traceStepIndex < previous.traceStepIndex || current.measureIndex < previous.measureIndex
            || (current.measureIndex === previous.measureIndex && (
                (current.timestampWhole !== null && previous.timestampWhole !== null && current.timestampWhole < previous.timestampWhole)
                || (current.occurrenceId !== null && previous.occurrenceId !== null && current.occurrenceId !== previous.occurrenceId)))) return 'navigation';
        if (current.layoutRevision !== previous.layoutRevision) return 'visibility';
        if (current.systemId === previous.systemId) return 'same';
        return current.systemId !== null && previous.systemId !== null && current.systemId === previous.systemId + 1 ? 'adjacent' : 'visibility';
    }
    export const dockingFraction = .06;
    export const completionFraction = .60;
    export const smoothingMilliseconds = 150;
    const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(value, high));
    export function decide(input: {
        height: number; scrollTop: number; maxScroll: number;
        system: Bounds | null; cursor: Bounds; topObstruction?: number;
    }) {
        const {height: h, cursor, system} = input;
        const s = input.scrollTop, max = Math.max(0, input.maxScroll);
        const margin = clamp(h * .04, 12, 32), pt = Math.max(margin, input.topObstruction || 0), pb = margin;
        const hold = {dock:s, minimum:s};
        if (!Number.isFinite(h) || h <= 0 || ![s,max,cursor.top,cursor.bottom].every(Number.isFinite)) return hold;
        const safe = (box: Bounds) => box.top - s >= pt - 3 && box.bottom - s <= h - pb + 3;
        let target = s;
        const valid = system && [system.top, system.bottom].every(Number.isFinite) && system.bottom > system.top;
        const low = valid ? Math.max(0, system.bottom - h + pb) : Infinity;
        const high = valid ? Math.min(max, system.top - pt) : -Infinity;
        if (valid && low <= high) {
            // System graphic top, not just the upper staff/cursor. Six percent
            // of the usable space below measured controls, plus safety margins.
            target = clamp(system.top - (pt + Math.max(0, h-pt-pb)*dockingFraction), low, high);
            if (safe(system) && target <= s + 3) return hold;
            return {dock:target, minimum:clamp(s, low, high)};
        } else {
            // An oversized system cannot satisfy both edges. Keep the painted
            // cursor readable with the smallest movement, even for long staves.
            if (cursor.bottom-cursor.top > h-pt-pb) {
                if (cursor.top-s >= pt-3 && cursor.top-s <= h-pb+3) return hold;
                target = cursor.top-pt;
            } else if (safe(cursor)) return hold;
            else if (cursor.top - s < pt) target = cursor.top - pt;
            else if (cursor.bottom - s > h - pb) target = cursor.bottom - h + pb;
        }
        target = clamp(target, 0, max);
        if (Math.abs(target - s) <= 3) return hold;
        return {dock:target, minimum:target};
    }
    export function progressTarget(from: number, dock: number, progress: number) {
        return from + Math.max(0, dock-from) * clamp(progress/completionFraction, 0, 1);
    }
    // Smoothing a moving target is visual only; it never advances musical time.
    export function approach(current: number, target: number, elapsedMs: number) {
        if (Math.abs(target-current) <= .5) return target;
        return current + (target-current) * (1-Math.exp(-clamp(elapsedMs,0,50)/smoothingMilliseconds));
    }
}
