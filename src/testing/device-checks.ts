import type {createServices} from '../app/services';

type Services=ReturnType<typeof createServices>;
export function createDeviceChecks(getServices:() => Services) {
    let held:Services['AppState']['heldCorrectNotes']|null=null;
    const commands=Object.freeze({
        initRange:() => getServices().playerRangeControls.init(),
        disposeRange:() => getServices().playerRangeControls.dispose(),
        initUpdates:() => getServices().updateControls.init(),
        disposeUpdates:() => getServices().updateControls.dispose(),
        disposeUpdateRequests:() => getServices().updateController.dispose(),
        checkUpdates:() => getServices().updateController.checkForUpdates({manual:true}),
        setManifest:(url:string) => {getServices().AppState.updateManifestUrl=url;},
        updateConnections:() => getServices().connectionStatus.updateConnectionStatuses(),
        setConnection:(mode:'none'|'wled',address:string,connection?:'none'|'disconnected'|'connected') => {
            const state=getServices().AppState;state.ledOutputMode=mode;state.wledIp=address;
            if(connection!==undefined)state.wledConnectionState=connection;
        },
        seedRangeNotes:() => {
            const s=getServices(),state=s.AppState,adapter=s.osmdAdapter;
            const note=[...adapter.readPlaybackEvent(adapter.resolveStaffIdFromEntry).entries]
                .flatMap(entry => [...entry.notes])[0];
            if(!note)throw Error('Missing range fixture note');
            state.expectedNotes=[20,60].map(midi => ({midi,noteRef:note.noteRef,hit:false,staffId:null,mIdx:0,anchor:null}));
            state.visualNotesToStart=[60,80].map(midi => ({midi,staffId:null,mIdx:0,endTimestamp:null,durationMs:100}));
            state.sustainedVisuals=[40,65].map(midi => ({midi,staffId:null,mIdx:0,endTimestamp:null}));
            state.outOfRangeCurrentNotes=[15,70].map(midi => ({midi,staffId:null,mIdx:0}));
            held=state.heldCorrectNotes;held.set(20,1);held.set(60,2);
        },
        readRange:() => {
            const state=getServices().AppState;
            return {pianoType:state.playerPianoType,range:state.playerRange?{...state.playerRange}:null,
                heldSame:!!held&&held===state.heldCorrectNotes,held:[...state.heldCorrectNotes.keys()],
                expected:state.expectedNotes.length,outOfRange:state.outOfRangeCurrentNotes.length,
                timelineDirty:state.ledPreviewTimelineDirty,previewEvents:state.lastLedPreviewEvents.length,previewIndex:state.ledPreviewTraversalIndex};
        },
        readUpdate:() => {
            const state=getServices().AppState;
            return {info:state.updateInfo?{...state.updateInfo}:null,status:state.updateStatus,last:state.updateLastCheckedAt};
        }
    });
    return {commands,clear:() => {held=null;}};
}
