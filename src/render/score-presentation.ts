import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerPerformance} from '../domain/performance-position';

// Display queries only; practice keeps source references and the single source iterator.
export namespace PianoTrainerScorePresentation {
    export interface Hit {sourceMeasureIndex: number; traceStepIndex: number; loopIteration: number;}
    export interface Service {
        getSvg(): SVGSVGElement | null;
        getCursorElement(): HTMLElement | null;
        anchor(ref: PianoTrainerDomain.NoteRef, event?: PianoTrainerPerformance.PerformedEvent | null): PianoTrainerDomain.SvgPoint | null;
        hitTest(clientX: number, clientY: number): Hit | null;
    }
}
