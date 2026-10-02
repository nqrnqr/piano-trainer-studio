"use strict";
// Legacy startup assembles this object synchronously before any consumers run.
// This assertion is confined to the initially empty namespace, not input data.
window.PTTiming = window.PTTiming || {};
// CRITICAL: Repeats / ending skips use the playable remainder of the current
// measure, preserving the legacy comparisons, defaults and returned units.
window.PTTiming.getRemainingMeasureWaitWhole = function getRemainingMeasureWaitWhole(options = {}) {
    const { currentMeasureIdx, currentTimestamp, fallbackLength = 1, getMeasureTimingInfo } = options;
    const fallbackWhole = Number.isFinite(fallbackLength) && fallbackLength > 0 ? fallbackLength : 0.25;
    const timing = typeof getMeasureTimingInfo === 'function' ? getMeasureTimingInfo(currentMeasureIdx) : null;
    // Number.isFinite is not a TS type predicate; assertions here preserve its
    // exact runtime guard without changing legacy null/undefined behavior.
    const measureStart = Number.isFinite(timing?.startTimestamp) ? timing.startTimestamp : null;
    const measureLength = Number.isFinite(timing?.actualLengthWhole) && timing.actualLengthWhole > 0
        ? timing.actualLengthWhole
        : (Number.isFinite(timing?.nominalMeasureLengthWhole) && timing.nominalMeasureLengthWhole > 0 ? timing.nominalMeasureLengthWhole : null);
    if (!Number.isFinite(currentTimestamp) || measureStart == null || measureLength == null) {
        return fallbackWhole;
    }
    const measureEnd = measureStart + measureLength;
    const remainingWhole = measureEnd - currentTimestamp;
    if (!Number.isFinite(remainingWhole) || remainingWhole <= 1e-6) {
        return fallbackWhole;
    }
    return Math.max(1e-6, remainingWhole);
};
window.PTTiming.getTraversalBeatsToWait = function getTraversalBeatsToWait(options = {}) {
    const { currentMeasureIdx, currentTimestamp, nextMeasureIdx, nextTimestamp, fallbackLength = 1, getMeasureTimingInfo } = options;
    const remainingMeasureWhole = window.PTTiming.getRemainingMeasureWaitWhole({
        currentMeasureIdx,
        currentTimestamp,
        fallbackLength,
        getMeasureTimingInfo
    });
    // Omitted fields intentionally retain legacy JS arithmetic (including NaN).
    if (nextTimestamp < currentTimestamp) {
        return remainingMeasureWhole * 4;
    }
    if (nextMeasureIdx > currentMeasureIdx + 1) {
        return remainingMeasureWhole * 4;
    }
    return (nextTimestamp - currentTimestamp) * 4;
};
//# sourceMappingURL=timing.js.map