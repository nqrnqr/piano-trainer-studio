import type {createServices} from '../app/services';
import {PianoTrainerToolbar} from '../ui/toolbar';

type Services=ReturnType<typeof createServices>;
export function createControlsChecks(getServices:() => Services) {
    let capture:{context:Services['AppState']['currentExpectedContext'];score:Services['AppState']['score']}|null=null;
    let lateToolbar:PianoTrainerToolbar.Service|null=null,finishRefresh:(() => void)|null=null;
    const nativeControllers=() => {const s=getServices();return [s.toolbarUi,s.displayControls,s.tempoControls,s.audioLevelControls,s.loopControls];};
    const commands=Object.freeze({
        initNative:() => {for(const controller of nativeControllers())controller.init();},
        disposeNative:() => {for(const controller of nativeControllers())controller.dispose();},
        hidePanels:(immediate=true) => getServices().toolbarUi.hideToolbarPanels(immediate),
        showPanel:(id:PianoTrainerToolbar.PanelId) => getServices().toolbarUi.showToolbarPanel(document.getElementById(id)),
        positionScores:() => getServices().toolbarUi.positionScoresPanel(),
        showFirstRunIntro:() => getServices().toolbarUi.maybeShowFirstRunIntro(),
        capturePracticeIdentity:() => {const state=getServices().AppState;capture={context:state.currentExpectedContext,score:state.score};},
        readSnapshot:() => {
            const s=getServices(),state=s.AppState;
            return {libraryView:state.scoreLibraryView,zoom:state.zoom,vendorZoom:s.osmdAdapter.getZoom(),ready:s.osmdAdapter.isReady(),
                speed:state.speedPercent,midiOutVolume:state.midiOutVolume,midiInBoost:state.midiInBoost,
                metronomeMidiOut:state.metronomeMidiOutEnabled,loopCountIn:state.loopCountInEnabled,
                looper:{...state.looper},pseudoFullscreen:state.pseudoFullscreenActive,
                scoreSameAsCapture:!!capture&&capture.score===state.score,contextSameAsCapture:!!capture&&capture.context===state.currentExpectedContext};
        },
        setBaseBpm:(value:number) => {getServices().AppState.baseBpm=value;},
        requestFullscreen:() => getServices().displayControls.requestAppFullscreen(),
        exitFullscreen:() => getServices().displayControls.exitAppFullscreen(),
        preserveScroll:<T>(callback:() => T) => getServices().displayControls.preserveMusicAreaScroll(callback),
        createLateToolbar:() => {
            lateToolbar?.dispose();finishRefresh=null;
            lateToolbar=PianoTrainerToolbar.create({document,window,storage:localStorage,state:getServices().AppState,
                refreshScoresDrawer:() => new Promise<void>(resolve => {finishRefresh=resolve;})});
        },
        disposeToolbar:() => getServices().toolbarUi.dispose(),
        initLateToolbar:() => {if(!lateToolbar)throw Error('Missing late toolbar scenario');lateToolbar.init();},
        disposeLateToolbar:() => lateToolbar?.dispose(),
        finishLateRefresh:() => {if(!finishRefresh)throw Error('No pending toolbar refresh');finishRefresh();finishRefresh=null;}
    });
    return {commands,clear:() => {lateToolbar?.dispose();lateToolbar=null;finishRefresh=null;capture=null;}};
}
