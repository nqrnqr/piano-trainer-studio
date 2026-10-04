import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerPerformance} from '../domain/performance-position';
import type {PianoTrainerOsmdAdapter} from '../score/osmd-adapter';
import type {PianoTrainerScorePresentation} from './score-presentation';
import {PianoTrainerHorizontalChunks} from './horizontal-chunks';
import {PianoTrainerHorizontalChunkModel} from './horizontal-chunk-model';

export namespace PianoTrainerHorizontalScore {
    export interface Ports {
        container: HTMLElement; area: HTMLElement; source: PianoTrainerOsmdAdapter.Service;
        currentEvent(): PianoTrainerPerformance.PerformedEvent | null;
        loopSettings(): {enabled: boolean; min: number; max: number};
        follows(): boolean;
        refreshed(immediate: boolean): void;
        reportError(error: unknown): void;
    }
    export function create(ports: Ports) {
        const ns = 'http://www.w3.org/2000/svg';
        const sourceHost = document.createElement('div'); sourceHost.id = 'source-score'; ports.container.append(sourceHost);
        const host = document.createElement('div'); host.className = 'horizontal-score-content'; host.style.position = 'relative'; host.hidden = true; ports.container.append(host);
        const svg = document.createElementNS(ns, 'svg'); svg.classList.add('pt-horizontal-canvas'); svg.style.display = 'block'; host.append(svg);
        const cursor = document.createElement('div'); cursor.className = 'horizontal-score-cursor pt-performance-cursor'; cursor.setAttribute('aria-hidden', 'true'); host.append(cursor);
        let xml: string | null = null, trace: PianoTrainerPerformance.Trace | null = null;
        let sequence: PianoTrainerHorizontalChunks.Sequence | null = null;
        const cache = new Map<string, PianoTrainerHorizontalChunkModel.Model>();
        const requests = new WeakMap<typeof cache, Map<string, Promise<PianoTrainerHorizontalChunkModel.Model>>>();
        let renderQueue: Promise<unknown> = Promise.resolve();
        const mounted = new Map<number, {key: string; svg: SVGSVGElement}>();
        const yields = new Map<number, () => void>();
        let generation = 0, horizontal = false, disposed = false, loadedZoom = 1;
        let loadedMetrics = {gap: 8, top: 80, bottom: 80, staffCount: 1};
        let preparedKey = '', origin = 0, windowStart = -1, windowEnd = -1, rendering = 0;
        let pending: Promise<void> | null = null;
        let pendingWindow: Promise<void> | null = null;
        let loading = false;
        let rebasing = false;
        let wasFollowing = ports.follows();
        let lastRebase: {before: number; after: number; error: number} | null = null;
        function yieldToPlayback() {
            return new Promise<void>(resolve => {
                const id = window.setTimeout(() => {yields.delete(id); resolve();}, 0);
                yields.set(id, resolve);
            });
        }
        function cancelYields() {for (const [id, resolve] of yields) {window.clearTimeout(id); resolve();} yields.clear();}
        function desiredWindow(index: number, navigate = false) {
            const result = PianoTrainerHorizontalChunks.windowAround(index, sequence?.finiteCount() ?? null);
            const event = ports.currentEvent();
            if (!navigate && mounted.size && sequence && event && (event.reason === 'advance' || event.reason === 'loop')) {
                const worldLeft = ports.area.scrollLeft / loadedZoom + origin;
                if ((sequence.address(result.start)?.offset || 0) > worldLeft) {
                    let low = 0, high = result.start;
                    while (low < high) {const middle = Math.ceil((low + high) / 2); if ((sequence.address(middle)?.offset || 0) <= worldLeft) low = middle; else high = middle - 1;}
                    result.start = low; result.end = Math.min(low + PianoTrainerHorizontalChunks.WINDOW_CHUNKS - 1, (sequence.finiteCount() ?? Infinity) - 1);
                }
            }
            return result;
        }
        function showSource() {sourceHost.style.cssText = ''; sourceHost.removeAttribute('aria-hidden'); ports.container.prepend(sourceHost); host.hidden = true;}
        function showDisplay() {
            sourceHost.style.cssText = `position:fixed;left:-100000px;top:0;width:${Math.max(900, ports.area.clientWidth)}px;opacity:0;pointer-events:none;`;
            sourceHost.setAttribute('aria-hidden', 'true'); document.body.append(sourceHost); host.hidden = false;
        }
        function clearWindow() {
            for (const node of mounted.values()) node.svg.remove();
            mounted.clear(); windowStart = windowEnd = -1; origin = 0;
        }
        function trimCache() {
            const pinned = new Set([...mounted.values()].map(node => node.key));
            const current = ports.currentEvent(), address = current && sequence?.forEvent(current);
            if (address) pinned.add(address.definition.key);
            for (const key of cache.keys()) {
                if (cache.size <= PianoTrainerHorizontalChunks.CACHE_MODELS) break;
                if (!pinned.has(key)) cache.delete(key);
            }
        }
        async function model(definition: PianoTrainerHorizontalChunks.Definition, token: number, target = cache, zoom = loadedZoom, metrics = loadedMetrics) {
            const existing = target.get(definition.key);
            if (existing) {target.delete(definition.key); target.set(definition.key, existing); return existing;}
            if (!xml || !trace) throw new Error('No horizontal score model.');
            let inflight = requests.get(target);
            if (!inflight) {inflight = new Map(); requests.set(target, inflight);}
            const requestKey = `${token}/${zoom}/${definition.key}`, prior = inflight.get(requestKey);
            if (prior) return prior;
            const currentXml = xml, currentTrace = trace;
            const task = renderQueue.then(async () => {
                if (disposed || token !== generation) throw new DOMException('Expired horizontal model.', 'AbortError');
                rendering++;
                try {
                    const result = await PianoTrainerHorizontalChunkModel.load(currentXml, definition, currentTrace, zoom, () => !disposed && token === generation, metrics);
                    if (disposed || token !== generation) throw new DOMException('Expired horizontal model.', 'AbortError');
                    target.set(definition.key, result);
                    if (target === cache) trimCache();
                    else while (target.size > PianoTrainerHorizontalChunks.CACHE_MODELS) target.delete(target.keys().next().value!);
                    return result;
                } finally {rendering--;}
            });
            renderQueue = task.catch(() => {}); inflight.set(requestKey, task);
            try {return await task;} finally {inflight.delete(requestKey);}
        }
        function localPoint(ref: PianoTrainerDomain.NoteRef, event: PianoTrainerPerformance.PerformedEvent) {
            const address = sequence?.forEvent(event), rendered = address && cache.get(address.definition.key);
            if (!address || !rendered) return null;
            const point = rendered.anchors.get(`${event.measureOccurrenceId}/${ref.id}`);
            return point ? {x: address.offset - origin + point.x, y: point.y} : null;
        }
        function anchor(ref: PianoTrainerDomain.NoteRef, event = ports.currentEvent()) {return horizontal && preparedKey && event ? localPoint(ref, event) : null;}
        function paintCursor() {
            const event = ports.currentEvent(), address = event && sequence?.forEvent(event);
            const point = event && address && cache.get(address.definition.key)?.events.get(event.traceStepIndex);
            if (!event || !address || !point) return;
            const worldX = address.offset + point.x;
            cursor.style.left = `${(worldX - origin) * loadedZoom - 5}px`;
            cursor.style.top = `${point.y * loadedZoom}px`; cursor.style.height = `${point.height * loadedZoom}px`;
            cursor.dataset.eventId = String(event.eventId); cursor.dataset.logicalX = String(worldX * loadedZoom);
        }
        function commitWindow(index: number, immediate = false, navigate = false) {
            if (!sequence) return false;
            const window = desiredWindow(index, navigate);
            if (window.start === windowStart && window.end === windowEnd) {paintCursor(); return true;}
            const addresses: PianoTrainerHorizontalChunks.Address[] = [];
            for (let i = window.start; i <= window.end; i++) {
                const address = sequence.address(i);
                if (!address || !cache.has(address.definition.key)) return false;
                addresses.push(address);
            }
            if (!addresses.length) return false;
            const priorOrigin = origin, scroll = ports.area.scrollLeft;
            const event = ports.currentEvent(), activeAddress = event && sequence.forEvent(event);
            const activePoint = event && activeAddress && cache.get(activeAddress.definition.key)?.events.get(event.traceStepIndex);
            const before = activeAddress && activePoint ? (activeAddress.offset + activePoint.x - priorOrigin) * loadedZoom - scroll : null;
            origin = addresses[0]!.offset;
            const end = addresses[addresses.length - 1]!, width = end.offset + end.definition.width - origin;
            const height = Math.max(...addresses.map(address => address.definition.height));
            rebasing = true;
            for (const [i, node] of mounted) if (i < window.start || i > window.end) {node.svg.remove(); mounted.delete(i);}
            for (const address of addresses) {
                let node = mounted.get(address.index);
                if (!node) {
                    const copy = PianoTrainerHorizontalChunkModel.copy(cache.get(address.definition.key)!, `chunk-${generation}-${address.index}`);
                    copy.dataset.chunkIndex = String(address.index); copy.dataset.loopIteration = String(address.iteration);
                    svg.insertBefore(copy, svg.firstChild); node = {key: address.definition.key, svg: copy}; mounted.set(address.index, node);
                }
                node.svg.setAttribute('x', String(address.offset - origin)); node.svg.setAttribute('y', '0');
            }
            const tail = ports.area.clientWidth * .7 / loadedZoom;
            svg.setAttribute('viewBox', `0 0 ${width + tail} ${height}`);
            svg.setAttribute('width', String((width + tail) * loadedZoom)); svg.setAttribute('height', String(height * loadedZoom));
            host.style.width = `${(width + tail) * loadedZoom}px`; host.style.overflow = 'hidden';
            windowStart = window.start; windowEnd = window.end;
            paintCursor(); showDisplay();
            ports.area.scrollLeft = Math.max(0, PianoTrainerHorizontalChunks.compensatedScroll(scroll, priorOrigin, origin, loadedZoom));
            if (before !== null && activeAddress && activePoint && priorOrigin !== origin) {
                const after = (activeAddress.offset + activePoint.x - origin) * loadedZoom - ports.area.scrollLeft;
                lastRebase = {before, after, error: Math.abs(before - after)};
            }
            rebasing = false; trimCache(); ports.refreshed(immediate); return true;
        }
        async function ensureWindow(index: number, immediate = false, navigate = false) {
            if (commitWindow(index, immediate, navigate)) return;
            if (pendingWindow) {
                const token = generation;
                try {await pendingWindow;} catch (error) {if (token === generation && !disposed) ports.reportError(error); return;}
                if (token !== generation || disposed || commitWindow(index, immediate, navigate)) return;
            }
            const token = generation, window = desiredWindow(index, navigate);
            const task = (async () => {
                for (let i = window.start; i <= window.end; i++) {
                    const address = sequence?.address(i); if (address) await model(address.definition, token);
                }
                if (!disposed && token === generation) commitWindow(index, immediate, navigate);
            })();
            pendingWindow = task;
            try {await task;} catch (error) {if (token === generation && !disposed) ports.reportError(error);}
            finally {if (pendingWindow === task) pendingWindow = null;}
        }
        function paint() {
            if (!horizontal || !preparedKey) return;
            const event = ports.currentEvent(), address = event && sequence?.forEvent(event);
            if (!address) return;
            // Upcoming blocks were rendered during preparation. Cache hits commit synchronously.
            const following = ports.follows(), resumed = following && !wasFollowing; wasFollowing = following;
            if (following || windowStart < 0) void ensureWindow(address.index, resumed, resumed);
            const token = generation;
            if (!cache.has(address.definition.key)) void model(address.definition, token).then(() => {if (token === generation) paintCursor();}, error => {if (!disposed && token === generation) ports.reportError(error);});
            paintCursor();
        }
        async function refresh() {
            if (!horizontal || !xml || !trace || disposed || loading) return;
            const loop = ports.loopSettings(), zoom = ports.source.getZoom();
            const key = `${ports.source.getScoreRevision()}/${zoom}/${loop.enabled}/${loop.min}/${loop.max}`;
            if (preparedKey === key) {paint(); return;}
            if (pending) return pending;
            const token = ++generation, current = ports.currentEvent();
            const nextSequence = PianoTrainerHorizontalChunks.define(trace, loop, current?.measureOccurrenceId || 0);
            const nextCache = new Map<string, PianoTrainerHorizontalChunkModel.Model>();
            const nextMetrics = ports.source.getHorizontalMetrics();
            const task = (async () => {
                // Measure every finite definition once. Templates are held by a bounded LRU.
                for (const definition of nextSequence.definitions) {
                    await model(definition, token, nextCache, zoom, nextMetrics);
                    if (disposed || token !== generation) return;
                    // Yield between finite blocks so reflow cannot starve the
                    // existing musical timers. This callback is owned/cancelled.
                    await yieldToPlayback();
                    if (disposed || token !== generation) return;
                }
                if (disposed || token !== generation || !horizontal) return;
                nextSequence.layout(); loadedZoom = zoom; loadedMetrics = nextMetrics; sequence = nextSequence;
                clearWindow(); cache.clear(); for (const [key, value] of nextCache) cache.set(key, value);
                preparedKey = key;
                const latest = ports.currentEvent(), address = latest && sequence!.forEvent(latest);
                await ensureWindow(address?.index || 0, true);
            })();
            pending = task;
            try {await task;} catch (error) {if (token === generation && !disposed) {preparedKey = ''; showSource(); ports.reportError(error);}}
            finally {if (pending === task) pending = null;}
            const latest = ports.loopSettings();
            if (!disposed && horizontal && token === generation && preparedKey && (zoom !== ports.source.getZoom() || loop.enabled !== latest.enabled || loop.min !== latest.min || loop.max !== latest.max)) await refresh();
        }
        function setMode(value: boolean) {
            horizontal = value;
            if (value) {if (preparedKey) {showDisplay(); paint();} void refresh();}
            else {generation++; cancelYields(); pending = null; pendingWindow = null; showSource();}
        }
        async function loaded(currentXml: string) {
            loading = false;
            generation++; cancelYields(); pending = pendingWindow = null; xml = currentXml; trace = ports.source.getPerformanceTrace();
            preparedKey = ''; sequence = null; cache.clear(); clearWindow(); showSource(); await refresh();
        }
        function hitTest(clientX: number, clientY: number): PianoTrainerScorePresentation.Hit | null {
            if (!horizontal || !preparedKey || !sequence) return null;
            const rect = svg.getBoundingClientRect(), viewBox = svg.viewBox.baseVal;
            const x = (clientX - rect.left) / rect.width * viewBox.width, y = (clientY - rect.top) / rect.height * viewBox.height;
            for (const [index, node] of mounted) {
                const address = sequence.address(index)!, rendered = cache.get(node.key)!;
                for (const occurrence of address.definition.measures) {
                    const box = rendered.boxes.get(occurrence.measureOccurrenceId)!, left = address.offset - origin + box.x;
                    if (x >= left && x <= left + box.width && y >= box.y && y <= box.y + box.height) return {
                        sourceMeasureIndex: occurrence.sourceMeasureIndex, traceStepIndex: occurrence.firstTraceStepIndex, loopIteration: address.iteration};
                }
            }
            return null;
        }
        function onScroll() {
            if (rebasing || !horizontal || !preparedKey || !sequence || !mounted.size) return;
            const area = ports.area, first = sequence.address(windowStart)!, last = sequence.address(windowEnd)!;
            if (area.scrollLeft < area.clientWidth * .25 && windowStart > 0) void ensureWindow(windowStart + 1);
            else if (area.scrollLeft + area.clientWidth > (last.offset + last.definition.width - first.offset) * loadedZoom - area.clientWidth * .25 && sequence.address(windowEnd + 1)) void ensureWindow(windowEnd - 1);
        }
        ports.area.addEventListener('scroll', onScroll, {passive: true});
        function dispose() {disposed = true; generation++; cancelYields(); ports.area.removeEventListener('scroll', onScroll); clearWindow(); cache.clear(); sequence = null; trace = null; xml = null; pending = pendingWindow = null; sourceHost.remove(); host.remove();}
        async function ready() {
            let token: number;
            do {
                token = generation;
                try {await refresh(); await pending; await pendingWindow; await renderQueue;}
                catch (error) {if (!(error instanceof DOMException && error.name === 'AbortError')) throw error;}
                if (disposed || !horizontal || loading) return;
            } while (token !== generation || pending || pendingWindow);
        }
        return {sourceHost, setMode, refresh, loaded, paint, anchor, hitTest, dispose,
            beginLoad: () => {loading = true; generation++; cancelYields(); pending = pendingWindow = null;},
            getSvg: () => horizontal && preparedKey ? svg : sourceHost.querySelector<SVGSVGElement>('svg'),
            getCursorElement: () => horizontal && preparedKey ? cursor : ports.source.getCursorElement(),
            staffTopY: (staff: number) => {
                const event = ports.currentEvent(), address = event && sequence?.forEvent(event);
                return horizontal && event && address ? cache.get(address.definition.key)?.staffTops.get(`${event.measureOccurrenceId}/${staff}`) ?? null : null;
            },
            isActive: () => horizontal && !!preparedKey,
            measureBoxes: () => {
                if (!horizontal || !preparedKey || !sequence) return null;
                return [...mounted].flatMap(([index, node]) => {
                    const address = sequence!.address(index)!, rendered = cache.get(node.key)!;
                    return address.definition.measures.map(measure => {const box = rendered.boxes.get(measure.measureOccurrenceId)!;
                        return {index: measure.sourceMeasureIndex, measureOccurrenceId: measure.measureOccurrenceId,
                            traceStepIndex: measure.firstTraceStepIndex, loopIteration: address.iteration, box: {...box, x: box.x + address.offset - origin}};});
                });
            },
            ready,
            readResources: () => ({generation, pending: !!pending || !!pendingWindow, instances: rendering, models: cache.size, callbacks: yields.size,
                templateNodes: [...cache.values()].reduce((count, model) => count + model.template.querySelectorAll('*').length, 0),
                mountedNodes: svg.querySelectorAll('*').length,
                mappedNotes: [...cache.values()].reduce((count, model) => count + model.anchors.size, 0), chunks: mounted.size,
                maxChunks: PianoTrainerHorizontalChunks.WINDOW_CHUNKS, maxModels: PianoTrainerHorizontalChunks.CACHE_MODELS, origin,
                windowStart, windowEnd, definitions: sequence?.definitions.length || 0, lastRebase: lastRebase ? {...lastRebase} : null})};

    }
    export type Service = ReturnType<typeof create>;
}
