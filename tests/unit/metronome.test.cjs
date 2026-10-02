const test=require('node:test'),assert=require('node:assert/strict');
const {harness,plain}=require('../helpers/metronome-harness.cjs');
test('clock preserves values and delays, owns timers/frames, and invalidates disposed callbacks without blocking reuse',()=>{
 const h=harness();let fired=0;const id=h.clock.setTimer(()=>fired++,NaN);const callback=h.timers.get(id).callback;
 const frame=h.clock.requestFrame(()=>fired++);assert.deepEqual(plain(h.clock.readResources()),{timers:1,frames:1});
 assert.ok(Number.isNaN(h.timers.get(id).delay));assert.equal(h.clock.nowSeconds(),10);assert.equal(h.clock.monotonicMilliseconds(),1000);
 h.clock.dispose();callback();assert.equal(fired,0);assert.equal(h.frames.has(frame),false);assert.equal(h.timers.size,0);
 const newId=h.clock.setTimer(()=>fired++,0);h.fire(newId);assert.equal(fired,1);assert.deepEqual(plain(h.clock.readResources()),{timers:0,frames:0});
});
test('metronome keeps downbeat accent and minimum MIDI velocity, including silent volume',()=>{
 const h=harness();assert.deepEqual(plain(h.service.getMetronomeClickSpec(true)),{note:'G6',velocity:.95});
 assert.deepEqual(plain(h.service.getMetronomeClickSpec(false)),{note:'C6',velocity:.7});
 assert.equal(h.service.getMetronomeMidiVelocity(0,118),1);assert.equal(h.service.getMetronomeMidiVelocity(50,118),59);
 h.state.accentedDownbeatEnabled=false;assert.equal(h.service.getMetronomeClickSpec(true).note,'C6');
 assert.equal(h.service.getMetronomeMidiClickSpec(true).note,76);
});
test('local click uses exact Tone timestamp while pulse schedules eight milliseconds early',()=>{
 const h=harness();h.service.playMetronomeClick(true,10.5);
 assert.deepEqual(h.events[0],['local','G6','64n',10.5,.95]);assert.equal(h.nextTimer()[1].delay,492);
 h.fire(h.nextTimer()[0]);assert.equal(h.events.some(e=>e[0]==='pulse-on'),true);
 assert.equal(h.nextTimer()[1].delay,170);h.fire(h.nextTimer()[0]);assert.equal(h.events.at(-1)[0],'pulse-off');
});
test('MIDI click schedules two milliseconds early, rechecks checkbox and keeps pulse independent',()=>{
 const h=harness({metronomeMidiOutEnabled:true});h.setMidi(true);h.service.playMetronomeClick(true,10.5);
 assert.equal(h.nextTimer()[1].delay,492); // pulse runs before the 498ms attack
 const attack=[...h.timers].find(([,t])=>t.delay===498)[0];h.setEnabled(false);h.fire(attack);
 assert.equal(h.events.some(e=>e[0]==='midi'),false);assert.equal(h.events.some(e=>e[0]==='local'),false);
});
test('MIDI attack callback retains original pause behavior and quantized volume',()=>{
 const h=harness({metronomeMidiOutEnabled:true});h.setMidi(true);h.setVolume(50);h.service.playMetronomeClick(false,10.5);
 const attack=[...h.timers].find(([,t])=>t.delay===498)[0];h.state.isPlaying=false;h.fire(attack);
 assert.deepEqual(h.events.find(e=>e[0]==='midi'),['midi',76,46,80]);
});
test('visual pulse retains 120ms deduplication and 170ms clear; disabled/missing targets schedule nothing',()=>{
 const h=harness();h.service.triggerTempoVisualPulse();const first=h.nextTimer()[0];h.setMono(1119);h.service.triggerTempoVisualPulse();
 assert.equal(h.events.filter(e=>e[0]==='pulse-on').length,1);h.setMono(1120);h.service.triggerTempoVisualPulse();
 assert.equal(h.events.filter(e=>e[0]==='pulse-on').length,2);assert.equal(h.timers.has(first),false);
 h.service.clearTempoVisualPulse();assert.equal(h.timers.size,0);h.setTarget(false);h.service.triggerTempoVisualPulse(20);assert.equal(h.timers.size,0);
 h.setTarget(true);h.state.visualPulseEnabled=false;h.service.triggerTempoVisualPulse(20);assert.equal(h.timers.size,0);
});
test('visual future pulse retarget clears only prior pending pulse and preserves the captured target',()=>{
 const h=harness();h.service.triggerTempoVisualPulse(11);const old=h.nextTimer()[0];h.service.triggerTempoVisualPulse(12);
 assert.equal(h.timers.has(old),false);assert.equal(h.nextTimer()[1].delay,1992);h.setTarget(false);h.fire(h.nextTimer()[0]);
 assert.equal(h.events.some(e=>e[0]==='pulse-on'),true);
});
test('count-in emits the first beat synchronously and hands off one full beat after the last click',()=>{
 const h=harness();h.setBeats(3);let started=0;h.service.doCountInAndStart(()=>started++);
 assert.equal(h.state.countInActive,true);assert.equal(h.events.filter(e=>e[0]==='local').length,1);
 for(let beat=0;beat<3;beat++){
  const tick=[...h.timers].find(([,t])=>t.delay===500);assert.ok(tick);h.setMono(1500+beat*500);h.fire(tick[0]);
 }
 assert.equal(h.events.filter(e=>e[0]==='local').length,3);assert.equal(started,1);assert.equal(h.state.countInActive,false);
});
test('count-in pause gates tick and handoff; original raw zero numerator still creates one click',()=>{
 const h=harness();h.setBeats(0);let started=0;h.service.doCountInAndStart(()=>started++);
 h.state.isPlaying=false;const handoff=[...h.timers].find(([,t])=>t.delay===500)[0];h.fire(handoff);
 assert.equal(started,0);assert.equal(h.state.countInActive,false);assert.equal(h.state.ledPreviewTraversalIndex,-1);
 assert.equal(h.events.filter(e=>e[0]==='local').length,1);
});
test('rapid pause/resume preserves legacy count-in callback behavior until a separate behavioral fix',()=>{
 const h=harness();h.setBeats(1);let starts=0;h.service.doCountInAndStart(()=>starts++);
 const oldHandoff=[...h.timers].find(([,t])=>t.delay===500)[0];h.state.isPlaying=false;h.state.countInActive=false;
 h.state.isPlaying=true;h.service.doCountInAndStart(()=>starts++);h.fire(oldHandoff);
 const nextHandoff=[...h.timers].find(([,t])=>t.delay===500)[0];h.fire(nextHandoff);assert.equal(starts,2);
});
test('Wait metronome runs independently of note advancement and keeps time-signature modulo',()=>{
 const h=harness({mode:'wait'});h.setCache([{startTimestamp:0,actualLengthWhole:.75,nominalMeasureLengthWhole:.75,numerator:3,denominator:4,beatLengthWhole:.25}]);
 h.service.startWaitModeMetronome(0);
 for(let beat=0;beat<4;beat++){
  const id=h.service.readResources().waitTimer;h.setNow(10+beat*.5);h.setMono(1000+beat*500);h.fire(id);
 }
 assert.deepEqual(h.events.filter(e=>e[0]==='local').map(e=>e[1]),['G6','C6','C6','G6']);
 assert.equal(h.service.getWaitMeasureIndex(),0);h.service.stopWaitModeMetronome();assert.equal(h.service.getWaitMeasureIndex(),-1);
});
test('Wait metronome tempo rebuild resets beat grid and never runs during count-in or unchecked state',()=>{
 const h=harness({mode:'wait'});h.service.startWaitModeMetronome(0);const old=h.service.readResources().waitTimer;
 h.state.baseBpm=60;h.service.rebuildWaitModeMetronome(0);assert.equal(h.timers.has(old),false);
 h.fire(h.service.readResources().waitTimer);assert.equal(h.timers.get(h.service.readResources().waitTimer).delay,992);
 h.state.countInActive=true;h.fire(h.service.readResources().waitTimer);assert.equal(h.service.readResources().waitTimer,null);
 h.state.countInActive=false;h.setEnabled(false);h.service.startWaitModeMetronome(0);assert.equal(h.service.readResources().waitTimer,null);
});
test('Follow window retains original beat-offset formula and explicit cancellation of the preceding window',()=>{
 const h=harness();h.service.scheduleMetronomeForPlaybackWindow(10,0,0,1,2);
 const first=[...h.timers];assert.deepEqual(first.map(([,t])=>t.delay),[0,1992]);
 h.service.scheduleMetronomeForPlaybackWindow(11,0,.5,1,2);assert.equal(first.every(([id])=>!h.timers.has(id)),true);
 assert.equal(h.service.readResources().windowEvents,2);h.state.isPlaying=false;
 for(const [id]of [...h.timers])h.fire(id);assert.equal(h.events.some(e=>e[0]==='local'),false);
});
test('Wait scheduling window reuses its own metronome and Follow defers to checkbox/playing gates',()=>{
 const h=harness({mode:'wait'});h.service.scheduleMetronomeForPlaybackWindow(10,0,0,.5,1);
 const original=h.service.readResources().waitTimer;h.service.scheduleMetronomeForPlaybackWindow(10.5,0,.25,.5,1);
 assert.equal(h.service.readResources().waitTimer,original);h.setEnabled(false);h.service.scheduleMetronomeForPlaybackWindow(11,0,.5,.5,1);
 assert.equal(h.service.readResources().waitTimer,null);
});
test('explicit metronome dispose owns all delayed count-in/MIDI/pulse work and rejects late callback execution',()=>{
 const h=harness({metronomeMidiOutEnabled:true});h.setMidi(true);h.service.doCountInAndStart(()=>h.events.push(['started']));
 const captured=[...h.timers.values()].map(t=>t.callback);h.service.dispose();const before=h.events.length;
 assert.equal(h.timers.size,0);for(const callback of captured)callback();assert.equal(h.events.length,before);
 assert.deepEqual(plain(h.clock.readResources()),{timers:0,frames:0});
});
test('MembraneSynth allocation remains explicit, idempotent and uses original options and dB volume',()=>{
 const h=harness();let allocated=0,disposed=0;const calls=[];
 class Synth{constructor(options){allocated++;calls.push(options);this.volume={value:0};}toDestination(){return this;}triggerAttackRelease(...args){calls.push(args);}dispose(){disposed++;}}
 const output=h.api('PianoTrainerMetronomeOutput').create({tone:{MembraneSynth:Synth}});assert.equal(allocated,0);
 output.init();output.init();assert.equal(allocated,1);assert.equal(calls[0].pitchDecay,.008);assert.equal(calls[0].octaves,1.5);
 output.play('G6','64n',10,.95);assert.deepEqual(calls.at(-1),['G6','64n',10,.95]);
 output.setVolumeDecibels(-Infinity);output.dispose();output.dispose();assert.equal(disposed,1);output.init();assert.equal(allocated,2);
});
