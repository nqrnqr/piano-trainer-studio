// Original XML/MXL bytes and ZIP selection; normalization is only a transpose source.
namespace PianoTrainerMusicXmlIO {
    export interface ZipEntry {fileName: string; compressionMethod: number; compressedSize: number; uncompressedSize: number; localHeaderOffset: number;}
    export interface Ports {
        getNormalizer(): ((rawData: PianoTrainerDomain.ScoreRawData, options: PianoTrainerDomain.ScoreLoadOptions) => Promise<string>) | null;
        warn(message: string, error: unknown): void;
    }
    // FileReader/library views use ArrayBuffer. Preserve native slice semantics at
    // this binary boundary; the assertion does not convert or copy SharedArrayBuffer.
    function sliceView(view: ArrayBufferView): ArrayBuffer {
        return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
    }
    export function create(ports: Ports) {
        function getScoreFileTypeFromName(fileName = '') {
            const lowered = String(fileName || '').toLowerCase();
            if (lowered.endsWith('.mxl')) return 'mxl';
            if (lowered.endsWith('.musicxml')) return 'musicxml';
            return 'xml';
        }

        function getScoreDisplayTitle(fileName = '', fallback = 'Untitled Score') {
            const base = String(fileName || '').trim();
            if (!base) return fallback;
            return base.replace(/\.(musicxml|xml|mxl)$/i, '').trim() || fallback;
        }

        function cloneScoreRawData(rawData: PianoTrainerDomain.ScoreRawData) {
            if (typeof rawData === 'string') return rawData;
            if (rawData instanceof ArrayBuffer) return rawData.slice(0);
            if (ArrayBuffer.isView(rawData)) {
                return sliceView(rawData);
            }
            if (typeof Blob !== 'undefined' && rawData instanceof Blob) {
                return rawData.slice(0, rawData.size, rawData.type || '');
            }
            return rawData;
        }

        function readUint16LE(bytes: Uint8Array, offset: number) {
            return bytes[offset] | (bytes[offset + 1] << 8);
        }

        function readUint32LE(bytes: Uint8Array, offset: number) {
            return (
                bytes[offset] |
                (bytes[offset + 1] << 8) |
                (bytes[offset + 2] << 16) |
                (bytes[offset + 3] << 24)
            ) >>> 0;
        }

        function normalizeZipEntryPath(path: string) {
            return String(path || '').replace(/^\/+/, '').replace(/\\/g, '/');
        }

        function getZipEntryDepth(path: string) {
            const normalized = normalizeZipEntryPath(path);
            if (!normalized) return Number.MAX_SAFE_INTEGER;
            return normalized.split('/').length - 1;
        }

        async function rawDataToArrayBuffer(rawData: PianoTrainerDomain.ScoreRawData) {
            if (rawData instanceof ArrayBuffer) return rawData;
            if (ArrayBuffer.isView(rawData)) {
                return sliceView(rawData);
            }
            if (typeof Blob !== 'undefined' && rawData instanceof Blob) {
                return await rawData.arrayBuffer();
            }
            return null;
        }

        function listZipEntries(arrayBuffer: ArrayBuffer) {
            const bytes = new Uint8Array(arrayBuffer);
            const eocdSignature = 0x06054b50;
            const centralSignature = 0x02014b50;
            const minEocdSize = 22;
            const maxCommentLength = 0xffff;
            const searchStart = Math.max(0, bytes.length - (minEocdSize + maxCommentLength));

            let eocdOffset = -1;
            for (let offset = bytes.length - minEocdSize; offset >= searchStart; offset -= 1) {
                if (readUint32LE(bytes, offset) === eocdSignature) {
                    eocdOffset = offset;
                    break;
                }
            }

            if (eocdOffset < 0) {
                throw new Error('Could not find the ZIP directory in this MXL file.');
            }

            const entryCount = readUint16LE(bytes, eocdOffset + 10);
            const centralDirectoryOffset = readUint32LE(bytes, eocdOffset + 16);
            let offset = centralDirectoryOffset;
            const decoder = new TextDecoder('utf-8');
            const entries = [];

            for (let index = 0; index < entryCount; index += 1) {
                if (offset + 46 > bytes.length || readUint32LE(bytes, offset) !== centralSignature) {
                    throw new Error('Could not read the ZIP entries from this MXL file.');
                }

                const compressionMethod = readUint16LE(bytes, offset + 10);
                const compressedSize = readUint32LE(bytes, offset + 20);
                const uncompressedSize = readUint32LE(bytes, offset + 24);
                const fileNameLength = readUint16LE(bytes, offset + 28);
                const extraFieldLength = readUint16LE(bytes, offset + 30);
                const fileCommentLength = readUint16LE(bytes, offset + 32);
                const localHeaderOffset = readUint32LE(bytes, offset + 42);
                const fileNameStart = offset + 46;
                const fileNameEnd = fileNameStart + fileNameLength;
                const fileName = decoder.decode(bytes.slice(fileNameStart, fileNameEnd));

                entries.push({
                    fileName,
                    compressionMethod,
                    compressedSize,
                    uncompressedSize,
                    localHeaderOffset
                });

                offset = fileNameEnd + extraFieldLength + fileCommentLength;
            }

            return entries;
        }

        async function inflateZipEntryData(compressedBytes: Uint8Array<ArrayBuffer>, compressionMethod: number) {
            if (compressionMethod === 0) {
                return compressedBytes;
            }

            if (compressionMethod !== 8) {
                throw new Error(`Unsupported MXL compression method: ${compressionMethod}.`);
            }

            if (typeof DecompressionStream !== 'function') {
                throw new Error('This browser does not support ZIP decompression for transpose.');
            }

            const stream = new Blob([compressedBytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
            const inflatedBuffer = await new Response(stream).arrayBuffer();
            return new Uint8Array(inflatedBuffer);
        }

        async function extractZipEntryText(arrayBuffer: ArrayBuffer, entry: ZipEntry) {
            const bytes = new Uint8Array(arrayBuffer);
            const localSignature = 0x04034b50;
            const localOffset = entry.localHeaderOffset;

            if (localOffset + 30 > bytes.length || readUint32LE(bytes, localOffset) !== localSignature) {
                throw new Error(`Could not read ZIP entry "${entry.fileName}".`);
            }

            const fileNameLength = readUint16LE(bytes, localOffset + 26);
            const extraFieldLength = readUint16LE(bytes, localOffset + 28);
            const dataStart = localOffset + 30 + fileNameLength + extraFieldLength;
            const dataEnd = dataStart + entry.compressedSize;
            const compressedBytes = bytes.slice(dataStart, dataEnd);
            const inflatedBytes = await inflateZipEntryData(compressedBytes, entry.compressionMethod);
            return new TextDecoder('utf-8').decode(inflatedBytes);
        }

        function chooseMusicXmlEntry(entries: ZipEntry[], containerPath = '') {
            const normalizedContainerPath = normalizeZipEntryPath(containerPath).toLowerCase();
            const xmlEntries = entries.filter((entry) => {
                const normalizedPath = normalizeZipEntryPath(entry.fileName);
                if (!normalizedPath) return false;
                if (normalizedPath.toLowerCase() === 'meta-inf/container.xml') return false;
                return /\.(xml|musicxml)$/i.test(normalizedPath);
            });

            if (!xmlEntries.length) return null;

            if (normalizedContainerPath) {
                const containerMatch = xmlEntries.find((entry) => normalizeZipEntryPath(entry.fileName).toLowerCase() === normalizedContainerPath);
                if (containerMatch) return containerMatch;
            }

            const rootLevelEntry = xmlEntries
                .filter((entry) => getZipEntryDepth(entry.fileName) === 0)
                .sort((left, right) => normalizeZipEntryPath(left.fileName).localeCompare(normalizeZipEntryPath(right.fileName)))[0];
            if (rootLevelEntry) return rootLevelEntry;

            return xmlEntries.sort((left, right) => {
                const depthDelta = getZipEntryDepth(left.fileName) - getZipEntryDepth(right.fileName);
                if (depthDelta !== 0) return depthDelta;
                return normalizeZipEntryPath(left.fileName).localeCompare(normalizeZipEntryPath(right.fileName));
            })[0];
        }

        async function extractMusicXmlFromMxl(rawData: PianoTrainerDomain.ScoreRawData) {
            const arrayBuffer = await rawDataToArrayBuffer(rawData);
            if (!arrayBuffer) return null;

            const entries = listZipEntries(arrayBuffer);
            const containerEntry = entries.find((entry) => normalizeZipEntryPath(entry.fileName).toLowerCase() === 'meta-inf/container.xml');
            let containerPath = '';

            if (containerEntry) {
                try {
                    const containerText = await extractZipEntryText(arrayBuffer, containerEntry);
                    const match = containerText.match(/full-path\s*=\s*["']([^"']+)["']/i);
                    if (match && match[1]) {
                        containerPath = match[1];
                    }
                } catch (_) {}
            }

            const xmlEntry = chooseMusicXmlEntry(entries, containerPath);
            if (!xmlEntry) {
                throw new Error('Could not find the embedded MusicXML inside this MXL file.');
            }

            return await extractZipEntryText(arrayBuffer, xmlEntry);
        }

        async function getCanonicalMusicXmlForTranspose(rawData: PianoTrainerDomain.ScoreRawData, { fileName = 'Untitled Score', fileType = 'xml' }: PianoTrainerDomain.ScoreLoadOptions = {}) {
            const resolvedType = String(fileType || getScoreFileTypeFromName(fileName || '') || 'xml').toLowerCase();
            if (resolvedType === 'xml' || resolvedType === 'musicxml') {
                return typeof rawData === 'string' ? rawData : null;
            }

            if (resolvedType === 'mxl') {
                try {
                    return await extractMusicXmlFromMxl(rawData);
                } catch (extractErr) {
                    const normalize = ports.getNormalizer();
                    if (normalize) {
                        try {
                            return await normalize(rawData, { fileName, fileType: resolvedType });
                        } catch (normalizeErr) {
                            ports.warn('Could not normalize MXL to MusicXML for transpose support.', normalizeErr);
                            ports.warn('Direct MXL XML extraction also failed.', extractErr);
                            return null;
                        }
                    }
                    ports.warn('Could not extract MXL to MusicXML for transpose support.', extractErr);
                    return null;
                }
            }

            return null;
        }

        function getOsmdLoadPayload(rawData: PianoTrainerDomain.ScoreRawData, fileType = 'xml', fileName = 'Untitled Score') {
            const resolvedType = String(fileType || getScoreFileTypeFromName(fileName || '') || 'xml').toLowerCase();
            if (resolvedType !== 'mxl') return rawData;

            const resolvedName = fileName || 'Untitled Score.mxl';

            // For reconstructed library MXL files, do not force a MIME type.
            // Browser-selected .mxl files usually arrive with an empty/neutral type,
            // and OSMD reliably identifies them by filename/contents.
            // Forcing an XML-ish MIME here can make compressed MXL payloads look like
            // invalid plain documents when reopening starter-library scores.
            if (rawData instanceof File) return rawData;
            if (rawData instanceof Blob) {
                if (typeof File === 'function') {
                    return new File([rawData], resolvedName);
                }
                Object.assign(rawData, {name: resolvedName});
                return rawData;
            }
            if (rawData instanceof ArrayBuffer) {
                if (typeof File === 'function') {
                    return new File([rawData], resolvedName);
                }
                const blob = new Blob([rawData]);
                Object.assign(blob, {name: resolvedName});
                return blob;
            }
            if (ArrayBuffer.isView(rawData)) {
                const slice = sliceView(rawData);
                if (typeof File === 'function') {
                    return new File([slice], resolvedName);
                }
                const blob = new Blob([slice]);
                Object.assign(blob, {name: resolvedName});
                return blob;
            }

            return rawData;
        }
        return {getScoreFileTypeFromName, getScoreDisplayTitle, cloneScoreRawData, readUint16LE, readUint32LE, normalizeZipEntryPath, getZipEntryDepth, rawDataToArrayBuffer, listZipEntries, inflateZipEntryData, extractZipEntryText, chooseMusicXmlEntry, extractMusicXmlFromMxl, getCanonicalMusicXmlForTranspose, getOsmdLoadPayload};
    }
    export type Service = ReturnType<typeof create>;
}
