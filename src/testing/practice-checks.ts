import type {createServices} from '../app/services';
import type {PianoTrainerDomain as Domain} from '../domain/model';
import {PianoTrainerTiming} from '../domain/timing';
import {createPermissionHelp, getMidiPermissionHelpText} from '../ui/permission-help';

type Services = ReturnType<typeof createServices>;
// Test-only commands and copied observations. No vendor/state object escapes.
export function createPracticeChecks(getServices: () => Services) {
    const inputs: Domain.TrainerNoteInput[] = [];
    const markerIds = new WeakMap<Domain.FeedbackMarker, number>();
    let nextMarkerId = 0, outputFrames = 0;
    function markerId(marker: Domain.FeedbackMarker) {
        if (!markerIds.has(marker)) markerIds.set(marker, ++nextMarkerId);
        return markerIds.get(marker)!;
    }
    function observe() {
        const services = getServices(), handle = services.practiceInput.handle;
        services.practiceInput.handle = input => {inputs.push({...input}); return handle(input);};
        const engine = services.legacyLed.LedEngine, render = engine.renderOutputs;
        engine.renderOutputs = function () {outputFrames++; return render.call(this);};
    }
    function stop() {
        const services = getServices();
        services.trainerPlayback.pausePlaybackFromToolbar();
        for (const midi of [...services.AppState.pressedKeys])
            services.practiceInput.handle({kind:'note-off',note:midi,source:'ui',velocity:100,channel:null,receivedAtMs:performance.now()});
    }
    function prepare(mode: Domain.PracticeMode = 'wait', practice: Domain.HandSelection = {left:true,right:true}, busy = false) {
        stop();
        const services = getServices(), state = services.AppState;
        services.playbackState.clearVisuals();
        state.mode = mode; state.practice = {...practice};
        state.score.correct = state.score.wrong = 0;
        state.isPlaying = true; state.isAudioBusy = busy;
    }
    function buildCurrentExpectations() {
        const services = getServices(), adapter = services.osmdAdapter;
        const event = adapter.readPlaybackEvent(adapter.resolveStaffIdFromEntry);
        services.practiceExpectedNotes.build(event.entries, adapter.getCurrentMeasureIndex(), adapter.getCurrentTimestamp());
    }
    function selectEvent(measureIndex: number, timestamp: number, build = true) {
        const services = getServices(), adapter = services.osmdAdapter;
        adapter.reset();
        let steps = 0;
        while (!adapter.isEndReached() && steps++ < 1000) {
            if (adapter.getCurrentMeasureIndex() === measureIndex && Math.abs(adapter.getCurrentTimestamp() - timestamp) < 1e-6) {
                adapter.updateCursor();
                services.AppState.currentExpectedContext = {measureIndex,timestamp,
                    signature:adapter.readPlaybackEvent(adapter.resolveStaffIdFromEntry).signature};
                if (build) buildCurrentExpectations();
                return;
            }
            adapter.advance();
        }
        throw Error(`Missing fixture event ${measureIndex}|${timestamp}`);
    }
    const snapshot = () => {
        const state = getServices().AppState;
        return {mode:state.mode,playing:state.isPlaying,countIn:state.countInActive,score:{...state.score},fileName:state.currentScoreFileName,
            pressed:[...state.pressedKeys],context:state.currentExpectedContext ? {...state.currentExpectedContext} : null,
            expected:state.expectedNotes.map(n => ({midi:n.midi,hit:n.hit,staffId:n.staffId,noteId:n.noteRef.id,
                revision:n.noteRef.scoreRevision,mIdx:n.mIdx,anchor:n.anchor ? {...n.anchor} : null})),
            wrongContext:state.realtimeWrongPressInCurrentContext,
            visualNotes:state.visualNotesToStart.map(n => ({...n})),outOfRange:state.outOfRangeCurrentNotes.map(n => ({...n})),
            reservations:[...state.earlyGraceReservations.values()].map(n => ({...n})),
            activeIncorrect:[...state.activeHeldIncorrectFeedback].map(([midi,marker]) => ({midi,id:markerId(marker)})),
            releasedIncorrect:state.releasedIncorrectFeedback.map(markerId)};
    };
    observe();
    return {snapshot,observe,
        commands:Object.freeze({
            muteOutputs:() => {
                const services = getServices(), state = services.AppState;
                services.toolbarUi.hideToolbarPanels(); document.getElementById('help-modal')?.classList.add('hidden');
                state.ledOutputMode = 'none';
                for (const key of Object.keys(state.audioEnabled) as (keyof Domain.AudioRouting)[]) state.audioEnabled[key] = false;
                for (const key of Object.keys(state.midiOutEnabled) as (keyof Domain.AudioRouting)[]) state.midiOutEnabled[key] = false;
                for (const id of ['check-metronome','check-looper','check-autoscroll']) {
                    const element = document.getElementById(id);
                    if (element instanceof HTMLInputElement) element.checked = false;
                }
            },
            muteInputActivation:() => {getServices().audioOutput.ensureLiveAudioReady = async () => {};},
            prepare,stop,selectEvent,buildCurrentExpectations,
            prepareMode:(mode:Domain.PracticeMode) => {
                stop(); const services = getServices(); services.playbackState.clearVisuals();
                services.AppState.mode = mode; services.handRouting.syncActiveHandStateFromMode();
            },
            startCurrentPlayback:() => {
                const services = getServices(); services.AppState.isPlaying = true;
                services.AppState.anchorTime = Tone.now(); services.trainerPlayback.playbackLoop();
            },
            assignPianoHands:() => {getServices().AppState.hands = {right:1,left:2};},
            setPlayerKeyCount:(count:number) => getServices().playerRangeControls.setPlayerPianoType(count,{save:false}),
            isMidiInRange:(midi:number) => getServices().playerRange.isMidiInPlayerRange(midi),
            processMisses:() => getServices().practiceScoring.processMissedNotes(),
            startSustains:() => getServices().practiceSustains.startVisualSustains(),
            findSatisfied:(midi:number) => {
                const match = getServices().practiceMatching.findSatisfiedOrSustainedMatchForMidi(midi);
                return match ? {...match} : null;
            },
            readInputs:() => inputs.map(input => ({...input})),
            clearInputs:() => {inputs.length = 0;},
            rebuildTimeline:() => {
                const services = getServices(); services.AppState.ledPreviewTimelineDirty = true;
                return services.sharedScoreTraversal.ensurePreviewTimelineBuilt().map(event => ({...event,notes:event.notes.map(n => ({...n}))}));
            },
            resetTraversal:() => getServices().osmdAdapter.reset(),
            advanceTraversal:() => getServices().osmdAdapter.advance(),
            readTraversal:() => {
                const adapter = getServices().osmdAdapter;
                return {end:adapter.isEndReached(),measure:adapter.getCurrentMeasureIndex(),timestamp:adapter.getCurrentTimestamp()};
            },
            traversalBeats:(currentMeasureIdx:number,currentTimestamp:number,nextMeasureIdx:number,nextTimestamp:number) =>
                PianoTrainerTiming.getTraversalBeatsToWait({currentMeasureIdx,currentTimestamp,nextMeasureIdx,nextTimestamp,
                    fallbackLength:0.25,getMeasureTimingInfo:getServices().scoreMeasureTiming.getInfo}),
            readLed:() => ({enabled:getServices().optionalLedOutput.enabled,outputFrames,
                resources:getServices().legacyLedResources.snapshot(),version:getServices().appMetadata.version}),
            showMidiHelp:() => createPermissionHelp(document).showMidiPermissionHelp(getMidiPermissionHelpText()),
            clearMidiHelp:() => createPermissionHelp(document).clearMidiPermissionHelp()
        })};
}
