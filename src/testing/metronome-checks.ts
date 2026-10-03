import type {createServices} from '../app/services';
import type {PianoTrainerDomain as Domain} from '../domain/model';

export function createMetronomeChecks(getServices:() => ReturnType<typeof createServices>) {
    let handoffs=0;
    return Object.freeze({
        initOutput:() => getServices().metronomeOutput.init(),
        disposeOutput:() => getServices().metronomeOutput.dispose(),
        muteOutput:() => getServices().metronomeOutput.setVolumeDecibels(-Infinity),
        dispose:() => getServices().trainerMetronome.dispose(),
        disposeCoordinator:() => getServices().trainerPlayback.dispose(),
        clearVisuals:() => getServices().playbackState.clearVisuals(),
        prepare:() => {
            const services=getServices(),state=services.AppState;
            services.osmdAdapter.reset();state.mode='wait';state.baseBpm=240;state.speedPercent=1;state.isPlaying=true;
            state.ledOutputMode='none';state.visualPulseEnabled=true;state.metronomeMidiOutEnabled=false;
        },
        prepareCoordinator:(mode:Domain.PracticeMode) => {
            const state=getServices().AppState;state.mode=mode;state.practice.left=state.practice.right=false;
            state.playback.left=state.playback.right=true;state.audioEnabled.hands=true;
            state.midiOutEnabled.hands=state.midiOutEnabled.other=false;
            state.lowLatencyPlaybackEnabled=true;state.fullscreenOnPlay=false;state.metronomeMidiOutEnabled=false;
        },
        selectMode:(mode:Domain.PracticeMode) => {getServices().AppState.mode=mode;},
        setPlaying:(value:boolean) => {getServices().AppState.isPlaying=value;},
        setMidiOutput:(value:boolean) => {getServices().AppState.metronomeMidiOutEnabled=value;},
        updateTempo:(percent:number) => getServices().tempoControls.updateTempo('percent',percent),
        readTiming:(index:number) => ({...getServices().scoreMeasureTiming.getInfo(index)}),
        readCacheCount:() => getServices().scoreMeasureTiming.getCachedMeasureCount(),
        readSnapshot:() => ({countIn:getServices().AppState.countInActive,handoffs,
            clock:{...getServices().metronomeClock.readResources()}}),
        startCountIn:() => getServices().trainerMetronome.doCountInAndStart(() => {handoffs++;}),
        startWait:(measure:number) => getServices().trainerMetronome.startWaitModeMetronome(measure),
        stopWait:() => getServices().trainerMetronome.stopWaitModeMetronome(),
        scheduleWindow:(start:number,measure:number,timestamp:number,end:number,length:number) =>
            getServices().trainerMetronome.scheduleMetronomeForPlaybackWindow(start,measure,timestamp,end,length),
        click:(downbeat:boolean,time:number) => getServices().trainerMetronome.playMetronomeClick(downbeat,time),
        startPlayback:() => getServices().trainerPlayback.startPlaybackFromToolbar()
    });
}
