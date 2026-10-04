const {test}=require('node:test');const assert=require('node:assert/strict');
const {harness,note,entry,plain}=require('../helpers/playback-harness.cjs');
const kinds=events=>events.map(e=>Array.isArray(e)?e[0]:e);
test('cached-page suspension cancels old advances, preserves score/position and permits a fresh Play',async()=>{
 const h=harness({state:{mode:'realtime'}});h.service.playbackLoop();const old=h.nextTimer()[1].callback,position=h.getStep();h.state.score.correct=7;
 h.service.suspend();assert.equal(h.state.isPlaying,false);assert.equal(h.timers.size,0);assert.equal(h.frames.size,0);assert.equal(h.state.score.correct,7);assert.equal(h.getStep(),position);
 await h.service.startPlaybackFromToolbar();h.finishCountIn();const fresh=h.getStep();old();assert.equal(h.getStep(),fresh);assert.equal(h.state.isPlaying,true);
});
test('cached-page suspension invalidates pending unlock and a captured count-in handoff',async()=>{
 let finish;const h=harness({state:{isPlaying:false},unlock:new Promise(resolve=>finish=resolve)});
 const start=h.service.startPlaybackFromToolbar();h.service.suspend();finish();await start;assert.equal(h.state.isPlaying,false);assert.equal(h.countIns.length,0);
 h.ports.audio.ensureReady=async()=>{};await h.service.startPlaybackFromToolbar();const old=h.countIns[0];h.service.suspend();
 await h.service.startPlaybackFromToolbar();const position=h.getStep();old();assert.equal(h.getStep(),position);h.finishCountIn();assert.equal(h.state.isPlaying,true);
});
test('cached-page suspension invalidates a captured Loop count-in restart without resetting scoring on return',()=>{
 const h=harness({loopEnabled:true,loopMax:1,state:{mode:'realtime',loopCountInEnabled:true},steps:[{measure:0,time:0,entries:[entry(note(60))]},{measure:1,time:1,entries:[]}]});
 h.service.playbackLoop();h.fire(h.nextTimer()[0]);const old=h.countIns[0];h.state.score.correct=7;h.service.suspend();h.state.isPlaying=true;const position=h.getStep();old();assert.equal(h.state.score.correct,7);assert.equal(h.getStep(),position);
});
test('one coordinator paints current event before real iterator prefetch and gates Wait input',()=>{
 const h=harness();h.service.playbackLoop();assert.equal(h.state.currentExpectedContext.timestamp,0);assert.equal(h.iterator.currentTimeStamp.RealValue,.25);
 assert.deepEqual(kinds(h.events),['expected','feedback','keyboard-event','advance','window']);assert.equal(h.state.isAudioBusy,true);assert.equal(h.timers.size,0);
});
test('accompaniment routes independently, postpones inactive-hand playback, and skips rest/tie continuation',()=>{
 const start=note(50,2,.25),continuation=note(50,2,.25);continuation.NoteTie={StartNote:start};
 const h=harness({state:{practice:{right:true,left:false},playback:{right:false,left:true},midiOutEnabled:{hands:true,other:false}},
  steps:[{measure:0,time:0,entries:[entry(note(60)),entry(note(48,2),note(49,2,.25,{isRest:()=>true}),continuation)]},{measure:0,time:.25,entries:[]}]});
 h.service.playbackLoop();assert.deepEqual(plain(h.state.pendingAudio),[{midi:48,durationMs:450,velocity:100,toLocalAudio:true,toMidiOut:true}]);
 assert.equal(h.events.some(e=>Array.isArray(e)&&e[0]==='audio'),false);
 h.state.expectedNotes.forEach(n=>n.hit=true);h.service.checkWaitModeAdvance();assert.equal(h.state.pendingAudio.length,0);
 assert.deepEqual(kinds(h.events.slice(-3)),['audio','sustains','timer']);
});
test('Realtime uses accumulated anchor and counts misses before paint/scroll/next event',()=>{
 const h=harness({state:{mode:'realtime',anchorTime:9.8}});h.service.playbackLoop();assert.equal(h.state.anchorTime,10.3);
 assert.ok(Math.abs(h.nextTimer()[1].delay-300)<1e-8);h.fire(h.nextTimer()[0]);assert.equal(h.state.score.wrong,2);
 const sequence=kinds(h.events);assert.deepEqual(sequence.slice(sequence.indexOf('misses'),sequence.indexOf('misses')+4),['misses','cursor','scroll','expected']);
});
test('Follow expected event defers metronome until input, using the original comfort window',()=>{
 const h=harness({state:{mode:'follow'}});h.service.playbackLoop();assert.deepEqual(kinds(h.events).slice(-2),['clear-window','clear-pulse']);
 assert.equal(h.timers.size,0);h.state.expectedNotes.forEach(n=>n.hit=true);h.setNow(10.4);h.service.checkWaitModeAdvance();
 assert.equal(h.nextTimer()[1].delay,500);assert.equal(h.events.findLast(e=>Array.isArray(e)&&e[0]==='window')[4],.5);
});
for(const [mode,delay,windows]of [['wait',10,1],['follow',500,2],['realtime',500,1]])test(`${mode} rest/inactive event keeps original delay and window call count`,()=>{
 const h=harness({state:{mode,practice:{right:false,left:false}}});h.service.playbackLoop();assert.equal(h.nextTimer()[1].delay,delay);
 assert.equal(h.events.filter(e=>Array.isArray(e)&&e[0]==='window').length,windows);assert.equal(h.state.expectedNotes.length,0);
});
test('already satisfied Wait group queues zero-delay check before the unchanged 10ms advance',()=>{
 const h=harness({alreadyHit:true});h.service.playbackLoop();assert.equal(h.nextTimer()[1].delay,0);h.fire(h.nextTimer()[0]);assert.equal(h.nextTimer()[1].delay,10);
});
test('empty voice entry advances and paints once via owned rAF, with no auto-scroll',()=>{
 const h=harness({steps:[{measure:0,time:0,entries:[]},{measure:0,time:.25,entries:[entry(note(62))]}]});h.service.playbackLoop();
 assert.deepEqual(kinds(h.events),['advance','cursor','frame']);assert.equal(h.frames.size,1);const [id,callback]=[...h.frames][0];h.frames.delete(id);callback(16);assert.equal(h.state.currentExpectedContext.timestamp,.25);
});
test('measure tempo is applied before note duration and beat scheduling',()=>{
 const h=harness({state:{mode:'realtime',playback:{right:true,left:false},speedPercent:.5},measures:[{TempoInBPM:180}]});h.service.playbackLoop();
 assert.equal(h.state.baseBpm,180);assert.deepEqual(h.events[0],['tempo',50]);assert.equal(h.events.find(e=>Array.isArray(e)&&e[0]==='audio')[2],600);
});
test('Pause preserves old event timers and sustain resources while clearing transient input',()=>{
 const h=harness({state:{mode:'realtime',ledOutputMode:'midi'}});h.service.playbackLoop();const id=h.nextTimer()[0];
 h.state.activeTimeouts=[500];h.state.sustainedVisuals=[{midi:60}];h.state.preExpectedHeldNotes.add(60);h.service.pausePlaybackFromToolbar();
 assert.equal(h.timers.has(id),true);assert.deepEqual(h.state.activeTimeouts,[500]);assert.equal(h.state.sustainedVisuals.length,1);assert.equal(h.state.preExpectedHeldNotes.size,0);
 const before=h.events.length;h.fire(id);assert.equal(h.events.length,before);assert.deepEqual(kinds(h.events).slice(-10),['cancel-viewport','transport-pause','clear-window','stop-wait','local-silence','midi-silence','clear-pulse','latency','button','wipe']);
});
test('original pending Realtime callback can advance after rapid Pause/Resume',()=>{
 const h=harness({state:{mode:'realtime'}});h.service.playbackLoop();const id=h.nextTimer()[0];h.service.pausePlaybackFromToolbar();h.state.isPlaying=true;
 const before=h.getStep();h.fire(id);assert.equal(h.getStep(),before+1);assert.equal(h.state.currentExpectedContext.timestamp,.25);
});
test('Reset seeks UI Loop minimum, zeros score, clears visuals and preserves pressed Map/Set identities',()=>{
 const h=harness({loopEnabled:true,loopMin:2,steps:[{measure:0,time:0,entries:[]},{measure:1,time:1,entries:[]},{measure:2,time:2,entries:[]}]});
 const held=h.state.heldCorrectNotes;held.set(60,1);h.state.score.correct=5;h.state.score.wrong=4;h.state.activeTimeouts=[100];h.service.resetPlaybackFromToolbar();
 assert.equal(h.getStep(),1);assert.deepEqual(h.state.score,{correct:0,wrong:0});assert.equal(h.state.heldCorrectNotes,held);assert.equal(held.size,0);assert.equal(h.state.activeTimeouts.length,0);
 assert.deepEqual(kinds(h.events).slice(-5),['clear-timer','wipe','keyboard-clear','hide-panels','button']);
});
test('loaded-score reset stops transport, keeps cursor position, resets score then visual state',()=>{
 const h=harness();h.setStep(1);h.state.score.correct=4;h.service.resetPlaybackForLoadedScore();assert.equal(h.getStep(),1);assert.equal(h.state.score.correct,0);
 assert.equal(kinds(h.events).includes('transport-stop'),true);assert.equal(kinds(h.events).includes('reset'),false);assert.deepEqual(kinds(h.events).slice(-4),['score','clear-feedback','wipe','keyboard-clear']);
});
test('Loop boundary waits full duration rather than anchor adjustment, grades before seek/restart',()=>{
 const h=harness({loopEnabled:true,loopMax:1,state:{mode:'realtime',anchorTime:9.7},steps:[{measure:0,time:0,entries:[entry(note(60))]},{measure:1,time:1,entries:[]}]});
 h.service.playbackLoop();assert.equal(h.nextTimer()[1].delay,2000);assert.equal(h.state.anchorTime,9.7);h.fire(h.nextTimer()[0]);
 const sequence=kinds(h.events);const i=sequence.indexOf('misses');assert.deepEqual(sequence.slice(i,i+7),['misses','transport-stop','reset','cursor','scroll','clear-feedback','wipe']);
 assert.equal(h.state.score.wrong,0);assert.equal(sequence.includes('transport-start'),true);assert.equal(h.state.isPlaying,true);
});
test('Loop restart count-in delays score reset and transport handoff',()=>{
 const h=harness({loopEnabled:true,loopMax:1,state:{mode:'realtime',loopCountInEnabled:true},steps:[{measure:0,time:0,entries:[entry(note(60))]},{measure:1,time:1,entries:[]}]});
 h.service.playbackLoop();h.fire(h.nextTimer()[0]);assert.equal(h.state.score.wrong,1);assert.equal(h.state.countInActive,true);assert.equal(h.countIns.length,1);
 h.finishCountIn();assert.equal(h.state.score.wrong,0);assert.equal(h.events.includes('transport-start'),true);
});
test('song end pauses then paints final cursor; enabled Loop end keeps original early return',()=>{
 const h=harness();h.setStep(2);h.service.playbackLoop();assert.equal(h.state.isPlaying,false);assert.deepEqual(kinds(h.events).slice(-2),['cursor','scroll']);
 const loop=harness({loopEnabled:true});loop.setStep(2);loop.service.playbackLoop();assert.equal(loop.events.length,0);assert.equal(loop.state.isPlaying,true);
});
test('Loop bound enforcement uses state bounds and real traversal rather than UI values',()=>{
 const h=harness({loopEnabled:true,loopMin:3,state:{looper:{min:2,max:2}},steps:[{measure:0,time:0,entries:[]},{measure:1,time:1,entries:[]},{measure:2,time:2,entries:[]}]});
 h.service.enforceLooperBounds();assert.equal(h.getStep(),1);assert.deepEqual(kinds(h.events),['reset','advance','cursor','scroll']);
});
test('Play waits for fullscreen/unlock, preserves viewport around timeline, then starts count-in',async()=>{
 let unlock;const h=harness({state:{isPlaying:false,fullscreenOnPlay:true},unlock:new Promise(resolve=>unlock=resolve),metroEnabled:true});
 const pending=h.service.startPlaybackFromToolbar();await new Promise(setImmediate);assert.deepEqual(kinds(h.events),['fullscreen','unlock']);assert.equal(h.state.isPlaying,false);
 unlock();await pending;assert.equal(h.state.isPlaying,true);assert.deepEqual(kinds(h.events).slice(-4),['timeline','preserve-end','latency','count-in']);
 h.finishCountIn();const sequence=kinds(h.events);assert.deepEqual(sequence.slice(sequence.indexOf('show'),sequence.indexOf('show')+5),['show','scroll','bpm','transport-start','start-wait']);
});
test('two Play requests while unlock is pending retain the original double count-in handoff',async()=>{
 let ready;const h=harness({state:{isPlaying:false},unlock:new Promise(resolve=>ready=resolve)});
 const first=h.service.startPlaybackFromToolbar(),second=h.service.startPlaybackFromToolbar();ready();await Promise.all([first,second]);assert.equal(h.countIns.length,2);
});
test('Pause during pending unlock keeps the original eventual start, while dispose invalidates it',async()=>{
 let ready;const h=harness({state:{isPlaying:false},unlock:new Promise(resolve=>ready=resolve)});const pending=h.service.startPlaybackFromToolbar();h.service.pausePlaybackFromToolbar();ready();await pending;assert.equal(h.state.isPlaying,true);
 let nextReady;const d=harness({state:{isPlaying:false},unlock:new Promise(resolve=>nextReady=resolve)});const next=d.service.startPlaybackFromToolbar();d.service.dispose();const before=d.events.length;nextReady();await next;assert.equal(d.state.isPlaying,false);assert.equal(d.events.length,before);
});
test('explicit dispose cancels owned event timers/frames, suppresses captured callbacks, and is idempotent',()=>{
 const h=harness({state:{mode:'realtime'}});h.service.playbackLoop();const callback=h.nextTimer()[1].callback;h.service.dispose();const before=h.events.length;
 callback();h.service.dispose();assert.equal(h.timers.size,0);assert.equal(h.events.length,before);
 const f=harness({steps:[{measure:0,time:0,entries:[]},{measure:0,time:.25,entries:[entry(note(60))]}]});f.service.playbackLoop();const frame=[...f.frames.values()][0];f.service.dispose();const length=f.events.length;frame(16);assert.equal(f.frames.size,0);assert.equal(f.events.length,length);
});
test('OSMD event projection retains captured entries after prefetch and keeps raw fallback distinct from tie length',()=>{
 const start=note(60,1,.25),continuation=note(60,1,.5);start.NoteTie={StartNote:start,Notes:[start,continuation]};
 const firstEntries=[entry(start)];const h=harness({steps:[{measure:0,time:0,entries:firstEntries},{measure:1,time:1,entries:[entry(note(62))]}]});
 const event=h.ports.score.readEvent();h.ports.score.advance();const projected=[...[...event.entries][0].notes][0];
 assert.equal(projected.midi,60);assert.equal(projected.combinedLengthWhole,.75);assert.equal(event.fallbackLengthWhole,.25);
 assert.equal(h.adapter.legacyEntriesForPlayback(event),firstEntries);assert.equal('halfTone'in projected,false);assert.equal('NoteTie'in projected,false);
 assert.equal(h.ports.score.getTimestamp(),1);assert.equal(event.isEmpty,false);
});
