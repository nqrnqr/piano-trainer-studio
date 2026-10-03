"use strict";
// Native resources owned by one optional legacy LED instance.
var PianoTrainerLegacyLedResources;
(function (PianoTrainerLegacyLedResources) {
    function create(ports) {
        let active = true;
        let generation = 0;
        const listeners = [];
        const markers = [];
        const timers = new Set(), intervals = new Set(), frames = new Set();
        const waits = new Map();
        const readers = new Set(), requests = new Set();
        const urls = new Set(), links = new Set();
        const captures = new Map();
        function isCurrent(token) { return active && token === generation; }
        function guard(callback) {
            const token = generation;
            return (...args) => isCurrent(token) ? callback(...args) : undefined;
        }
        function setTimer(callback, delayMs) {
            if (!active)
                return 0;
            const token = generation;
            const id = ports.setTimer(() => {
                timers.delete(id);
                if (isCurrent(token))
                    callback();
            }, delayMs);
            timers.add(id);
            return id;
        }
        function clearTimer(id) { if (timers.delete(id))
            ports.clearTimer(id); }
        function wait(delayMs) {
            if (!active)
                return Promise.resolve(false);
            return new Promise(resolve => {
                const id = setTimer(() => { waits.delete(id); resolve(true); }, delayMs);
                waits.set(id, resolve);
            });
        }
        function finishReader(reader) {
            readers.delete(reader);
            reader.onload = null;
            reader.onloadend = null;
        }
        return {
            get generation() { return generation; },
            get active() { return active; },
            isCurrent, guard, setTimer, clearTimer, wait,
            activate() { if (!active)
                active = true; },
            on(target, event, listener, options) {
                if (!active)
                    return;
                const wrapped = guard((value) => {
                    if (event === 'lostpointercapture' && 'pointerId' in value && typeof value.pointerId === 'number') {
                        const ids = captures.get(target);
                        ids?.delete(value.pointerId);
                        if (ids?.size === 0)
                            captures.delete(target);
                    }
                    listener(value);
                });
                target.addEventListener(event, wrapped, options);
                listeners.push(() => target.removeEventListener(event, wrapped, options));
            },
            markDataset(element, key) {
                if (!active)
                    return;
                element.dataset[key] = 'true';
                markers.push(() => { if (element.dataset[key] === 'true')
                    delete element.dataset[key]; });
            },
            setInterval(callback, delayMs) {
                if (!active)
                    return 0;
                const id = ports.setInterval(guard(callback), delayMs);
                intervals.add(id);
                return id;
            },
            clearInterval(id) { if (intervals.delete(id))
                ports.clearInterval(id); },
            requestFrame(callback) {
                if (!active)
                    return 0;
                const token = generation;
                const id = ports.requestFrame(time => { frames.delete(id); if (isCurrent(token))
                    callback(time); });
                frames.add(id);
                return id;
            },
            capture(element, pointerId) {
                element.setPointerCapture(pointerId);
                let ids = captures.get(element);
                if (!ids)
                    captures.set(element, ids = new Set());
                ids.add(pointerId);
            },
            createReader() { return ports.createReader(); },
            readText(reader, file) {
                if (!active)
                    return;
                readers.add(reader);
                reader.onloadend = () => finishReader(reader);
                try {
                    reader.readAsText(file);
                }
                catch (error) {
                    finishReader(reader);
                    throw error;
                }
            },
            createRequest() {
                const controller = ports.createRequest();
                if (active)
                    requests.add(controller);
                else
                    controller.abort();
                return controller;
            },
            releaseRequest(controller) { requests.delete(controller); },
            createUrl(blob) { const url = ports.createUrl(blob); urls.add(url); return url; },
            revokeUrl(url) { ports.revokeUrl(url); urls.delete(url); },
            createLink() { const link = ports.createLink(); links.add(link); return link; },
            removeLink(link) { link.remove(); links.delete(link); },
            snapshot() {
                return { active, listeners: listeners.length, markers: markers.length, timers: timers.size, intervals: intervals.size,
                    frames: frames.size, waits: waits.size, readers: readers.size, requests: requests.size,
                    urls: urls.size, links: links.size, captures: [...captures.values()].reduce((sum, ids) => sum + ids.size, 0) };
            },
            dispose() {
                if (!active)
                    return;
                active = false;
                generation += 1;
                for (const release of listeners.splice(0).reverse())
                    release();
                for (const release of markers.splice(0).reverse())
                    release();
                for (const id of timers)
                    ports.clearTimer(id);
                timers.clear();
                for (const id of intervals)
                    ports.clearInterval(id);
                intervals.clear();
                for (const id of frames)
                    ports.cancelFrame(id);
                frames.clear();
                for (const resolve of waits.values())
                    resolve(false);
                waits.clear();
                for (const reader of readers) {
                    reader.onload = null;
                    reader.onloadend = null;
                    if (reader.readyState === 1)
                        reader.abort();
                }
                readers.clear();
                for (const controller of requests)
                    controller.abort();
                requests.clear();
                for (const [element, ids] of captures)
                    for (const id of ids) {
                        try {
                            if (element.hasPointerCapture(id))
                                element.releasePointerCapture(id);
                        }
                        catch { }
                    }
                captures.clear();
                for (const link of links)
                    link.remove();
                links.clear();
                for (const url of urls)
                    ports.revokeUrl(url);
                urls.clear();
            }
        };
    }
    PianoTrainerLegacyLedResources.create = create;
})(PianoTrainerLegacyLedResources || (PianoTrainerLegacyLedResources = {}));
//# sourceMappingURL=legacy-led-resources.js.map