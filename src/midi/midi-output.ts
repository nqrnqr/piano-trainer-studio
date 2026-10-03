import type {PianoTrainerMidiService} from './midi-service';
// One implementation: preserve the later legacy core's effective MIDI behavior.
export namespace PianoTrainerMidiOutput {
    export interface Ports {
        getOutput(): PianoTrainerMidiService.Output | null;
        getChannel(): number;
        getVolume(): number;
        normalizeChannel(value: number): number;
        normalizeVelocity(value: unknown): number;
        remember(status: number, note: number, velocity: number): void;
        setTimer(callback: () => void, delayMs: number): number;
        clearTimer(id: number): void;
    }
    export function expressionValue(value: unknown) {
        const percent = Math.max(0, Math.min(100, Number(value) || 0));
        return Math.max(0, Math.min(127, Math.round((percent / 100) * 127)));
    }
    export function create(ports: Ports) {
        const timers = new Set<number>();
        let percussionEpoch = 0;
        const status = (base: number) => base + (ports.normalizeChannel(ports.getChannel() || 1) - 1);
        function noteOn(midi: number, velocity: unknown = 100) {
            const output = ports.getOutput();
            if (!output) return false;
            const messageStatus = status(0x90);
            const finalVelocity = ports.normalizeVelocity(velocity);
            ports.remember(messageStatus, midi, finalVelocity);
            output.send([messageStatus, midi, finalVelocity]);
            return true;
        }
        function noteOff(midi: number) {
            const output = ports.getOutput();
            if (!output) return false;
            const messageStatus = status(0x80);
            ports.remember(messageStatus, midi, 0);
            output.send([messageStatus, midi, 0]);
            return true;
        }
        function expression(value: unknown = ports.getVolume()) {
            const output = ports.getOutput();
            if (!output) return false;
            output.send([status(0xB0), 11, expressionValue(value)]);
            return true;
        }
        function scheduleNote(midi: number, durationMs: unknown, velocity: unknown = 100) {
            if (!noteOn(midi, velocity)) return;
            const id = ports.setTimer(() => { timers.delete(id); noteOff(midi); }, Math.max(0, Number(durationMs) || 0));
            timers.add(id);
        }
        function silence() {
            const output = ports.getOutput();
            if (!output) return;
            const controlStatus = status(0xB0);
            output.send([controlStatus,64,0]);
            output.send([controlStatus,123,0]);
            output.send([controlStatus,120,0]);
        }
        function percussionClick(note: unknown, velocity: number, durationMs: unknown = 80) {
            const output = ports.getOutput();
            if (!output) return false;
            const generation = percussionEpoch;
            const noteNumber = Math.max(0, Math.min(127, Math.round(Number(note) || 0)));
            const onStatus = 0x90 + (ports.normalizeChannel(10) - 1);
            const offStatus = 0x80 + (ports.normalizeChannel(10) - 1);
            ports.remember(onStatus, noteNumber, velocity);
            output.send([onStatus, noteNumber, velocity]);
            // Capture this output, preserving the original click's release route.
            const id = ports.setTimer(() => {
                timers.delete(id);
                if (generation !== percussionEpoch) return;
                ports.remember(offStatus, noteNumber, 0);
                output.send([offStatus, noteNumber, 0]);
            }, Math.max(20, Number(durationMs) || 80));
            timers.add(id);
            return true;
        }
        function dispose() {
            percussionEpoch++;
            for (const id of timers) ports.clearTimer(id);
            timers.clear();
        }
        return {noteOn, noteOff, expression, scheduleNote, percussionClick, silence, dispose, status, getOutput:ports.getOutput};
    }
}
