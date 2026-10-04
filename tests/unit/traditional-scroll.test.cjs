const test=require('node:test'),assert=require('node:assert/strict');
const {PianoTrainerTraditionalScroll:P}=require('../../.cache/test-modules/render/traditional-scroll-policy.js');
const {estimateSystemSeconds}=require('../../.cache/test-modules/score/system-duration.js');
const {systemBoundsInContent}=require('../../.cache/test-modules/render/traditional-scroll-geometry.js');
const {PianoTrainerScoreViewport}=require('../../.cache/test-modules/render/score-viewport.js');
const base={kind:'adjacent',height:600,scrollTop:0,maxScroll:1500,system:{top:400,bottom:560},cursor:{top:420,bottom:540},mode:'realtime',lineSeconds:4};
test('a fully visible new piano system below the reading band settles to 30%',()=>{
 const d=P.decide(base);assert.equal(d.kind,'animate');assert.equal(d.target,220);assert.equal(d.durationMs,800);
 assert.ok(base.system.bottom-d.target<=576);assert.ok(base.system.top-d.target>=24);
});
test('reading band and safe content above it hold without backward centering',()=>{
 for(const top of [170,210,80])assert.equal(P.decide({...base,system:{top,bottom:top+130},cursor:{top,bottom:top+130}}).kind,'hold');
 assert.equal(P.decide({...base,kind:'same'}).kind,'hold');assert.equal(P.decide({...base,kind:'visibility'}).kind,'hold');
});
test('full-system safety wins over band center, first and last page clamp to legal range',()=>{
 const d=P.decide({...base,system:{top:400,bottom:930}});assert.equal(d.target,354);
 assert.equal(P.decide({...base,maxScroll:100}).target,100);
 assert.equal(P.decide({...base,system:{top:5,bottom:150},cursor:{top:20,bottom:140}}).kind,'hold');
});
test('missing and oversized system geometry use minimum cursor movement without oscillation',()=>{
 for(const system of [null,{top:10,bottom:1100}]) {
  const d=P.decide({...base,system,cursor:{top:710,bottom:850}});assert.equal(d.target,274);assert.equal(d.durationMs,400);
  assert.equal(P.decide({...base,system,scrollTop:274,cursor:{top:710,bottom:850}}).kind,'hold');
 }
 const tall={...base,system:null,cursor:{top:700,bottom:1500}};
 const d=P.decide(tall);assert.equal(d.target,676);assert.equal(P.decide({...tall,scrollTop:d.target}).kind,'hold');
 assert.equal(P.decide({...base,height:0}).kind,'hold');
});
test('three pixel hysteresis avoids jitter near the band, safe edges and target',()=>{
 assert.equal(P.decide({...base,system:{top:212,bottom:340}}).kind,'hold');
 assert.equal(P.decide({...base,scrollTop:218}).kind,'hold');
 assert.equal(P.decide({...base,system:{top:22,bottom:578},cursor:{top:40,bottom:530}}).kind,'hold');
});
test('measured overlay obstruction raises the top safety limit',()=>{
 const d=P.decide({...base,topObstruction:100,system:{top:80,bottom:560},cursor:{top:110,bottom:500}});
 assert.equal(d.kind,'hold');
 const e=P.decide({...base,topObstruction:100,system:{top:400,bottom:870}});assert.equal(e.target,294);
});
test('Wait and invalid estimates use 650ms, other modes use 20% bounded to 400–1200ms',()=>{
 for(const t of [1,4,100,null,NaN,Infinity,-1,0])assert.equal(P.duration('wait',t),650);
 for(const mode of ['follow','realtime']) {
  assert.equal(P.duration(mode,1),400);assert.equal(P.duration(mode,4),800);assert.equal(P.duration(mode,10),1200);
  for(const t of [null,NaN,Infinity,-1,0])assert.equal(P.duration(mode,t),650);
 }
});
const pos={scoreRevision:1,layoutRevision:1,systemId:0,traceStepIndex:3,measureIndex:0,timestampWhole:.75,occurrenceId:0,eventId:4,runId:1,loopIteration:0,reason:'advance'};
test('classification recognizes adjacent rows independently of leftward cursor resets',()=>{
 assert.equal(P.classify(pos,{...pos,systemId:1,measureIndex:1,traceStepIndex:4,timestampWhole:1,eventId:5,occurrenceId:1}),'adjacent');
 assert.equal(P.classify(pos,{...pos,eventId:5,traceStepIndex:4,timestampWhole:.875}),'same');
 assert.equal(P.classify(pos,{...pos,layoutRevision:2}),'visibility');
 assert.equal(P.classify(pos,{...pos,systemId:3,measureIndex:20,traceStepIndex:80}),'visibility');
});
test('same-system and cross-system repeats, explicit seek/reset and early Loop resets keep navigation semantics',()=>{
 for(const patch of [{timestampWhole:0,traceStepIndex:4},{measureIndex:0,occurrenceId:2,traceStepIndex:4},
  {systemId:0,measureIndex:-1,traceStepIndex:4},{traceStepIndex:0,eventId:null,reason:null},
  {eventId:5,reason:'seek'},{eventId:5,reason:'reset'},{eventId:5,reason:'loop',loopIteration:1}]) {
  assert.equal(P.classify(pos,{...pos,...patch}),'navigation');
 }
 assert.equal(P.classify(pos,pos),'same');
 assert.equal(P.decide({...base,kind:'navigation'}).kind,'legacy');
});
const trace=(entries)=>({steps:entries.map(([measure,time,length=.25,occurrence=measure],i)=>({traceStepIndex:i,measureOccurrenceId:occurrence,
 source:{sourceMeasureIndex:measure,timestampWhole:time,sourceEventOrdinal:i},relativeTimestampWhole:time-measure,
 notes:[{lengthWhole:length},{lengthWhole:length}]})),measures:[]});
