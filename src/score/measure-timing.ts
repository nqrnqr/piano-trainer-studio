import type {PianoTrainerScoreTraversal} from './score-traversal';
// Moved from 1ec34ee without changing traversal, timing or cancellation rules.
export namespace PianoTrainerMeasureTiming {
    export interface MeasureInfo {
        numerator: number; denominator: number; beatLengthWhole: number;
        nominalMeasureLengthWhole: number; actualLengthWhole: number; startTimestamp: number;
    }
    export type CacheEntry = Omit<MeasureInfo, 'beatLengthWhole'>;
    export interface Ports {
        getMeasure(index: number | undefined): PianoTrainerOsmdVendor.SourceMeasure | null;
        getMeasureCount(): number;
        getCursor(): PianoTrainerScoreTraversal.Cursor | null | undefined;
        restoreToPosition(measureIndex: number, timestamp: number | null): void;
    }
    export function create(ports: Ports) {
        let measureTimingCache: CacheEntry[] = [];
        function getInfo(measureIndex: number | undefined): MeasureInfo {
            const measure = ports.getMeasure(measureIndex);
            const cached = measureTimingCache[measureIndex!] || null;
            const activeTimeSignature = measure?.ActiveTimeSignature || ports.getMeasure(0)?.ActiveTimeSignature || null;
            const numerator = Math.max(1, Number(activeTimeSignature?.Numerator) || 4);
            const denominator = Math.max(1, Number(activeTimeSignature?.Denominator) || 4);
            const beatLengthWhole = 1 / denominator;
            const nominalMeasureLengthWhole = numerator * beatLengthWhole;
            const startTimestamp = Number.isFinite(cached?.startTimestamp) ? cached!.startTimestamp : 0;

            return {
                numerator,
                denominator,
                beatLengthWhole,
                nominalMeasureLengthWhole,
                actualLengthWhole: Number.isFinite(cached?.actualLengthWhole) ? cached!.actualLengthWhole : nominalMeasureLengthWhole,
                startTimestamp
            };
        }

        function rebuild() {
            const cursor = ports.getCursor();
            if (!cursor?.Iterator) {
                measureTimingCache = [];
                return measureTimingCache;
            }

            const savedMeasureIndex = cursor.Iterator.CurrentMeasureIndex;
            const savedTimestamp = cursor.Iterator.currentTimeStamp?.RealValue ?? null;
            const totalMeasures = ports.getMeasureCount();
            const nextStarts: (number | null)[] = new Array(totalMeasures).fill(null);
            const firstEvents: (number | null)[] = new Array(totalMeasures).fill(null);

            cursor.reset();
            const safetyMax = 100000;
            let safety = 0;
            let previousMeasureIndex: number | null = null;

            while (!cursor.Iterator.EndReached && safety < safetyMax) {
                const measureIndex = cursor.Iterator.CurrentMeasureIndex;
                const timestamp = cursor.Iterator.currentTimeStamp?.RealValue ?? null;

                if (firstEvents[measureIndex] == null && Number.isFinite(timestamp)) {
                    firstEvents[measureIndex] = timestamp;
                }

                if (previousMeasureIndex != null && measureIndex !== previousMeasureIndex && nextStarts[previousMeasureIndex] == null && Number.isFinite(timestamp)) {
                    nextStarts[previousMeasureIndex] = timestamp;
                }

                previousMeasureIndex = measureIndex;
                cursor.Iterator.moveToNext();
                safety += 1;
            }

            measureTimingCache = [];
            let runningStart = 0;
            for (let i = 0; i < totalMeasures; i++) {
                const measure = ports.getMeasure(i);
                const activeTimeSignature = measure?.ActiveTimeSignature || ports.getMeasure(0)?.ActiveTimeSignature || null;
                const numerator = Math.max(1, Number(activeTimeSignature?.Numerator) || 4);
                const denominator = Math.max(1, Number(activeTimeSignature?.Denominator) || 4);
                const nominalMeasureLengthWhole = numerator / denominator;
                const firstTimestamp = Number.isFinite(firstEvents[i]) ? firstEvents[i]! : null;
                const explicitStart = firstTimestamp != null ? firstTimestamp : runningStart;
                const nextStart = Number.isFinite(nextStarts[i]) ? nextStarts[i]! : null;
                const actualLengthWhole = (nextStart != null && Number.isFinite(explicitStart))
                    ? Math.max(0, nextStart - explicitStart)
                    : nominalMeasureLengthWhole;

                measureTimingCache[i] = {
                    startTimestamp: explicitStart,
                    actualLengthWhole,
                    nominalMeasureLengthWhole,
                    numerator,
                    denominator
                };

                runningStart = explicitStart + actualLengthWhole;
            }

            ports.restoreToPosition(savedMeasureIndex, savedTimestamp);
            return measureTimingCache;
        }
        return {getInfo, rebuild, getCachedMeasureCount: () => measureTimingCache.length, readCache: () => measureTimingCache.map(entry => ({...entry}))};
    }
    export type Service = ReturnType<typeof create>;
}
