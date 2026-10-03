import type {createServices} from '../app/services';

type Services=ReturnType<typeof createServices>;
export function createKeyboardChecks(getServices:() => Services) {
    let output:Services['audioOutput']|null=null,originalReady:Services['audioOutput']['ensureLiveAudioReady']|null=null;
    const finishes:(() => void)[]=[],captured=new Map<number,(() => void)[]>();let nextCapture=0;
    function restoreReady() {
        if(output&&originalReady)output.ensureLiveAudioReady=originalReady;
        output=null;originalReady=null;finishes.length=0;captured.clear();
    }
    const commands=Object.freeze({
        init:() => {const s=getServices();s.virtualKeyboardControls.init();s.scoreSeekControls.init();},
        dispose:() => {const s=getServices();s.virtualKeyboardControls.dispose();s.scoreSeekControls.dispose();},
        initKeyboard:() => getServices().virtualKeyboardControls.init(),
        disposeKeyboard:() => getServices().virtualKeyboardControls.dispose(),
        rebuild:() => getServices().virtualKeyboardControls.createKeyboard(),
        releasePointer:() => getServices().virtualKeyboardControls.releaseActiveVirtualPointer(),
        release:() => {
            const s=getServices();s.virtualKeyboardControls.releaseActiveVirtualPointer();
            for(const midi of [...s.AppState.pressedKeys])s.practiceInput.handle({kind:'note-off',note:midi,velocity:100,source:'ui',channel:null,receivedAtMs:performance.now()});
        },
        setUnlock:(mode:'muted'|'pending') => {
            if(!originalReady){output=getServices().audioOutput;originalReady=output.ensureLiveAudioReady;}
            output!.ensureLiveAudioReady=mode==='muted' ? async () => {} : () => new Promise<void>(resolve => {finishes.push(resolve);});
        },
        finishUnlocks:() => {for(const finish of finishes.splice(0))finish();},
        captureUnlocks:() => {const token=++nextCapture;captured.set(token,finishes.splice(0));return token;},
        finishCapturedUnlocks:(token:number) => {
            const callbacks=captured.get(token);if(!callbacks)throw Error('Missing captured unlocks');captured.delete(token);
            for(const finish of callbacks)finish();
        },
        restoreReady,
        measureBox:(measure:number) => {const box=getServices().geometryEngine.getMeasureBox(measure,0);return box ? {...box}:null;},
        selectWait:() => {const s=getServices();s.AppState.mode='wait';s.handRouting.syncActiveHandStateFromMode();},
        setLoopBounds:(min:number,max:number) => {const state=getServices().AppState;state.looper.min=min;state.looper.max=max;},
        setPlaying:(playing:boolean) => {getServices().AppState.isPlaying=playing;},
        setScore:(correct:number,wrong:number) => {
            const s=getServices();s.AppState.score.correct=correct;s.AppState.score.wrong=wrong;s.scoreStatus.update();
        },
        seedPresentation:() => {
            const state=getServices().AppState;
            state.sustainedVisuals=[{midi:60,staffId:2,mIdx:0,endTimestamp:null}];
            state.lastLedPreviewEvents=[{measureIndex:0,timestamp:0,notes:[{midi:62,staffId:1,state:'future1-r'}]}];state.futurePreviewEnabled=true;
        },
        clearPendingVisuals:() => {getServices().AppState.visualNotesToStart=[];},
        setEarlyCarry:(midi:number,early:boolean) => {
            const state=getServices().AppState;state.pressedKeys.add(midi);
            if(early)state.preExpectedHeldNotes.add(midi);else {state.preExpectedHeldNotes.delete(midi);state.correctHighlightEnabled=true;}
        },
        setCalibration:(enabled:boolean,midi=60) => {const state=getServices().AppState;state.ledCalibrationMode=enabled;state.ledCalibrationSelectedMidi=midi;},
        render:() => getServices().keyboardController.render()
    });
    return {commands,clear:restoreReady};
}
