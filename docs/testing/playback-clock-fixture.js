// Test entry only: inject a controllable clock into the next playback composition.
(() => {
 const original=PianoTrainerPlaybackClock.create;
 const fixture=window.__PT_PLAYBACK_CLOCK_TEST__={now:10,nextId:100000,timers:new Map(),frames:new Map(),countIns:[],unlocks:0};
 PianoTrainerPlaybackClock.create=ports=>{
  PianoTrainerPlaybackClock.create=original;
  return original({...ports,nowSeconds:()=>fixture.now,
   setTimer(callback,delay){const id=++fixture.nextId;fixture.timers.set(id,{callback,delay,due:fixture.now+Math.max(0,delay)/1000});return id;},
   clearTimer:id=>fixture.timers.delete(id),
   requestFrame(callback){const id=++fixture.nextId;fixture.frames.set(id,callback);return id;},cancelFrame:id=>fixture.frames.delete(id)});
 };
 audioOutput.ensureLiveAudioReady=async()=>{fixture.unlocks++;};
 fixture.nextTimer=()=>[...fixture.timers].sort((a,b)=>a[1].due-b[1].due||a[0]-b[0])[0];
 fixture.fireNext=()=>{const next=fixture.nextTimer();if(!next)throw Error('Missing scheduled playback event');fixture.timers.delete(next[0]);fixture.now=Math.max(fixture.now,next[1].due);next[1].callback();return next[1].delay;};
})();
