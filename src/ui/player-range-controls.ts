// Playable-range settings coordinate typed state/commands and own the native select.
namespace PianoTrainerPlayerRangeControls {
    export interface Ports {
        document: Document;
        state: Pick<LegacyAppState, 'playerPianoType' | 'playerRange' | 'expectedNotes' | 'visualNotesToStart' | 'sustainedVisuals' | 'outOfRangeCurrentNotes' | 'heldCorrectNotes' | 'ledPreviewTimelineDirty' | 'lastLedPreviewEvents' | 'ledPreviewTraversalIndex'>;
        normalize(value: unknown): number;
        derive(count: number): PianoTrainerDomain.PlayerRange;
        getRange(): PianoTrainerDomain.PlayerRange;
        inRange(midi: unknown): boolean;
        readSaved(): string | null;
        save(value: string): void;
        renderKeyboard(): void;
        led: Pick<PianoTrainerOptionalLed.Output, 'refreshMapping' | 'invalidate' | 'renderOutputs'>;
    }
    export function create(ports: Ports) {
        const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
        let generation = 0, ownedSelect: HTMLSelectElement | null = null;
        function syncPlayerPianoTypeControl() {
            const select = getPlayerPianoTypeSelect();
            if (select) {
                select.value = String(state.playerPianoType);
            }
            const label = ports.document.getElementById('player-piano-range-label');
            if (label) {
                const range = ports.getRange();
                label.textContent = `Playable Range: MIDI ${range.minMidi}–${range.maxMidi}`;
            }
        }
        function refreshPlayerRangeDependentState() {
            state.expectedNotes = state.expectedNotes.filter(note => ports.inRange(note.midi));
            state.visualNotesToStart = state.visualNotesToStart.filter(note => ports.inRange(note.midi));
            state.sustainedVisuals = state.sustainedVisuals.filter(note => ports.inRange(note.midi));
            state.outOfRangeCurrentNotes = state.outOfRangeCurrentNotes.filter(note => !ports.inRange(note.midi));
            state.heldCorrectNotes.forEach((staffId, midi) => {
                if (!ports.inRange(midi)) {
                    state.heldCorrectNotes.delete(midi);
                }
            });
            ports.led.refreshMapping();
            ports.led.invalidate();
            ports.led.renderOutputs();
        }
        function setPlayerPianoType(value: unknown, { save = true, rerender = true } = {}) {
            state.playerPianoType = ports.normalize(value);
            state.playerRange = ports.derive(state.playerPianoType);
            if (save) {
                ports.save(String(state.playerPianoType));
            }
            syncPlayerPianoTypeControl();
            refreshPlayerRangeDependentState();
            state.ledPreviewTimelineDirty = true;
            state.lastLedPreviewEvents = [];
            state.ledPreviewTraversalIndex = -1;
            if (rerender) {
                ports.renderKeyboard();
            }
        }
        function initPlayerPianoTypeControl() {
            const saved = ports.readSaved();
            setPlayerPianoType(saved ?? 88, { save: false, rerender: false });
            const select = getPlayerPianoTypeSelect();
            if (select && !select.dataset.boundPlayerRange) {
                select.dataset.boundPlayerRange = 'true';
                select.value = String(state.playerPianoType);
                const token = generation;
                ownedSelect = select;
                dom.on(select, 'change', e => { if (token === generation && e.target instanceof HTMLSelectElement)
                    setPlayerPianoType(e.target.value); });
            }
            syncPlayerPianoTypeControl();
        }
        function getPlayerPianoTypeSelect(): HTMLSelectElement | null {
            const select = ports.document.getElementById('select-player-piano-type');
            return select instanceof HTMLSelectElement ? select : null;
        }
        function dispose() { generation++; dom.dispose(); if (ownedSelect?.dataset.boundPlayerRange === 'true')
            delete ownedSelect.dataset.boundPlayerRange; ownedSelect = null; }
        return { init: initPlayerPianoTypeControl, dispose, setPlayerPianoType, syncPlayerPianoTypeControl, refreshPlayerRangeDependentState };
    }
    export type Service = ReturnType<typeof create>;
}
