const test=require('node:test'),assert=require('node:assert/strict');
const {harness,plain,sourceNote,entry}=require('../helpers/practice-harness.cjs');
const event=(timestamp,notes,extra={})=>({measureIndex:0,timestamp,signature:timestamp===0?'now':String(timestamp),notes,...extra});
const preview=(midi,staffId=1)=>({midi,staffId,state:'future1-r'});
const setupChord=()=>{const h=harness();h.build([entry(1,[sourceNote(60),sourceNote(64)])]);h.events.length=0;return h;};

test('partial chord grades before marking hit and advances only through the existing coordinator port',()=>{
    const h=setupChord();h.input.receive(60,true,'ui',73);
    assert.deepEqual(h.events.map(e=>e[0]),['audio-on','overlay','score','advance','keyboard']);
    assert.deepEqual(h.events[0],['audio-on',60,'ui',73,true]);
    assert.deepEqual(h.events.find(e=>e[0]==='score'),['score',{correct:1,wrong:0},[false,false]]);
    assert.deepEqual(h.events.find(e=>e[0]==='advance'),['advance',[true,false]]);
    assert.deepEqual(plain(h.state.expectedNotes.map(n=>n.hit)),[true,false]);
    h.input.receive(60,true,'ui');assert.deepEqual(h.state.score,{correct:1,wrong:0});
    h.input.receive(64,true,'midi');assert.deepEqual(h.state.score,{correct:2,wrong:0});
});
test('same pitch across staves consumes distinct identities by cursor distance and stable ties',()=>{
    const h=harness();const right=sourceNote(60,{point:{x:160,y:200}}),left=sourceNote(60,{point:{x:102,y:300}});
    h.build([entry(1,[right]),entry(2,[left])]);const refs=h.state.expectedNotes.map(n=>n.noteRef);
    assert.notEqual(refs[0],refs[1]);assert.equal(h.matching.findExpectedMatchForMidi(60).staffId,2);
    h.input.receive(60,true);h.input.receive(60,true);assert.equal(h.state.score.correct,2);
    assert.equal(h.state.expectedNotes.every(n=>n.hit),true);
    h.state.expectedNotes.forEach(n=>{n.hit=false;n.anchor={x:100,y:200};});
    assert.equal(h.matching.findExpectedMatchForMidi(60),h.state.expectedNotes[0]);
    h.setCursorX(null);assert.equal(h.matching.findExpectedMatchForMidi(60),h.state.expectedNotes[0]);
});
test('unanchored candidate uses cursor X and matching preserves diagnostics without mutating expectations',()=>{
    const h=harness({debugMatchLogs:true});h.build([entry(1,[sourceNote(60,{point:null})]),entry(2,[sourceNote(60,{point:{x:200,y:200}})])]);
    const before=plain(h.state.expectedNotes);assert.equal(h.matching.findExpectedMatchForMidi(60).staffId,1);
    assert.deepEqual(plain(h.state.expectedNotes),before);
    assert.deepEqual(h.logs.slice(-2).map(l=>l.name),['MATCH_CANDIDATES','MATCH_CHOSEN']);
});
test('wrong press records held feedback; release transfers history before audio off and clears held state',()=>{
    const h=setupChord();h.state.mode='realtime';h.input.receive(90,true,'midi',44);
    assert.equal(h.state.score.wrong,1);assert.equal(h.state.realtimeWrongPressInCurrentContext,true);
    const marker=h.state.activeHeldIncorrectFeedback.get(90);h.events.length=0;h.input.receive(90,false,'midi');
    assert.deepEqual(h.events.map(e=>e[0]),['overlay','audio-off','keyboard']);
    assert.equal(h.state.releasedIncorrectFeedback[0],marker);assert.equal(h.state.activeHeldIncorrectFeedback.size,0);
    assert.equal(h.state.pressedKeys.has(90),false);
});
test('feedback disabled still grades and releases; idle and no-practice input still monitor without grading',()=>{
    const h=setupChord();h.state.feedbackEnabled=false;h.input.receive(60,true);
    assert.equal(h.state.score.correct,1);assert.equal(h.state.correctFeedbackHistory.length,0);
    h.state.isPlaying=false;h.input.receive(91,true);assert.equal(h.state.score.wrong,0);
    h.state.isPlaying=true;h.state.practice={left:false,right:false};h.input.receive(92,true);
    assert.equal(h.state.score.wrong,0);assert.equal(h.state.pressedKeys.has(92),true);
});
test('calibration returns after audio and key selection; release still clears input and monitors off',()=>{
    const h=setupChord();h.state.ledCalibrationMode=true;h.input.receive(60,true,'ui',50);
    assert.deepEqual(h.events.map(e=>e[0]),['audio-on','calibration','keyboard']);
    assert.equal(h.state.score.correct,0);assert.equal(h.state.expectedNotes[0].hit,false);
    h.input.receive(60,false,'ui');assert.equal(h.state.pressedKeys.size,0);
});
test('unified MIDI input and virtual input produce identical matching and score transitions',()=>{
    const a=setupChord(),b=setupChord();a.input.receive(60,true,'ui',100);
    b.input.handle({kind:'note-on',note:60,velocity:100,source:'midi',channel:7,receivedAtMs:1000});
    assert.deepEqual(plain(a.state.expectedNotes),plain(b.state.expectedNotes));assert.deepEqual(a.state.score,b.state.score);
    b.input.handle({kind:'note-off',note:60,velocity:0,source:'midi',channel:7,receivedAtMs:1100});
    assert.equal(b.state.pressedKeys.size,0);
});
test('Follow released early tap survives intervening accompaniment events and scores only at its target',()=>{
    const h=harness({mode:'follow',practice:{left:false,right:true}});
    h.setTimeline([event(0,[preview(48,2)]),event(.25,[preview(50,2)]),event(.75,[preview(64)])]);
    h.input.receive(64,true);const reservation=h.state.earlyGraceReservations.get(64);
    assert.equal(reservation.allowTapCarry,true);assert.equal(reservation.beatsUntilTarget,3);
    assert.equal(h.state.score.correct,0);h.input.receive(64,false);assert.equal(h.state.earlyGraceReservations.get(64),reservation);
    h.build([entry(2,[sourceNote(50)])],0,.25);assert.equal(h.state.earlyGraceReservations.size,1);
    h.build([entry(1,[sourceNote(64)])],0,.75);assert.equal(h.state.expectedNotes[0].hit,true);
    assert.equal(h.state.score.correct,1);assert.equal(h.state.heldCorrectNotes.size,0);assert.equal(h.state.earlyGraceReservations.size,0);
});
test('Realtime upcoming held note reserves despite an incomplete chord and is discarded on release',()=>{
    const h=setupChord();h.state.mode='realtime';h.setTimeline([event(0,[preview(60)]),event(.25,[preview(67)])]);
    h.input.receive(67,true);const reservation=h.state.earlyGraceReservations.get(67);
    assert.equal(reservation.allowTapCarry,false);assert.equal(h.state.score.wrong,0);
    h.input.receive(67,false);assert.equal(h.state.earlyGraceReservations.size,0);
    h.build([entry(1,[sourceNote(67)])],0,.25);assert.equal(h.state.expectedNotes[0].hit,false);
});
test('holding an early realtime note through the next event consumes reservation and retains held membership',()=>{
    const h=harness({mode:'realtime'});h.setTimeline([event(0,[]),event(.25,[preview(67)])]);
    h.input.receive(67,true);h.build([entry(1,[sourceNote(67)])],0,.25);
    assert.equal(h.state.score.correct,1);assert.equal(h.state.expectedNotes[0].hit,true);
    assert.equal(h.state.heldCorrectNotes.get(67),1);assert.equal(h.state.preExpectedHeldNotes.has(67),true);
});
test('single-hand tap threshold and realtime lookahead keep their original beat boundaries',()=>{
    const h=harness({mode:'realtime',practice:{left:false,right:true}});
    h.setTimeline([event(0,[preview(60)]),event(.2625,[preview(64)])]);
    assert.equal(h.early.tryReserveSingleHandEarlyGrace(64).allowTapCarry,true);
    h.setTimeline([event(0,[preview(60)]),event(.2626,[preview(64)])]);
    assert.equal(h.early.tryReserveSingleHandEarlyGrace(64).allowTapCarry,false);
    h.setTimeline([event(0,[]),event(.275,[preview(65)])]);assert.ok(h.early.tryReserveRealtimeUpcomingHeldNote(65));
    h.setTimeline([event(0,[]),event(.2751,[preview(66)])]);assert.equal(h.early.tryReserveRealtimeUpcomingHeldNote(66),null);
});
test('nullable timeline timestamps retain legacy timing coercion through the early-grace port',()=>{
    const h=harness({mode:'realtime',practice:{left:false,right:true},currentExpectedContext:{measureIndex:0,timestamp:.25,signature:'now'}});
    h.setTimeline([{measureIndex:0,timestamp:.25,signature:'now',notes:[preview(60)]},event(null,[preview(64)])]);
    const info=h.early.findSingleHandPracticeTimelineWindow();
    assert.equal(h.early.getSingleHandPracticeBeatsUntilNextEvent(info),3);
    assert.equal(h.early.tryReserveSingleHandEarlyGrace(64).allowTapCarry,false);
});
test('single-hand grace requires all current expectations hit; realtime respects practiced staff and repeated occurrence index',()=>{
    const h=setupChord();h.state.mode='follow';h.state.practice={left:false,right:true};
    h.setTimeline([event(0,[preview(60)]),event(.25,[preview(64)])]);assert.equal(h.early.tryReserveSingleHandEarlyGrace(64),null);
    h.state.expectedNotes.forEach(n=>n.hit=true);assert.ok(h.early.tryReserveSingleHandEarlyGrace(64));
    h.state.mode='realtime';h.state.ledPreviewTraversalIndex=2;
    h.setTimeline([event(0,[]),event(.25,[preview(65)]),event(0,[]),event(.25,[preview(66,2)]),event(.25,[preview(67)])]);
    assert.equal(h.early.tryReserveRealtimeUpcomingHeldNote(65),null);assert.equal(h.early.tryReserveRealtimeUpcomingHeldNote(66),null);
    assert.equal(h.early.tryReserveRealtimeUpcomingHeldNote(67).midi,67);
});
test('already-hit re-press carries a Follow reservation while sustain-only input remains ungraded',()=>{
    const h=harness({mode:'follow',practice:{left:false,right:true}});h.build([entry(1,[sourceNote(60)])]);
    h.setTimeline([event(0,[preview(60)]),event(.5,[preview(60)])]);
    h.input.receive(60,true);h.input.receive(60,true);
    assert.equal(h.state.score.correct,1);assert.equal(h.state.earlyGraceReservations.get(60).timestamp,.5);
    h.state.expectedNotes=[];h.state.sustainedVisuals=[{midi:70,staffId:1,mIdx:0,endTimestamp:null}];
    h.input.receive(70,true);assert.equal(h.state.score.wrong,0);
});
