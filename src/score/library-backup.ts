// The existing permissive v1 backup boundary; preserve native coercion and field order.
namespace PianoTrainerLibraryBackup {
    export type RawPayload = {
        kind: 'arraybuffer';
        bytes: number[];
    } | {
        kind: 'text';
        text: string;
    };
    export interface Backup {
        version: number;
        exportedAt: string;
        folders: PianoTrainerDomain.LibraryFolder[];
        scores: (Omit<PianoTrainerDomain.LibraryScore, 'rawData'> & {
            rawData: RawPayload;
        })[];
    }
    export interface Entry {
        id?: string;
        name?: unknown;
        title?: unknown;
        folderId?: string | null;
        fileName?: string;
        fileType?: string;
        rawData?: unknown;
        createdAt?: unknown;
        updatedAt?: unknown;
        lastOpenedAt?: unknown;
    }
    export function arrayBufferToByteArray(buffer: ArrayBuffer) { return Array.from(new Uint8Array(buffer)); }
    export function byteArrayToArrayBuffer(bytes: unknown) {
        // Only arrays pass the original check. Uint8Array keeps the original per-value coercion.
        return new Uint8Array(Array.isArray(bytes) ? bytes as number[] : []).buffer;
    }
    export function serializeScoreRawData(rawData: unknown): RawPayload {
        if (rawData instanceof ArrayBuffer)
            return { kind: 'arraybuffer', bytes: arrayBufferToByteArray(rawData) };
        return { kind: 'text', text: String(rawData ?? '') };
    }
    export function deserializeScoreRawData(payload: unknown): string | ArrayBuffer {
        if (!payload || typeof payload !== 'object')
            return '';
        const kind = Reflect.get(payload, 'kind');
        if (kind === 'arraybuffer')
            return byteArrayToArrayBuffer(Reflect.get(payload, 'bytes'));
        return String(Reflect.get(payload, 'text') ?? '');
    }
    export function readArrays(payload: unknown) {
        // Validate exactly the two original array boundaries. Optional metadata types describe
        // legitimate v1 backups; malformed entries still reach the same native coercion/errors.
        // Do not eagerly read/normalize entries: import generates IDs before reading their fields.
        const top = payload as {
            folders?: unknown;
            scores?: unknown;
        } | null | undefined;
        return { folders: Array.isArray(top?.folders) ? top.folders as Entry[] : [],
            scores: Array.isArray(top?.scores) ? top.scores as Entry[] : [] };
    }
}
