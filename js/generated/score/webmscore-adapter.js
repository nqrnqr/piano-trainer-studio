"use strict";
// Browser script/ready boundary for the bundled converter. No load at factory creation.
var PianoTrainerWebmscoreAdapter;
(function (PianoTrainerWebmscoreAdapter) {
    PianoTrainerWebmscoreAdapter.SCRIPT_URL = 'assets/vendor/webmscore/webmscore.js';
    function bufferLike(data) {
        if (data && (typeof data === 'object' || typeof data === 'function') && 'buffer' in data && data.buffer instanceof ArrayBuffer) {
            // Bundled vendor buffer-like exports have numeric offsets. Keep the
            // native constructor's original coercion/fallback rather than copy bytes.
            return data;
        }
        return null;
    }
    function uint8ArrayToString(data) {
        if (typeof data === 'string')
            return data;
        if (data instanceof ArrayBuffer)
            return new TextDecoder('utf-8').decode(new Uint8Array(data));
        if (ArrayBuffer.isView(data))
            return new TextDecoder('utf-8').decode(data);
        const view = bufferLike(data);
        if (view)
            return new TextDecoder('utf-8').decode(new Uint8Array(view.buffer, view.byteOffset || 0, view.byteLength || view.buffer.byteLength));
        throw new Error('Converted score was not returned as text.');
    }
    PianoTrainerWebmscoreAdapter.uint8ArrayToString = uint8ArrayToString;
    function bytesForNormalization(rawData) {
        if (rawData instanceof Uint8Array)
            return rawData;
        if (rawData instanceof ArrayBuffer)
            return new Uint8Array(rawData);
        const view = bufferLike(rawData);
        return view ? new Uint8Array(view.buffer, view.byteOffset || 0, view.byteLength || view.buffer.byteLength) : null;
    }
    PianoTrainerWebmscoreAdapter.bytesForNormalization = bytesForNormalization;
    function create(ports) {
        let scriptPromise = null, readyPromise = null;
        let ownedScript = null, rejectScript = null, generation = 0;
        function assertActive(started) { if (started !== generation)
            throw new DOMException('Score conversion disposed.', 'AbortError'); }
        async function ensureWebMscoreLoaded() {
            const started = generation;
            if (ports.getVendor() && ports.getVendor().ready) {
                await ports.getVendor().ready;
                assertActive(started);
                return ports.getVendor();
            }
            if (!scriptPromise) {
                scriptPromise = new Promise((resolve, reject) => {
                    const existing = ports.document.querySelector('script[data-webmscore-loader="true"]');
                    if (existing) {
                        resolve();
                        return;
                    }
                    const script = ports.document.createElement('script');
                    ownedScript = script;
                    rejectScript = reject;
                    script.src = PianoTrainerWebmscoreAdapter.SCRIPT_URL;
                    script.async = true;
                    script.dataset.webmscoreLoader = 'true';
                    script.onload = () => { if (started !== generation)
                        return; rejectScript = null; resolve(); };
                    script.onerror = () => { if (started !== generation)
                        return; rejectScript = null; reject(new Error('Could not load the local webmscore converter files. ' + 'Download them into assets/vendor/webmscore first.')); };
                    ports.document.head.appendChild(script);
                });
            }
            await scriptPromise;
            assertActive(started);
            if (!ports.getVendor() || !ports.getVendor().ready)
                throw new Error('webmscore did not initialize correctly.');
            if (!readyPromise)
                readyPromise = ports.getVendor().ready;
            await readyPromise;
            assertActive(started);
            return ports.getVendor();
        }
        function dispose() {
            generation++;
            if (rejectScript)
                rejectScript(new DOMException('Score conversion disposed.', 'AbortError'));
            rejectScript = null;
            if (ownedScript) {
                ownedScript.onload = ownedScript.onerror = null;
                ownedScript.remove();
                ownedScript = null;
            }
            scriptPromise = null;
            readyPromise = null;
        }
        return { ensureWebMscoreLoaded, dispose };
    }
    PianoTrainerWebmscoreAdapter.create = create;
})(PianoTrainerWebmscoreAdapter || (PianoTrainerWebmscoreAdapter = {}));
//# sourceMappingURL=webmscore-adapter.js.map