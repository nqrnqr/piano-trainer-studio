import type {PianoTrainerPerformance} from '../domain/performance-position';

export namespace PianoTrainerPerformancePosition {
    export interface Ports {
        getTrace(): PianoTrainerPerformance.Trace;
        getTraceStepIndex(): number;
        getScoreRevision(): number;
        changed(event: PianoTrainerPerformance.PerformedEvent): void;
    }
    export function create(ports: Ports) {
        let runId = 0, eventId = 0, loopIteration = 0;
        let current: PianoTrainerPerformance.PerformedEvent | null = null;
        let reason: PianoTrainerPerformance.Reason = 'load';
        function present() {
            const step = ports.getTrace().steps[ports.getTraceStepIndex()];
            if (!step) return current;
            const scoreRevision = ports.getScoreRevision();
            if (current?.traceStepIndex === step.traceStepIndex && current.loopIteration === loopIteration && current.runId === runId && current.scoreRevision === scoreRevision) return current;
            current = {...step, scoreRevision, runId, eventId: ++eventId, loopIteration, reason};
            reason = 'advance'; ports.changed(current);
            return current;
        }
        function navigate(nextReason: Exclude<PianoTrainerPerformance.Reason, 'advance' | 'loop'>, iteration = 0) {
            runId++; loopIteration = iteration; current = null; reason = nextReason;
            return present();
        }
        function loop() { loopIteration++; reason = 'loop'; }
        return {present, navigate, loop, current: () => current};
    }
    export type Service = ReturnType<typeof create>;
}
