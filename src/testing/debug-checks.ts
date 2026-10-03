import type {createServices} from '../app/services';
import type {PianoTrainerDomain} from '../domain/model';
import {PianoTrainerOsmdDebugObservation} from '../score/osmd-debug-observation';

export function createDebugChecks(getServices:() => ReturnType<typeof createServices>) {
    return Object.freeze({
        init:() => getServices().feedbackDebug.init(),
        dispose:() => getServices().feedbackDebug.dispose(),
        setFrameLimit:(count:number) => getServices().feedbackDebug.setDebugStickyFrames(count),
        pushFrame:(frame:PianoTrainerDomain.FeedbackFrameInput) => getServices().feedbackDebug.pushStickyDebugFrame(frame),
        readSnapshot:() => {
            const state=getServices().AppState;
            return {anchors:state.debugPersistentAnchors,events:state.debugEventFlow,matches:state.debugMatchLogs,resolution:state.debugAnchorResolution,
                sequence:state.debugFrameSeq,history:state.debugAnchorHistory.map(frame => ({...frame,
                    notes:frame.notes.map(note => ({...note,anchor:{...note.anchor}}))}))};
        },
        readFirstNote:() => {
            const adapter=getServices().osmdAdapter;
            const first=[...adapter.readPlaybackEvent(adapter.resolveStaffIdFromEntry).entries].flatMap(entry => [...entry.notes])[0];
            const note=first&&adapter.resolveNote(first.noteRef);
            if(!note)throw Error('Missing debug fixture note');
            return {diagnostic:PianoTrainerOsmdDebugObservation.describeLogicalNoteForDebug(note,0,0),
                sourceMidi:note.halfTone===undefined?null:note.halfTone+12,sourceLength:note.Length?.RealValue??null};
        }
    });
}
