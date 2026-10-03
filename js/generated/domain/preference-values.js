"use strict";
// Pure persisted value normalization, shared by startup and device controls.
var PianoTrainerPreferenceValues;
(function (PianoTrainerPreferenceValues) {
    function normalizeLedCount(value) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return 88;
        return Math.max(1, Math.min(500, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues.normalizeLedCount = normalizeLedCount;
    function normalizeLedMasterBrightness(value) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return 70;
        return Math.max(1, Math.min(100, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues.normalizeLedMasterBrightness = normalizeLedMasterBrightness;
    function normalizeLedFuturePct(value, fallback) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return fallback;
        return Math.max(0, Math.min(100, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues.normalizeLedFuturePct = normalizeLedFuturePct;
    function normalizeMidiChannel(value, fallback = 1) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return fallback;
        return Math.max(1, Math.min(16, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues.normalizeMidiChannel = normalizeMidiChannel;
    function normalizeMidiInputChannel(value, fallback = 0) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue))
            return fallback;
        if (numericValue <= 0)
            return 0;
        return Math.max(1, Math.min(16, Math.round(numericValue)));
    }
    PianoTrainerPreferenceValues.normalizeMidiInputChannel = normalizeMidiInputChannel;
})(PianoTrainerPreferenceValues || (PianoTrainerPreferenceValues = {}));
//# sourceMappingURL=preference-values.js.map