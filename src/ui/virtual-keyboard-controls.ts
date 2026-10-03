// Pointer/mouse/touch input and browser audio activation share one owned lifetime.
namespace PianoTrainerVirtualKeyboardControls {
    export interface Ports {
        document: Document;
        window: Window;
        pressedKeys: ReadonlySet<number>;
        isMidiInRange(midi: number): boolean;
        ensureLiveAudioReady(): Promise<void>;
        triggerVirtualKey(midi: number, down: boolean, source: 'ui'): void;
    }
    export function create(ports: Ports) {
        const dom = PianoTrainerControlDom.create(ports.document);
        const keys = new Set<HTMLElement>(), captures = new Map<HTMLElement, Set<number>>();
        let activePointerId: string | null = null, activeMidi: number | null = null;
        let activationInitialized = false, keyboardInitialized = false, generation = 0;
        function releaseActiveVirtualPointer(pointerId: string | null = null) {
            if (activeMidi == null) return;
            if (pointerId != null && activePointerId != null && pointerId !== activePointerId) return;
            ports.triggerVirtualKey(activeMidi, false, 'ui');
            activePointerId = null; activeMidi = null;
        }
        function on(target: EventTarget, event: string, handler: EventListener, options?: AddEventListenerOptions) {
            const token = generation;
            dom.on(target, event, event => {if (token === generation) handler(event);}, options);
        }
        function pointer(target: EventTarget, type: string, handler: (event: PointerEvent) => void | Promise<void>) {
            on(target, type, event => {if (event instanceof PointerEvent) return handler(event);});
        }
        function mouse(target: EventTarget, type: string, handler: (event: MouseEvent) => void | Promise<void>) {
            on(target, type, event => {if (event instanceof MouseEvent) return handler(event);});
        }
        function touch(target: EventTarget, type: string, handler: (event: TouchEvent) => void | Promise<void>, passive: boolean) {
            on(target, type, event => {if (event instanceof TouchEvent) return handler(event);}, {passive});
        }
        async function bindStart(key: HTMLElement, midi: number, token: string | null, lifetime: number) {
            if (key.dataset.virtualDown === '1') return;
            key.dataset.virtualDown = '1';
            await ports.ensureLiveAudioReady();
            if (lifetime !== generation) return;
            // Ordinary release/rebuild does not invalidate this delayed attack.
            if (activeMidi != null && activeMidi !== midi) releaseActiveVirtualPointer();
            activePointerId = token; activeMidi = midi;
            ports.triggerVirtualKey(midi, true, 'ui');
        }
        function bindEnd(key: HTMLElement, midi: number, token: string | null) {
            if (token != null && activePointerId != null && token !== activePointerId) return;
            key.dataset.virtualDown = '0';
            if (ports.pressedKeys.has(midi)) ports.triggerVirtualKey(midi, false, 'ui');
            if (activeMidi === midi) {activePointerId = null; activeMidi = null;}
        }
        function createKeyboard() {
            const container = dom.element('virtual-keyboard');
            if (!container) return;
            keyboardInitialized = true;
            container.innerHTML = '';
            const blackIndices = [1, 3, 6, 8, 10], lifetime = generation;
            for (let i = 0; i < 88; i++) {
                const key = ports.document.createElement('div'), midi = i + 21;
                const black = blackIndices.includes((i + 9) % 12);
                key.className = `key ${black ? 'black' : 'white'}`;
                key.classList.toggle('out-of-range', !ports.isMidiInRange(midi));
                key.dataset.midi = String(midi); key.dataset.virtualDown = '0'; keys.add(key);
                pointer(key, 'pointerdown', async event => {
                    event.preventDefault();
                    if (typeof key.setPointerCapture === 'function') {
                        try {
                            key.setPointerCapture(event.pointerId);
                            const ids = captures.get(key) || new Set<number>(); ids.add(event.pointerId); captures.set(key, ids);
                        } catch (_) {}
                    }
                    await bindStart(key, midi, `pointer:${event.pointerId}`, lifetime);
                });
                pointer(key, 'pointerup', event => {event.preventDefault(); bindEnd(key, midi, `pointer:${event.pointerId}`);});
                pointer(key, 'pointercancel', event => {event.preventDefault(); bindEnd(key, midi, `pointer:${event.pointerId}`);});
                pointer(key, 'pointerleave', event => {if (event.pointerType === 'mouse') bindEnd(key, midi, `pointer:${event.pointerId}`);});
                mouse(key, 'mousedown', async event => {event.preventDefault(); await bindStart(key, midi, 'mouse', lifetime);});
                mouse(key, 'mouseup', event => {event.preventDefault(); bindEnd(key, midi, 'mouse');});
                on(key, 'mouseleave', () => bindEnd(key, midi, 'mouse'));
                touch(key, 'touchstart', async event => {
                    event.preventDefault(); const first = event.changedTouches?.[0];
                    await bindStart(key, midi, first ? `touch:${first.identifier}` : 'touch', lifetime);
                }, false);
                for (const type of ['touchend', 'touchcancel']) touch(key, type, event => {
                    event.preventDefault(); const first = event.changedTouches?.[0];
                    bindEnd(key, midi, first ? `touch:${first.identifier}` : 'touch');
                }, false);
                container.appendChild(key);
            }
        }
        function initActivation() {
            if (activationInitialized) return;
            activationInitialized = true;
            pointer(ports.window, 'pointerup', event => releaseActiveVirtualPointer(`pointer:${event.pointerId}`));
            pointer(ports.window, 'pointercancel', event => releaseActiveVirtualPointer(`pointer:${event.pointerId}`));
            on(ports.window, 'mouseup', () => releaseActiveVirtualPointer('mouse'));
            for (const type of ['touchend', 'touchcancel']) touch(ports.window, type, event => {
                const first = event.changedTouches?.[0]; releaseActiveVirtualPointer(first ? `touch:${first.identifier}` : 'touch');
            }, true);
            on(ports.window, 'blur', () => releaseActiveVirtualPointer());
            on(ports.document, 'visibilitychange', () => {
                if (ports.document.hidden) {releaseActiveVirtualPointer(); return;}
                void ports.ensureLiveAudioReady();
            });
            on(ports.window, 'pageshow', () => {void ports.ensureLiveAudioReady();});
            on(ports.window, 'focus', () => {void ports.ensureLiveAudioReady();});
            for (const type of ['touchstart', 'pointerdown', 'mousedown']) on(ports.document, type, () => {
                void ports.ensureLiveAudioReady();
            }, {passive: true});
        }
        function init() {initActivation(); if (!keyboardInitialized) createKeyboard();}
        function dispose() {
            generation++; dom.dispose(); releaseActiveVirtualPointer();
            for (const [key, ids] of captures) for (const id of ids) {
                try {if (key.hasPointerCapture(id)) key.releasePointerCapture(id);} catch (_) {}
            }
            captures.clear();
            for (const key of keys) {key.dataset.virtualDown = '0'; key.remove();}
            keys.clear(); activationInitialized = false; keyboardInitialized = false;
        }
        return {init, initActivation, createKeyboard, releaseActiveVirtualPointer, dispose};
    }
}
