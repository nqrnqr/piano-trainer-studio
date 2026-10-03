const vm = require('node:vm');
const {runScript} = require('./legacy-script.cjs');
const plain = value => JSON.parse(JSON.stringify(value));
const sourceNote = (midi, extra = {}) => ({halfTone:midi-12, Length:{RealValue:.25},
    isRest:()=>false, point:{x:100,y:200}, ...extra});
const entry = (staffId, notes) => ({staffId,Notes:notes});
function harness(overrides = {}) {
    const context = vm.createContext({window:{}});
    for (const path of ['domain/timing','score/score-traversal','score/osmd-adapter',
        'practice/feedback-state','practice/scoring','practice/input-matching','practice/early-grace',
        'practice/expected-notes','practice/sustain-state','practice/input-controller']) {
        runScript(context,`js/generated/${path}.js`);
    }
    const api = name => vm.runInContext(name,context);
    const state = {mode:'wait',practice:{left:true,right:true},isPlaying:true,ledCalibrationMode:false,
        currentExpectedContext:{measureIndex:0,timestamp:0,signature:'now'},
        expectedNotes:[],visualNotesToStart:[],sustainedVisuals:[],outOfRangeCurrentNotes:[],
        baseBpm:120,speedPercent:1,score:{correct:0,wrong:0},realtimeWrongPressInCurrentContext:false,
        pressedKeys:new Set(),heldCorrectNotes:new Map(),preExpectedHeldNotes:new Set(),
        earlyGraceReservations:new Map(),ledPreviewTraversalIndex:0,debugMatchLogs:false,
        feedbackEnabled:true,activeHeldIncorrectFeedback:new Map(),releasedIncorrectFeedback:[],correctFeedbackHistory:[],activeTimeouts:[],
        ...overrides};
    const events = [], logs = [], debugFrames = [], timers = new Map();
    let nextTimer=0, cursorX=100, range=[21,108], timeline=[];
    const renderer={Sheet:{},cursor:{Iterator:{CurrentMeasureIndex:0,currentTimeStamp:{RealValue:0}},update(){}}};
    const score=api('PianoTrainerOsmdAdapter').create({getRenderer:()=>renderer,
        describeNote:()=>({}),describeGraphicalNote:()=>({}),debugLog(){},reportError(){}});
    const getHandRole=staff=>staff===1?'right':staff===2?'left':null;
    const isPracticeHandEnabled=staff=>getHandRole(staff)==='right'?state.practice.right:getHandRole(staff)==='left'&&state.practice.left;
    const debugLog=(name,detail)=>logs.push({name,detail});
    const renderKeyboard=()=>events.push(['keyboard',plain(state.score)]);
    const feedback=api('PianoTrainerFeedbackState').create({state,
        getTraversalPosition:()=>score.readPositions().traversal,
        resolveAnchor:(midi,staff,measure,anchor)=>anchor&&typeof anchor==='object'?anchor:{x:cursorX,y:200},
        renderOverlay:()=>events.push(['overlay',state.correctFeedbackHistory.length,state.releasedIncorrectFeedback.length,state.activeHeldIncorrectFeedback.size]),
        clearOverlay:()=>events.push(['clear-overlay']),clearDebug:()=>events.push(['clear-debug']),
        pushDebugFrame:frame=>debugFrames.push(frame)});
    const scoring=api('PianoTrainerScoring').create({state,feedback,
        updateDisplay:()=>events.push(['score',plain(state.score),plain(state.expectedNotes.map(n=>n.hit))])});
    const matching=api('PianoTrainerInputMatching').create({state,getCursorX:()=>cursorX,debugLog});
    const early=api('PianoTrainerEarlyGrace').create({state,getHandRole,isPracticeHandEnabled,
        getTimeline:()=>timeline,findTimelineIndex:api('PianoTrainerScoreTraversal').findMatchingTimelineIndex,
        getBeatsToWait:context.PianoTrainerTiming.getTraversalBeatsToWait,
        getMeasureTimingInfo:()=>({startTimestamp:0,actualLengthWhole:1})});
    const expected=api('PianoTrainerExpectedNotes').create({state,getHandRole,
        isMidiInRange:midi=>midi>=range[0]&&midi<=range[1],
        getAnchor:ref=>score.resolveNote(ref).point,
        describeNote:ref=>({midi:score.resolveNote(ref).halfTone+12}),feedback,scoring,
        getTraversalTimestamp:()=>score.readPositions().traversal?.timestampWhole??null,
        pushDebugFrame:frame=>debugFrames.push(frame),debugAnchor:debugLog,debugLog});
    const setTimer=(callback,delay)=>{const id=++nextTimer;timers.set(id,{callback,delay});events.push(['timer',delay]);return id;};
    const sustains=api('PianoTrainerSustainState').create({state,renderKeyboard,setTimer,clearTimer:id=>timers.delete(id)});
    const input=api('PianoTrainerInputController').create({state,matching,early,feedback,scoring,
        audio:{monitorNoteOn:(midi,source,velocity)=>events.push(['audio-on',midi,source,velocity,state.pressedKeys.has(midi)]),
            monitorNoteOff:(midi,source)=>events.push(['audio-off',midi,source,state.pressedKeys.has(midi)])},
        selectCalibration:midi=>events.push(['calibration',midi]),renderKeyboard,
        advanceAfterHit:()=>events.push(['advance',plain(state.expectedNotes.map(n=>n.hit))]),debugLog});
    const build=(entries,measure=0,time=0)=>expected.build(score.readPracticeEntries(entries,e=>e.staffId),measure,time);
    return {context,api,state,events,logs,debugFrames,timers,renderer,score,feedback,scoring,matching,early,expected,sustains,input,build,
        setCursorX:value=>cursorX=value,setRange:value=>range=value,setTimeline:value=>timeline=value,
        fireTimer(id){const timer=timers.get(id);timers.delete(id);timer.callback();}};
}
module.exports={harness,plain,sourceNote,entry};
