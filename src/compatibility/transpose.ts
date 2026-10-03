// Original transpose script slot. Bootstrap will own this composition at P9.
const transposeCommands=PianoTrainerTransposeController.create({
    getApp:()=>typeof AppState==='undefined'?undefined:AppState, getEngine:()=>window.TransposeEngine,
    getLoader:()=>window.loadScoreIntoApp, syncUi:()=>transposeControls.syncUiFromState(), setStatus:(text,error)=>transposeControls.setStatus(text,error),
    reportError:(message,error)=>console.error(message,error),
    errorText:(error,fallback)=>{
        const message=error&&(typeof error==='object'||typeof error==='function')&&'message'in error?error.message:null;
        return message?String(message):fallback;
    }
});
const transposeControls=PianoTrainerTransposeControls.create({document,commands:transposeCommands,getEngine:()=>window.TransposeEngine});
window.TransposeEngine=PianoTrainerTransposeEngine;
window.TransposeUI={...transposeCommands,syncUiFromState:transposeControls.syncUiFromState,getPanel:transposeControls.getPanel,
    init:()=>{transposeCommands.init();transposeControls.init();},dispose:()=>{transposeControls.dispose();transposeCommands.dispose();}};
window.TransposeUI.init();
