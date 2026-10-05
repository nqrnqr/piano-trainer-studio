const test=require('node:test'),assert=require('node:assert/strict');
const {PianoTrainerTraditionalScroll:P}=require('../../.cache/test-modules/render/traditional-scroll-policy.js');
const {buildSystemProgress}=require('../../.cache/test-modules/score/system-progress.js');
const {systemBoundsInContent}=require('../../.cache/test-modules/render/traditional-scroll-geometry.js');
const {PianoTrainerScoreViewport}=require('../../.cache/test-modules/render/score-viewport.js');
const base={height:600,scrollTop:0,maxScroll:1500,system:{top:400,bottom:560},cursor:{top:420,bottom:540}};
test('graphic system top docks higher at 6% of usable space, including both piano staves',()=>{
 const d=P.decide(base);assert.equal(d.dock,342.88);assert.equal(d.minimum,0);
 assert.ok(base.system.bottom-d.dock<=576);assert.ok(Math.abs(base.system.top-d.dock-(24+552*.06))<1e-8);
 assert.equal(P.decide({...base,topObstruction:100}).dock,271.44);
});
test('already docked or safely above docking never scrolls downward to align',()=>{
 for(const scrollTop of [342,343,350])assert.deepEqual(P.decide({...base,scrollTop}),{dock:scrollTop,minimum:scrollTop});
 assert.deepEqual(P.decide({...base,system:{top:5,bottom:150},cursor:{top:20,bottom:140}}),{dock:0,minimum:0});
});
test('full-system visibility wins, with natural first/last page limits',()=>{
 const d=P.decide({...base,system:{top:400,bottom:930}});assert.equal(d.dock,354);assert.equal(d.minimum,354);
 assert.equal(P.decide({...base,maxScroll:100}).dock,100);
});
test('missing/oversized geometry minimally follows painted cursor without oscillation',()=>{
 for(const system of [null,{top:10,bottom:1100}]) {
  const d=P.decide({...base,system,cursor:{top:710,bottom:850}});assert.equal(d.dock,274);
  assert.deepEqual(P.decide({...base,system,scrollTop:274,cursor:{top:710,bottom:850}}),{dock:274,minimum:274});
 }
 const tall={...base,system:null,cursor:{top:700,bottom:1500}};
 assert.equal(P.decide(tall).dock,676);assert.equal(P.decide({...tall,scrollTop:676}).dock,676);
 assert.equal(P.decide({...base,height:0}).dock,0);
});
test('targets track duration progress and dock sooner at 60%, independently of wall time',()=>{
 assert.equal(P.progressTarget(0,325,0),0);assert.equal(P.progressTarget(0,325,.12),65);
 assert.equal(P.progressTarget(0,325,.60),325);assert.equal(P.progressTarget(0,325,1),325);
 assert.equal(P.progressTarget(350,325,.5),350);
});
test('moving-target smoothing is bounded, monotonic and time based',()=>{
 let s=0;for(let i=0;i<200;i++){const next=P.approach(s,320,16.67);assert.ok(next>=s&&next<=320);s=next;}
 assert.equal(s,320);assert.ok(Math.abs(P.approach(P.approach(0,320,16),320,16)-P.approach(0,320,32))<1e-8);
});
const pos={scoreRevision:1,layoutRevision:1,systemId:0,traceStepIndex:3,measureIndex:0,timestampWhole:.75,occurrenceId:0,eventId:4,runId:1,loopIteration:0,reason:'advance'};
test('classification separates normal systems, reflow and all return identities',()=>{
 assert.equal(P.classify(pos,{...pos,systemId:1,measureIndex:1,traceStepIndex:4,timestampWhole:1,eventId:5,occurrenceId:1}),'adjacent');
 assert.equal(P.classify(pos,{...pos,eventId:5,traceStepIndex:4,timestampWhole:.875}),'same');
 assert.equal(P.classify(pos,{...pos,layoutRevision:2}),'visibility');
 for(const patch of [{timestampWhole:0,traceStepIndex:4},{occurrenceId:2,traceStepIndex:4},
  {measureIndex:-1},{traceStepIndex:0,eventId:null,reason:null},{eventId:5,reason:'seek'},
  {eventId:5,reason:'reset'},{eventId:5,reason:'loop',loopIteration:1}])assert.equal(P.classify(pos,{...pos,...patch}),'navigation');
});
const trace=entries=>({steps:entries.map(([measure,time,length=.25,occurrence=measure],i)=>({traceStepIndex:i,measureOccurrenceId:occurrence,
 source:{sourceMeasureIndex:measure,timestampWhole:time,sourceEventOrdinal:i},relativeTimestampWhole:time-measure,
 notes:[{lengthWhole:length},{lengthWhole:length}]})),measures:[]});
