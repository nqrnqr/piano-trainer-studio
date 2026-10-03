const {test}=require('node:test');
const assert=require('node:assert/strict');
const {harness,plain}=require('../helpers/playback-harness.cjs');

test('Follow comfort boundary keeps exactly 60 percent, resets shorter or late waits, and preserves an early anchor',()=>{
 const p=harness().api('PianoTrainerModePolicy');
 for(const [remaining,expected] of [[.6,.6],[.599999,1],[0,1],[-.1,1],[1.2,1.2]])
  assert.equal(p.followWaitSeconds(1,remaining),expected);
 assert.equal(p.followWaitSeconds(0,-1),0);
 assert.equal(p.followHitDelayMs(1/3),333);
 assert.equal(p.followHitDelayMs(-.1),0);
});

test('Realtime never inspects hit flags, while input policies hold a partial chord without mutating it',()=>{
 const p=harness().api('PianoTrainerModePolicy');
 const unreadable=Object.freeze([{get hit(){throw Error('Realtime must not inspect input');}}]);
 assert.deepEqual(plain(p.realtime.group(unreadable)),{kind:'timed'});
 const notes=Object.freeze([Object.freeze({hit:true}),Object.freeze({hit:false})]);
 assert.deepEqual(plain(p.wait.group(notes)),{kind:'input',alreadyHit:false});
 assert.deepEqual(plain(p.follow.group(notes)),{kind:'input',alreadyHit:false});
 assert.deepEqual(notes,[{hit:true},{hit:false}]);
});

test('Follow hit scheduling uses the displayed event after the actual iterator has prefetched',()=>{
 const h=harness({state:{mode:'follow'}});h.service.playbackLoop();
 assert.equal(h.iterator.currentTimeStamp.RealValue,.25);
 assert.deepEqual(plain(h.state.followAdvanceInfo),{currentMeasureIdx:0,currentTimestamp:0,waitSeconds:.5,beatsToWait:1});
 h.state.expectedNotes.forEach(n=>n.hit=true);h.service.checkWaitModeAdvance();
 assert.deepEqual(h.events.findLast(e=>Array.isArray(e)&&e[0]==='window').slice(2,4),[0,0]);
});

test('missing or nonfinite Follow info keeps the original Wait-only fallback callback',()=>{
 for(const info of [null,{waitSeconds:NaN},{waitSeconds:Infinity}]){
  const h=harness({state:{mode:'follow'}});h.service.playbackLoop();
  h.state.followAdvanceInfo=info;h.state.expectedNotes.forEach(n=>n.hit=true);
  h.clock.nowSeconds=()=>{throw Error('Invalid Follow info must not read the clock');};
  h.service.checkWaitModeAdvance();assert.equal(h.nextTimer()[1].delay,10);
  const before=h.events.length;h.fire(h.nextTimer()[0]);assert.equal(h.events.length,before);
 }
});

test('an empty Wait group observes mode changes made by sustain effects before choosing its delay',()=>{
 const h=harness({state:{practice:{right:false,left:false}}});
 h.ports.practice.startSustains=()=>{h.events.push('sustains');h.state.mode='follow';};
 h.service.playbackLoop();assert.equal(h.state.mode,'follow');
 assert.equal(h.state.followAdvanceInfo,null);assert.equal(h.state.isAudioBusy,true);
 assert.equal(h.nextTimer()[1].delay,500);
 assert.equal(h.events.filter(e=>Array.isArray(e)&&e[0]==='window').length,2);
});

test('a hit observes mode changes made by sustain effects before selecting Follow scheduling',()=>{
 const h=harness({state:{mode:'follow'}});h.service.playbackLoop();
 h.state.expectedNotes.forEach(n=>n.hit=true);
 h.ports.practice.startSustains=()=>{h.events.push('sustains');h.state.mode='wait';};
 h.clock.nowSeconds=()=>{throw Error('Wait hit must not read the Follow clock');};
 h.service.checkWaitModeAdvance();assert.equal(h.nextTimer()[1].delay,10);
});

test('Wait hit callback reads the current mode and stays gated after a switch to Follow',()=>{
 const h=harness();h.service.playbackLoop();h.state.expectedNotes.forEach(n=>n.hit=true);
 h.service.checkWaitModeAdvance();h.state.mode='follow';
 const before=h.events.length;h.fire(h.nextTimer()[0]);assert.equal(h.events.length,before);
});

test('input-gap callback allows a Wait to Follow switch and still grades before the next event',()=>{
 const h=harness({state:{practice:{right:false,left:false}}});h.service.playbackLoop();
 h.state.mode='follow';const before=h.getStep();h.fire(h.nextTimer()[0]);
 assert.equal(h.getStep(),before+1);assert.equal(h.events.includes('misses'),true);
});

test('Realtime callback keeps its playing-only guard after a switch to Follow',()=>{
 const h=harness({state:{mode:'realtime'}});h.service.playbackLoop();
 h.state.mode='follow';const before=h.getStep();h.fire(h.nextTimer()[0]);
 assert.equal(h.getStep(),before+1);assert.equal(h.state.score.wrong,2);
 assert.equal(h.state.followAdvanceInfo.currentTimestamp,.25);
});

test('an invalid saved mode retains the timed branch and accumulated anchor',()=>{
 const h=harness({state:{mode:'legacy-invalid',anchorTime:9.8}});h.service.playbackLoop();
 assert.equal(h.state.anchorTime,10.3);assert.ok(Math.abs(h.nextTimer()[1].delay-300)<1e-8);
 assert.equal(h.state.isAudioBusy,false);assert.equal(h.state.followAdvanceInfo,null);
});
