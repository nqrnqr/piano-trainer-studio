import type {PianoTrainerPerformance} from '../domain/performance-position';
import {PianoTrainerTiming} from '../domain/timing';

// A read-only estimate of this occurrence, using the playback wait calculation.
// A traversal event represents simultaneous voices once, regardless of spacing.
export function estimateSystemSeconds(input: {
    trace: PianoTrainerPerformance.Trace; traceStepIndex: number;
    firstMeasureIndex: number; lastMeasureIndex: number; loopMax: number | null;
    baseBpm: number; speed: number;
    getTempo(index: number): number | undefined;
    getMeasureTimingInfo(index: number | undefined): PianoTrainerTiming.MeasureTimingInfo;
}): number | null {
    const {steps} = input.trace;
    let bpm = input.baseBpm, seconds = 0, count = 0;
    if (!Number.isFinite(input.speed) || input.speed <= 0 || !steps[input.traceStepIndex]) return null;
    for (let index = input.traceStepIndex; index < steps.length; index++) {
        if (++count > 100000) return null;
        const step = steps[index]!, next = steps[index + 1], measure = step.source.sourceMeasureIndex;
        if (measure < input.firstMeasureIndex || measure > input.lastMeasureIndex || (input.loopMax !== null && measure > input.loopMax)) break;
        const previous = steps[index - 1];
        if (index === input.traceStepIndex || previous?.source.sourceMeasureIndex !== measure) {
            const tempo = input.getTempo(measure);
            if (tempo) bpm = tempo;
        }
        const effective = bpm * input.speed;
        if (!Number.isFinite(effective) || effective <= 0) return null;
        const fallbackLength = step.notes[0]?.lengthWhole ?? 1;
        const options = {currentMeasureIdx: measure, currentTimestamp: step.source.timestampWhole, fallbackLength,
            getMeasureTimingInfo: input.getMeasureTimingInfo};
        const beats = next ? PianoTrainerTiming.getTraversalBeatsToWait({...options,
            nextMeasureIdx: next.source.sourceMeasureIndex, nextTimestamp: next.source.timestampWhole})
            : PianoTrainerTiming.getRemainingMeasureWaitWhole(options) * 4;
        if (!Number.isFinite(beats) || beats < 0) return null;
        seconds += beats * 60 / effective;
        // Stop before this system is revisited by a repeat, even if the next
        // occurrence has the same source measure or timestamp.
        if (!next || next.source.sourceMeasureIndex < measure || next.source.timestampWhole < step.source.timestampWhole
            || (next.source.sourceMeasureIndex === measure && next.measureOccurrenceId !== step.measureOccurrenceId)) break;
    }
    return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}
