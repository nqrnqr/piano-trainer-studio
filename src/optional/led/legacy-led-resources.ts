
// Native resources owned by one optional legacy LED instance.
export namespace PianoTrainerLegacyLedResources {
    export interface Ports {
        setTimer(callback: () => void, delayMs: number): number;
        clearTimer(id: number): void;
        setInterval(callback: () => void, delayMs: number): number;
        clearInterval(id: number): void;
        requestFrame(callback: FrameRequestCallback): number;
        cancelFrame(id: number): void;
        createReader(): FileReader;
        createRequest(): AbortController;
        createUrl(blob: Blob): string;
        revokeUrl(url: string): void;
        createLink(): HTMLAnchorElement;
    }
    export function create(ports: Ports) {
        let active = true;
        let generation = 0;
        const listeners: (() => void)[] = [];
        const markers: (() => void)[] = [];
        const timers = new Set<number>(), intervals = new Set<number>(), frames = new Set<number>();
        const waits = new Map<number, (completed: boolean) => void>();
        const readers = new Set<FileReader>(), requests = new Set<AbortController>();
        const urls = new Set<string>(), links = new Set<HTMLAnchorElement>();
        const captures = new Map<Element, Set<number>>();
        function isCurrent(token: number) { return active && token === generation; }
        function guard<Args extends unknown[], Result>(callback: (...args: Args) => Result) {
            const token = generation;
            return (...args: Args): Result | undefined => isCurrent(token) ? callback(...args) : undefined;
        }
        function setTimer(callback: () => void, delayMs: number) {
            if (!active) return 0;
            const token = generation;
            const id = ports.setTimer(() => {
                timers.delete(id);
                if (isCurrent(token)) callback();
            }, delayMs);
            timers.add(id);
            return id;
        }
        function clearTimer(id: number) { if (timers.delete(id)) ports.clearTimer(id); }
        function wait(delayMs: number): Promise<boolean> {
            if (!active) return Promise.resolve(false);
            return new Promise(resolve => {
                const id = setTimer(() => { waits.delete(id); resolve(true); }, delayMs);
                waits.set(id, resolve);
            });
        }
        function finishReader(reader: FileReader) {
            readers.delete(reader);
            reader.onload = null;
            reader.onloadend = null;
        }
        return {
            get generation() { return generation; },
            get active() { return active; },
            isCurrent, guard, setTimer, clearTimer, wait,
            activate() { if (!active) active = true; },
            on(target: EventTarget, event: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
                if (!active) return;
                const wrapped = guard((value: Event) => {
                    if (event === 'lostpointercapture' && 'pointerId' in value && typeof value.pointerId === 'number') {
                        const ids = captures.get(target as Element);
                        ids?.delete(value.pointerId);
                        if (ids?.size === 0) captures.delete(target as Element);
                    }
                    listener(value);
                });
                target.addEventListener(event, wrapped, options);
                listeners.push(() => target.removeEventListener(event, wrapped, options));
            },
            markDataset(element: HTMLElement, key: string) {
                if (!active) return;
                element.dataset[key] = 'true';
                markers.push(() => { if (element.dataset[key] === 'true') delete element.dataset[key]; });
            },
            setInterval(callback: () => void, delayMs: number) {
                if (!active) return 0;
                const id = ports.setInterval(guard(callback), delayMs);
                intervals.add(id);
                return id;
            },
            clearInterval(id: number) { if (intervals.delete(id)) ports.clearInterval(id); },
            requestFrame(callback: FrameRequestCallback) {
                if (!active) return 0;
                const token = generation;
                const id = ports.requestFrame(time => { frames.delete(id); if (isCurrent(token)) callback(time); });
                frames.add(id);
                return id;
            },
            capture(element: Element, pointerId: number) {
                element.setPointerCapture(pointerId);
                let ids = captures.get(element);
                if (!ids) captures.set(element, ids = new Set());
                ids.add(pointerId);
            },
            createReader() { return ports.createReader(); },
            readText(reader: FileReader, file: Blob) {
                if (!active) return;
                readers.add(reader);
                reader.onloadend = () => finishReader(reader);
                try { reader.readAsText(file); }
                catch (error) { finishReader(reader); throw error; }
            },
            createRequest() {
                const controller = ports.createRequest();
                if (active) requests.add(controller); else controller.abort();
                return controller;
            },
            releaseRequest(controller: AbortController) { requests.delete(controller); },
            createUrl(blob: Blob) { const url = ports.createUrl(blob); urls.add(url); return url; },
            revokeUrl(url: string) { ports.revokeUrl(url); urls.delete(url); },
            createLink() { const link = ports.createLink(); links.add(link); return link; },
            removeLink(link: HTMLAnchorElement) { link.remove(); links.delete(link); },
            snapshot() { return {active, listeners: listeners.length, markers: markers.length, timers: timers.size, intervals: intervals.size,
                frames: frames.size, waits: waits.size, readers: readers.size, requests: requests.size,
                urls: urls.size, links: links.size, captures: [...captures.values()].reduce((sum, ids) => sum + ids.size, 0)}; },
            dispose() {
                if (!active) return;
                active = false;
                generation += 1;
                for (const release of listeners.splice(0).reverse()) release();
                for (const release of markers.splice(0).reverse()) release();
                for (const id of timers) ports.clearTimer(id);
                timers.clear();
                for (const id of intervals) ports.clearInterval(id);
                intervals.clear();
                for (const id of frames) ports.cancelFrame(id);
                frames.clear();
                for (const resolve of waits.values()) resolve(false);
                waits.clear();
                for (const reader of readers) {
                    reader.onload = null; reader.onloadend = null;
                    if (reader.readyState === 1) reader.abort();
                }
                readers.clear();
                for (const controller of requests) controller.abort();
                requests.clear();
                for (const [element, ids] of captures) for (const id of ids) {
                    try { if (element.hasPointerCapture(id)) element.releasePointerCapture(id); } catch {}
                }
                captures.clear();
                for (const link of links) link.remove();
                links.clear();
                for (const url of urls) ports.revokeUrl(url);
                urls.clear();
            }
        };
    }
    export type Resources = ReturnType<typeof create>;
}
