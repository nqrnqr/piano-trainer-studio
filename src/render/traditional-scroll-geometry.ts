import type {PianoTrainerTraditionalScroll} from './traditional-scroll-policy';
import type {PianoTrainerOsmdAdapter} from '../score/osmd-adapter';

// getScreenCTM includes viewBox, zoom, page placement and the current scroll.
// Adding scrollTop converts the result back to stable CSS content coordinates.
export function systemBoundsInContent(bounds: PianoTrainerOsmdAdapter.SvgSystemBounds, svg: SVGSVGElement, area: HTMLElement): PianoTrainerTraditionalScroll.SystemBounds | null {
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const rect = area.getBoundingClientRect();
    const point = (x: number, y: number) => ({x: matrix.a*x + matrix.c*y + matrix.e - rect.left - area.clientLeft + area.scrollLeft,
        y: matrix.b*x + matrix.d*y + matrix.f - rect.top - area.clientTop + area.scrollTop});
    const corners = [point(bounds.left,bounds.top),point(bounds.right,bounds.top),point(bounds.left,bounds.bottom),point(bounds.right,bounds.bottom)];
    return {...bounds, left: Math.min(...corners.map(p=>p.x)), right: Math.max(...corners.map(p=>p.x)),
        top: Math.min(...corners.map(p=>p.y)), bottom: Math.max(...corners.map(p=>p.y))};
}
