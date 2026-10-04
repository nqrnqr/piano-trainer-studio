import type {PianoTrainerPerformance} from '../domain/performance-position';
import type {PianoTrainerDomain} from '../domain/model';

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
    export function duration(mode: PianoTrainerDomain.PracticeMode, lineSeconds: number | null) {
        return mode === 'wait' || lineSeconds === null || !Number.isFinite(lineSeconds) || lineSeconds <= 0
            ? 650 : Math.min(1200, Math.max(400, lineSeconds * 200));
    }
    const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(value, high));
    export function decide(input: {
        kind: Kind; height: number; scrollTop: number; maxScroll: number;
        system: Bounds | null; cursor: Bounds; topObstruction?: number;
        mode: PianoTrainerDomain.PracticeMode; lineSeconds: number | null;
    }) {
        const {kind, height: h, cursor, system, mode, lineSeconds} = input;
        const s = input.scrollTop, max = Math.max(0, input.maxScroll);
        const margin = clamp(h * .04, 12, 32), pt = Math.max(margin, input.topObstruction || 0), pb = margin;
        const hold = {kind: 'hold' as const, target: s, durationMs: 0, lineSeconds};
        if (!Number.isFinite(h) || h <= 0 || ![s,max,cursor.top,cursor.bottom].every(Number.isFinite)) return hold;
        if (kind === 'navigation') return {kind: 'legacy' as const, target: s, durationMs: 0, lineSeconds};
        const safe = (box: Bounds) => box.top - s >= pt - 3 && box.bottom - s <= h - pb + 3;
        let target = s;
        const valid = system && [system.top, system.bottom].every(Number.isFinite) && system.bottom > system.top;
        const low = valid ? Math.max(0, system.bottom - h + pb) : Infinity;
        const high = valid ? Math.min(max, system.top - pt) : -Infinity;
        if (valid && low <= high) {
            if (safe(system)) {
                if (kind === 'same' || kind === 'visibility' || system.top - s <= h * .35 + 3) return hold;
            }
            target = clamp(system.top - h * .30, low, high);
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
        const correction = !safe(cursor);
        return {kind: 'animate' as const, target, durationMs: correction ? Math.min(400, duration(mode, lineSeconds)) : duration(mode, lineSeconds), lineSeconds};
    }
    export function interpolate(from: number, to: number, elapsed: number, durationMs: number) {
        const t = Math.min(1, Math.max(0, elapsed / durationMs));
        return from + (to - from) * t * t * (3 - 2 * t);
    }
}
