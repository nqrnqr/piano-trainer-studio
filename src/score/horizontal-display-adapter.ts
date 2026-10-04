import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerPerformance} from '../domain/performance-position';
import {PianoTrainerOsmdAdapter} from './osmd-adapter';
import {PianoTrainerSourceNoteIndex} from './source-note-index';
import {PianoTrainerGeometry} from '../render/geometry-engine';

// One silent display block. Source NoteRef remains the practice identity.
export namespace PianoTrainerHorizontalDisplay {
    export function create(host: HTMLElement, renderer: PianoTrainerOsmdVendor.Renderer,
        occurrences: readonly PianoTrainerPerformance.MeasureOccurrence[], trace: PianoTrainerPerformance.Trace) {
        const adapter = PianoTrainerOsmdAdapter.create({getRenderer: () => renderer,
            describeNote: () => ({}), describeGraphicalNote: () => ({}), debugLog: () => {},
            reportError: (message, error) => console.error(message, error)});
        const geometry = PianoTrainerGeometry.create({score: adapter, document,
            getSvg: () => host.querySelector('svg'), getComputedStyle: node => getComputedStyle(node),
            clearOverlays: () => {}, fallbackHands: () => ({left: 2, right: 1}),
            describeNote: () => ({}), describeGraphicalNote: () => ({}), debugLog: () => {}});
        const notes = new Map<string, {note: PianoTrainerOsmdVendor.Note; measure: number; staff: number}>();
        const measureIndices = new Map<number, number>();
        let disposed = false;
        function validate() {
            notes.clear(); measureIndices.clear();
            const measures = renderer.Sheet?.SourceMeasures || [];
            if (measures.length !== occurrences.length) throw new Error('Display measure count does not match the performance path.');
            for (const [index, occurrence] of occurrences.entries()) {
                measureIndices.set(occurrence.measureOccurrenceId, index);
                const displayNotes = PianoTrainerSourceNoteIndex.measure(measures[index]!);
                for (let stepIndex = occurrence.firstTraceStepIndex; stepIndex <= occurrence.lastTraceStepIndex; stepIndex++) {
                    for (const source of trace.steps[stepIndex]!.notes) {
                        const mapped = displayNotes.get(source.structureKey);
                        if (!mapped || mapped.note.halfTone + 12 !== source.midi || !!mapped.note.isRest?.() !== source.rest ||
                            Math.abs((mapped.note.Length?.RealValue ?? 0) - source.lengthWhole) > 1e-8) {
                            throw new Error(`Ambiguous display note mapping at source measure ${occurrence.sourceMeasureIndex}, address ${source.structureKey}.`);
                        }
                        notes.set(`${occurrence.measureOccurrenceId}/${source.sourceNoteRef.id}`, {note: mapped.note, measure: index, staff: source.staffIndex});
                    }
                }
            }
        }
        async function load(xml: string, zoom: number, staffGap?: number) {
            await renderer.load(xml);
            if (disposed) return;
            adapter.setLayout(true, adapter.getDefaults());
            if (staffGap !== undefined) {
                // Use the largest source spacing for every block. Independent
                // skyline optimizations otherwise move lower staves at seams.
                renderer.EngravingRules.MinimumStaffLineDistance = staffGap - 4;
                renderer.EngravingRules.MinSkyBottomDistBetweenStaves = -100000;
            }
            adapter.setZoom(zoom); renderer.render();
            if (renderer.cursor?.cursorElement) renderer.cursor.cursorElement.style.display = 'none';
            validate();
        }
        function anchor(occurrenceId: number, ref: PianoTrainerDomain.NoteRef) {
            const mapped = notes.get(`${occurrenceId}/${ref.id}`);
            return mapped ? geometry.getNoteAnchor(mapped.note, mapped.measure, mapped.staff) : null;
        }
        function box(occurrenceId: number, staff = 0) {
            const index = measureIndices.get(occurrenceId);
            return index === undefined ? null : geometry.getMeasureBox(index, staff);
        }
        function eventAnchor(step: PianoTrainerPerformance.TraceStep) {
            const points = step.notes.map(note => anchor(step.measureOccurrenceId, note.sourceNoteRef)).filter((point): point is NonNullable<typeof point> => !!point);
            const bounds = box(step.measureOccurrenceId);
            if (!bounds) return null;
            let x = points.length ? Math.min(...points.map(point => point.x)) : bounds.x;
            if (!points.length) {
                const occurrence = occurrences.find(measure => measure.measureOccurrenceId === step.measureOccurrenceId)!;
                let before = {time: 0, x: bounds.x}, after = {time: 1, x: bounds.x + bounds.width};
                for (let index = occurrence.firstTraceStepIndex; index <= occurrence.lastTraceStepIndex; index++) {
                    const candidate = trace.steps[index]!, anchors = candidate.notes.map(note => anchor(step.measureOccurrenceId, note.sourceNoteRef)).filter((point): point is NonNullable<typeof point> => !!point);
                    if (!anchors.length) continue;
                    const point = {time: candidate.relativeTimestampWhole, x: Math.min(...anchors.map(anchor => anchor.x))};
                    if (point.time <= step.relativeTimestampWhole) before = point;
                    else {after = point; break;}
                }
                after.time = Math.max(after.time, step.relativeTimestampWhole);
                const fraction = after.time > before.time ? (step.relativeTimestampWhole - before.time) / (after.time - before.time) : 0;
                x = before.x + Math.max(0, Math.min(1, fraction)) * (after.x - before.x);
            }
            return {x,
                y: bounds.y, height: bounds.height};
        }
        function dispose() { disposed = true; adapter.dispose(); notes.clear(); measureIndices.clear(); geometry.invalidate(); host.replaceChildren(); host.remove(); }
        return {load, anchor, box, eventAnchor, dispose, getSvg: () => geometry.getSvg(),
            staffTopY: (occurrenceId: number, staff: number) => {
                const index = measureIndices.get(occurrenceId);
                return index === undefined ? null : adapter.getStaffTopY(index, staff);
            },
            readResources: () => ({mappedNotes: notes.size, measures: measureIndices.size}),
            width: () => geometry.getSvg()?.getBoundingClientRect().width || 0,
            height: () => geometry.getSvg()?.getBoundingClientRect().height || 0};
    }
    export type Block = ReturnType<typeof create>;
}