const profile=(extra={})=>buildSystemProgress({trace:trace([[0,0],[0,.25],[0,.5],[0,.75],[1,1]]),traceStepIndex:0,
 firstMeasureIndex:0,lastMeasureIndex:0,loopMax:null,getMeasureTimingInfo:i=>({startTimestamp:i,actualLengthWhole:1}),...extra});
test('progress counts elapsed musical durations once across simultaneous voices',()=>{
 const p=profile();assert.equal(p.totalBeats,4);assert.deepEqual(p.steps.map(s=>s.completedBeats),[0,1,2,3]);
 const uneven=profile({trace:trace([[0,0],[0,.125],[0,.75],[1,1]])});
 assert.deepEqual(uneven.steps.map(s=>s.completedBeats),[0,.5,3]);assert.equal(uneven.totalBeats,4);
});
test('weak upbeat, rests, tuplets and long notes use traversal waits, never note counts',()=>{
 assert.equal(profile({trace:trace([[0,0,1/12],[0,1/12],[0,.125],[1,.25]]),getMeasureTimingInfo:()=>({startTimestamp:0,actualLengthWhole:.25})}).totalBeats,1);
 assert.equal(profile({trace:trace([[0,0,2],[1,2]]),getMeasureTimingInfo:()=>({startTimestamp:0,actualLengthWhole:2})}).totalBeats,8);
 assert.equal(profile({trace:trace([[0,0,1]])}).totalBeats,4);
});
test('progress ends at this occurrence/Loop boundary and restarts at actual entry',()=>{
 const t=trace([[0,0,1],[1,1,1],[0,0,1,2],[1,1,1,3]]);
 assert.equal(profile({trace:t,lastMeasureIndex:1}).totalBeats,8);
 assert.equal(profile({trace:t,lastMeasureIndex:1,loopMax:0}).totalBeats,4);
 assert.equal(profile({trace:trace([[0,0],[0,.25],[0,0,.25,2]])}).totalBeats,4);
 assert.equal(profile({traceStepIndex:2}).totalBeats,2);
});
test('invalid progress disables interpolation without mutating independent trace',()=>{
 const t=trace([[0,0],[1,1]]),before=JSON.stringify(t);
 assert.equal(profile({trace:trace([[0,NaN],[1,1]])}),null);assert.equal(profile({traceStepIndex:100}),null);
 profile({trace:t});assert.equal(JSON.stringify(t),before);
});
test('CSS conversion includes page offsets, borders, zoom and scroll exactly once',()=>{
 const box={systemId:1,layoutRevision:8,pageIndex:2,firstMeasureIndex:2,lastMeasureIndex:4,left:10,right:100,top:20,bottom:120};
 const svg={getScreenCTM:()=>({a:1.5,b:0,c:0,d:1.5,e:40,f:900})};
 const area={scrollTop:200,scrollLeft:8,clientTop:2,clientLeft:3,getBoundingClientRect:()=>({left:20,top:100})};
 const d=systemBoundsInContent(box,svg,area);assert.equal(d.top,1028);assert.equal(d.bottom,1178);assert.equal(d.left,40);
 assert.equal(systemBoundsInContent(box,{getScreenCTM:()=>null},area),null);
});
function viewportHarness() {
 class Element {constructor(){this.style={};this.listeners=new Map();this.classList={toggle(){},add(){},remove(){}};}
 addEventListener(n,f){this.listeners.set(n,f);}removeEventListener(n,f){if(this.listeners.get(n)===f)this.listeners.delete(n);}}
 const area=new Element(),wrapper=new Element(),layout=new Element(),autoScroll=new Element();
 Object.assign(area,{scrollTop:0,scrollLeft:0,clientHeight:600,scrollHeight:2100,getBoundingClientRect:()=>({top:0,height:600}),scrollTo(o){this.scrollTop=o.top;}});autoScroll.checked=true;
 let position={...pos,traceStepIndex:0,eventId:1,timestampWhole:0},system={top:150,bottom:310,systemId:0,layoutRevision:1},reduced=false,id=0,paintedAvailable=true,mode='wait',fraction=0,moving=true,obstruction=0;
 const frames=new Map(),cancelled=[];let profiles=0;
 const lifecycle={visibilityState:'visible',addEventListener(n,f){this[n]=f;},removeEventListener(n){delete this[n];}};
 const viewport=PianoTrainerScoreViewport.create({elements:{area,wrapper,layout,autoScroll},score:{getDefaults:()=>({}),setLayout(){},isReady:()=>false,afterRender(){},getCursorElement:()=>null},
 state:{expectedNotes:[]},storage:{getItem:()=>null,setItem(){}},storageKey:'test',getSvg:()=>null,getAnchor(){},clearFeedbackPreserveScoring(){},renderScoreAndRefreshGeometry(){},
 requestFrame:f=>{frames.set(++id,f);return id;},cancelFrame:id=>{cancelled.push(frames.get(id));frames.delete(id);},prefersReducedMotion:()=>reduced,
 traditional:{read:()=>paintedAvailable?({position,system,cursor:{top:system.top+20,bottom:system.bottom-20},mode,topObstruction:obstruction}):null,
 buildProgress:()=>{profiles++;return {totalBeats:8,steps:Array.from({length:8},(_,i)=>({traceStepIndex:position.traceStepIndex+i,completedBeats:i,durationBeats:1}))};},
 readPlayback:()=>({fraction,moving}),lifecycle,isPlaying:()=>true}});
 viewport.init();viewport.autoScroll();
 const tick=time=>{const pending=[...frames.values()];frames.clear();pending.forEach(f=>f(time));};tick(0);
 const settle=start=>{for(let t=start;t<start+1800;t+=16)tick(t);};
 return {viewport,area,autoScroll,frames,cancelled,lifecycle,tick,settle,get profiles(){return profiles;},setReduced:v=>{reduced=v;},
 setClock:(f,m=true)=>{fraction=f;moving=m;},setMode:m=>{mode=m;},setObstruction:v=>{obstruction=v;},
 enter:(number,top=400)=>{fraction=0;position={...position,systemId:number,measureIndex:number,traceStepIndex:position.traceStepIndex+1,eventId:position.eventId+1,timestampWhole:number};system={...system,systemId:number,top,bottom:top+160};viewport.autoScroll();},
 seek:()=>{position={...position,systemId:1,measureIndex:1,traceStepIndex:4,eventId:position.eventId+1,runId:position.runId+1,timestampWhole:1,reason:'seek'};system={...system,systemId:1,top:400,bottom:560};viewport.autoScroll();},
 hidePainted:()=>{paintedAvailable=false;viewport.autoScroll();},
 note:()=>{fraction=0;position={...position,reason:'advance',traceStepIndex:position.traceStepIndex+1,eventId:position.eventId+1,timestampWhole:position.timestampWhole+.25};viewport.autoScroll();}};
}
test('system entry has no full settle; notes update targets without rebuilding baseline',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.settle(32);assert.equal(h.area.scrollTop,0);assert.equal(h.frames.size,0);
 const count=h.profiles;h.note();h.tick(1900);const a=h.viewport.readTraditionalState().animation;
 assert.equal(a.progress,.125);assert.ok(a.target>0&&a.target<a.dock);h.settle(1916);
 assert.equal(h.area.scrollTop,a.target);h.note();h.tick(3800);assert.ok(h.viewport.readTraditionalState().animation.target>a.target);
 assert.equal(h.profiles,count);assert.equal(h.frames.size,1);
});
test('Wait/Follow finish only the last committed segment then stop despite wall time',()=>{
 for(const mode of ['wait','follow']){const h=viewportHarness();h.setMode(mode);h.enter(1);h.tick(16);h.note();h.tick(32);h.settle(48);
 const s=h.area.scrollTop,a=h.viewport.readTraditionalState().animation;h.setClock(1);h.settle(2000);
 assert.equal(h.area.scrollTop,s);assert.equal(h.frames.size,0);assert.ok(s<a.dock);}
});
test('same-system duplicates keep one frame and one progress baseline',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.note();h.tick(32);const a=h.viewport.readTraditionalState().animation,c=h.profiles;
 h.viewport.autoScroll();h.viewport.autoScroll();assert.equal(h.frames.size,1);h.tick(48);
 assert.deepEqual(h.viewport.readTraditionalState().animation,a);assert.equal(h.profiles,c);h.settle(64);assert.equal(h.frames.size,0);
});
test('Realtime interpolates only the existing playback interval during a long note',()=>{
 const h=viewportHarness();h.setMode('realtime');h.enter(1);h.tick(16);
 h.setClock(.5);h.tick(32);const a=h.viewport.readTraditionalState().animation;assert.equal(a.progress,.0625);assert.ok(a.target>0);
 h.setClock(1,false);h.settle(48);const s=h.area.scrollTop;assert.equal(h.frames.size,0);h.settle(2000);assert.equal(h.area.scrollTop,s);
});
test('native device-pixel rounding at 144Hz cannot stall smoothing or retain an idle frame',()=>{
 const h=viewportHarness();let top=0;Object.defineProperty(h.area,'scrollTop',{get:()=>top,set:v=>{top=Math.round(v/.8)*.8;}});
 h.enter(1);h.tick(16);h.note();h.tick(23);for(let t=30;t<2400;t+=7)h.tick(t);
 assert.ok(Math.abs(h.area.scrollTop-h.viewport.readTraditionalState().animation.target)<=.4);assert.equal(h.frames.size,0);
});
test('manual scrollbar movement during animation cancels rather than pulling the user back',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.note();h.tick(32);h.area.scrollTop=100;h.tick(48);
 assert.equal(h.area.scrollTop,100);assert.equal(h.frames.size,0);h.viewport.autoScroll();h.tick(100);assert.equal(h.area.scrollTop,100);
});
test('re-enabling follow corrects a clipped system downward only as far as necessary',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.area.scrollTop=450;
 h.autoScroll.checked=false;h.autoScroll.listeners.get('change')();h.autoScroll.checked=true;h.autoScroll.listeners.get('change')();
 h.tick(32);h.settle(48);assert.equal(h.area.scrollTop,376);assert.equal(h.frames.size,0);
});
test('60% progress docks before row end, then subsequent commits hold',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);for(let i=0;i<6;i++){h.note();h.tick(32+i*16);}h.settle(150);
 assert.equal(h.area.scrollTop,342.88);h.note();h.tick(2000);h.settle(2016);assert.equal(h.area.scrollTop,342.88);assert.equal(h.frames.size,0);
});
test('rapid row changes take over actual position with no queue of old goals',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.note();h.tick(32);h.tick(100);const s=h.area.scrollTop;
 h.enter(2,750);h.tick(116);const a=h.viewport.readTraditionalState().animation;assert.equal(a.from,s);assert.equal(a.systemId,2);assert.equal(h.frames.size,1);
 h.settle(132);assert.equal(h.area.scrollTop,a.target);assert.ok(a.target<a.dock);
});
test('pause gates stale callbacks; resume and manual input rebase actual scroll',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.note();h.tick(32);h.tick(100);h.viewport.cancel();const stopped=h.area.scrollTop;
 h.cancelled.at(-1)(600);assert.equal(h.area.scrollTop,stopped);assert.equal(h.frames.size,0);
 h.viewport.autoScroll();h.tick(700);assert.equal(h.viewport.readTraditionalState().animation.from,stopped);assert.equal(h.frames.size,0);
 h.area.listeners.get('wheel')();h.area.scrollTop=20;h.viewport.autoScroll();h.tick(800);assert.equal(h.area.scrollTop,20);assert.equal(h.frames.size,0);
 h.note();h.tick(900);assert.equal(h.viewport.readTraditionalState().animation.from,20);
});
test('toggle, reflow and reduced motion preserve progress semantics and cancel old frames',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.note();h.tick(32);h.tick(100);const s=h.area.scrollTop;
 h.viewport.beforeRender();h.area.scrollTop=0;h.viewport.afterRender();h.tick(200);assert.equal(h.area.scrollTop,s);assert.equal(h.frames.size,0);
 h.autoScroll.checked=false;h.autoScroll.listeners.get('change')();h.autoScroll.checked=true;h.autoScroll.listeners.get('change')();h.tick(300);assert.equal(h.area.scrollTop,s);
 h.setReduced(true);h.note();h.tick(400);const a=h.viewport.readTraditionalState().animation;assert.equal(h.area.scrollTop,a.target);assert.ok(a.target<a.dock);assert.equal(h.frames.size,0);
});
test('returns retain legacy navigation and discard outgoing progress',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.note();h.tick(32);h.seek();h.tick(48);
 assert.equal(h.area.scrollTop,360);assert.equal(h.viewport.readTraditionalState().lastKind,'navigation');assert.equal(h.viewport.readTraditionalState().animation.progress,0);
});
test('navigation cannot start a second graphic safety correction during a return/count-in',()=>{
 const h=viewportHarness();h.area.scrollTop=360;h.setObstruction(100);h.seek();h.tick(16);h.settle(32);
 assert.equal(h.area.scrollTop,360);assert.equal(h.frames.size,0);assert.equal(h.viewport.readTraditionalState().animation.progress,0);
 h.note();h.tick(1900);assert.ok(h.viewport.readTraditionalState().animation.progress>0);
});
test('missing painted cursor, visibility and dispose own no late writes/listeners',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);h.note();h.tick(32);h.hidePainted();h.tick(100);const s=h.area.scrollTop;
 assert.equal(h.frames.size,0);h.tick(500);assert.equal(h.area.scrollTop,s);
 h.lifecycle.visibilityState='hidden';h.lifecycle.visibilitychange();assert.equal(h.frames.size,0);
 h.viewport.dispose();assert.equal(h.area.listeners.size,0);assert.equal(h.lifecycle.visibilitychange,undefined);
});
