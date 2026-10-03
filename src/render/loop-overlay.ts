import type {LegacyAppState} from '../state/model';
export namespace PianoTrainerLoopOverlay {
    export interface Box { x: number; y: number; width: number; height: number; }
    export interface Ports {
        bounds: Pick<LegacyAppState['looper'], 'min' | 'max'>;
        document: Pick<Document, 'createElementNS'>;
        getSvg(): SVGSVGElement | null;
        ensureGroup(id: string): Element | null;
        enabled(): boolean;
        measureCount(): number | null;
        measureBox(index: number, staff: number): Box | null;
    }
    export function create(ports: Ports) {
        function getGroup() { return ports.ensureGroup('pt-looper-group'); }
        function clear() { ports.getSvg()?.querySelector('#pt-looper-group')?.replaceChildren(); }
        function render() {
            clear();
            if (!ports.enabled()) return;
            const count = ports.measureCount();
            if (count === null) return;
            const group = getGroup();
            if (!group) return;
            const minIdx = ports.bounds.min - 1, maxIdx = ports.bounds.max - 1;
            for (let i = 0; i < count; i++) {
                const box = ports.measureBox(i, 0);
                if (!box) continue;
                if (i < minIdx || i > maxIdx) {
                    const shade = ports.document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    shade.setAttribute('x', String(box.x)); shade.setAttribute('y', String(box.y));
                    shade.setAttribute('width', String(box.width)); shade.setAttribute('height', String(box.height));
                    shade.setAttribute('fill', 'rgba(128, 128, 128, 0.35)'); group.appendChild(shade);
                }
                if (i === minIdx || i === maxIdx) {
                    const bracket = ports.document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bracket.setAttribute('x', String(i === minIdx ? box.x : box.x + box.width - 6));
                    bracket.setAttribute('y', String(box.y)); bracket.setAttribute('width', '6');
                    bracket.setAttribute('height', String(box.height)); bracket.setAttribute('fill', '#3498db');
                    group.appendChild(bracket);
                }
            }
        }
        return {getGroup, clear, render};
    }
}