const estimate=(extra={})=>estimateSystemSeconds({trace:trace([[0,0],[0,.25],[0,.5],[0,.75],[1,1]]),traceStepIndex:0,
 firstMeasureIndex:0,lastMeasureIndex:0,loopMax:null,baseBpm:60,speed:1,getTempo:()=>undefined,
 getMeasureTimingInfo:i=>({startTimestamp:i,actualLengthWhole:1}),...extra});
test('duration counts simultaneous voices once and applies the speed multiplier once',()=>{
 assert.equal(estimate(),4);assert.equal(estimate({speed:2}),2);assert.equal(estimate({baseBpm:120}),2);
 assert.equal(P.duration('follow',estimate()),800);assert.equal(P.duration('follow',estimate({speed:2})),400);
});
test('weak upbeat, rests, dotted/tuplet offsets and cross-line long duration follow actual timestamps',()=>{
 assert.equal(estimate({trace:trace([[0,0,1/12],[0,1/12],[0,.125],[1,.25]]),getMeasureTimingInfo:()=>({startTimestamp:0,actualLengthWhole:.25})}),1);
 assert.equal(estimate({trace:trace([[0,0,2],[1,2]]),getMeasureTimingInfo:()=>({startTimestamp:0,actualLengthWhole:2})}),8);
 // EndReached has no outgoing event: use the existing remaining-measure rule.
 assert.equal(estimate({trace:trace([[0,0,1]])}),4);
});
test('tempo changes and Loop boundary use only this occurrence before it leaves the system',()=>{
 const t=trace([[0,0,1],[1,1,1],[0,0,1,2],[1,1,1,3]]);
 assert.equal(estimate({trace:t,lastMeasureIndex:1,getTempo:i=>i===1?120:60}),6);
 assert.equal(estimate({trace:t,lastMeasureIndex:1,loopMax:0}),4);
 const same=trace([[0,0],[0,.25],[0,0,.25,2]]);assert.equal(estimate({trace:same}),4);
});
test('duration rejects unusable data and never mutates the independent trace',()=>{
 const t=trace([[0,0],[1,1]]),before=JSON.stringify(t);
 assert.equal(estimate({trace:t,speed:NaN}),null);assert.equal(estimate({trace:t,baseBpm:0}),null);
 assert.equal(estimate({trace:trace([[0,NaN],[1,1]])}),null);assert.equal(JSON.stringify(t),before);
});
test('CSS conversion includes page offsets, borders, zoom and scroll exactly once',()=>{
 const box={systemId:1,layoutRevision:8,pageIndex:2,firstMeasureIndex:2,lastMeasureIndex:4,left:10,right:100,top:20,bottom:120};
 const svg={getScreenCTM:()=>({a:1.5,b:0,c:0,d:1.5,e:40,f:900})};
 const area={scrollTop:200,scrollLeft:8,clientTop:2,clientLeft:3,getBoundingClientRect:()=>({left:20,top:100})};
 const d=systemBoundsInContent(box,svg,area);assert.equal(d.top,1028);assert.equal(d.bottom,1178);assert.equal(d.left,40);
 assert.equal(d.layoutRevision,8);assert.equal(d.pageIndex,2);
 assert.equal(systemBoundsInContent(box,{getScreenCTM:()=>null},area),null);
});
test('finite smoothstep is monotonic, bounded and independent of refresh rate',()=>{
 let last=50;for(let t=0;t<=800;t+=8){const value=P.interpolate(50,300,t,650);assert.ok(value>=last&&value<=300);last=value;}
 assert.equal(P.interpolate(50,300,650,650),300);assert.equal(P.interpolate(50,300,325,650),175);
});
function viewportHarness() {
 class Element {constructor(){this.style={};this.listeners=new Map();this.classList={toggle(){},add(){},remove(){}};}
 addEventListener(n,f){this.listeners.set(n,f);}removeEventListener(n,f){if(this.listeners.get(n)===f)this.listeners.delete(n);}}
 const area=new Element(),wrapper=new Element(),layout=new Element(),autoScroll=new Element();
 Object.assign(area,{scrollTop:0,scrollLeft:0,clientHeight:600,scrollHeight:2100,getBoundingClientRect:()=>({top:0,height:600}),scrollTo(o){this.scrollTop=o.top;}});autoScroll.checked=true;
 let position={...pos,traceStepIndex:0,eventId:1,timestampWhole:0},system={top:150,bottom:310,systemId:0,layoutRevision:1},seconds=4,reduced=false,id=0,playing=true,paintedAvailable=true;
 const frames=new Map(),cancelled=[];let estimates=0;
 const lifecycle={visibilityState:'visible',addEventListener(n,f){this[n]=f;},removeEventListener(n){delete this[n];}};
 const viewport=PianoTrainerScoreViewport.create({elements:{area,wrapper,layout,autoScroll},score:{getDefaults:()=>({}),setLayout(){},isReady:()=>false,afterRender(){},getCursorElement:()=>null},
 state:{expectedNotes:[]},storage:{getItem:()=>null,setItem(){}},storageKey:'test',getSvg:()=>null,getAnchor(){},clearFeedbackPreserveScoring(){},renderScoreAndRefreshGeometry(){},
 requestFrame:f=>{frames.set(++id,f);return id;},cancelFrame:id=>{cancelled.push(frames.get(id));frames.delete(id);},prefersReducedMotion:()=>reduced,
 traditional:{read:()=>paintedAvailable?({position,system,cursor:{top:system.top+20,bottom:system.bottom-20},mode:'wait',topObstruction:0}):null,estimateSeconds:()=>{estimates++;return seconds;},lifecycle,isPlaying:()=>playing}});
 viewport.init();viewport.autoScroll();
 const tick=time=>{const pending=[...frames.values()];frames.clear();pending.forEach(f=>f(time));};tick(0);
 return {viewport,area,autoScroll,frames,cancelled,lifecycle,tick,get estimates(){return estimates;},setReduced:v=>{reduced=v;},
 enter:(number,top=400)=>{position={...position,systemId:number,measureIndex:number,traceStepIndex:position.traceStepIndex+1,eventId:position.eventId+1,timestampWhole:number};system={...system,systemId:number,top,bottom:top+160};viewport.autoScroll();},
 seek:()=>{position={...position,systemId:1,measureIndex:1,traceStepIndex:4,eventId:position.eventId+1,runId:position.runId+1,timestampWhole:1,reason:'seek'};system={...system,systemId:1,top:400,bottom:560};viewport.autoScroll();},
 hidePainted:()=>{paintedAvailable=false;viewport.autoScroll();},
 note:()=>{position={...position,traceStepIndex:position.traceStepIndex+1,eventId:position.eventId+1,timestampWhole:position.timestampWhole+.25};viewport.autoScroll();}};
}
test('one vertical sequence keeps its deadline through duplicate notifications and same-system notes',()=>{
 const h=viewportHarness();h.enter(1);h.tick(16);const animation=h.viewport.readTraditionalState().animation;
 h.viewport.autoScroll();h.viewport.autoScroll();assert.equal(h.frames.size,1);h.tick(216);h.note();h.tick(416);
 assert.deepEqual(h.viewport.readTraditionalState().animation,animation);assert.equal(h.estimates,1);
 h.tick(666);assert.equal(h.area.scrollTop,220);assert.equal(h.frames.size,0);h.note();h.tick(1000);assert.equal(h.frames.size,0);
});
test('a faster new row retargets from actual current position without queueing old goals',()=>{
 const h=viewportHarness();h.enter(1);h.tick(20);h.tick(220);const current=h.area.scrollTop;
 h.enter(2,750);h.tick(236);const animation=h.viewport.readTraditionalState().animation;
 assert.equal(animation.from,current);assert.equal(animation.target,570);assert.equal(h.frames.size,1);
 h.tick(886);assert.equal(h.area.scrollTop,570);assert.equal(h.frames.size,0);
});
test('pause cancellation gates stale callbacks, resume checks current row, user wheel does not reclaim same event',()=>{
 const h=viewportHarness();h.enter(1);h.tick(20);h.tick(220);h.viewport.cancel();const stopped=h.area.scrollTop;
 h.cancelled.at(-1)(600);assert.equal(h.area.scrollTop,stopped);assert.equal(h.frames.size,0);
 h.viewport.autoScroll();h.tick(700);assert.equal(h.frames.size,1);h.area.listeners.get('wheel')();
 h.viewport.autoScroll();h.tick(800);assert.equal(h.area.scrollTop,stopped);assert.equal(h.frames.size,0);
 h.autoScroll.checked=false;h.autoScroll.listeners.get('change')();h.autoScroll.checked=true;h.autoScroll.listeners.get('change')();h.tick(900);h.tick(1550);assert.equal(h.area.scrollTop,220);
});
test('reduced motion uses same target without animation, and dispose/visibility own no late writes',()=>{
 const h=viewportHarness();h.setReduced(true);h.enter(1);h.tick(20);assert.equal(h.area.scrollTop,220);assert.equal(h.frames.size,0);
 h.setReduced(false);h.enter(2,750);h.tick(40);h.lifecycle.visibilityState='hidden';h.lifecycle.visibilitychange();assert.equal(h.frames.size,0);
 h.lifecycle.visibilityState='visible';h.lifecycle.visibilitychange();h.tick(100);assert.equal(h.frames.size,1);
 h.viewport.dispose();assert.equal(h.frames.size,0);assert.equal(h.area.listeners.size,0);assert.equal(h.lifecycle.visibilitychange,undefined);
});
test('reflow preserves a safely visible system and cancels the old geometry animation',()=>{
 const h=viewportHarness();h.enter(1);h.tick(20);h.tick(220);const current=h.area.scrollTop;
 h.viewport.afterRender();h.tick(300);assert.equal(h.area.scrollTop,current);assert.equal(h.frames.size,0);
});
test('rendering an empty intermediate SVG does not lose the previous traditional scroll',()=>{
 const h=viewportHarness();h.enter(1);h.tick(20);h.tick(670);h.area.scrollTop=180;h.viewport.beforeRender();h.area.scrollTop=0;
 h.viewport.afterRender();h.tick(1000);assert.equal(h.area.scrollTop,180);assert.equal(h.frames.size,0);
});
test('explicit seek retains old navigation, while enabling follow after a disabled seek deliberately aligns',()=>{
 const navigation=viewportHarness();navigation.seek();navigation.tick(20);
 assert.equal(navigation.area.scrollTop,360);assert.equal(navigation.viewport.readTraditionalState().lastKind,'navigation');
 const h=viewportHarness();h.autoScroll.checked=false;h.autoScroll.listeners.get('change')();h.seek();
 h.autoScroll.checked=true;h.autoScroll.listeners.get('change')();h.tick(20);h.tick(670);
 assert.equal(h.area.scrollTop,220);assert.equal(h.viewport.readTraditionalState().lastKind,'align');assert.equal(h.frames.size,0);
});
test('losing the painted cursor stops the owned animation instead of writing a stale target',()=>{
 const h=viewportHarness();h.enter(1);h.tick(20);h.tick(220);const stopped=h.area.scrollTop;
 h.hidePainted();h.tick(300);assert.equal(h.frames.size,0);assert.equal(h.area.scrollTop,stopped);
});
