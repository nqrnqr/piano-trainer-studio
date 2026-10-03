const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {runScript} = require('../helpers/legacy-script.cjs');

function harness(events, {practice = {left:true, right:true}, range = [21,108]} = {}) {
    const context = vm.createContext({});
    runScript(context, 'js/generated/score/score-traversal.js');
    const api = vm.runInContext('PianoTrainerScoreTraversal', context);
    let index = 0, moves = 0, updates = 0;
    const cursor = {
        Iterator: {
            get EndReached() { return index >= events.length; },
            get CurrentMeasureIndex() { return events[index]?.measure ?? -1; },
            get currentTimeStamp() { return events[index] ? {RealValue:events[index].time} : undefined; },
            get CurrentVoiceEntries() { return events[index]?.entries; },
            moveToNext() { index++; moves++; }
        },
        reset() { index = 0; }, update() { updates++; }
    };
    const state = {ledPreviewTimeline:[], ledPreviewTimelineDirty:true, ledPreviewTraversalIndex:-1,
        isPlaying:true, countInActive:false};
    const logs = [];
    const service = api.create({state, getCursor:()=>cursor,
        resolveStaffId: note=>note.ParentStaff?.id ?? null,
        isPracticeHandEnabled: staff=>staff === 0 ? practice.left : staff === 1 && practice.right,
        getHandRole: staff=>staff === 0 ? 'left' : staff === 1 ? 'right' : null,
        isMidiInRange: midi=>midi >= range[0] && midi <= range[1],
        debugLog: (name, detail)=>logs.push({name,detail})});
    return {api, service, state, context, cursor, logs,
        setIndex(value) {index=value;}, get index() {return index;}, get moves() {return moves;}, get updates() {return updates;}};
}
const note = (midi, staff = 1, extra = {}) => ({halfTone:midi-12, ParentStaff:{id:staff}, Length:{RealValue:0.25}, ...extra});
const event = (measure, time, notes) => ({measure,time,entries:[{Notes:notes}]});
const plain = value => JSON.parse(JSON.stringify(value));

test('timeline follows repeated OSMD events, skips empty voice entries and restores actual prefetch position', () => {
    const events = [event(0,0,[note(60)]),event(0,0.25,[note(62)]),{measure:0,time:0.5,entries:[]},
        event(1,1,[note(64)]),event(0,0,[note(60)]),event(0,0.25,[note(62)]),event(2,2,[note(65)])];
    const h = harness(events);
    h.setIndex(3);
    const timeline = h.service.ensurePreviewTimelineBuilt();
    assert.deepEqual(plain(timeline.map(x=>[x.measureIndex,x.timestamp])), [[0,0],[0,0.25],[1,1],[0,0],[0,0.25],[2,2]]);
    assert.equal(h.index,3);
    assert.equal(h.updates,1);
    assert.equal(h.state.ledPreviewTraversalIndex,-1);
    const moves = h.moves;
    assert.equal(h.service.ensurePreviewTimelineBuilt(),timeline);
    assert.equal(h.moves,moves);
    // Preserve the old first-occurrence restore rule; do not repair it during migration.
    h.setIndex(5);
    h.state.ledPreviewTimelineDirty = true;
    h.service.ensurePreviewTimelineBuilt();
    assert.equal(h.index,1);
});

test('preview filters hidden, cue, rest, tie continuation, hand and range without collapsing same pitch across staves', () => {
    const attack = note(65);
    const continuation = note(65,1,{NoteTie:{StartNote:attack}});
    const notes = [note(60,0),note(60,1),note(60,1),note(62,1,{Notehead:'none'}),
        note(63,1,{PrintObject:false}),note(64,1,{isCueNote:true}),note(66,1,{isRest:()=>true}),
        continuation,attack,note(110)];
    const h = harness([event(0,0,notes)]);
    assert.deepEqual(plain(h.service.ensurePreviewTimelineBuilt()[0].notes), [
        {midi:60,staffId:0,state:'future1-l'}, {midi:60,staffId:1,state:'future1-r'}, {midi:65,staffId:1,state:'future1-r'}]);
    const rightOnly = harness([event(0,0,notes)],{practice:{left:false,right:true},range:[61,108]});
    assert.deepEqual(plain(rightOnly.service.ensurePreviewTimelineBuilt()[0].notes.map(n=>n.midi)),[65]);
});

