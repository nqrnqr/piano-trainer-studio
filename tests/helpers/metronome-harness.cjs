const vm=require('node:vm');const {runScript}=require('./legacy-script.cjs');
function harness(overrides={}){
 const context=vm.createContext({});for(const name of ['audio/playback-clock','audio/metronome','score/measure-timing','audio/metronome-output'])runScript(context,`js/generated/${name}.js`);
 const api=name=>vm.runInContext(name,context);
 const state={accentedDownbeatEnabled:true,metronomeMidiOutEnabled:false,visualPulseEnabled:true,baseBpm:120,speedPercent:1,isPlaying:true,countInActive:false,mode:'follow',lastLedPreviewEvents:[],ledPreviewTraversalIndex:0,...overrides};
 const events=[],timers=new Map(),frames=new Map();let nextId=0,now=10,mono=1000,enabled=true,midiAvailable=false,volume=65,beats=4,measure=0,targetAvailable=true;
 const backend={nowSeconds:()=>now,monotonicMilliseconds:()=>mono,
  setTimer(callback,delay){const id=++nextId;timers.set(id,{callback,delay});events.push(['timer',id,delay]);return id;},
  clearTimer(id){timers.delete(id);events.push(['clear-timer',id]);},
  requestFrame(callback){const id=++nextId;frames.set(id,callback);return id;},cancelFrame(id){frames.delete(id);events.push(['clear-frame',id]);}};
 const clock=api('PianoTrainerPlaybackClock').create(backend);
 let cache=[{startTimestamp:0,actualLengthWhole:1,nominalMeasureLengthWhole:1,numerator:4,denominator:4,beatLengthWhole:.25}];
 const timing={getInfo:index=>cache[index]||cache[0],getCachedMeasureCount:()=>cache.length};
 const target={restart:()=>events.push(['pulse-on',mono]),hide:()=>events.push(['pulse-off'])};
 const ports={state,clock,timing,
  audio:{play:(...args)=>events.push(['local',...args])},
  midi:{isAvailable:()=>midiAvailable,percussionClick:(...args)=>{events.push(['midi',...args]);return midiAvailable;}},
  isEnabled:()=>enabled,getVolume:()=>volume,getPulseTarget:()=>targetAvailable?target:null,
  getLiveAudioTime:()=>now-.01,getCurrentMeasureIndex:()=>measure,getCountInBeats:()=>beats};
 const service=api('PianoTrainerMetronome').create(ports);
 return {context,api,state,events,timers,frames,backend,clock,timing,ports,service,
  setNow:value=>now=value,setMono:value=>mono=value,setEnabled:value=>enabled=value,setMidi:value=>midiAvailable=value,setVolume:value=>volume=value,
  setBeats:value=>beats=value,setMeasure:value=>measure=value,setTarget:value=>targetAvailable=value,setCache:value=>cache=value,
  fire(id){const t=timers.get(id);if(!t)throw Error(`missing timer ${id}`);timers.delete(id);t.callback();},
  nextTimer(){return [...timers].sort((a,b)=>a[1].delay-b[1].delay||a[0]-b[0])[0];}};
}
module.exports={harness,plain:value=>JSON.parse(JSON.stringify(value))};
