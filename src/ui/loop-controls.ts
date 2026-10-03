import {LegacyAppState} from '../state/model';
import {PianoTrainerControlDom} from './controls-dom';
// Loop range/input/hold UI. Playback owns cursor enforcement and loop timing.
export namespace PianoTrainerLoopControls {
    type Target='min'|'max';
    export interface Ports {
        document: Document;
        window: Window;
        state: Pick<LegacyAppState,'looper'|'loopCountInEnabled'>;
        renderLooper(): void;
        enforceLooperBounds(): void;
        saveLoopCountIn(value: boolean): void;
    }
    interface Hold {
        button: HTMLButtonElement;
        pointerId: number | null;
        delayTimer: number | null;
        repeatTimer: number | null;
    }
    export function create(ports: Ports) {
        const {document,window,state}=ports,dom=PianoTrainerControlDom.create(document);
        let optionsInitialized=false,rangeInitialized=false,active=true,generation=0,activeLooperHold: Hold | null=null;
        function syncLooperDependentUi() {
            if (!active) return;
            const loop=dom.optionalInput('check-looper'),count=dom.optionalInput('check-loop-countin'),row=dom.element('looper-countin-row'),enabled=!!loop?.checked;
            if(count){count.disabled=!enabled;count.checked=!!state.loopCountInEnabled;}
            if(row){row.classList.toggle('is-disabled',!enabled);row.setAttribute('aria-disabled',String(!enabled));}
        }
        function resetRangeForScore(total: number) {
            if(!active)return;
            dom.input('slider-loop-max').max=String(total);dom.input('slider-loop-min').max=String(total);
            dom.input('val-loop-min').min='1';dom.input('val-loop-min').max=String(total);
            dom.input('val-loop-max').min='1';dom.input('val-loop-max').max=String(total);
            dom.input('val-loop-max').value=String(total);dom.input('val-loop-min').value='1';
            state.looper.min=1;state.looper.max=total;
        }
        function syncLooper(_source: 'slider'|'input',changedId: string) {
            if(!active)return;
            const minInput=dom.input('val-loop-min'),maxInput=dom.input('val-loop-max'),minSlider=dom.input('slider-loop-min'),maxSlider=dom.input('slider-loop-max');
            let min=parseInt(minInput.value,10),max=parseInt(maxInput.value,10);
            const allowed=parseInt(maxSlider.max,10)||100;
            if(changedId==='slider-loop-min')min=parseInt(minSlider.value,10);
            if(changedId==='slider-loop-max')max=parseInt(maxSlider.value,10);
            if(isNaN(min)||min<1)min=1;if(isNaN(max)||max<1)max=1;
            if(min>allowed)min=allowed;if(max>allowed)max=allowed;
            if(min>max){
                if(changedId==='slider-loop-min'||changedId==='val-loop-min')max=min;
                else if(changedId==='slider-loop-max'||changedId==='val-loop-max')min=max;
            }
            minSlider.value=String(min);maxSlider.value=String(max);minInput.value=String(min);maxInput.value=String(max);
            state.looper.min=min;state.looper.max=max;ports.renderLooper();ports.enforceLooperBounds();
        }
        function syncLooperInputIfReady(changedId: string) {
            const input=changedId==='val-loop-min'?dom.input('val-loop-min'):dom.input('val-loop-max');
            if(input.value==='')return;syncLooper('input',changedId);
        }
        function stepLooperValue(target: Target,delta: number) {
            if(!active)return;
            const input=dom.input(target==='min'?'val-loop-min':'val-loop-max'),fallback=target==='min'?state.looper.min:state.looper.max,current=parseInt(input.value,10);
            input.value=String((Number.isNaN(current)?fallback:current)+delta);
            syncLooper('input',target==='min'?'val-loop-min':'val-loop-max');
        }
        function clearLooperHold() {
            if(!activeLooperHold)return;
            if(activeLooperHold.delayTimer)window.clearTimeout(activeLooperHold.delayTimer);
            if(activeLooperHold.repeatTimer)window.clearInterval(activeLooperHold.repeatTimer);
            if(activeLooperHold.button.releasePointerCapture&&activeLooperHold.pointerId!=null){
                try{if(activeLooperHold.button.hasPointerCapture?.(activeLooperHold.pointerId))activeLooperHold.button.releasePointerCapture(activeLooperHold.pointerId);}catch(_){}
            }
            activeLooperHold.button.classList.remove('is-holding');activeLooperHold=null;
        }
        function beginLooperHold(button: HTMLButtonElement,target: Target,delta: number,pointerId: number | null) {
            if(!active)return;clearLooperHold();activeLooperHold={button,pointerId,delayTimer:null,repeatTimer:null};button.classList.add('is-holding');
            const token=generation;
            if(button.setPointerCapture&&pointerId!=null){try{button.setPointerCapture(pointerId);}catch(_) {}}
            activeLooperHold.delayTimer=window.setTimeout(()=>{
                if(!active||token!==generation||!activeLooperHold||activeLooperHold.button!==button)return;
                activeLooperHold.repeatTimer=window.setInterval(()=>{if(active&&token===generation)stepLooperValue(target,delta);},170);
            },320);
        }
        function wireLooperHold(button: HTMLButtonElement | null,target: Target,delta: number) {
            if(!button)return;
            dom.on(button,'contextmenu',event=>event.preventDefault());dom.on(button,'dragstart',event=>event.preventDefault());
            dom.on(button,'pointerdown',event=>{
                if(!(event instanceof PointerEvent))return;
                if(event.button!==undefined&&event.button!==0)return;
                event.preventDefault();beginLooperHold(button,target,delta,event.pointerId);
            });
            dom.on(button,'pointerup',clearLooperHold);dom.on(button,'pointercancel',clearLooperHold);dom.on(button,'lostpointercapture',clearLooperHold);
            dom.on(button,'pointerleave',event=>{
                if(!(event instanceof PointerEvent))return;
                if(activeLooperHold?.button!==button)return;if(event.buttons===0)clearLooperHold();
            });
        }
        function initOptions() {
            if(optionsInitialized)return;active=true;optionsInitialized=true;
            dom.on(dom.input('check-looper'),'change',()=>{ports.renderLooper();ports.enforceLooperBounds();syncLooperDependentUi();});
            dom.onInput(dom.optionalInput('check-loop-countin'),'change',node=>{
                if(node.disabled)return;state.loopCountInEnabled=node.checked;ports.saveLoopCountIn(state.loopCountInEnabled);
            });
        }
        function initRange() {
            if(rangeInitialized)return;active=true;rangeInitialized=true;
            const minSlider=dom.input('slider-loop-min'),maxSlider=dom.input('slider-loop-max'),minInput=dom.input('val-loop-min'),maxInput=dom.input('val-loop-max');
            dom.onInput(minSlider,'input',node=>syncLooper('slider',node.id));dom.onInput(maxSlider,'input',node=>syncLooper('slider',node.id));
            dom.onInput(minInput,'input',node=>syncLooperInputIfReady(node.id));dom.onInput(maxInput,'input',node=>syncLooperInputIfReady(node.id));
            for(const event of ['change','blur'])for(const node of [minInput,maxInput])dom.onInput(node,event,input=>syncLooper('input',input.id));
            const steppers=[['btn-loop-min-decrease','min',-1],['btn-loop-min-increase','min',1],['btn-loop-max-decrease','max',-1],['btn-loop-max-increase','max',1]] as const;
            for(const [id,target,delta]of steppers)dom.on(dom.optionalButton(id),'click',()=>stepLooperValue(target,delta));
            for(const [id,target,delta]of steppers)wireLooperHold(dom.optionalButton(id),target,delta);
            dom.on(document,'pointerup',clearLooperHold);dom.on(document,'pointercancel',clearLooperHold);dom.on(window,'blur',clearLooperHold);
        }
        function init(){initOptions();syncLooperDependentUi();initRange();}
        function dispose(){if(!active)return;active=false;generation++;optionsInitialized=false;rangeInitialized=false;clearLooperHold();dom.dispose();}
        return{init,initOptions,initRange,dispose,syncLooperDependentUi,resetRangeForScore,syncLooper,syncLooperInputIfReady,stepLooperValue,clearLooperHold,beginLooperHold};
    }
    export type Service=ReturnType<typeof create>;
}
