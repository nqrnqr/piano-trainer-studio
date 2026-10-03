import {createServices} from '../app/services';
import type {ServicePorts} from '../app/services';
import type {PianoTrainerDomain} from '../domain/model';
import {createPracticeChecks} from './practice-checks';
import {createRenderChecks} from './render-checks';
import {createPlaybackChecks} from './playback-checks';
import {createMidiChecks} from './midi-checks';
import {createAudioChecks} from './audio-checks';
import {createMetronomeChecks} from './metronome-checks';
import {createScoreChecks} from './score-checks';
import {createLibraryChecks} from './library-checks';
import type {LibraryFixturePorts} from './library-checks';
import {createControlsChecks} from './controls-checks';
import {createPreferenceChecks} from './preference-checks';
import {createKeyboardChecks} from './keyboard-checks';
import {createDeviceChecks} from './device-checks';

// Separate test entry: commands and copied observations, with no state/vendor object.
export function createTestFacade(options: {controlledPlayback?:boolean} = {}, injectedPorts:ServicePorts = {}, libraryFixture?:LibraryFixturePorts) {
    const playbackChecks = options.controlledPlayback ? createPlaybackChecks() : null;
    const servicePorts = {...injectedPorts,...playbackChecks?.ports};
    let services = createServices(servicePorts);
    playbackChecks?.attach(() => services);
    services.init();
    const checks = createPracticeChecks(() => services);
    const renderChecks = createRenderChecks(() => services);
    const scoreChecks = createScoreChecks(() => services);
    const libraryChecks = createLibraryChecks(() => services,libraryFixture);
    const controlsChecks = createControlsChecks(() => services);
    const preferenceChecks = createPreferenceChecks(() => services);
    const keyboardChecks = createKeyboardChecks(() => services);
    const deviceChecks = createDeviceChecks(() => services);
    return Object.freeze({
        loadScore: (raw:PianoTrainerDomain.ScoreRawData,options:PianoTrainerDomain.ScoreLoadOptions={})=>services.scoreLoader.loadScoreIntoApp(raw,options),
        dispatchInput: (note:number,down:boolean)=>services.practiceInput.handle({kind:down?'note-on':'note-off',note,velocity:100,
            source:'ui',channel:null,receivedAtMs:performance.now()}),
        readPracticeSnapshot:checks.snapshot,
        practice:checks.commands,
        render:renderChecks.commands,
        playback:playbackChecks?.commands,
        midi:createMidiChecks(() => services),
        audio:createAudioChecks(() => services),
        metronome:createMetronomeChecks(() => services),
        score:scoreChecks.commands,
        library:libraryChecks.commands,
        controls:controlsChecks.commands,
        preferences:preferenceChecks.commands,
        keyboard:keyboardChecks.commands,
        devices:deviceChecks.commands,
        dispatchNote:(input:PianoTrainerDomain.TrainerNoteInput)=>services.practiceInput.handle({...input}),
        readViewportSnapshot:()=>({layout:services.ScoreDisplay.isHorizontal()?'horizontal':'traditional',
            ...services.osmdAdapter.readPositions(),measureCount:services.osmdAdapter.getMeasureCount(),
            systems:services.osmdAdapter.getSystemCount(),cursorLeft:services.osmdAdapter.getCursorElement()?.style.left,
            cursorBounds:(() => {const rect = services.osmdAdapter.getCursorElement()?.getBoundingClientRect();
                return rect ? {left:rect.left,width:rect.width} : null;})()}),
        setLayout:(layout:PianoTrainerDomain.ScoreLayout)=>services.ScoreDisplay.setMode(layout,{save:false}),
        beginScenario:(mode:PianoTrainerDomain.PracticeMode)=>{
            services.trainerPlayback.pausePlaybackFromToolbar(); services.playbackState.clearVisuals();
            services.AppState.mode=mode;services.handRouting.syncActiveHandStateFromMode();
            services.AppState.practice.left=services.AppState.practice.right=true;
            services.AppState.score.correct=services.AppState.score.wrong=0;
            services.osmdAdapter.reset();services.osmdAdapter.showCursor();services.osmdAdapter.updateCursor();
            for(const key of Object.keys(services.AppState.audioEnabled) as (keyof PianoTrainerDomain.AudioRouting)[])services.AppState.audioEnabled[key]=false;
            for(const key of Object.keys(services.AppState.midiOutEnabled) as (keyof PianoTrainerDomain.AudioRouting)[])services.AppState.midiOutEnabled[key]=false;
            services.AppState.ledOutputMode='none';services.AppState.isPlaying=true;services.AppState.anchorTime=Tone.now();
            services.trainerPlayback.playbackLoop();
        },
        pause:()=>services.trainerPlayback.pausePlaybackFromToolbar(),
        init:()=>services.init(),dispose:()=>{services.dispose();renderChecks.clear();scoreChecks.clear();libraryChecks.clear();controlsChecks.clear();preferenceChecks.clear();keyboardChecks.clear();deviceChecks.clear();playbackChecks?.dispose();},
        recreate:()=>{services.dispose();renderChecks.clear();scoreChecks.clear();libraryChecks.clear();controlsChecks.clear();preferenceChecks.clear();keyboardChecks.clear();deviceChecks.clear();playbackChecks?.dispose();services=createServices(servicePorts);
            playbackChecks?.attach(() => services);services.init();checks.observe();}
    });
}
