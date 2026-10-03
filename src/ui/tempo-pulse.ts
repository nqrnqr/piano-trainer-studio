
// DOM lookup and the forced layout read stay at the UI boundary.
export namespace PianoTrainerTempoPulse {
    export interface Target { restart(): void; hide(): void; }
    export function create(getElement: () => HTMLElement | null) {
        return {getTarget(): Target | null {
            const element = getElement();
            return element ? {
                restart() { element.classList.remove('metronome-pulse'); void element.offsetWidth; element.classList.add('metronome-pulse'); },
                hide() { element.classList.remove('metronome-pulse'); }
            } : null;
        }};
    }
}