test('signature retains rest/tie/length/staff data, sort order and duplicate notes', () => {
    const h = harness([]);
    const start = note(60,1), tie = note(60,1,{NoteTie:{StartNote:start}});
    const notes = [tie,note(48,0,{isRest:()=>true}),start,start];
    const signature = h.api.makeEntrySignature([{Notes:notes}]);
    assert.equal(signature,'0:48:0.25:attack:rest|1:60:0.25:attack:note|1:60:0.25:attack:note|1:60:0.25:tiecont:note');
    assert.equal(h.api.makeEntrySignature([{Notes:[...notes].reverse()}]),signature);
});

test('index resolution reuses current occurrence, searches forward then restarts; lookahead skips nonattacks', () => {
    const a = event(0,0,[note(60)]), rest = event(0,0.25,[note(0,1,{isRest:()=>true})]);
    const b = event(1,1,[note(64)]);
    const h = harness([a,rest,b,a,event(2,2,[note(65)])]);
    assert.equal(h.service.resolveTraversalIndex(a.entries,0,0),0);
    assert.equal(h.service.resolveTraversalIndex(a.entries,0,0),0);
    assert.equal(h.service.resolveTraversalIndex(b.entries,1,1),2);
    assert.equal(h.service.resolveTraversalIndex(a.entries,0,0),3);
    assert.equal(h.service.resolveTraversalIndex(b.entries,1,1),2);
    h.state.ledPreviewTraversalIndex = 0;
    assert.deepEqual(plain(h.service.collectFuturePreviewEvents(a.entries,0,0,2).map(x=>[x.measureIndex,x.notes[0].state])),
        [[1,'future1-r'],[0,'future2-r']]);
    assert.equal(h.service.collectFuturePreviewEvents(rest.entries,0,0.25,2).length,0);
    h.state.countInActive=true;
    assert.equal(h.service.collectFuturePreviewEvents(a.entries,0,0,1).length,0);
});

test('absent cursor leaves timeline dirty and empty; stuck iterator preserves traversal safety limit', () => {
    const h = harness([]);
    const missing = h.api.create({state:h.state,getCursor:()=>null});
    assert.equal(missing.ensurePreviewTimelineBuilt().length,0);
    assert.equal(h.state.ledPreviewTimelineDirty,true);
    let moves = 0;
    h.cursor.Iterator.moveToNext = () => moves++;
    Object.defineProperty(h.cursor.Iterator,'EndReached',{get:()=>false});
    h.service.ensurePreviewTimelineBuilt();
    assert.equal(moves,100000);
    assert.equal(h.state.ledPreviewTimelineDirty,false);
});

test('single-hand early input uses shared timeline with no LED globals or output', () => {
    const h = harness([event(0,0,[note(48,0)]),event(0,0.25,[note(50,0)]),event(0,0.5,[note(60,1)])],
        {practice:{left:false,right:true}});
    Object.assign(h.state,{practice:{left:false,right:true},expectedNotes:[], mode:'follow',
        currentExpectedContext:{measureIndex:0,timestamp:0,signature:h.api.makeEntrySignature([{Notes:[note(48,0)]}])},
        earlyGraceReservations:new Map(),heldCorrectNotes:new Map(),preExpectedHeldNotes:new Set()});
    Object.assign(h.context,{AppState:h.state,ensureLedPreviewTimelineBuilt:h.service.ensurePreviewTimelineBuilt,
        findMatchingLedPreviewTimelineIndex:h.api.findMatchingTimelineIndex,
        getAssignedHandRoleForStaff:staff=>staff === 0 ? 'left':'right',
        getMeasureTimingInfo:()=>({duration:1})});
    h.context.window = {};
    runScript(h.context,'js/generated/domain/timing.js');
    runScript(h.context, 'js/generated/practice/early-grace.js');
    const early = vm.runInContext('PianoTrainerEarlyGrace', h.context).create({
        state: h.state, getTimeline: h.service.ensurePreviewTimelineBuilt,
        findTimelineIndex: h.api.findMatchingTimelineIndex,
        getHandRole: h.context.getAssignedHandRoleForStaff, isPracticeHandEnabled: staff => staff === 1,
        getBeatsToWait: h.context.PianoTrainerTiming.getTraversalBeatsToWait,
        getMeasureTimingInfo: h.context.getMeasureTimingInfo
    });
    const reservation = early.tryReserveSingleHandEarlyGrace(60);
    assert.equal(reservation.timestamp,0.5);
    assert.equal(reservation.allowTapCarry,true);
    assert.equal(h.state.heldCorrectNotes.get(60),1);
    assert.equal(h.state.preExpectedHeldNotes.has(60),true);
    assert.equal(h.state.earlyGraceReservations.get(60),reservation);
});
