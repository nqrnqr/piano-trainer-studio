import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerOsmdAdapter} from '../score/osmd-adapter';
import type {LegacyAppState} from '../state/model';
import {PianoTrainerTraditionalScroll as Traditional} from './traditional-scroll-policy';
import type {SystemProgress} from '../score/system-progress';
// Display layout and scrolling only. Musical advancement belongs to practice.
export namespace PianoTrainerScoreViewport {
    export interface Elements {
        area: HTMLElement; wrapper: HTMLElement;
        layout: HTMLSelectElement; autoScroll: HTMLInputElement;
    }
    export interface Ports {
        traditional?: {
            read(): {position: Traditional.Position; system: Traditional.SystemBounds | null; cursor: Traditional.Bounds;
                mode: PianoTrainerDomain.PracticeMode; topObstruction: number} | null;
            buildProgress(system: Traditional.SystemBounds, position: Traditional.Position): SystemProgress | null;
            readPlayback(position: Traditional.Position): {fraction:number; moving:boolean} | null;
            lifecycle?: Pick<Document, 'addEventListener' | 'removeEventListener' | 'visibilityState'>;
            isPlaying(): boolean;
        };
        refreshPresentation?(): void;
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
        let initialized = false;
        let verticalFrame: number | null = null, generation = 0, dirty = false;
        let previous: Traditional.Position | null = null, recheck: 'align' | 'visibility' | null = null;
        let resume = false, nativeScroll = false, framesRun = 0, framesRequested = 0;
        type Segment = {from:number; value:number; dock:number; minimum:number; target:number; systemId:number | null; navigation:boolean;
            profile:SystemProgress | null; point:SystemProgress['steps'][number] | null; consumedAtStart:number; progress:number};
        let vertical: Segment | null = null, verticalTime = 0;
        let snapshot: ReturnType<NonNullable<Ports['traditional']>['read']> = null;
        let measuredSystem: Traditional.SystemBounds | null = null;
        let lastKind: Traditional.Kind | null = null;
        let renderedTop: number | null = null;
        const area = () => elements.area;
        const isHorizontal = () => mode === 'horizontal';
        const follows = () => elements.autoScroll.checked !== false;
        function stopNativeScroll() {
            if (nativeScroll) area().scrollTo({top:area().scrollTop, behavior:'instant'});
            nativeScroll = false;
        }
        function cancel() {
            if (frame !== null) ports.cancelFrame(frame);
            frame = null; previousTime = 0;
            generation++;
            if (verticalFrame !== null) ports.cancelFrame(verticalFrame);
            verticalFrame = null; vertical = null; snapshot = null; verticalTime = 0; dirty = false; recheck = null; resume = true;
            stopNativeScroll();
        }
        function scheduleVertical() {
            if (verticalFrame !== null || !initialized || !follows() || isHorizontal()) return;
            if (ports.traditional?.lifecycle?.visibilityState === 'hidden') return;
            const epoch = generation;
            framesRequested++;
            verticalFrame = ports.requestFrame(time => {if (epoch === generation) animateVertical(time);});
        }
        function legacyPosition(cursor: Traditional.Bounds) {
            vertical = null; stopNativeScroll();
            const viewport = area(), height = viewport.getBoundingClientRect().height;
            const screenY = cursor.top - viewport.scrollTop;
            if (screenY > height * .6 || screenY < 0) {
                const target = Math.max(0, Math.min(viewport.scrollHeight - viewport.clientHeight, cursor.top - height * .1));
                if (ports.prefersReducedMotion()) viewport.scrollTop = target;
                else {viewport.scrollTo({top:target, behavior:'smooth'}); nativeScroll = true;}
            }
        }
        function animateVertical(time: number) {
            verticalFrame = null; framesRun++;
            if (!follows() || isHorizontal()) return;
            if (dirty) {
                dirty = false;
                snapshot = ports.traditional?.read() ?? null;
                if (snapshot) {
                    const classification = Traditional.classify(previous, snapshot.position);
                    const unchanged = previous && previous.scoreRevision === snapshot.position.scoreRevision
                        && previous.layoutRevision === snapshot.position.layoutRevision && previous.traceStepIndex === snapshot.position.traceStepIndex
                        && previous.eventId === snapshot.position.eventId && previous.runId === snapshot.position.runId;
                    const kind = recheck === 'align' ? 'align' : classification === 'navigation' ? classification : recheck || (resume ? 'align' : classification);
                    lastKind = kind;
                    const reevaluate = !!recheck || resume;
                    recheck = null; resume = false;
                    previous = {...snapshot.position}; measuredSystem = snapshot.system;
                    if (!unchanged || reevaluate) {
                        if (kind === 'navigation') {vertical = null; legacyPosition(snapshot.cursor);}
                        if (!vertical || vertical.navigation || kind !== 'same' || reevaluate || nativeScroll || Math.abs(area().scrollTop-vertical.value) > 2) {
                            // Keep the established return scroll. Normal forward
                            // commits take over from its actual position.
                            if (kind !== 'navigation') stopNativeScroll();
                            const decision = Traditional.decide({height:area().clientHeight, scrollTop:area().scrollTop,
                                maxScroll:area().scrollHeight-area().clientHeight, system:snapshot.system, cursor:snapshot.cursor,
                                topObstruction:snapshot.topObstruction});
                            const profile = kind === 'same' && vertical?.navigation ? vertical.profile
                                : snapshot.system ? ports.traditional!.buildProgress(snapshot.system,snapshot.position) : null;
                            const point = profile?.steps.find(point => point.traceStepIndex === snapshot!.position.traceStepIndex) ?? null;
                            const playback = snapshot.mode === 'realtime' ? ports.traditional!.readPlayback(snapshot.position) : null;
                            vertical = {from:area().scrollTop, value:area().scrollTop, dock:decision.dock, minimum:decision.minimum,
                                target:kind === 'navigation' ? area().scrollTop : decision.minimum, navigation:kind === 'navigation',
                                systemId:snapshot.position.systemId, profile, point, progress:0,
                                consumedAtStart:reevaluate && point ? point.durationBeats*(playback?.fraction ?? 0) : 0};
                            verticalTime = time;
                        } else {
                            vertical.point = vertical.profile?.steps.find(point => point.traceStepIndex === snapshot!.position.traceStepIndex) ?? null;
                        }
                    }
                } else vertical = null;
            }
            let tracking = false, approaching = false;
            if (vertical && snapshot && !vertical.navigation && !nativeScroll) {
                // Keep fractional motion between frames: native scrollTop may
                // quantize to device pixels, especially at high refresh rates.
                // A larger external change belongs to manual scrollbar input.
                if (Math.abs(area().scrollTop-vertical.value) > 2) {cancel();resume = false;return;}
                const playback = snapshot.mode === 'realtime' && ports.traditional!.isPlaying()
                    ? ports.traditional!.readPlayback(snapshot.position) : null;
                const {profile,point,consumedAtStart} = vertical;
                if (profile && point && profile.totalBeats > consumedAtStart) {
                    const completed = point.completedBeats + point.durationBeats*(playback?.fraction ?? 0);
                    vertical.progress = Math.max(vertical.progress, Math.min(1,Math.max(0,
                        (completed-consumedAtStart)/(profile.totalBeats-consumedAtStart))));
                    vertical.target = vertical.dock < vertical.from ? vertical.minimum
                        : Math.max(vertical.minimum, Traditional.progressTarget(vertical.from,vertical.dock,vertical.progress));
                    tracking = !!playback?.moving && vertical.progress < Traditional.completionFraction && vertical.dock > vertical.from+.5;
                }
                const elapsed = verticalTime ? time-verticalTime : 16;
                verticalTime = time;
                vertical.value = ports.prefersReducedMotion() ? vertical.target : Traditional.approach(vertical.value,vertical.target,elapsed);
                approaching = Math.abs(vertical.value-vertical.target) > .5;
                if (!approaching) vertical.value = vertical.target;
                area().scrollTop = vertical.value;
            }
            if (dirty || tracking || approaching) scheduleVertical();
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
            if (!isHorizontal()) return;
            if (!follows()) { cancel(); return; }
            const viewport = area(); targetLeft = getTargetLeft(viewport);
            if (immediate || ports.prefersReducedMotion()) { cancel(); viewport.scrollLeft = targetLeft; }
            else if (frame === null) frame = ports.requestFrame(animate);
        }
        function beforeRender() {
            cancel();
            renderedTop = isHorizontal() ? null : area().scrollTop;
        }
        function afterRender() {
            cancel();
            ports.refreshPresentation?.();
            for (const expected of state.expectedNotes) {
                if (expected.noteRef) expected.anchor = ports.getAnchor(expected.noteRef, expected.mIdx, Number(expected.staffId) - 1);
            }
            score.afterRender(true);
            if (!isHorizontal()) {
                if (renderedTop !== null) area().scrollTop = Math.max(0,Math.min(renderedTop,area().scrollHeight-area().clientHeight));
                renderedTop = null; resume = false; recheck = 'visibility'; autoScroll(); return;
            }
            const width = ports.getSvg()?.getBoundingClientRect().width || 0;
            elements.wrapper.style.width = `${Math.max(area().clientWidth, width)}px`;
            score.getCursorElement()?.classList.add('horizontal-score-cursor');
            follow({immediate: true});
        }
        function autoScroll() {
            if (isHorizontal()) { follow(); return; }
            if (!follows()) return;
            if (ports.traditional) {dirty = true; scheduleVertical(); return;}
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
                if (!ports.refreshPresentation) ports.clearFeedbackPreserveScoring();
                state.realtimeWrongPressInCurrentContext = wrongPress;
                ports.renderScoreAndRefreshGeometry();
                autoScroll();
            }
        }
        const onLayoutChange = (event: Event) => {
            if (event.target instanceof HTMLSelectElement) setMode(event.target.value);
        };
        const onAutoScrollChange = () => { ports.refreshPresentation?.(); if (follows()) {
            if (isHorizontal()) follow(); else {recheck = 'align'; autoScroll();}
        } else cancel(); };
        const onManualScroll = () => {cancel(); resume = false;};
        const onVisibility = () => {
            if (ports.traditional?.lifecycle?.visibilityState !== 'visible') cancel();
            else if (ports.traditional.isPlaying()) autoScroll();
        };
        function init() {
            if (initialized) return;
            defaults ??= score.getDefaults();
            let saved: string | null | undefined;
            try { saved = ports.storage.getItem(ports.storageKey); } catch (_) { }
            setMode(saved, {save: false});
            elements.layout.addEventListener('change', onLayoutChange);
            elements.autoScroll.addEventListener('change', onAutoScrollChange);
            area().addEventListener('wheel', onManualScroll, {passive: true});
            area().addEventListener('touchstart', onManualScroll, {passive: true});
            ports.traditional?.lifecycle?.addEventListener('visibilitychange', onVisibility);
            initialized = true;
        }
        function dispose() {
            cancel();
            elements.layout.removeEventListener('change', onLayoutChange);
            elements.autoScroll.removeEventListener('change', onAutoScrollChange);
            area().removeEventListener('wheel', onManualScroll);
            area().removeEventListener('touchstart', onManualScroll);
            ports.traditional?.lifecycle?.removeEventListener('visibilitychange', onVisibility);
            initialized = false;
        }
        return {init, dispose, setMode, isHorizontal, follow, beforeRender, afterRender, autoScroll, cancel,
            readTraditionalState: () => ({framePending:verticalFrame !== null, active:verticalFrame !== null, framesRun, framesRequested,
                position:previous ? {...previous} : null, system:measuredSystem ? {...measuredSystem} : null,
                animation:vertical ? {from:vertical.from,target:vertical.target,dock:vertical.dock,progress:vertical.progress,
                    totalBeats:vertical.profile?.totalBeats ?? null,systemId:vertical.systemId} : null, lastKind})};
    }
}
