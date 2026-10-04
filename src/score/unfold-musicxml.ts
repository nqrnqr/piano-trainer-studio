import type {PianoTrainerPerformance} from '../domain/performance-position';

export namespace PianoTrainerUnfoldMusicXml {
    const navigationAttributes = ['dacapo', 'dalsegno', 'tocoda', 'fine', 'segno', 'coda', 'forward-repeat'];
    const children = (node: Element, name: string) => Array.from(node.children).filter(child => child.localName === name);
    const attributeKey = (node: Element) => `${node.localName}/${node.getAttribute('number') || ''}`;
    const serialize = (document: Document) => {
        const xml = new XMLSerializer().serializeToString(document);
        // OSMD 1.9.7 requires a declaration when load receives a string. A
        // cloned Document does not retain the original declaration metadata.
        return xml.startsWith('<?xml') ? xml : `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
    };
    function displayIds(measure: Element, partId: string, occurrence: number) {
        const prefix = `display-${partId}-measure-${occurrence}`;
        measure.setAttribute('id', prefix);
        for (const [index, node] of Array.from(measure.querySelectorAll('note[id], direction[id], barline[id], harmony[id]')).entries()) node.setAttribute('id', `${prefix}-${node.localName}-${index}`);
    }
    function stripNavigation(measure: Element) {
        for (const node of Array.from(measure.querySelectorAll('repeat, ending, segno, coda, multiple-rest'))) node.remove();
        for (const print of children(measure, 'print')) print.remove();
        for (const sound of Array.from(measure.querySelectorAll('sound'))) {
            for (const attribute of navigationAttributes) sound.removeAttribute(attribute);
        }
        for (const words of Array.from(measure.querySelectorAll('direction-type > words'))) {
            if (/^\s*(?:D\.?\s*[CS]\.?|Da\s+Capo|Dal\s+Segno|(?:To\s+)?Coda|Fine)(?:\s|$)/i.test(words.textContent || '')) words.remove();
        }
        for (const type of Array.from(measure.querySelectorAll('direction-type'))) if (!type.children.length) type.remove();
        for (const direction of children(measure, 'direction')) {
            const meaningfulSound = direction.querySelector('sound')?.attributes.length;
            if (!direction.querySelector('direction-type') && !meaningfulSound) direction.remove();
        }
    }
    interface Context {attributes: Map<string, Element>; tempo: Element | null;}
    function contexts(measures: Element[]) {
        const result: Context[] = [];
        const attributes = new Map<string, Element>();
        let tempo: Element | null = null;
        for (const measure of measures) {
            result.push({attributes: new Map(attributes), tempo});
            for (const block of children(measure, 'attributes')) {
                for (const attribute of Array.from(block.children)) {
                    if (!['measure-style'].includes(attribute.localName)) attributes.set(attributeKey(attribute), attribute);
                }
            }
            for (const direction of children(measure, 'direction')) {
                if (direction.querySelector('sound[tempo], metronome')) tempo = direction;
            }
        }
        return result;
    }
    function restoreContext(document: Document, measure: Element, context: Context) {
        const block = document.createElement('attributes');
        // Order matters to MusicXML readers: divisions, key, time, staves, clef, transpose.
        const order = ['divisions', 'key', 'time', 'staves', 'part-symbol', 'instruments', 'clef', 'staff-details', 'transpose', 'directive'];
        for (const name of order) for (const attribute of context.attributes.values()) {
            if (attribute.localName === name) block.appendChild(attribute.cloneNode(true));
        }
        if (block.children.length) measure.insertBefore(block, measure.firstChild);
        if (context.tempo) {
            const direction = context.tempo.cloneNode(true) as Element;
            // Carry tempo only; a compound direction must not replay its dynamics/words/pedal.
            for (const type of children(direction, 'direction-type')) {
                for (const child of Array.from(type.children)) if (child.localName !== 'metronome') child.remove();
                if (!type.children.length) type.remove();
            }
            const sound = direction.querySelector('sound');
            if (sound) for (const attribute of Array.from(sound.attributes)) if (attribute.name !== 'tempo') sound.removeAttribute(attribute.name);
            direction.querySelector('offset')?.remove();
            measure.insertBefore(direction, block.nextSibling);
        }
    }
    interface Span {start: number; end: number;}
    // Match adjacent attacks within a voice, including backup/forward, chords
    // and cross-staff voices. A later same pitch is not sufficient for a tie.
    function repairConnections(part: Element, occurrences: readonly PianoTrainerPerformance.MeasureOccurrence[]) {
        const spans: Span[] = [];
        const pendingTies = new Map<string, Map<string, {links: Element[]; index: number; end: number}>>();
        const pendingLines = new Map<string, {link: Element; index: number}>();
        let divisions = 1, elapsed = 0, meter = 4;
        function line(link: Element, key: string, index: number, start: boolean, stop: boolean) {
            const prior = pendingLines.get(key);
            if (stop) {
                if (prior) {spans.push({start: prior.index, end: index}); pendingLines.delete(key);}
                else link.remove();
            }
            if (start) {pendingLines.get(key)?.link.remove(); pendingLines.set(key, {link, index});}
        }
        for (const [index, measure] of children(part, 'measure').entries()) {
            // Backward navigation restarts phrasing; a forward ending skip may
            // legitimately retain a slur/extension to its remaining endpoint.
            if (index && occurrences[index]!.sourceMeasureIndex <= occurrences[index - 1]!.sourceMeasureIndex) {
                for (const entry of pendingLines.values()) entry.link.remove();
                pendingLines.clear();
            }
            const voices = new Map<string, {time: number; grace: boolean; notes: Element[]}[]>();
            let time = 0, duration = 0;
            for (const node of Array.from(measure.children)) {
                if (node.localName === 'attributes') {
                    divisions = Number(node.querySelector('divisions')?.textContent) || divisions;
                    const signature = node.querySelector('time');
                    if (signature?.querySelector('beats') && signature.querySelector('beat-type')) meter = Number(signature.querySelector('beats')!.textContent) * 4 / Number(signature.querySelector('beat-type')!.textContent);
                }
                else if (node.localName === 'backup') time -= Number(node.querySelector('duration')?.textContent) / divisions;
                else if (node.localName === 'forward') time += Number(node.querySelector('duration')?.textContent) / divisions;
                else if (node.localName === 'note') {
                    const voice = node.querySelector('voice')?.textContent || `staff-${node.querySelector('staff')?.textContent || '1'}`;
                    const groups = voices.get(voice) || [], chord = !!node.querySelector('chord'), grace = !!node.querySelector('grace');
                    if (chord && groups.length) groups[groups.length - 1]!.notes.push(node);
                    else groups.push({time, grace, notes: [node]});
                    voices.set(voice, groups);
                    if (!chord && !grace) time += (Number(node.querySelector('duration')?.textContent) || 0) / divisions;
                }
                duration = Math.max(duration, time);
                const staff = node.querySelector('staff')?.textContent || '1';
                for (const link of Array.from(node.querySelectorAll('wedge, pedal, dashes, bracket'))) {
                    const type = link.getAttribute('type');
                    line(link, `${link.localName}/${staff}/${link.getAttribute('number') || '1'}`, index,
                        ['start', 'crescendo', 'diminuendo', 'sostenuto', 'resume', 'change'].includes(type || ''),
                        ['stop', 'discontinue', 'change'].includes(type || ''));
                }
            }
            for (const [voice, groups] of voices) {
                groups.sort((a, b) => a.time - b.time || Number(b.grace) - Number(a.grace));
                for (const group of groups) {
                    const prior = pendingTies.get(voice) || new Map<string, {links: Element[]; index: number; end: number}>();
                    const next = new Map<string, {links: Element[]; index: number; end: number}>();
                    for (const note of group.notes) {
                        const pitch = note.querySelector('pitch')?.textContent?.replace(/\s/g, '') || 'rest';
                        const ties = Array.from(note.querySelectorAll('tie, tied')), stops = ties.filter(tie => tie.getAttribute('type') === 'stop');
                        const pending = prior.get(pitch);
                        if (stops.length && pending && Math.abs(pending.end - elapsed - group.time) < 1e-8) {spans.push({start: pending.index, end: index}); prior.delete(pitch);}
                        else stops.forEach(tie => tie.remove());
                        const starts = ties.filter(tie => tie.getAttribute('type') === 'start');
                        if (starts.length) next.set(pitch, {links: starts, index, end: elapsed + group.time + (Number(note.querySelector('duration')?.textContent) || 0) / divisions});
                        for (const slur of Array.from(note.querySelectorAll('slur'))) {
                            line(slur, `slur/${voice}/${slur.getAttribute('number') || '1'}`, index,
                                slur.getAttribute('type') === 'start', slur.getAttribute('type') === 'stop');
                        }
                        for (const extend of Array.from(note.querySelectorAll('lyric > extend'))) {
                            line(extend, `lyric/${voice}/${extend.parentElement?.getAttribute('number') || '1'}`, index,
                                extend.getAttribute('type') === 'start', extend.getAttribute('type') === 'stop');
                        }
                    }
                    for (const entry of prior.values()) entry.links.forEach(link => link.remove());
                    pendingTies.set(voice, next);
                }
            }
            elapsed += measure.getAttribute('implicit') === 'yes' ? duration : Math.max(duration, meter);
        }
        for (const pending of pendingTies.values()) for (const entry of pending.values()) entry.links.forEach(link => link.remove());
        for (const entry of pendingLines.values()) entry.link.remove();
        return spans;
    }
    export interface Result {xml: string; measures: readonly PianoTrainerPerformance.MeasureOccurrence[];}
    export function unfold(xml: string, occurrences: readonly PianoTrainerPerformance.MeasureOccurrence[], {drawTitle = true, repairLinks = true} = {}): Result {
        const document = new DOMParser().parseFromString(xml, 'application/xml');
        if (document.querySelector('parsererror') || document.documentElement.localName !== 'score-partwise') throw new Error('Horizontal display requires valid partwise MusicXML.');
        if (!occurrences.length) throw new Error('The performance path is empty.');
        if (!drawTitle) for (const node of Array.from(document.querySelectorAll('work, movement-title, identification, credit'))) node.remove();
        for (const part of children(document.documentElement, 'part')) {
            const sourceMeasures = children(part, 'measure'), inherited = contexts(sourceMeasures);
            const copies: Element[] = [];
            for (const [index, occurrence] of occurrences.entries()) {
                const source = sourceMeasures[occurrence.sourceMeasureIndex];
                if (!source) throw new Error(`Part ${part.getAttribute('id')} is missing source measure ${occurrence.sourceMeasureIndex}.`);
                const measure = source.cloneNode(true) as Element;
                stripNavigation(measure);
                displayIds(measure, part.getAttribute('id') || 'part', occurrence.measureOccurrenceId);
                // Preserve printed source numbers, including pickup/non-numeric/repeated values.
                if (index === 0 || occurrences[index - 1]!.sourceMeasureIndex + 1 !== occurrence.sourceMeasureIndex) {
                    restoreContext(document, measure, inherited[occurrence.sourceMeasureIndex]!);
                }
                copies.push(measure);
            }
            sourceMeasures.forEach(measure => measure.remove());
            copies.forEach(measure => part.appendChild(measure));
            if (repairLinks) repairConnections(part, occurrences);
        }
        return {xml: serialize(document), measures: occurrences};
    }
    // A fixed main block may require farther engraving context for a long slur,
    // pedal or lyric extension. Keep both endpoints, crop only after engraving.
    // Context is finite source data, never appended once per Loop iteration.
    export function prepare(xml: string, path: readonly PianoTrainerPerformance.MeasureOccurrence[], cyclic: boolean) {
        const occurrences = cyclic ? [...path, ...path, ...path] : [...path];
        const document = new DOMParser().parseFromString(unfold(xml, occurrences, {drawTitle: false}).xml, 'application/xml');
        const parts = children(document.documentElement, 'part');
        const spans = parts.flatMap(part => repairConnections(part, occurrences));
        const inherited = parts.map(part => contexts(children(part, 'measure')));
        return {excerpt(start: number, end: number): Result {
            if (cyclic) {start += path.length; end += path.length;}
            let left = Math.max(0, start - 1), right = Math.min(occurrences.length, end + 1);
            for (const span of spans) if (span.start < end && span.end >= start) {left = Math.min(left, span.start); right = Math.max(right, span.end + 1);}
            const excerpt = document.cloneNode(true) as Document;
            const selected = occurrences.slice(left, right).map((occurrence, index) => ({...occurrence,
                measureOccurrenceId: left + index >= start && left + index < end ? occurrence.measureOccurrenceId : -index - 1}));
            for (const [partIndex, part] of children(excerpt.documentElement, 'part').entries()) {
                const measures = children(part, 'measure');
                measures.forEach((measure, index) => {
                    if (index < left || index >= right) measure.remove();
                    else displayIds(measure, part.getAttribute('id') || 'part', selected[index - left]!.measureOccurrenceId);
                });
                restoreContext(excerpt, measures[left]!, inherited[partIndex]![left]!);
            }
            return {xml: serialize(excerpt), measures: selected};
        }};
    }
}
