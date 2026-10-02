// Display layout and scrolling only. Musical advancement belongs to practice.
namespace PianoTrainerScoreViewport {
    export interface Elements {
        area: HTMLElement; wrapper: HTMLElement;
        layout: HTMLSelectElement; autoScroll: HTMLInputElement;
    }
    export interface Ports {
        elements: Elements;
        score: Pick<PianoTrainerOsmdAdapter.Service, 'getDefaults' | 'setLayout' | 'isReady' | 'afterRender' | 'getCursorElement'>;
        state: Pick<LegacyAppState, 'expectedNotes' | 'realtimeWrongPressInCurrentContext'>;
        storage: Pick<Storage, 'getItem' | 'setItem'>;
        storageKey: string;
        getSvg(): SVGSVGElement | null;
        getAnchor(ref: PianoTrainerDomain.NoteRef, measureIndex: number, staffIndex: number): PianoTrainerDomain.SvgPoint | null;
        clearFeedbackPreserveScoring(): void;
        renderScoreAndRefreshGeometry(): void;
        requestFrame(callback: FrameRequestCallback): number;
        cancelFrame(id: number): void;
        prefersReducedMotion(): boolean;
    }
    export function create(ports: Ports) {
        const {elements, score, state} = ports;
        let mode: PianoTrainerDomain.ScoreLayout = 'traditional';
        let defaults: PianoTrainerOsmdAdapter.LayoutDefaults | null = null;
        let frame: number | null = null, targetLeft = 0, previousTime = 0;
        let changingLayout = false, initialized = false;
        const area = () => elements.area;
        const isHorizontal = () => mode === 'horizontal';
        const follows = () => elements.autoScroll.checked !== false;
        function cancel() {
            if (frame !== null) ports.cancelFrame(frame);
            frame = null; previousTime = 0;
        }
        function animate(time: number) {
            frame = null;
            if (!isHorizontal() || !follows()) return;
            const viewport = area();
            targetLeft = getTargetLeft(viewport);
            const delta = targetLeft - viewport.scrollLeft;
            const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
            previousTime = time;
            if (Math.abs(delta) < 1) {
                viewport.scrollLeft = targetLeft; previousTime = 0; return;
            }
            const step = Math.max(1, Math.abs(delta) * (1 - Math.exp(-elapsed / 90)));
            viewport.scrollLeft += Math.sign(delta) * Math.min(Math.abs(delta), step);
            frame = ports.requestFrame(animate);
        }
        function getTargetLeft(viewport: HTMLElement) {
            const cursor = score.getCursorElement();
            if (!cursor || cursor.style.display === 'none') return viewport.scrollLeft;
            const bounds = viewport.getBoundingClientRect(), rect = cursor.getBoundingClientRect();
            const contentX = viewport.scrollLeft + rect.left + rect.width / 2 - bounds.left - viewport.clientLeft;
            return Math.max(0, Math.min(contentX - viewport.clientWidth * 0.33, viewport.scrollWidth - viewport.clientWidth));
        }
        function follow({immediate = false} = {}) {
            if (!isHorizontal() || !follows()) { cancel(); return; }
            const viewport = area(); targetLeft = getTargetLeft(viewport);
            if (immediate || ports.prefersReducedMotion()) { cancel(); viewport.scrollLeft = targetLeft; }
            else if (frame === null) frame = ports.requestFrame(animate);
        }
        function afterRender() {
            if (isHorizontal() || changingLayout) {
                for (const expected of state.expectedNotes) {
                    if (expected.noteRef) expected.anchor = ports.getAnchor(expected.noteRef, expected.mIdx, expected.staffId - 1);
                }
            }
            score.afterRender(isHorizontal() || changingLayout);
            if (!isHorizontal()) return;
            const width = ports.getSvg()?.getBoundingClientRect().width || 0;
            elements.wrapper.style.width = `${Math.max(area().clientWidth, width)}px`;
            score.getCursorElement()?.classList.add('horizontal-score-cursor');
            follow({immediate: true});
        }
        function autoScroll() {
            if (isHorizontal()) { follow(); return; }
            if (!follows()) return;
            const cursor = score.getCursorElement();
            if (!cursor) return;
            const viewport = area(), bounds = viewport.getBoundingClientRect(), rect = cursor.getBoundingClientRect();
            const cursorScreenY = rect.top - bounds.top;
            if (cursorScreenY > bounds.height * 0.6 || cursorScreenY < 0) {
                viewport.scrollTo({top: Math.max(0, viewport.scrollTop + cursorScreenY - bounds.height * 0.1), behavior: 'smooth'});
            }
        }
        function setMode(value: unknown, {save = true} = {}) {
            const next = value === 'horizontal' ? 'horizontal' : 'traditional';
            elements.layout.value = next;
            if (save) { try { ports.storage.setItem(ports.storageKey, next); } catch (_) { } }
            if (next === mode) return;
            if (!defaults) throw new Error('Score viewport must be initialized before changing layout.');
            cancel(); mode = next;
            area().classList.toggle('score-horizontal', isHorizontal());
            elements.wrapper.style.width = '';
            score.getCursorElement()?.classList.remove('horizontal-score-cursor');
            score.setLayout(isHorizontal(), defaults);
            area().scrollLeft = 0; area().scrollTop = 0;
            if (score.isReady()) {
                const wrongPress = state.realtimeWrongPressInCurrentContext;
                ports.clearFeedbackPreserveScoring();
                state.realtimeWrongPressInCurrentContext = wrongPress;
                changingLayout = true;
                try { ports.renderScoreAndRefreshGeometry(); } finally { changingLayout = false; }
                autoScroll();
            }
        }
        const onLayoutChange = (event: Event) => {
            if (event.target instanceof HTMLSelectElement) setMode(event.target.value);
        };
        const onAutoScrollChange = () => { if (follows()) follow(); else cancel(); };
        function init() {
            if (initialized) return;
            defaults ??= score.getDefaults();
            let saved: string | null | undefined;
            try { saved = ports.storage.getItem(ports.storageKey); } catch (_) { }
            setMode(saved, {save: false});
            elements.layout.addEventListener('change', onLayoutChange);
            elements.autoScroll.addEventListener('change', onAutoScrollChange);
            area().addEventListener('wheel', cancel, {passive: true});
            area().addEventListener('touchstart', cancel, {passive: true});
            initialized = true;
        }
        function dispose() {
            cancel();
            elements.layout.removeEventListener('change', onLayoutChange);
            elements.autoScroll.removeEventListener('change', onAutoScrollChange);
            area().removeEventListener('wheel', cancel);
            area().removeEventListener('touchstart', cancel);
            initialized = false;
        }
        return {init, dispose, setMode, isHorizontal, follow, afterRender, autoScroll, cancel};
    }
}
