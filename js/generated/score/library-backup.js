"use strict";
// The existing permissive v1 backup boundary; preserve native coercion and field order.
var PianoTrainerLibraryBackup;
(function (PianoTrainerLibraryBackup) {
    function arrayBufferToByteArray(buffer) { return Array.from(new Uint8Array(buffer)); }
    PianoTrainerLibraryBackup.arrayBufferToByteArray = arrayBufferToByteArray;
    function byteArrayToArrayBuffer(bytes) {
        // Only arrays pass the original check. Uint8Array keeps the original per-value coercion.
        return new Uint8Array(Array.isArray(bytes) ? bytes : []).buffer;
    }
    PianoTrainerLibraryBackup.byteArrayToArrayBuffer = byteArrayToArrayBuffer;
    function serializeScoreRawData(rawData) {
        if (rawData instanceof ArrayBuffer)
            return { kind: 'arraybuffer', bytes: arrayBufferToByteArray(rawData) };
        return { kind: 'text', text: String(rawData ?? '') };
    }
    PianoTrainerLibraryBackup.serializeScoreRawData = serializeScoreRawData;
    function deserializeScoreRawData(payload) {
        if (!payload || typeof payload !== 'object')
            return '';
        const kind = Reflect.get(payload, 'kind');
        if (kind === 'arraybuffer')
            return byteArrayToArrayBuffer(Reflect.get(payload, 'bytes'));
        return String(Reflect.get(payload, 'text') ?? '');
    }
    PianoTrainerLibraryBackup.deserializeScoreRawData = deserializeScoreRawData;
    function readArrays(payload) {
        // Validate exactly the two original array boundaries. Optional metadata types describe
        // legitimate v1 backups; malformed entries still reach the same native coercion/errors.
        // Do not eagerly read/normalize entries: import generates IDs before reading their fields.
        const top = payload;
        return { folders: Array.isArray(top?.folders) ? top.folders : [],
            scores: Array.isArray(top?.scores) ? top.scores : [] };
    }
    PianoTrainerLibraryBackup.readArrays = readArrays;
})(PianoTrainerLibraryBackup || (PianoTrainerLibraryBackup = {}));
//# sourceMappingURL=library-backup.js.map