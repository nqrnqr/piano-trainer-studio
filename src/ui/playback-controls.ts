
// DOM reads stay at the UI boundary. Factories do not bind listeners.
export namespace PianoTrainerPlaybackControls {
    export interface Ports {getElement(id: string): HTMLElement | null;}
    export function create(ports: Ports) {
        function input(id: string) {
            const element = ports.getElement(id);
            if (!(element instanceof HTMLInputElement)) throw new Error(`Missing required playback input: ${id}`);
            return element;
        }
        return {
            isLoopEnabled: () => input('check-looper').checked,
            isLoopEnabledAtEnd: () => {
                const element = ports.getElement('check-looper');
                return element instanceof HTMLInputElement && element.checked;
            },
            readLoopMin: () => parseInt(input('val-loop-min').value),
            readLoopMax: () => parseInt(input('val-loop-max').value),
            isMetronomeEnabled: () => {
                const element = ports.getElement('check-metronome');
                return element instanceof HTMLInputElement && element.checked;
            }
        };
    }
    export type Service = ReturnType<typeof create>;
}
