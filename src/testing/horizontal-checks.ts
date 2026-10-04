import type {createServices} from '../app/services';
import {PianoTrainerUnfoldMusicXml} from '../score/unfold-musicxml';
import {PianoTrainerHorizontalDisplay} from '../score/horizontal-display-adapter';

export function createHorizontalChecks(getServices: () => ReturnType<typeof createServices>) {
    let prototype: PianoTrainerHorizontalDisplay.Block | null = null;
    return {
        convert: (xml: string, indices: number[]) => PianoTrainerUnfoldMusicXml.unfold(xml, indices.map((sourceMeasureIndex, measureOccurrenceId) => ({sourceMeasureIndex, measureOccurrenceId, firstTraceStepIndex: 0, lastTraceStepIndex: 0}))).xml,
        excerpt: (xml: string, indices: number[], start: number, end: number) => {
            const result = PianoTrainerUnfoldMusicXml.prepare(xml, indices.map((sourceMeasureIndex, measureOccurrenceId) => ({sourceMeasureIndex, measureOccurrenceId, firstTraceStepIndex: 0, lastTraceStepIndex: 0})), false).excerpt(start, end);
            return {xml: result.xml, indices: result.measures.map(measure => measure.sourceMeasureIndex)};
        },
        trace: () => {
            const trace = getServices().osmdAdapter.getPerformanceTrace();
            return {steps: trace.steps.map(step => ({...step, source: {...step.source}, notes: step.notes.map(note => ({...note, sourceNoteRef: {...note.sourceNoteRef}}))})),
                measures: trace.measures.map(measure => ({...measure}))};
        },
        prototype: async (xml: string) => {
            prototype?.dispose();
            const adapter = getServices().osmdAdapter, trace = adapter.getPerformanceTrace();
            const derived = PianoTrainerUnfoldMusicXml.unfold(xml, trace.measures);
            const host = document.createElement('div'); host.style.width = '1200px'; document.body.append(host);
            prototype = PianoTrainerHorizontalDisplay.create(host, new opensheetmusicdisplay.OpenSheetMusicDisplay(host, {autoResize: false, drawTitle: false}), trace.measures, trace);
            await prototype.load(derived.xml, 1);
            return {sequence: trace.measures.map(measure => measure.sourceMeasureIndex),
                anchors: trace.steps.map(step => prototype!.eventAnchor(step)), resources: prototype.readResources(),
                xml: derived.xml};
        },
        seek: (stepIndex: number) => { const services = getServices(), adapter = services.osmdAdapter; adapter.seekTraceStep(stepIndex); adapter.updateCursor(); services.performancePosition.navigate('seek'); },
        ready: () => getServices().horizontalScore.ready(),
        position: () => {const event = getServices().performancePosition.current(); return event ? {...event, source: {...event.source}, notes: event.notes.map(note => ({...note, sourceNoteRef: {...note.sourceNoteRef}}))} : null;},
        resources: () => ({...getServices().horizontalScore.readResources()}),
        anchors: () => {
            const services = getServices(), current = services.performancePosition.current();
            if (!current) return [];
            return services.osmdAdapter.getPerformanceTrace().steps.flatMap(step => step.notes.map(note => ({midi: note.midi, staffIndex: note.staffIndex,
                measureOccurrenceId: step.measureOccurrenceId, point: services.horizontalScore.anchor(note.sourceNoteRef, {...current, ...step})})));
        },
        measureBounds: () => getServices().horizontalScore.measureBoxes(),
        clear: () => {prototype?.dispose(); prototype = null;}
    };
}
