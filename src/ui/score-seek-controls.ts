import {PianoTrainerControlDom} from './controls-dom';
export namespace PianoTrainerScoreSeekControls {
    export interface Ports {document: Document; seek(x: number, y: number): void;}
    export function create(ports: Ports) {
        const dom = PianoTrainerControlDom.create(ports.document);
        let initialized = false, generation = 0;
        function init() {
            if (initialized) return;
            const node = dom.element('canvas-wrapper');
            if (!node) throw Error('Missing required trainer control: canvas-wrapper');
            initialized = true;
            const token = generation;
            dom.on(node, 'click', event => {if (token === generation && event instanceof MouseEvent) ports.seek(event.clientX, event.clientY);});
        }
        function dispose() {generation++; initialized = false; dom.dispose();}
        return {init, dispose};
    }
}
