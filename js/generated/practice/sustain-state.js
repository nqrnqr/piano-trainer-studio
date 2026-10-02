"use strict";
// Preserve the P5 input contract and side-effect order; all external effects use ports.
var PianoTrainerSustainState;
(function (PianoTrainerSustainState) {
    function create(ports) {
        const state = ports.state;
        function startVisualSustains() {
            const RETRIGGER_GAP_MS = 35;
            const pendingVisuals = state.visualNotesToStart.slice();
            state.visualNotesToStart = [];
            const startOneVisual = (n) => {
                const vis = { midi: n.midi, staffId: n.staffId, mIdx: n.mIdx, endTimestamp: n.endTimestamp };
                state.sustainedVisuals.push(vis);
                ports.renderKeyboard();
                if (!((state.mode === 'wait' || state.mode === 'follow') && Number.isFinite(n.endTimestamp))) {
                    const tId = ports.setTimer(() => {
                        const idx = state.sustainedVisuals.indexOf(vis);
                        if (idx > -1) {
                            state.sustainedVisuals.splice(idx, 1);
                            ports.renderKeyboard();
                        }
                    }, n.durationMs);
                    state.activeTimeouts.push(tId);
                }
            };
            pendingVisuals.forEach(n => {
                const sameMeasureAlreadyActive = state.sustainedVisuals.some(v => v.midi === n.midi &&
                    v.staffId === n.staffId &&
                    v.mIdx === n.mIdx);
                if (sameMeasureAlreadyActive) {
                    return;
                }
                const olderSamePitchActive = state.sustainedVisuals.some(v => v.midi === n.midi &&
                    v.staffId === n.staffId &&
                    v.mIdx !== n.mIdx);
                if (olderSamePitchActive) {
                    state.sustainedVisuals = state.sustainedVisuals.filter(v => !(v.midi === n.midi && v.staffId === n.staffId));
                    ports.renderKeyboard();
                    const gapId = ports.setTimer(() => {
                        startOneVisual(n);
                    }, RETRIGGER_GAP_MS);
                    state.activeTimeouts.push(gapId);
                }
                else {
                    startOneVisual(n);
                }
            });
        }
        function pruneAtTimestamp(currentTimestamp) {
            if ((state.mode === 'wait' || state.mode === 'follow') && Number.isFinite(currentTimestamp)) {
                state.sustainedVisuals = state.sustainedVisuals.filter(n => !Number.isFinite(n.endTimestamp) || currentTimestamp < n.endTimestamp);
            }
        }
        function markHeldPreview(midi, previewState) {
            if (state.heldCorrectNotes.has(midi) && (previewState === 'future1-l' || previewState === 'future1-r')) {
                state.preExpectedHeldNotes.add(midi);
            }
        }
        return { startVisualSustains, pruneAtTimestamp, markHeldPreview };
    }
    PianoTrainerSustainState.create = create;
})(PianoTrainerSustainState || (PianoTrainerSustainState = {}));
//# sourceMappingURL=sustain-state.js.map