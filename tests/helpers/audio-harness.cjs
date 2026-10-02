const vm = require('node:vm');
const {runScript} = require('./legacy-script.cjs');
const plain = value => JSON.parse(JSON.stringify(value));
function deferred() {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return {promise, resolve, reject};
}
function audioHarness(options = {}) {
    const calls = [], warnings = [], nodes = [], timers = new Map();
    let seq = 0, audioTime = 12.5, loadedCalls = 0;
    const loading = deferred();
    const state = {mode:'wait', lowLatencyPlaybackEnabled:true,
        audioEnabled:{hands:true,other:false,instrument:true,virtual:true},
        midiOutEnabled:{hands:false,other:false,instrument:false,virtual:false},
        midiInBoost:150, inputVelocityEnabled:true, liveLowLatencyMonitoringEnabled:true};
    const context = {state:'suspended',lookAhead:0.1,updateInterval:0.03,latencyHint:'interactive',
        resume:async()=>{calls.push(['resume']);context.state='running';}};
    class Volume {
        constructor(db) { this.volume={value:db};nodes.push(this);calls.push(['volume',db]); }
        toDestination() { calls.push(['destination']);return this; }
        dispose() { calls.push(['dispose','volume']); }
    }
    function voice(kind, config) {
        const node={kind, config:plain(config), connect(destination){this.destination=destination;calls.push(['connect',kind]);return this;},
            triggerAttack:(...args)=>calls.push(['attack',kind,...args]),
            triggerRelease:(...args)=>calls.push(['release',kind,...args]),
            triggerAttackRelease:(...args)=>calls.push(['attack-release',kind,...args]),
            releaseAll:()=>calls.push(['release-all',kind]),dispose:()=>calls.push(['dispose',kind])};
        nodes.push(node);return node;
    }
    const tone={context,getContext:()=>context,
        loaded:()=>{loadedCalls++;return loading.promise;},start:async()=>{calls.push(['start']);},
        now:()=>audioTime+0.1,immediate:()=>audioTime,
        Frequency:value=>({toNote:()=>`note-${value}`}),Volume,Synth:{},
        PolySynth:class {constructor(_type,config){return voice('synth',config);}},
        Sampler:class {constructor(config){return voice('sampler',config);}}};
    if(options.withoutImmediate)delete tone.immediate;
    if(options.withoutLoaded)delete tone.loaded;
    const realm=vm.createContext({});
    for(const file of ['domain/velocity','audio/tone-adapter','audio/audio-routing'])runScript(realm,`js/generated/${file}.js`);
    const api=vm.runInContext('({output:PianoTrainerAudioOutput,routing:PianoTrainerAudioRouting,velocity:PianoTrainerVelocity})',realm);
    const timerPorts={setTimer:(cb,delay)=>{timers.set(++seq,{cb,delay});return seq;},clearTimer:id=>timers.delete(id)};
    const audio=api.output.create({tone,state,sampleExtension:()=>options.extension||'ogg',...timerPorts,
        warn:(...args)=>warnings.push(args)});
    let midiAvailable=true;
    const midi={noteOn:(...args)=>{calls.push(['midi-on',...args]);return midiAvailable;},
        noteOff:(...args)=>{calls.push(['midi-off',...args]);return midiAvailable;}};
    const routing=api.routing.create({state,audio,midi,...timerPorts});
    const fire=id=>{const timer=timers.get(id);timers.delete(id);timer.cb();};
    return {api,state,tone,context,audio,routing,calls,warnings,nodes,timers,loading,fire,
        clear:()=>{calls.length=0;},advance:seconds=>{audioTime+=seconds;},
        ready:async()=>{const pending=audio.ensurePianoSamplerLoaded();loading.resolve();await pending;},
        setMidiAvailable:value=>{midiAvailable=value;},get loadedCalls(){return loadedCalls;}};
}
module.exports={audioHarness,deferred,plain};
