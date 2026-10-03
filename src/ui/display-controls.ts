// Fullscreen, Play/Reset shell and zoom/resize commands preserve their native UI order.
namespace PianoTrainerDisplayControls {
    interface FullscreenDocument extends Document {
        webkitFullscreenElement?: Element | null;
        webkitExitFullscreen?: () => void;
    }
    type FullscreenTarget = HTMLElement & {webkitRequestFullscreen?: () => void};
    export interface Ports {
        document: FullscreenDocument;
        window: Window;
        state: Pick<LegacyAppState, 'isPlaying'|'pseudoFullscreenActive'|'zoom'>;
        saveZoom(value: string): void;
        hideToolbarPanels(): void;
        reportWarning(message: string, error: unknown): void;
        pause(): void;
        play(): Promise<void>;
        reset(): void;
        isReadyToRender(): boolean;
        setZoom(value: number): void;
        clearFeedbackVisualStatePreserveScoring(): void;
        renderScoreAndRefreshGeometry(): void;
        positionCalibrationPanel(): void;
    }
    export function create(ports: Ports) {
        const {document,window,state} = ports, dom = PianoTrainerControlDom.create(document);
        let initialized = false, active = true, generation = 0, resizeTimer: number | undefined;
        let playButton: HTMLButtonElement | null = null, fullscreenButton: HTMLButtonElement | null = null;
        let resetButton: HTMLButtonElement | null = null;
        let playHandler: (()=>Promise<void>) | null = null, resetHandler: (()=>void) | null = null;
        function getFullscreenElement() {return document.fullscreenElement || document.webkitFullscreenElement || null;}
        function getFullscreenTargetElement(): FullscreenTarget {return document.documentElement;}
        function canUseNativeFullscreen() {
            const target = getFullscreenTargetElement();
            return !!(target?.requestFullscreen || target?.webkitRequestFullscreen || document.exitFullscreen || document.webkitExitFullscreen);
        }
        function isFullscreenActive() {return !!getFullscreenElement() || !!state.pseudoFullscreenActive;}
        function syncFullscreenUi() {
            if (!active) return;
            const fullscreenActive = isFullscreenActive(), label = fullscreenActive ? 'Exit full screen' : 'Enter full screen';
            document.body.classList.toggle('app-fullscreen-active', fullscreenActive);
            if (fullscreenButton) {
                fullscreenButton.classList.toggle('is-active',fullscreenActive);
                fullscreenButton.textContent = fullscreenActive ? '🗗' : '⛶';
                fullscreenButton.setAttribute('aria-label',label); fullscreenButton.setAttribute('aria-pressed',fullscreenActive?'true':'false');
                fullscreenButton.title=label; fullscreenButton.dataset.tooltip=label;
            }
        }
        async function requestAppFullscreen() {
            if (!active) return;
            const token=generation;
            ports.hideToolbarPanels(); const target=getFullscreenTargetElement();
            try {
                if (target?.requestFullscreen) {
                    await target.requestFullscreen(); if (!active || token!==generation) return;
                    state.pseudoFullscreenActive=false;
                } else if (target?.webkitRequestFullscreen) {
                    target.webkitRequestFullscreen(); state.pseudoFullscreenActive=false;
                } else state.pseudoFullscreenActive=true;
            } catch(error) {
                if (!active || token!==generation) return;
                ports.reportWarning('Fullscreen request failed; using in-app fullscreen fallback.',error);
                state.pseudoFullscreenActive=true;
            }
            syncFullscreenUi();
        }
        async function exitAppFullscreen() {
            if (!active) return;
            const token=generation;
            try {
                if (document.exitFullscreen && document.fullscreenElement) {
                    await document.exitFullscreen(); if (!active || token!==generation) return;
                } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) document.webkitExitFullscreen();
            } catch(error) {
                if (!active || token!==generation) return;
                ports.reportWarning('Could not exit native fullscreen cleanly.',error);
            }
            state.pseudoFullscreenActive=false; syncFullscreenUi();
        }
        async function toggleAppFullscreen() {
            if (isFullscreenActive()) {await exitAppFullscreen(); return;}
            await requestAppFullscreen();
        }
        function updatePlayPauseButton() {
            if (!active) return;
            document.body.classList.toggle('app-playing',!!state.isPlaying);
            if (playButton) playButton.textContent=state.isPlaying?'⏸ Pause':'▶ Play';
        }
        function preserveMusicAreaScroll<T>(callback: (()=>T) | undefined): T | undefined {
            const area=dom.element('music-area');
            if (!area || typeof callback!=='function') return typeof callback==='function'?callback():undefined;
            const top=area.scrollTop,left=area.scrollLeft,result=callback();
            area.scrollTop=top; area.scrollLeft=left; return result;
        }
        function normalizeZoomValue(value: string | number) {
            let normalized=parseInt(String(value),10);
            if (isNaN(normalized)) return null;
            if (normalized<50) normalized=50; if (normalized>150) normalized=150;
            return normalized;
        }
        function syncZoomControls(value: string | number) {
            if (!active) return;
            const normalized=normalizeZoomValue(value); if (normalized==null) return;
            dom.input('slider-zoom').value=String(normalized); dom.input('val-zoom').value=String(normalized);
        }
        function applyZoom(value: string | number,{save=true}={}) {
            if (!active) return;
            const normalized=normalizeZoomValue(value); if (normalized==null) return;
            dom.input('slider-zoom').value=String(normalized); dom.input('val-zoom').value=String(normalized);
            state.zoom=normalized/100;
            if (save) ports.saveZoom(String(normalized));
            if (ports.isReadyToRender()) {
                ports.setZoom(state.zoom); ports.clearFeedbackVisualStatePreserveScoring(); ports.renderScoreAndRefreshGeometry();
            }
        }
        function initPlaybackShell() {
            if (initialized) return;
            active=true; initialized=true;
            const token=generation;
            playHandler=async()=>{if(!active||token!==generation)return;if(state.isPlaying)ports.pause();else await ports.play();};
            resetHandler=()=>{if(active&&token===generation)ports.reset();};
            playButton=dom.optionalButton('btn-play'); fullscreenButton=dom.optionalButton('btn-score-fullscreen'); resetButton=dom.button('btn-reset');
            dom.on(document,'fullscreenchange',syncFullscreenUi); dom.on(document,'webkitfullscreenchange',syncFullscreenUi);
            dom.on(fullscreenButton,'click',()=>{void toggleAppFullscreen();});
            if (playButton) playButton.onclick=playHandler; resetButton.onclick=resetHandler;
            dom.on(window,'resize',()=>{
                window.clearTimeout(resizeTimer);
                const token=generation;
                resizeTimer=window.setTimeout(()=>{
                    resizeTimer=undefined; if (!active || token!==generation) return;
                    if (ports.isReadyToRender()) {ports.clearFeedbackVisualStatePreserveScoring(); ports.renderScoreAndRefreshGeometry();}
                    ports.positionCalibrationPanel();
                },300);
            });
        }
        let zoomInitialized=false;
        function initZoom() {
            if (zoomInitialized) return;
            active=true; zoomInitialized=true;
            const slider=dom.input('slider-zoom'),input=dom.input('val-zoom');
            slider.min='50'; slider.max='150'; input.min='50'; input.max='150';
            dom.onInput(slider,'input',node=>syncZoomControls(node.value)); dom.onInput(slider,'change',node=>applyZoom(node.value));
            dom.onInput(input,'input',node=>syncZoomControls(node.value)); dom.onInput(input,'change',node=>applyZoom(node.value));
        }
        function init() {initPlaybackShell(); initZoom();}
        function dispose() {
            if (!active) return;
            active=false; generation++; initialized=false; zoomInitialized=false; dom.dispose();
            window.clearTimeout(resizeTimer); resizeTimer=undefined;
            if (playButton?.onclick===playHandler) playButton.onclick=null;
            if (resetButton?.onclick===resetHandler) resetButton.onclick=null;
        }
        return {init,initPlaybackShell,initZoom,dispose,getFullscreenElement,getFullscreenTargetElement,canUseNativeFullscreen,
            isFullscreenActive,syncFullscreenUi,requestAppFullscreen,exitAppFullscreen,toggleAppFullscreen,
            updatePlayPauseButton,preserveMusicAreaScroll,normalizeZoomValue,syncZoomControls,applyZoom};
    }
    export type Service=ReturnType<typeof create>;
}
