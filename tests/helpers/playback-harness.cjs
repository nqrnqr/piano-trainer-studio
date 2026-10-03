const vm=require('node:vm');
const {runScript}=require('./legacy-script.cjs');
const plain=value=>JSON.parse(JSON.stringify(value));
const note=(midi,staffId=1,length=.25,extra={})=>({halfTone:midi-12,ParentStaff:{id:staffId},Length:{RealValue:length},isRest:()=>false,...extra});
const entry=(...notes)=>({Notes:notes});
function harness(options={}){
 const context=vm.createContext({window:{}});
 for(const file of ['domain/timing','score/score-traversal','score/osmd-adapter','audio/playback-clock','practice/playback-state','practice/mode-policy','practice/playback-coordinator'])runScript(context,`js/generated/${file}.js`);
 const api=name=>vm.runInContext(name,context);
 const state={mode:'wait',isPlaying:true,countInActive:false,fullscreenOnPlay:false,baseBpm:120,speedPercent:1,anchorTime:10,
  expectedNotes:[],pendingAudio:[],followAdvanceInfo:null,currentExpectedContext:null,isAudioBusy:false,score:{correct:0,wrong:0},
  practice:{left:true,right:true},playback:{left:false,right:false},audioEnabled:{hands:true,other:false},midiOutEnabled:{hands:false,other:false},
  loopCountInEnabled:false,looper:{min:1,max:2,enabled:false},ledOutputMode:'none',lastLedPreviewEvents:[],ledPreviewTraversalIndex:-1,
  activeTimeouts:[],sustainedVisuals:[],visualNotesToStart:[],outOfRangeCurrentNotes:[],activeHeldIncorrectFeedback:new Map(),releasedIncorrectFeedback:[],
  correctFeedbackHistory:[],realtimeWrongPressInCurrentContext:false,heldCorrectNotes:new Map(),preExpectedHeldNotes:new Set(),earlyGraceReservations:new Map(),
  ...options.state};
 const events=[],timers=new Map(),frames=new Map(),countIns=[];
 let now=options.now??10,id=0,step=0,loopEnabled=!!options.loopEnabled,metroEnabled=!!options.metroEnabled,cursorAvailable=true;
 let sourceSteps=options.steps??[{measure:0,time:0,entries:[entry(note(60,1),note(48,2))]},{measure:0,time:.25,entries:[entry(note(62,1),note(50,2))]}];
 const current=()=>sourceSteps[Math.min(step,sourceSteps.length-1)];
 const iterator={get EndReached(){return step>=sourceSteps.length;},get CurrentMeasureIndex(){return current()?.measure??0;},
  get currentTimeStamp(){return {RealValue:current()?.time??0};},get CurrentVoiceEntries(){return current()?.entries;},
  moveToNext(){events.push('advance');step++;}};
 const cursor={Iterator:iterator,reset(){events.push('reset');step=0;},update(){events.push('cursor');},show(){events.push('show');}};
 const renderer={get cursor(){return cursorAvailable?cursor:null;},Sheet:{SourceMeasures:options.measures??[{ActiveTimeSignature:{Numerator:4,Denominator:4}}]}};
 const adapter=api('PianoTrainerOsmdAdapter').create({getRenderer:()=>renderer,describeNote:()=>({}),describeGraphicalNote:()=>({}),debugLog:()=>{},reportError:()=>{}});
 const resolveStaff=e=>e.Notes?.[0]?.ParentStaff?.id??null;
 const getHandRole=staff=>staff===1?'right':staff===2?'left':null;
 const domainBuild=(entries,measure,time)=>{
  events.push(['expected',measure,time]);state.expectedNotes=[];
  for(const e of entries){if(!state.practice[getHandRole(e.staffId)])continue;
   for(const n of e.notes){if(n.rest||n.tieContinuation||n.notehead==='none'||n.printObject===false||n.cue)continue;
    state.expectedNotes.push({midi:n.midi,staffId:e.staffId,hit:!!options.alreadyHit,mIdx:measure});}}
 };
 const backend={nowSeconds:()=>now,monotonicMilliseconds:()=>now*1000,
  setTimer(callback,delay){const timerId=++id;timers.set(timerId,{callback,delay,due:now+Math.max(0,delay)/1000});events.push(['timer',timerId,delay]);return timerId;},
  clearTimer(timerId){timers.delete(timerId);events.push(['clear-timer',timerId]);},
  requestFrame(callback){const frameId=++id;frames.set(frameId,callback);events.push(['frame',frameId]);return frameId;},
  cancelFrame(frameId){frames.delete(frameId);events.push(['clear-frame',frameId]);}};
 const clock=api('PianoTrainerPlaybackClock').create(backend);
 const transitions=api('PianoTrainerPlaybackState').create({state,
  clearFeedbackPreserveScoring:()=>events.push('clear-feedback'),clearTimer:backend.clearTimer,
  wipeHardware:()=>events.push('wipe'),renderKeyboard:()=>events.push('keyboard-clear')});
 const metronome={scheduleMetronomeForPlaybackWindow:(...args)=>events.push(['window',...args]),clearScheduledMetronomeEvents:()=>events.push('clear-window'),
  clearTempoVisualPulse:()=>events.push('clear-pulse'),stopWaitModeMetronome:()=>events.push('stop-wait'),startWaitModeMetronome:measure=>events.push(['start-wait',measure]),
  doCountInAndStart(callback){state.countInActive=true;countIns.push(callback);events.push('count-in');},dispose(){countIns.length=0;events.push('dispose-metro');}};
 const controls={isLoopEnabled:()=>loopEnabled,isLoopEnabledAtEnd:()=>loopEnabled,readLoopMin:()=>options.loopMin??state.looper.min,
  readLoopMax:()=>options.loopMax??state.looper.max,isMetronomeEnabled:()=>metroEnabled};
 const transport={stop:()=>events.push('transport-stop'),pause:()=>events.push('transport-pause'),start:()=>events.push('transport-start'),setBpm:value=>events.push(['bpm',value])};
 const audio={schedule:(...args)=>events.push(['audio',...args]),silence:()=>events.push('local-silence'),applyLatencyProfile:()=>events.push('latency'),
  ensureReady:()=>{events.push('unlock');return options.unlock??Promise.resolve();}};
 const ui={scroll:()=>events.push('scroll'),cancelViewport:()=>events.push('cancel-viewport'),clearSvgFeedback:()=>events.push('clear-svg'),
  updatePlayPause:()=>events.push(['button',state.isPlaying]),hidePanels:()=>events.push('hide-panels'),isFullscreenActive:()=>false,
  requestFullscreen:()=>{events.push('fullscreen');return options.fullscreen??Promise.resolve();},
  preserveScroll:callback=>{events.push('preserve-start');callback();events.push('preserve-end');},renderFeedback:()=>events.push('feedback'),
  renderEventKeyboard:(event,measure,time)=>events.push(['keyboard-event',measure,time]),updateScore:()=>events.push(['score',state.score.correct,state.score.wrong]),
  updateTempoPercent:value=>events.push(['tempo',value])};
 const ports={state,clock,controls,transitions,transport,metronome,audio,ui,
  midi:{silence:()=>events.push('midi-silence')},led:{wipeHardware:()=>events.push('wipe'),clearOutputs:()=>{events.push('clear-led');return Promise.resolve();}},
  ensureTimeline:()=>events.push('timeline'),
  score:{hasCursor:adapter.hasCursor,isEndReached:adapter.isEndReached,readEvent:()=>adapter.readPlaybackEvent(resolveStaff),
   getTimestamp:adapter.getCurrentTimestamp,getMeasureIndex:adapter.getCurrentMeasureIndex,getTempo:adapter.getPlaybackTempo,
   advance:adapter.advance,reset:adapter.reset,update:adapter.updateCursor,show:adapter.showCursor},
  practice:{buildExpected:domainBuild,getHandRole,startSustains:()=>events.push('sustains'),processMisses:()=>{events.push('misses');state.score.wrong+=state.expectedNotes.filter(n=>!n.hit).length;}},
  timing:{getTraversalBeatsToWait:api('PianoTrainerTiming').getTraversalBeatsToWait,getMeasureTimingInfo:()=>({startTimestamp:0,actualLengthWhole:1,nominalMeasureLengthWhole:1,beatLengthWhole:.25,numerator:4,denominator:4})}};
 const service=api('PianoTrainerPlaybackCoordinator').create(ports);
 return {context,api,state,events,timers,frames,countIns,backend,clock,ports,service,adapter,renderer,iterator,cursor,resolveStaff,domainBuild,plain,
  setNow:value=>now=value,getNow:()=>now,setStep:value=>step=value,getStep:()=>step,setLoop:value=>loopEnabled=value,setMetro:value=>metroEnabled=value,
  setCursor:value=>cursorAvailable=value,setSteps:value=>{sourceSteps=value;step=0;},
  fire(timerId){const timer=timers.get(timerId);if(!timer)throw Error('Missing timer');timers.delete(timerId);now=Math.max(now,timer.due);timer.callback();},
  nextTimer:()=>[...timers].sort((a,b)=>a[1].due-b[1].due||a[0]-b[0])[0],
  finishCountIn(){state.countInActive=false;const callback=countIns.shift();if(!callback)throw Error('Missing count-in');callback();}};
}
module.exports={harness,note,entry,plain};
