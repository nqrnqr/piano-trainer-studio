import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerPerformance} from '../domain/performance-position';
import {PianoTrainerHorizontalDisplay} from '../score/horizontal-display-adapter';
import {PianoTrainerUnfoldMusicXml} from '../score/unfold-musicxml';
import type {PianoTrainerHorizontalChunks} from './horizontal-chunks';

// Render once, copy numeric geometry and an SVG template, then release the OSMD graph.
export namespace PianoTrainerHorizontalChunkModel {
    const contexts = new WeakMap<readonly PianoTrainerPerformance.MeasureOccurrence[], ReturnType<typeof PianoTrainerUnfoldMusicXml.prepare>>();
    export interface Model {
        template: SVGSVGElement;
        width: number; height: number;
        anchors: Map<string, PianoTrainerDomain.SvgPoint>;
        boxes: Map<number, {x: number; y: number; width: number; height: number}>;
        events: Map<number, {x: number; y: number; height: number}>;
        staffTops: Map<string, number>;
    }
    function cropGraphics(source: SVGSVGElement, copy: SVGSVGElement, left: number, right: number) {
        const inverse = source.getScreenCTM()?.inverse();
        if (!inverse) return;
        const selector = 'path,text,rect,line,circle,ellipse,polygon,polyline,image,use';
        const originals = source.querySelectorAll<SVGGraphicsElement>(selector), copies = copy.querySelectorAll(selector);
        originals.forEach((element, index) => {
            if (element.closest('defs')) return;
            const transform = element.getScreenCTM();
            if (!transform) return;
            const bounds = element.getBBox(), matrix = inverse.multiply(transform);
            const points = [[bounds.x, bounds.y], [bounds.x + bounds.width, bounds.y], [bounds.x, bounds.y + bounds.height], [bounds.x + bounds.width, bounds.y + bounds.height]]
                .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
            if (Math.max(...points.map(point => point.x)) < left - 1 || Math.min(...points.map(point => point.x)) > right + 1) copies[index]?.remove();
        });
        for (const group of Array.from(copy.querySelectorAll('g')).reverse()) if (!group.children.length) group.remove();
    }
    export async function load(xml: string, definition: PianoTrainerHorizontalChunks.Definition, trace: PianoTrainerPerformance.Trace, zoom: number,
        isActive: () => boolean, metrics: {gap: number; top: number; bottom: number; staffCount: number}): Promise<Model> {
        const context = definition.context;
        let prepared = contexts.get(context.path);
        if (!prepared) {prepared = PianoTrainerUnfoldMusicXml.prepare(xml, context.path, context.cyclic); contexts.set(context.path, prepared);}
        const excerpt = prepared.excerpt(context.start, context.end);
        const host = document.createElement('div');
        host.style.cssText = 'position:fixed;left:-100000px;top:0;width:1200px;'; document.body.append(host);
        const block = PianoTrainerHorizontalDisplay.create(host,
            new opensheetmusicdisplay.OpenSheetMusicDisplay(host, {autoResize: false, drawTitle: false}), excerpt.measures, trace);
        try {
            await block.load(excerpt.xml, zoom, metrics.gap);
            if (!isActive()) throw new DOMException('Expired horizontal chunk.', 'AbortError');
            const first = block.box(definition.measures[0]!.measureOccurrenceId)!, last = block.box(definition.measures[definition.measures.length - 1]!.measureOccurrenceId)!;
            const svg = block.getSvg();
            if (!svg || !first || !last) throw new Error('Missing rendered chunk geometry.');
            const width = last.x + last.width - first.x, height = (metrics.staffCount - 1) * metrics.gap * 10 + 40 + metrics.top + metrics.bottom;
            const top = first.y + 40 - metrics.top;
            const template = svg.cloneNode(true) as SVGSVGElement;
            cropGraphics(svg, template, first.x, first.x + width);
            template.setAttribute('viewBox', `${first.x} ${top} ${width} ${height}`);
            template.setAttribute('width', String(width)); template.setAttribute('height', String(height));
            template.style.cssText = 'overflow:hidden;';
            const model: Model = {template, width, height, anchors: new Map(), boxes: new Map(), events: new Map(), staffTops: new Map()};
            for (const occurrence of definition.measures) {
                const box = block.box(occurrence.measureOccurrenceId)!;
                model.boxes.set(occurrence.measureOccurrenceId, {...box, x: box.x - first.x, y: box.y - top});
                for (let index = occurrence.firstTraceStepIndex; index <= occurrence.lastTraceStepIndex; index++) {
                    const step = trace.steps[index]!, point = block.eventAnchor(step);
                    if (!point) throw new Error('Missing performed event anchor in chunk.');
                    model.events.set(index, {...point, x: point.x - first.x, y: point.y - top});
                    for (const note of step.notes) {
                        const anchor = block.anchor(occurrence.measureOccurrenceId, note.sourceNoteRef);
                        if (!anchor) throw new Error('Missing display note anchor in chunk.');
                        model.anchors.set(`${occurrence.measureOccurrenceId}/${note.sourceNoteRef.id}`, {x: anchor.x - first.x, y: anchor.y - top});
                        const staffTop = block.staffTopY(occurrence.measureOccurrenceId, note.staffIndex);
                        if (staffTop !== null) model.staffTops.set(`${occurrence.measureOccurrenceId}/${note.staffIndex}`, staffTop - top);
                    }
                }
            }
            definition.width = width; definition.height = height;
            return model;
        } finally {block.dispose();}
    }
    export function copy(model: Model, instanceId: string) {
        const svg = model.template.cloneNode(true) as SVGSVGElement;
        const ids = new Map<string, string>();
        for (const [index, element] of [svg, ...Array.from(svg.querySelectorAll('[id]'))].entries()) {
            if (!element.id) {element.removeAttribute('id'); continue;}
            // OSMD can reuse source measure-number IDs within one unfolded SVG.
            // Make every element unique, preserving the first target of an
            // existing fragment reference as document.getElementById would.
            const prior = element.id, next = `${instanceId}-node-${index}-${prior}`;
            if (!ids.has(prior)) ids.set(prior, next);
            element.id = next;
        }
        for (const element of [svg, ...Array.from(svg.querySelectorAll('*'))]) for (const attribute of Array.from(element.attributes)) {
            let value = attribute.value;
            value = value.replace(/url\(#([^)]+)\)/g, (match, id: string) => ids.has(id) ? `url(#${ids.get(id)!})` : match);
            if (value.startsWith('#') && ids.has(value.slice(1))) value = `#${ids.get(value.slice(1))!}`;
            if (value !== attribute.value) element.setAttribute(attribute.name, value);
        }
        return svg;
    }
}
