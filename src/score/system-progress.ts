import type {PianoTrainerPerformance} from '../domain/performance-position';
import {PianoTrainerTiming} from '../domain/timing';

export interface SystemProgress {
    totalBeats: number;
    steps: {traceStepIndex: number; completedBeats: number; durationBeats: number}[];
}

// One interval per traversal event, including rests and simultaneous voices.
// Build once per system entry/return, without touching the prefetched iterator.
export function buildSystemProgress(input: {
    trace: PianoTrainerPerformance.Trace; traceStepIndex: number;
    firstMeasureIndex: number; lastMeasureIndex: number; loopMax: number | null;
    getMeasureTimingInfo(index: number | undefined): PianoTrainerTiming.MeasureTimingInfo;
}): SystemProgress | null {
    const steps: SystemProgress['steps'] = [];
    let totalBeats = 0;
    for (let index = input.traceStepIndex; index < input.trace.steps.length; index++) {
        if (steps.length >= 100000) return null;
        const step = input.trace.steps[index]!, next = input.trace.steps[index + 1];
        const measure = step.source.sourceMeasureIndex;
        if (measure < input.firstMeasureIndex || measure > input.lastMeasureIndex
            || (input.loopMax !== null && measure > input.loopMax)) break;
        const fallbackLength = step.notes[0]?.lengthWhole ?? 1;
        const durationBeats = PianoTrainerTiming.getTraversalBeatsToWait({
            currentMeasureIdx: measure, currentTimestamp: step.source.timestampWhole,
            nextMeasureIdx: next?.source.sourceMeasureIndex ?? measure,
            nextTimestamp: next?.source.timestampWhole ?? step.source.timestampWhole + fallbackLength,
            fallbackLength, getMeasureTimingInfo: input.getMeasureTimingInfo
        });
        if (!Number.isFinite(durationBeats) || durationBeats < 0) return null;
        steps.push({traceStepIndex:index, completedBeats:totalBeats, durationBeats});
        totalBeats += durationBeats;
        // A repeat/DC/DS or same-measure occurrence starts a new baseline.
        if (!next || next.source.sourceMeasureIndex < measure || next.source.timestampWhole < step.source.timestampWhole
            || (next.source.sourceMeasureIndex === measure && next.measureOccurrenceId !== step.measureOccurrenceId)) break;
    }
    return Number.isFinite(totalBeats) && totalBeats > 0 ? {totalBeats, steps} : null;
}
