import type {createServices} from '../app/services';
import type {PianoTrainerDomain as Domain} from '../domain/model';
import type {PianoTrainerAudioRouting} from '../audio/audio-routing';
import {getPreferredPianoSampleExtension} from '../ui/audio-capabilities';

// Commands exercise the actual output, routing and level controllers. Fixtures
// observe only their injected native Tone nodes and MIDI protocol ports.
export function createAudioChecks(getServices:() => ReturnType<typeof createServices>) {
    return Object.freeze({
        hidePanels:() => {getServices().toolbarUi.hideToolbarPanels();document.getElementById('help-modal')?.classList.add('hidden');},
        initOutput:() => getServices().audioOutput.init(),
        disposeOutput:() => getServices().audioOutput.dispose(),
        disposeRouting:() => getServices().audioRouting.dispose(),
        ensureReady:() => getServices().audioOutput.ensureLiveAudioReady(),
        loadSampler:() => getServices().audioOutput.ensurePianoSamplerLoaded(),
        isReady:() => getServices().audioOutput.isReady(),
        sampleExtension:getPreferredPianoSampleExtension,
        applyLatency:(mode:Domain.PracticeMode) => getServices().audioOutput.applyToneLatencyProfileForMode(mode),
        pianoVolume:(value:number) => getServices().audioLevelControls.updatePianoVolume(value,{save:false}),
        metroVolume:(value:number) => getServices().audioLevelControls.updateMetroVolume(value,{save:false}),
        setPianoVolume:(value:number) => getServices().audioOutput.setPianoVolume(value),
        setRouting:(audio:Partial<Domain.AudioRouting>,midi:Partial<Domain.AudioRouting>) => {
            const state = getServices().AppState;
            Object.assign(state.audioEnabled,audio);Object.assign(state.midiOutEnabled,midi);
        },
        setInputVelocity:(boost:number,enabled:boolean) => {
            const state = getServices().AppState;state.midiInBoost=boost;state.inputVelocityEnabled=enabled;
        },
        selectMode:(mode:Domain.PracticeMode,lowLatency:boolean) => {
            const state = getServices().AppState;state.mode=mode;state.lowLatencyPlaybackEnabled=lowLatency;
        },
        schedule:(note:number,duration:number,velocity:number,destinations:PianoTrainerAudioRouting.Destinations) =>
            getServices().audioRouting.schedulePlaybackForDestinations(note,duration,velocity,destinations),
        silence:() => {const services=getServices();services.audioOutput.silence();services.midiOutput.silence();}
    });
}
