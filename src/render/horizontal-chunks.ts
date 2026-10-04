import type {PianoTrainerPerformance} from '../domain/performance-position';

// Finite definitions, arithmetic Loop addresses. No list grows with Loop iterations.
export namespace PianoTrainerHorizontalChunks {
    export const MEASURES_PER_CHUNK = 8;
    export const WINDOW_CHUNKS = 7;
    export const CACHE_MODELS = 16;
    export interface Definition {
        key: string;
        context: {path: readonly PianoTrainerPerformance.MeasureOccurrence[]; start: number; end: number; cyclic: boolean};
        measures: readonly PianoTrainerPerformance.MeasureOccurrence[];
        before: PianoTrainerPerformance.MeasureOccurrence | null;
        after: PianoTrainerPerformance.MeasureOccurrence | null;
        width: number;
        height: number;
        offset: number;
    }
    export interface Address {index: number; iteration: number; definition: Definition; offset: number;}
    function split(path: readonly PianoTrainerPerformance.MeasureOccurrence[], prefix: string, loop: boolean): Definition[] {
        const result: Definition[] = [];
        for (let start = 0; start < path.length; start += MEASURES_PER_CHUNK) {
            const end = Math.min(path.length, start + MEASURES_PER_CHUNK);
            result.push({key: `${prefix}/${start}`, measures: path.slice(start, end),
                context: {path, start, end, cyclic: loop},
                before: path[start - 1] || (loop ? path[path.length - 1]! : null),
                after: path[end] || (loop ? path[0]! : null), width: 0, height: 0, offset: 0});
        }
        return result;
    }
    export function define(trace: PianoTrainerPerformance.Trace, loop: {enabled: boolean; min: number; max: number}, currentOccurrence = 0) {
        const start = trace.measures.findIndex(measure => measure.sourceMeasureIndex >= loop.min - 1);
        let stop = trace.measures.findIndex((measure, index) => index >= Math.max(0, start) && measure.sourceMeasureIndex > loop.max - 1);
        if (stop < 0) stop = trace.measures.length;
        let initialStop = loop.enabled ? trace.measures.findIndex((measure, index) => index > currentOccurrence && measure.sourceMeasureIndex > loop.max - 1) : -1;
        if (initialStop < 0) initialStop = trace.measures.length;
        const initial = split(trace.measures.slice(0, initialStop), 'initial', false);
        const repeated = loop.enabled && start >= 0 ? split(trace.measures.slice(start, stop), 'loop', true) : [];
        let initialWidth = 0, repeatedWidth = 0;
        function layout() {
            initialWidth = 0; repeatedWidth = 0;
            for (const definition of initial) {definition.offset = initialWidth; initialWidth += definition.width;}
            for (const definition of repeated) {definition.offset = repeatedWidth; repeatedWidth += definition.width;}
        }
        function address(index: number): Address | null {
            if (index < 0 || !Number.isInteger(index)) return null;
            if (index < initial.length) {const definition = initial[index]!; return {index, iteration: 0, definition, offset: definition.offset};}
            if (!repeated.length) return null;
            const relative = index - initial.length;
            const iteration = Math.floor(relative / repeated.length) + 1;
            const definition = repeated[relative % repeated.length]!;
            return {index, iteration, definition, offset: initialWidth + (iteration - 1) * repeatedWidth + definition.offset};
        }
        function forEvent(event: Pick<PianoTrainerPerformance.PerformedEvent, 'measureOccurrenceId' | 'loopIteration'>) {
            const definitions = event.loopIteration > 0 && repeated.length ? repeated : initial;
            const index = definitions.findIndex(definition => definition.measures.some(measure => measure.measureOccurrenceId === event.measureOccurrenceId));
            if (index < 0) return null;
            return address(definitions === initial ? index : initial.length + (event.loopIteration - 1) * repeated.length + index);
        }
        return {initial, repeated, layout, address, forEvent,
            definitions: [...initial, ...repeated],
            finiteCount: () => repeated.length ? null : initial.length};
    }
    export type Sequence = ReturnType<typeof define>;
    export function windowAround(index: number, finiteCount: number | null) {
        const start = Math.max(0, index - 2);
        return {start, end: Math.min(start + WINDOW_CHUNKS - 1, finiteCount === null ? Infinity : finiteCount - 1)};
    }
    export function compensatedScroll(oldScroll: number, oldOrigin: number, newOrigin: number, zoom: number) {
        return oldScroll + (oldOrigin - newOrigin) * zoom;
    }
}
