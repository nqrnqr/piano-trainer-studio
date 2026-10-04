const test=require('node:test'),assert=require('node:assert/strict');
const {PianoTrainerPerformanceTrace:traceApi}=require('../../.cache/test-modules/score/performance-trace.js');
const {PianoTrainerPerformancePosition:positionApi}=require('../../.cache/test-modules/score/performance-position.js');
function iterator(events){let index=0;return {get EndReached(){return index>=events.length;},get CurrentMeasureIndex(){return events[index].measure;},get currentTimeStamp(){return {RealValue:events[index].time};},get CurrentRelativeInMeasureTimestamp(){return {RealValue:events[index].relative??0};},get CurrentEnrolledTimestamp(){return {RealValue:events[index].enrolled};},get JumpOccurred(){return !!events[index].jump;},moveToNext(){index++;}};}
test('single-event repeated measure has separate occurrences, structural identities and exact ordinals',()=>{
 const events=[{measure:0,time:0,enrolled:0},{measure:0,time:0,enrolled:.25,jump:true},{measure:1,time:.25,enrolled:.5}];
 const note={sourceNoteRef:{scoreRevision:1,id:'note-1'},staffIndex:0,structureKey:'0/0/0/0',midi:60,lengthWhole:.25,rest:false};
 const trace=traceApi.scan(iterator(events),()=>[note]);
 assert.deepEqual(trace.measures.map(m=>m.sourceMeasureIndex),[0,0,1]);assert.deepEqual(trace.steps.map(s=>s.measureOccurrenceId),[0,1,2]);
 assert.equal(trace.steps[0].notes[0].sourceNoteRef,trace.steps[1].notes[0].sourceNoteRef);
 assert.equal(trace.steps[0].source.sourceEventOrdinal,trace.steps[1].source.sourceEventOrdinal);
});
test('floating-point enrolled timestamps do not split a triplet measure; same-time structural events remain distinct',()=>{
 const events=[{measure:0,time:1,enrolled:1},{measure:0,time:1+1/3,relative:1/3,enrolled:1+1/3},{measure:0,time:1+2/3,relative:2/3,enrolled:1+2/3}];
 const trace=traceApi.scan(iterator(events),()=>[]);assert.equal(trace.measures.length,1);
 const same=traceApi.scan(iterator([{measure:0,time:0,enrolled:0},{measure:0,time:0,enrolled:0}]),(()=>{let i=0;return()=>[{structureKey:`grace-${i++}`}];})());
 assert.deepEqual(same.steps.map(step=>step.source.sourceEventOrdinal),[0,1]);
});
test('a stuck path raises an explicit error instead of returning a truncated complete score',()=>{
 const stuck=iterator([{measure:0,time:0,enrolled:0}]);stuck.moveToNext=()=>{};
 assert.throws(()=>traceApi.scan(stuck,()=>[],8),/exceeds 8 events/);
});
test('presentation identities advance only for official source steps or Loop; redraw/pause do not consume event IDs',()=>{
 const trace=traceApi.scan(iterator([{measure:0,time:0,enrolled:0},{measure:0,time:0,enrolled:.25,jump:true}]),()=>[]);
 let step=0,revision=1;const changes=[];const position=positionApi.create({getTrace:()=>trace,getTraceStepIndex:()=>step,getScoreRevision:()=>revision,changed:event=>changes.push(event)});
 position.navigate('load');const first=position.current();position.present();position.present();assert.equal(position.current(),first);assert.equal(changes.length,1);
 step=1;position.present();assert.equal(position.current().eventId,first.eventId+1);assert.equal(position.current().measureOccurrenceId,1);
 position.loop();step=0;position.present();assert.equal(position.current().loopIteration,1);assert.equal(position.current().reason,'loop');
 const loop=position.current();position.navigate('seek',10);assert.equal(position.current().runId,loop.runId+1);assert.equal(position.current().loopIteration,10);
 revision=2;position.present();assert.equal(position.current().scoreRevision,2);
});
