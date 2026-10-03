import {PianoTrainerDomain} from '../domain/model';
import {LegacyAppState} from '../state/model';
// Preserve the P5 input contract and side-effect order; all external effects use ports.
export namespace PianoTrainerSustainState {
    export interface Ports {
        state: Pick<LegacyAppState, 'mode' | 'visualNotesToStart' | 'sustainedVisuals' | 'activeTimeouts' | 'heldCorrectNotes' | 'preExpectedHeldNotes'>;
        renderKeyboard(): void;
        setTimer(callback: () => void, delayMs: number): number;
        clearTimer(id: number): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        const timers = new Set<number>();
        let active = true, generation = 0;
        function setTimer(callback: () => void, delayMs: number) {
            const started = generation;
            const id = ports.setTimer(() => {
                timers.delete(id);
                if (active && generation === started) callback();
            }, delayMs);
            timers.add(id);
            return id;
        }
        function cancelTimer(id: number) { timers.delete(id); ports.clearTimer(id); }
        function init() { active = true; }
        function dispose() {
            if (!active) return;
            active = false; generation++;
            for (const id of timers) ports.clearTimer(id);
            timers.clear();
        }
        function startVisualSustains() {
            if (!active) return;
            const RETRIGGER_GAP_MS = 35;

            const pendingVisuals = state.visualNotesToStart.slice();
            state.visualNotesToStart = [];

            const startOneVisual = (n: PianoTrainerDomain.PendingVisual) => {
                const vis = { midi: n.midi, staffId: n.staffId, mIdx: n.mIdx, endTimestamp: n.endTimestamp };
                state.sustainedVisuals.push(vis);
                ports.renderKeyboard();

                if (!((state.mode === 'wait' || state.mode === 'follow') && Number.isFinite(n.endTimestamp))) {
                    const tId = setTimer(() => {
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
                const sameMeasureAlreadyActive = state.sustainedVisuals.some(v =>
                    v.midi === n.midi &&
                    v.staffId === n.staffId &&
                    v.mIdx === n.mIdx
                );

                if (sameMeasureAlreadyActive) {
                    return;
                }

                const olderSamePitchActive = state.sustainedVisuals.some(v =>
                    v.midi === n.midi &&
                    v.staffId === n.staffId &&
                    v.mIdx !== n.mIdx
                );

                if (olderSamePitchActive) {
                    state.sustainedVisuals = state.sustainedVisuals.filter(v =>
                        !(v.midi === n.midi && v.staffId === n.staffId)
                    );
                    ports.renderKeyboard();

                    const gapId = setTimer(() => {
                        startOneVisual(n);
                    }, RETRIGGER_GAP_MS);

                    state.activeTimeouts.push(gapId);
                } else {
                    startOneVisual(n);
                }
            });
        }

        function pruneAtTimestamp(currentTimestamp: number | null) {
            if ((state.mode === 'wait' || state.mode === 'follow') && Number.isFinite(currentTimestamp)) {
                state.sustainedVisuals = state.sustainedVisuals.filter(n => !Number.isFinite(n.endTimestamp) || currentTimestamp! < n.endTimestamp!);
            }
        }

        function markHeldPreview(midi: number, previewState: string | null) {
            if (state.heldCorrectNotes.has(midi) && (previewState === 'future1-l' || previewState === 'future1-r')) {
                state.preExpectedHeldNotes.add(midi);
            }
        }
        return {init, dispose, cancelTimer, startVisualSustains, pruneAtTimestamp, markHeldPreview};
    }
    export type Service = ReturnType<typeof create>;
}
