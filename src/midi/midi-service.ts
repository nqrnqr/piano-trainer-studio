import type {PianoTrainerDomain} from '../domain/model';
import {PianoTrainerMidiInput} from './midi-input';
// Web MIDI is confined to this device boundary. UI and practice receive ports.
export namespace PianoTrainerMidiService {
    export interface Device { id: string; name: string | null; state: MIDIPortDeviceState; }
    export type Output = Pick<MIDIOutput, 'id' | 'name' | 'state' | 'send'>;
    export interface Ports {
        requestAccess: (() => Promise<MIDIAccess>) | null;
        onReady(): void;
        onDevicesChanged(): void;
        onAccessError(error: unknown): void;
        selectedInputChannel(): number;
        isEcho(status: number | undefined, note: number | undefined, velocity: number | undefined): boolean;
        dispatch(input: PianoTrainerDomain.TrainerNoteInput): void;
        nowMs(): number;
    }

    export function create(ports: Ports) {
        let access: MIDIAccess | null = null;
        let activeInput: MIDIInput | null = null;
        let activeCallback: ((event: MIDIMessageEvent) => void) | null = null;
        let pending: Promise<void> | null = null;
        let epoch = 0;
        function detachInput() {
            if (activeInput && activeInput.onmidimessage === activeCallback) activeInput.onmidimessage = null;
            activeInput = null;
            activeCallback = null;
        }
        function selectInput(id: string) {
            detachInput();
            if (id === 'none') return;
            const input = access?.inputs.get(id);
            if (!input) return;
            activeInput = input;
            activeCallback = event => {
                const data = event.data;
                if (!data) return;
                const status = data[0];
                const note = data[1];
                const velocity = data.length > 2 ? data[2] : 0;
                // Preserve pruning/filter order for every message, including CC.
                if (ports.isEcho(status, note, velocity)) return;
                const decoded = PianoTrainerMidiInput.decode(data, ports.selectedInputChannel(), ports.nowMs());
                if (decoded) ports.dispatch(decoded);
            };
            input.onmidimessage = activeCallback;
        }
        function isInputBound(id: string) {
            return !!activeInput && activeInput.id === id && activeInput === access?.inputs.get(id)
                && activeInput.onmidimessage === activeCallback;
        }
        const onStateChange = () => {
            ports.onDevicesChanged();
            // Clear removed device listeners; also handle a replacement port with
            // the same ID. Reconnection UI can select the saved ID on the next event.
            if (activeInput && !isInputBound(activeInput.id)) selectInput(activeInput.id);
        };
        function init(): Promise<void> {
            if (pending) return pending;
            if (access || !ports.requestAccess) return Promise.resolve();
            const currentEpoch = epoch;
            const requestAccess = ports.requestAccess;
            const work = (async () => {
                try {
                    const nextAccess = await requestAccess();
                    if (epoch !== currentEpoch) return;
                    access = nextAccess;
                    ports.onReady();
                    if (epoch === currentEpoch && access === nextAccess) nextAccess.onstatechange = onStateChange;
                } catch (error) {
                    if (epoch === currentEpoch) ports.onAccessError(error);
                }
            })();
            const tracked = work.finally(() => { if (pending === tracked) pending = null; });
            pending = tracked;
            return tracked;
        }
        function dispose() {
            epoch++;
            detachInput();
            if (access?.onstatechange === onStateChange) access.onstatechange = null;
            access = null;
            pending = null;
        }
        function getPort(direction: 'input' | 'output', id: string): Device | Output | undefined {
            return direction === 'input' ? access?.inputs.get(id) : access?.outputs.get(id);
        }
        function getOutput(id: string): Output | undefined { return access?.outputs.get(id); }
        function listInputs(): Device[] { return access ? Array.from(access.inputs.values()) : []; }
        function listOutputs(): Device[] { return access ? Array.from(access.outputs.values()) : []; }
        const isReady = () => access !== null;
        return {init, dispose, selectInput, isInputBound, getPort, getOutput, listInputs, listOutputs, isReady};
    }
    export type Service = ReturnType<typeof create>;
}
