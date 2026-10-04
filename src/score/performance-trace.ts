import type {PianoTrainerPerformance} from '../domain/performance-position';

// The vendor decides the musical path. This scanner only gives its occurrences identities.
export namespace PianoTrainerPerformanceTrace {
    export interface Iterator {
        readonly EndReached: boolean;
        readonly CurrentMeasureIndex: number;
        readonly currentTimeStamp?: {RealValue: number};
        readonly CurrentRelativeInMeasureTimestamp: {RealValue: number};
        readonly CurrentEnrolledTimestamp: {RealValue: number};
        readonly JumpOccurred: boolean;
        moveToNext(): void;
    }
    export function scan(iterator: Iterator, readNotes: () => readonly PianoTrainerPerformance.NoteAddress[], limit = 100000): PianoTrainerPerformance.Trace {
        const steps: PianoTrainerPerformance.TraceStep[] = [];
        const measures: PianoTrainerPerformance.MeasureOccurrence[] = [];
        const ordinals = new Map<string, Map<string, number>>();
        let previousStart: number | null = null;
        while (!iterator.EndReached) {
            if (steps.length >= limit) throw new Error(`Performance traversal exceeds ${limit} events.`);
            const sourceMeasureIndex = iterator.CurrentMeasureIndex;
            const timestampWhole = iterator.currentTimeStamp?.RealValue;
            const relativeTimestampWhole = iterator.CurrentRelativeInMeasureTimestamp.RealValue;
            const enrolledStart = iterator.CurrentEnrolledTimestamp.RealValue - relativeTimestampWhole;
            if (!Number.isFinite(timestampWhole) || !Number.isFinite(relativeTimestampWhole)) throw new Error('Invalid performance timestamp.');
            let occurrence = measures[measures.length - 1];
            if (!occurrence || occurrence.sourceMeasureIndex !== sourceMeasureIndex || previousStart === null || Math.abs(previousStart - enrolledStart) > 1e-8 || iterator.JumpOccurred) {
                occurrence = {measureOccurrenceId: measures.length, sourceMeasureIndex, firstTraceStepIndex: steps.length, lastTraceStepIndex: steps.length};
                measures.push(occurrence);
            }
            previousStart = enrolledStart;
            const notes = readNotes();
            const key = `${relativeTimestampWhole}|${notes.map(note => note.structureKey).join(';')}`;
            let measureOrdinals = ordinals.get(String(sourceMeasureIndex));
            if (!measureOrdinals) { measureOrdinals = new Map(); ordinals.set(String(sourceMeasureIndex), measureOrdinals); }
            if (!measureOrdinals.has(key)) measureOrdinals.set(key, measureOrdinals.size);
            steps.push({traceStepIndex: steps.length, measureOccurrenceId: occurrence.measureOccurrenceId,
                source: {sourceMeasureIndex, timestampWhole: timestampWhole!, sourceEventOrdinal: measureOrdinals.get(key)!}, relativeTimestampWhole, notes});
            occurrence.lastTraceStepIndex = steps.length - 1;
            iterator.moveToNext();
        }
        return {steps, measures};
    }
}
