const test=require('node:test'),assert=require('node:assert/strict');
const {harness,plain,sourceNote,entry}=require('../helpers/practice-harness.cjs');
const reservation=(midi,measureIndex,timestamp,allowTapCarry=false)=>({midi,staffId:1,measureIndex,timestamp,allowTapCarry,beatsUntilTarget:1});
const visual=(midi,staffId=1,mIdx=0,extra={})=>({midi,staffId,mIdx,endTimestamp:null,durationMs:425,...extra});

test('same staff pitch dedup retains first identity and longest duration; a missing anchor adopts the later source ref',()=>{
    const h=harness();const first=sourceNote(60,{point:null}),second=sourceNote(60,{Length:{RealValue:.5}});
    h.build([entry(1,[first,second]),entry(2,[sourceNote(60)])]);
    assert.equal(h.state.expectedNotes.length,2);assert.equal(h.score.resolveNote(h.state.expectedNotes[0].noteRef),second);
    assert.equal(h.state.visualNotesToStart[0].durationMs,850);assert.equal(h.state.visualNotesToStart[0].endTimestamp,.425);
    first.point={x:95,y:200};h.build([entry(1,[first,second])]);
    assert.equal(h.score.resolveNote(h.state.expectedNotes[0].noteRef),first);
    assert.equal(h.logs.some(l=>l.name==='EXPECTED_NOTE_DEDUPE_COLLISION'),true);
});
test('hidden/cue/rest/tie continuations and non-practice staves are excluded before geometry; range entries dedup per staff',()=>{
    const h=harness({practice:{left:false,right:true}});h.setRange([60,70]);
    const start=sourceNote(64),continuation=sourceNote(64);continuation.NoteTie={StartNote:start};
    const hidden=sourceNote(66,{Notehead:'none',isRest(){throw Error('hidden rest read');}});
    const notes=[hidden,sourceNote(67,{PrintObject:false}),sourceNote(68,{isCueNote:true}),sourceNote(69,{isRest:()=>true}),continuation,
        sourceNote(59),sourceNote(59),sourceNote(71),sourceNote(60)];
    h.build([entry(1,notes),entry(2,[sourceNote(62,{isRest(){throw Error('unpracticed read');}})]),entry(3,[sourceNote(63)])]);
    assert.deepEqual(plain(h.state.expectedNotes.map(n=>n.midi)),[60]);
    assert.deepEqual(plain(h.state.outOfRangeCurrentNotes.map(n=>n.midi)),[59,71]);
    assert.equal(h.state.visualNotesToStart.length,1);
});
test('source projection skips array holes and preserves nullable staff assignment',()=>{
    const h=harness();const notes=[];notes[2]=sourceNote(60);const entries=[];entries[3]=entry(null,notes);
    const projected=[...h.score.readPracticeEntries(entries,e=>e.staffId)];
    assert.equal(projected.length,1);assert.equal(projected[0].staffId,null);
    const projectedNotes=[...projected[0].notes];assert.equal(projectedNotes.length,1);assert.equal(projectedNotes[0].midi,60);
    assert.equal(h.score.resolveNote(projectedNotes[0].noteRef),notes[2]);
});
test('tie traversal preserves explicit next links, Notes preference, same-pitch check and cycle termination',()=>{
    const h=harness();const a=sourceNote(60),b=sourceNote(60,{Length:{RealValue:.5}}),c=sourceNote(60,{Length:{RealValue:.75}});
    a.NoteTie={StartNote:a,NextNote:b};b.NoteTie={StartNote:a,nextNote:c};c.NoteTie={StartNote:a,NextNote:a};
    assert.equal(h.score.getCombinedTieLength(a),1.5);
    a.NoteTie.Notes=[a,b,c];b.NoteTie.Notes=[a,b,c];assert.equal(h.score.getCombinedTieLength(a),.75);
    b.halfTone=61;assert.equal(h.score.getCombinedTieLength(a),.25);
    b.halfTone=48;h.build([entry(1,[a,b,c])]);assert.equal(h.state.expectedNotes.length,1);
    assert.equal(h.state.visualNotesToStart[0].durationMs,1275);
    assert.equal(h.score.getCombinedTieLength(null),0);
});
test('duration units and Wait-only score expiry retain BPM/speed scaling and nullable timestamp semantics',()=>{
    const h=harness({baseBpm:60,speedPercent:.5});h.build([entry(1,[sourceNote(60,{Length:{RealValue:.5}})])],3,2);
    assert.equal(h.state.visualNotesToStart[0].durationMs,3400);assert.equal(h.state.visualNotesToStart[0].endTimestamp,2.425);
    h.state.mode='follow';h.build([entry(1,[sourceNote(60)])],0,1);assert.equal(h.state.visualNotesToStart[0].endTimestamp,null);
    h.state.mode='wait';h.build([entry(1,[sourceNote(60)])],0,null);assert.equal(h.state.visualNotesToStart[0].endTimestamp,null);
});
test('reservation consumption preserves cross-staff grading, per-note feedback then one display update',()=>{
    const h=harness();h.state.pressedKeys.add(60);h.state.earlyGraceReservations.set(60,reservation(60,1,.5));
    const map=h.state.earlyGraceReservations,held=h.state.heldCorrectNotes,pre=h.state.preExpectedHeldNotes;
    h.build([entry(1,[sourceNote(60)]),entry(2,[sourceNote(60)])],1,.5);
    assert.equal(h.state.score.correct,2);assert.equal(h.state.expectedNotes.every(n=>n.hit),true);
    assert.equal(h.state.heldCorrectNotes.get(60),2);assert.equal(h.state.preExpectedHeldNotes.has(60),true);
    assert.deepEqual(h.events.map(e=>e[0]),['overlay','overlay','score']);
    assert.equal(h.state.earlyGraceReservations,map);assert.equal(h.state.heldCorrectNotes,held);assert.equal(h.state.preExpectedHeldNotes,pre);
});
test('past and absent-target reservations clear while unreleased-only and future reservations follow original retention',()=>{
    const h=harness();h.state.earlyGraceReservations.set(60,reservation(60,0,0));
    h.state.earlyGraceReservations.set(61,reservation(61,1,.5));
    h.state.earlyGraceReservations.set(62,reservation(62,1,.5));
    h.state.earlyGraceReservations.set(63,reservation(63,2,0,true));
    h.state.realtimeWrongPressInCurrentContext=true;h.build([entry(1,[sourceNote(62)])],1,.5);
    assert.deepEqual([...h.state.earlyGraceReservations.keys()],[62,63]);assert.equal(h.state.expectedNotes[0].hit,false);
    assert.equal(h.state.realtimeWrongPressInCurrentContext,false);
    h.state.earlyGraceReservations.get(62).allowTapCarry=true;h.build([entry(1,[sourceNote(62)])],1,.5);
    assert.equal(h.state.expectedNotes[0].hit,true);assert.equal(h.state.score.correct,1);
});
test('misses grade every unhit staff separately and suppress only visuals after a realtime wrong press',()=>{
    const h=harness({mode:'realtime'});h.build([entry(1,[sourceNote(60),sourceNote(64)]),entry(2,[sourceNote(60)])]);
    h.state.expectedNotes[0].hit=true;h.events.length=0;h.scoring.processMissedNotes();
    assert.equal(h.state.score.wrong,2);assert.equal(h.state.releasedIncorrectFeedback.length,2);
    assert.deepEqual(h.events.map(e=>e[0]),['overlay','overlay','score']);
    h.state.realtimeWrongPressInCurrentContext=true;h.events.length=0;h.scoring.processMissedNotes();
    assert.equal(h.state.score.wrong,4);assert.deepEqual(h.events.map(e=>e[0]),['score']);
    assert.equal(h.state.expectedNotes[1].hit,false);
    h.state.mode='follow';h.scoring.processMissedNotes();assert.equal(h.state.releasedIncorrectFeedback.length,4);
});
test('feedback retains explicit measure key versus current context key, history identity and offscreen release data',()=>{
    const h=harness();h.state.currentExpectedContext={measureIndex:2,timestamp:1.5,signature:'x'};
    h.feedback.drawFeedbackNote(60,true,1,1,{x:30,y:40});
    assert.equal(h.state.correctFeedbackHistory[0].contextKey,'1|1.5');
    h.feedback.registerHeldIncorrectFeedback(70,2,1,{x:50,y:60});
    const marker=h.state.activeHeldIncorrectFeedback.get(70);assert.equal(marker.contextKey,'2|1.5');
    h.state.currentExpectedContext={measureIndex:3,timestamp:2,signature:'y'};h.feedback.releaseHeldIncorrectFeedback(70);
    assert.equal(h.state.releasedIncorrectFeedback[0],marker);assert.equal(marker.contextKey,'2|1.5');
    h.state.currentExpectedContext=null;h.renderer.cursor.Iterator.currentTimeStamp.RealValue=.25;
    assert.equal(h.feedback.getCurrentFeedbackContext().key,'0|0.25');
    assert.equal(h.feedback.getFeedbackContextKey(NaN,Infinity),'na|na');
});
test('feedback cleanup clears geometry before histories and debug while preserving score and expected identities',()=>{
    const h=harness();h.build([entry(1,[sourceNote(60)])]);h.input.receive(60,true);
    const expected=h.state.expectedNotes,score=h.state.score,heldMarkers=h.state.activeHeldIncorrectFeedback;
    h.state.realtimeWrongPressInCurrentContext=true;h.events.length=0;h.feedback.clearPreserveScoring();
    assert.deepEqual(h.events.map(e=>e[0]),['clear-overlay','clear-debug']);
    assert.equal(h.state.expectedNotes,expected);assert.equal(h.state.score,score);assert.equal(score.correct,1);
    assert.equal(h.state.activeHeldIncorrectFeedback,heldMarkers);assert.equal(h.state.correctFeedbackHistory.length,0);
    assert.equal(h.state.realtimeWrongPressInCurrentContext,false);
});
test('sustain same-measure duplicate suppression keeps cross-staff instances and timer cancellation ownership',()=>{
    const h=harness({mode:'realtime'});h.state.visualNotesToStart=[visual(60),visual(60),visual(60,2)];
    h.sustains.startVisualSustains();assert.equal(h.state.visualNotesToStart.length,0);assert.equal(h.state.sustainedVisuals.length,2);
    assert.equal(h.state.activeTimeouts.length,2);assert.deepEqual(h.events.map(e=>e[0]),['keyboard','timer','keyboard','timer']);
    const second=h.state.sustainedVisuals[1];h.fireTimer(h.state.activeTimeouts[0]);
    assert.equal(h.state.sustainedVisuals.length,1);assert.equal(h.state.sustainedVisuals[0],second);
});
test('cross-measure retrigger removes only the matching staff and restarts after the original 35ms gap',()=>{
    const h=harness({mode:'realtime'});const other=visual(60,2);h.state.sustainedVisuals=[visual(60),other];
    h.state.visualNotesToStart=[visual(60,1,1)];h.sustains.startVisualSustains();
    assert.equal(h.state.sustainedVisuals.length,1);assert.equal(h.state.sustainedVisuals[0],other);
    assert.equal(h.timers.get(h.state.activeTimeouts[0]).delay,35);
    h.fireTimer(h.state.activeTimeouts[0]);assert.equal(h.state.sustainedVisuals.length,2);
    assert.equal(h.state.sustainedVisuals[1].mIdx,1);assert.equal(h.state.activeTimeouts.length,2);
});
test('score-position sustain expiry uses strict boundary; Follow null expiry still uses wall-clock timer',()=>{
    const h=harness();h.state.visualNotesToStart=[visual(60,1,0,{endTimestamp:.5})];h.sustains.startVisualSustains();
    assert.equal(h.timers.size,0);h.sustains.pruneAtTimestamp(.4999);assert.equal(h.state.sustainedVisuals.length,1);
    h.sustains.pruneAtTimestamp(.5);assert.equal(h.state.sustainedVisuals.length,0);
    h.state.mode='follow';h.state.visualNotesToStart=[visual(62)];h.sustains.startVisualSustains();assert.equal(h.timers.size,1);
    h.sustains.pruneAtTimestamp(9);assert.equal(h.state.sustainedVisuals.length,1);
    h.state.mode='realtime';h.state.sustainedVisuals.push(visual(64,1,0,{endTimestamp:.1}));
    h.sustains.pruneAtTimestamp(9);assert.equal(h.state.sustainedVisuals.length,2);
});
test('held preview marking retains existing physical input and no longer requires keyboard DOM',()=>{
    const h=harness();h.state.heldCorrectNotes.set(60,1);h.sustains.markHeldPreview(60,'future1-r');
    h.sustains.markHeldPreview(61,'future1-r');h.sustains.markHeldPreview(60,'future2-r');
    assert.deepEqual([...h.state.preExpectedHeldNotes],[60]);assert.equal(h.events.length,0);
});
