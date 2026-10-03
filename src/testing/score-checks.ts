import type {createServices} from '../app/services';
import {PianoTrainerTransposeEngine} from '../score/transpose-engine';

type Services=ReturnType<typeof createServices>;
export function createScoreChecks(getServices:() => Services) {
    let capture:{data:Services['AppState']['currentScoreData'];transpose:Services['AppState']['transpose']}|null=null;
    let originalLoad:Services['osmdAdapter']['load']|null=null,observedAdapter:Services['osmdAdapter']|null=null,loads=0;
    function clear() {
        if (originalLoad && observedAdapter) observedAdapter.load=originalLoad;
        capture=null;originalLoad=null;observedAdapter=null;loads=0;
    }
    function readSnapshot() {
        const services=getServices(),state=services.AppState,data=state.currentScoreData;
        return {fileName:state.currentScoreFileName,title:state.currentScoreTitle,fileType:state.currentScoreFileType,
            libraryId:state.currentScoreLibraryId,originalFileName:state.currentScoreOriginalFileName,
            originalText:typeof state.currentScoreOriginalData==='string'?state.currentScoreOriginalData:null,
            dataKind:typeof data==='string'?'string':data instanceof ArrayBuffer?'arraybuffer':'other',
            dataText:typeof data==='string'?data:null,
            dataByteLength:data instanceof ArrayBuffer?data.byteLength:null,speed:state.speedPercent,playing:state.isPlaying,
            transpose:{...state.transpose},dataSameAsCapture:!!capture&&capture.data===data,
            transposeSameAsCapture:!!capture&&capture.transpose===state.transpose,loads,
            hasCursor:services.osmdAdapter.hasCursor(),measure:services.osmdAdapter.hasCursor()?services.osmdAdapter.getCurrentMeasureIndex():null};
    }
    return {clear,commands:Object.freeze({
        readSnapshot,
        capture:() => {const state=getServices().AppState;capture={data:state.currentScoreData,transpose:state.transpose};},
        observeLoads:() => {
            if(originalLoad)return;
            const adapter=getServices().osmdAdapter,load=adapter.load;
            originalLoad=load;observedAdapter=adapter;loads=0;
            adapter.load=raw => {loads++;return load(raw);};
        },
        readFirstPitch:() => {
            const adapter=getServices().osmdAdapter;
            for(const entry of adapter.readPlaybackEvent(adapter.resolveStaffIdFromEntry).entries)
                for(const note of entry.notes)return note.midi;
            return null;
        },
        readFile:(file:File) => getServices().scoreFileReader.readScoreFile(file),
        selectFile:(file:File) => getServices().scoreFileControls.handleDirectScoreFileSelection(file),
        initFileControls:() => getServices().scoreFileControls.init(),
        disposeFileControls:() => getServices().scoreFileControls.dispose(),
        disposeConverter:() => getServices().scoreConversion.dispose(),
        disposeCoordinator:() => getServices().trainerPlayback.dispose(),
        updateTempo:(percent:number) => getServices().tempoControls.updateTempo('percent',percent),
        applyTranspose:() => getServices().transposeCommands.applyTranspose(),
        resetTranspose:() => getServices().transposeCommands.resetTranspose(),
        initTranspose:() => {const s=getServices();s.transposeCommands.init();s.transposeControls.init();},
        disposeTranspose:() => {const s=getServices();s.transposeControls.dispose();s.transposeCommands.dispose();},
        transposeXml:(raw:unknown,options:PianoTrainerTransposeEngine.TransposeOptions) =>
            structuredClone(PianoTrainerTransposeEngine.transposeXml(raw,options)),
        readKeyFifths:() => {
            const raw=getServices().AppState.currentScoreData;
            return typeof raw==='string'?PianoTrainerTransposeEngine.detectScoreKey(PianoTrainerTransposeEngine.parseXml(raw)).fifths:null;
        }
    })};
}
