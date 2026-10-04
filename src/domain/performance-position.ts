import type {PianoTrainerDomain} from './model';

export namespace PianoTrainerPerformance {
    export interface SourceEventAddress {
        sourceMeasureIndex: number;
        timestampWhole: number;
        sourceEventOrdinal: number;
    }
    export interface NoteAddress {
        sourceNoteRef: PianoTrainerDomain.NoteRef;
        staffIndex: number;
        structureKey: string;
        midi: number;
        lengthWhole: number;
        rest: boolean;
    }
    export interface TraceStep {
        traceStepIndex: number;
        measureOccurrenceId: number;
        source: SourceEventAddress;
        relativeTimestampWhole: number;
        notes: readonly NoteAddress[];
    }
    export interface MeasureOccurrence {
        measureOccurrenceId: number;
        sourceMeasureIndex: number;
        firstTraceStepIndex: number;
        lastTraceStepIndex: number;
    }
    export interface Trace {
        steps: readonly TraceStep[];
        measures: readonly MeasureOccurrence[];
    }
    export type Reason = 'load' | 'advance' | 'loop' | 'reset' | 'seek';
    export interface PerformedEvent extends TraceStep {
        scoreRevision: number;
        runId: number;
        eventId: number;
        loopIteration: number;
        reason: Reason;
    }
}
