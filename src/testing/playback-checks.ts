import type {createServices, ServicePorts} from '../app/services';
import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerPlaybackClock} from '../audio/playback-clock';

// Controlled clock/count-in at the explicit composition ports. Native score,
// toolbar, practice and coordinator remain the actual production instances.
export function createPlaybackChecks(nativeTime = false) {
    const timers = new Map<number,{callback:() => void,delay:number,due:number}>();
    const frames = new Map<number,FrameRequestCallback>();
    const countIns: (() => void)[] = [];
    let now = 10, nextId = 100000, unlocks = 0;
    let getServices: () => ReturnType<typeof createServices>;
    let restoreCountIn: (() => void) | undefined;
    const clock: PianoTrainerPlaybackClock.Ports = {
        nowSeconds:() => now,monotonicMilliseconds:() => performance.now(),
        setTimer:(callback,delay) => {const id = ++nextId; timers.set(id,{callback,delay,due:now+Math.max(0,delay)/1000});return id;},
        clearTimer:id => {timers.delete(id);},
        requestFrame:callback => {const id = ++nextId;frames.set(id,callback);return id;},
        cancelFrame:id => {frames.delete(id);}
    };
    const ports: ServicePorts = {ensurePlaybackReady:async () => {unlocks++;if (nativeTime) await Tone.start();},
        ...(nativeTime ? {} : {playbackClock:clock})};
    const nextTimer = () => [...timers].sort((a,b) => a[1].due-b[1].due || a[0]-b[0])[0];
    const commands = Object.freeze({
        setNow:(value:number) => {now = value;},
        readClock:() => ({now:nativeTime ? getServices().playbackClock.nowSeconds() : now,unlocks,timers:timers.size,frames:frames.size,countIns:countIns.length,
            owned:getServices().playbackClock.readResources()}),
        readWindow:() => getServices().trainerPlayback.readDisplayWindow(),
        nextTimer:() => {const next = nextTimer();return next ? [next[0],{delay:next[1].delay,due:next[1].due}] as const : undefined;},
        fireNext:() => {
            const next = nextTimer(); if (!next) throw Error('Missing scheduled playback event');
            timers.delete(next[0]); now = Math.max(now,next[1].due); next[1].callback();return next[1].delay;
        },
        finishCountIn:() => {
            const callback = countIns.shift();if (!callback) throw Error('Missing count-in callback');
            const state = getServices().AppState;state.countInActive = false;
            if (state.isPlaying) callback();
        },
        clearCountIns:() => {countIns.length = 0;},
        clearScheduled:() => getServices().playbackClock.dispose(),
        disposeCoordinator:() => getServices().trainerPlayback.dispose(),
        selectMode:(mode:PianoTrainerDomain.PracticeMode,syncHands = true) => {
            const services = getServices(), state = services.AppState;
            state.mode = mode;if (syncHands) services.handRouting.syncActiveHandStateFromMode();
            state.practice.left = state.practice.right = true;state.speedPercent = 1;state.fullscreenOnPlay = false;
        },
        prepareScenario:() => {
            const services = getServices(), state = services.AppState;
            services.playbackState.clearVisuals();state.loopCountInEnabled = false;
            state.score.correct = state.score.wrong = 0;
        },
        disablePulse:() => {getServices().AppState.visualPulseEnabled = false;},
        enableLoopCountIn:() => {getServices().AppState.loopCountInEnabled = true;},
        updateSpeed:(value:number) => getServices().tempoControls.updateTempo('percent',value)
    });
    return {ports,commands,
        attach:(services:() => ReturnType<typeof createServices>) => {
            getServices = services;
            const metronome = getServices().trainerMetronome, original = metronome.doCountInAndStart;
            metronome.doCountInAndStart = callback => {getServices().AppState.countInActive = true;countIns.push(callback);};
            restoreCountIn = () => {metronome.doCountInAndStart = original;};
        },
        dispose:() => {restoreCountIn?.();countIns.length = 0;timers.clear();frames.clear();}
    };
}
