// Actual OSMD and playback/input paths. Only the musical clock is controlled;
// viewport motion uses native foreground rAF and measured DOM coordinates.
(async()=>{
 const results=parent.document.getElementById('results'),api=window.PianoTrainerTest,f=api.playback;
 const el=id=>document.getElementById(id),area=el('music-area');
 const controlled=new URLSearchParams(parent.location.search).get('frames')==='controlled';
 const nativeRaf=window.requestAnimationFrame,nativeCancel=window.cancelAnimationFrame;
 const frameQueue=new Map();let frameId=1000000,frameTime=performance.now();
 if(controlled){window.requestAnimationFrame=callback=>{frameQueue.set(++frameId,callback);return frameId;};window.cancelAnimationFrame=id=>{frameQueue.delete(id);nativeCancel(id);};}
 const pump=ms=>{if(!controlled)return;for(let i=0;i<Math.max(1,Math.ceil(ms/16.67));i++){frameTime+=16.67;const callbacks=[...frameQueue.values()];frameQueue.clear();callbacks.forEach(callback=>callback(frameTime));}};
 const wait=async ms=>{await new Promise(resolve=>setTimeout(resolve,ms));pump(ms);};
 results.textContent='';let sample=false,frame=0,trajectory=[],phase='',checks=0;
 const check=(ok,message)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${message}\n`;if(!ok)throw Error(message);checks++;};
 const until=async(predicate,message,timeout=4000)=>{const start=performance.now();while(!predicate()){if(performance.now()-start>timeout)throw Error(message);await wait(10);}};
 const toggle=(id,value)=>{el(id).checked=value;el(id).dispatchEvent(new Event('change',{bubbles:true}));};
 const draw=time=>{if(!sample)return;const state=api.render.traditionalState(),p=api.readViewportSnapshot(),s=state.system;
  trajectory.push({phase,time,height:area.clientHeight,eventId:state.position?.eventId,systemId:state.position?.systemId,painted:p.painted,traversal:p.traversal,
   scroll:area.scrollTop,top:s?s.top-area.scrollTop:null,bottom:s?s.bottom-area.scrollTop:null,active:state.active,animation:state.animation});frame=requestAnimationFrame(draw);};
 window.TraditionalScrollCleanup=async()=>{sample=false;cancelAnimationFrame(frame);api.dispose();if(controlled){window.requestAnimationFrame=nativeRaf;window.cancelAnimationFrame=nativeCancel;}await window.__PT_LIBRARY_FIXTURE__.cleanup();results.textContent+='DONE\n';parent.document.getElementById('dispose').disabled=true;};
 const start=async(mode='realtime',speed=100)=>{
  api.pause();f.clearCountIns();toggle('check-looper',false);toggle('check-autoscroll',false);el('btn-reset').click();
  area.scrollTop=0;f.selectMode(mode);f.prepareScenario();f.updateSpeed(speed);toggle('check-autoscroll',true);
  el('btn-play').click();await until(()=>f.readClock().countIns>0,'count-in not ready');f.finishCountIn();await wait(40);
 };
 const advance=()=>{
  if(api.readPracticeSnapshot().mode!=='realtime') {
   const notes=api.readPracticeSnapshot().expected.filter(n=>!n.hit).map(n=>n.midi);
   for(const note of new Set(notes))api.dispatchInput(note,true);
   for(const note of new Set(notes))api.dispatchInput(note,false);
  }
  if(f.nextTimer())f.fireNext();else throw Error('No actual playback/input advancement scheduled');
 };
 const enter=async(system)=>{const target=api.render.systemBounds()[system].firstMeasureIndex;
  for(let i=0;api.horizontal.position().source.sourceMeasureIndex<target&&i<150;i++){advance();await wait(18);}
  await until(()=>api.render.traditionalState().position?.systemId===system,'painted system not committed');
 };
 try{
  api.practice.muteOutputs();f.disablePulse();
  const xml=await(await fetch('/docs/testing/fixtures/traditional-scroll.musicxml')).text();
  await api.loadScore(xml,{fileName:'traditional-scroll.musicxml'});await api.setLayout('traditional');
  const baseline=await(await fetch('/docs/testing/validation/traditional-baseline.json')).json();
  const raw=api.render.systemBounds();check(raw.length>=4,'complete original piano score has at least four systems');
  check(raw.every((s,i)=>s.firstMeasureIndex===baseline.layout.layout[i].measures[0]&&s.lastMeasureIndex===baseline.layout.layout[i].measures.at(-1)
   &&Math.abs(s.top-(baseline.layout.layout[i].position.y+baseline.layout.layout[i].borders.top)*10)<.01
   &&Math.abs(s.bottom-(baseline.layout.layout[i].position.y+baseline.layout.layout[i].borders.bottom)*10)<.01),'system assignments and visual borders match the pre-change OSMD baseline');
  check(raw[0].top<=150&&raw[1].bottom>660,'system geometry includes extreme ledger notes, lyric and dynamic extents');
  const height=baseline.motion.height;area.style.cssText=`height:${height}px;min-height:${height}px;max-height:${height}px;flex:none`;
  parent.document.querySelector('iframe').style.height=(height+300)+'px';await wait(500);
  phase='realtime-100';sample=true;frame=requestAnimationFrame(draw);await start();
  const firstNext=raw[1].firstMeasureIndex;
  while(api.horizontal.position().source.sourceMeasureIndex<firstNext-1){advance();await wait(18);}
  while(api.readViewportSnapshot().painted.measureIndex<firstNext-1||api.readViewportSnapshot().painted.timestampWhole<firstNext-.25){advance();await wait(18);}
  await wait(80);
  const pre=api.readViewportSnapshot();check(pre.traversal.measureIndex===firstNext&&pre.painted.measureIndex===firstNext-1,'live iterator has prefetched the next system while the painted cursor remains in the first');
  check(area.scrollTop<1&&!api.render.traditionalState().active,'no preview scrolling before the actual system entry');
  advance();await until(()=>api.render.traditionalState().active,'new system did not start settling');
  const initial=api.render.traditionalState(),a=initial.animation;
  check(initial.system.bottom<=height+1&&initial.system.top>height*.35,'new system was already fully visible below the reading band');
  await wait(1600);
  const primaryPoints=trajectory.filter(p=>p.phase===phase&&p.animation?.started===a.started);
  if(!controlled&&(primaryPoints.length<35||primaryPoints.some((p,i)=>i&&p.time-primaryPoints[i-1].time>250))){
   results.textContent+=`NATIVE_UNAVAILABLE ${JSON.stringify({visibility:document.visibilityState,reason:'browser frame delivery is throttled; foreground motion cannot be verified',state:api.render.traditionalState(),animation:a,points:primaryPoints})}\n`;
   await window.TraditionalScrollCleanup();return;
  }
  const settled=api.render.traditionalState();check(!settled.active&&!settled.framePending,'finite native animation converges and releases its frame');
  check(settled.system.top-area.scrollTop>=height*.25&&settled.system.top-area.scrollTop<=height*.35,'second system settles in the 25–35% reading band');
  check(settled.system.bottom-area.scrollTop<=height-Math.max(12,Math.min(32,.04*height))+1,'both piano staves and visual extents remain safely visible');
  const motion=trajectory.filter(p=>p.phase===phase&&p.animation?.started===a.started);
  results.textContent+=`MOTION_SAMPLE ${JSON.stringify({visibility:document.visibilityState,total:trajectory.length,matching:motion.length,animation:a,points:motion})}\n`;
  check((controlled||document.visibilityState==='visible')&&motion.length>35&&motion.filter(p=>p.scroll>a.from+1&&p.scroll<a.target-1).length>15,`${controlled?'controlled':'foreground native'} rAF records intermediate motion across many frames`);
  check(motion.every((p,i)=>!i||p.scroll>=motion[i-1].scroll-1)&&motion.every(p=>p.scroll<=a.target+1),'normal settling is monotonic and never overshoots');
  const arrived=motion.find(p=>Math.abs(p.scroll-a.target)<1),elapsed=arrived.time-a.started;
  check(elapsed>=a.durationMs-50&&elapsed<=a.durationMs+80,'native convergence duration agrees with the chosen D');
  const stationary=area.scrollTop,frames=settled.framesRun;
  for(let i=0;i<8;i++){advance();await wait(18);}await wait(1000);
  check(Math.abs(area.scrollTop-stationary)<=1&&api.render.traditionalState().animation.started===a.started,'later notes in the same system keep the target and deadline unchanged');
  const idleFrames=api.render.traditionalState().framesRun;await wait(250);
  check(api.render.traditionalState().framesRun===idleFrames&&idleFrames>frames,'no idle viewport frame loop after same-system checks');
  results.textContent+=`NATIVE ${JSON.stringify({frames:controlled?'controlled':'native',height:area.clientHeight,animation:a,elapsed,intermediateSamples:motion.length,finalScroll:stationary,system:settled.system})}\n`;
  phase='realtime-200';await start('realtime',200);await enter(1);const fast=api.render.traditionalState().animation;
  check(fast.lineSeconds<a.lineSeconds&&fast.durationMs<a.durationMs&&Math.abs(fast.durationMs-Math.min(1200,Math.max(400,fast.lineSeconds*200)))<.01,'200% speed uses the same actual beats and a shorter bounded duration');
  f.updateSpeed(50);advance();await wait(50);check(api.render.traditionalState().animation.started===fast.started&&api.render.traditionalState().animation.durationMs===fast.durationMs,'editing speed within a system does not restart its animation');
  await wait(1100);
  phase='wait-50';await start('wait',50);await enter(1);const waitSlow=api.render.traditionalState().animation;await wait(1700);
  check(waitSlow.durationMs===650&&!api.render.traditionalState().active,'Wait finishes one 650ms animation without another note');
  const waitTop=area.scrollTop,waitFrames=api.render.traditionalState().framesRun;await wait(1000);
  check(Math.abs(area.scrollTop-waitTop)<=1&&api.render.traditionalState().framesRun===waitFrames,'Wait remains still for a further second');
  phase='wait-200';await start('wait',200);await enter(1);check(api.render.traditionalState().animation.durationMs===waitSlow.durationMs,'Wait uses the same duration at 50% and 200% tempo');
  await wait(160);api.pause();const paused=area.scrollTop;await wait(900);
  check(Math.abs(area.scrollTop-paused)<=1&&!api.render.traditionalState().framePending,'pausing during native motion prevents late writes');
  el('btn-play').click();await until(()=>f.readClock().countIns>0,'resume count-in missing');f.finishCountIn();await wait(900);
  check(Math.abs(area.scrollTop-api.render.traditionalState().animation.target)<=1,'playback resume re-evaluates the paused position');
  phase='follow';await start('follow',200);await enter(1);check(api.render.traditionalState().animation.durationMs===fast.durationMs,'Follow uses the same quarter-beat duration as Realtime');
  await wait(100);area.dispatchEvent(new WheelEvent('wheel',{deltaY:60}));const wheelTop=area.scrollTop;
  api.render.autoScroll();await wait(1100);check(Math.abs(area.scrollTop-wheelTop)<=1&&!api.render.traditionalState().active,'wheel cancels and duplicate notification does not reclaim the same event');
  toggle('check-autoscroll',false);area.scrollTop=0;api.render.autoScroll();await wait(100);check(area.scrollTop===0,'disabled follow leaves traditional scroll alone');
  toggle('check-autoscroll',true);await wait(1100);check(Math.abs(area.scrollTop-api.render.traditionalState().animation.target)<=1,'re-enabled follow aligns the current traditional system');
  area.scrollTop=0;toggle('check-autoscroll',false);toggle('check-autoscroll',true);await wait(100);area.dispatchEvent(new Event('touchstart'));const touchTop=area.scrollTop;await wait(1000);
  check(Math.abs(area.scrollTop-touchTop)<=1,'touchstart cancels native settling');
  api.pause();toggle('check-autoscroll',false);area.scrollTop=180;const token=api.render.captureIdentity();
  api.render.render();await wait(100);check(Math.abs(area.scrollTop-180)<=1&&api.render.readIdentity(token).iteratorSame,'same-width reflow retains scroll and live iterator identity');
  for(const zoom of [50,100,150]){api.render.zoom(zoom);await wait(100);const bounds=api.render.systemBounds();check(bounds.length>0&&bounds.every(s=>Number.isFinite(s.top)&&s.layoutRevision>raw[0].layoutRevision),`${zoom}% zoom builds fresh finite geometry`);}
  api.render.zoom(100);await wait(100);const stable=api.render.systemBounds();
  check(stable.every((s,i)=>s.firstMeasureIndex===raw[i].firstMeasureIndex&&Math.abs(s.top-raw[i].top)<.01),'100% zoom restores the unchanged original system layout');
  parent.document.querySelector('iframe').style.width='760px';window.dispatchEvent(new Event('resize'));await wait(500);
  check(api.render.systemBounds()[0].layoutRevision>stable[0].layoutRevision,'resize invalidates geometry through original OSMD reflow');
  parent.document.querySelector('iframe').style.width='1100px';window.dispatchEvent(new Event('resize'));await wait(500);
  const beforeFullscreen=api.readViewportSnapshot().painted;
  await api.controls.requestFullscreen();await wait(500);
  check(JSON.stringify(api.readViewportSnapshot().painted)===JSON.stringify(beforeFullscreen)&&!api.render.traditionalState().active,'traditional fullscreen or its supported fallback retains painted position and cancels old motion');
  results.textContent+=`FULLSCREEN ${JSON.stringify({native:!!document.fullscreenElement,pseudo:api.controls.readSnapshot().pseudoFullscreen})}\n`;
  await api.controls.exitFullscreen();await wait(500);
  area.style.height=area.style.minHeight=area.style.maxHeight='130px';api.render.seekMeasure(firstNext,false);area.scrollTop=0;toggle('check-autoscroll',true);await wait(600);
  const tall=api.render.traditionalState();check(!tall.active&&Number.isFinite(area.scrollTop),'oversized-system fallback converges in a narrow-height viewport');
  area.style.height=area.style.minHeight=area.style.maxHeight=height+'px';await wait(100);
  phase='retarget';await start('realtime',100);await enter(1);await wait(100);const middle=area.scrollTop;await enter(2);
  const latest=api.render.traditionalState().animation;check(latest.systemId===2&&latest.from>=middle-1,'a real rapid next-system entry takes over from the current position');
  await wait(1400);check(!api.render.traditionalState().active&&Math.abs(area.scrollTop-latest.target)<=1,'retarget converges to the latest row with no queued old goal');
  phase='loop';el('val-loop-min').value='1';el('val-loop-max').value='21';toggle('check-looper',true);f.enableLoopCountIn();
  for(let i=0;i<100&&!f.readClock().countIns;i++){advance();await wait(18);}await wait(700);
  check(f.readClock().countIns>0&&api.readViewportSnapshot().painted.measureIndex===0,'Loop count-in displays the reset source position before the next formal event');
  const returned=area.scrollTop;check(api.render.traditionalState().position.measureIndex===0&&!api.render.traditionalState().active,'early Loop reset cancels settling and never pulls back to the outgoing system');
  f.finishCountIn();await wait(200);check(api.horizontal.position().loopIteration>0&&Math.abs(area.scrollTop-returned)<=1,'formal Loop restart keeps its original return and musical iteration');
  api.pause();toggle('check-looper',false);api.render.seekMeasure(20);await wait(700);api.render.seekMeasure(0);await wait(700);
  check(api.render.traditionalState().position.measureIndex===0&&!api.render.traditionalState().active,'backward seek preserves the traditional navigation branch');
  // Same target/safety rules apply when animation is explicitly reduced.
  toggle('check-autoscroll',false);api.render.seekMeasure(firstNext,false);area.scrollTop=0;
  const nativeMedia=window.matchMedia;window.matchMedia=query=>query==='(prefers-reduced-motion: reduce)'?{matches:true}:nativeMedia(query);
  toggle('check-autoscroll',true);await wait(40);window.matchMedia=nativeMedia;
  const reduced=api.render.traditionalState();check(!reduced.active&&!reduced.framePending&&Math.abs(area.scrollTop-reduced.animation.target)<=1,'reduced-motion commits the same safe reading target without an animation');
  const aligned=area.scrollTop,lastStart=reduced.animation.started;toggle('check-autoscroll',false);toggle('check-autoscroll',true);await wait(50);
  check(Math.abs(area.scrollTop-aligned)<=1&&api.render.traditionalState().animation.started===lastStart,'a real system already in the reading band stays still');
  area.scrollTop=reduced.system.top-height*.20;const above=area.scrollTop;toggle('check-autoscroll',false);toggle('check-autoscroll',true);await wait(50);
  check(Math.abs(area.scrollTop-above)<=1&&!api.render.traditionalState().active,'a safely visible real system above the band does not scroll backward to center');
  const repeatXml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();await api.loadScore(repeatXml);await start();
  for(let i=0;i<8;i++){advance();await wait(18);}
  check(api.horizontal.position().traceStepIndex===8&&api.render.traditionalState().lastKind==='navigation'&&!api.render.traditionalState().active,'actual same-system original repeat is classified as navigation despite reason advance');
  const repeatDoc=new DOMParser().parseFromString(xml,'application/xml'),repeatMeasures=[...repeatDoc.querySelectorAll('measure')];
  const addRepeat=(measure,direction,location)=>{const bar=repeatDoc.createElement('barline');bar.setAttribute('location',location);const mark=repeatDoc.createElement('repeat');mark.setAttribute('direction',direction);bar.append(mark);measure.append(bar);};
  addRepeat(repeatMeasures[0],'forward','left');addRepeat(repeatMeasures[11],'backward','right');await api.loadScore(new XMLSerializer().serializeToString(repeatDoc));await start();
  for(let i=0;i<48;i++){advance();await wait(18);}
  check(api.horizontal.position().source.sourceMeasureIndex===0&&api.render.traditionalState().lastKind==='navigation'&&!api.render.traditionalState().active,'actual cross-system original repeat cancels forward settling and returns');
  const sparseDoc=new DOMParser().parseFromString(xml,'application/xml');
  for(const measure of sparseDoc.querySelectorAll('measure')){const upper=[...measure.querySelectorAll('note')].filter(note=>note.querySelector('staff')?.textContent==='1');
   upper.slice(1).forEach(note=>note.remove());upper[0].querySelector('duration').textContent='4';upper[0].querySelector('type').textContent='whole';}
  await api.loadScore(new XMLSerializer().serializeToString(sparseDoc));await start();check(api.render.systemBounds().length>=2,'whole-note sparse piano fixture retains multiple original systems');
  await enter(1);const sparsePosition=JSON.stringify(api.readViewportSnapshot().painted);await wait(1700);
  check(!api.render.traditionalState().active&&JSON.stringify(api.readViewportSnapshot().painted)===sparsePosition,'a real long-note system finishes settling without receiving another musical event');
  api.pause();await api.loadScore(xml);
  const source=api.score.readSnapshot();check(source.dataText===xml&&source.originalText===xml,'complete raw and original MusicXML remain unchanged');
  const svgCount=el('source-score').querySelectorAll('svg').length;results.textContent+=`PAGES ${svgCount}\n`;
  // Use the existing repeat fixture for the horizontal switch regression:
  // the synthetic metronome/lyrics score exercises original traditional OSMD.
  await api.loadScore(repeatXml);
  for(let i=0;i<2;i++){await api.setLayout('horizontal');await api.setLayout('traditional');}
  check(!api.render.traditionalState().active,'repeated layout switches cancel vertical owners');
  sample=false;cancelAnimationFrame(frame);
  results.textContent+=`DURATIONS ${JSON.stringify({realtime100:a,realtime200:fast,wait50:waitSlow,wait200:650})}\nTRAJECTORY ${JSON.stringify(trajectory)}\nCHECKS ${checks}\nREADY_FOR_CAPTURE\n`;
  parent.document.getElementById('dispose').disabled=false;
 }catch(error){results.textContent+=`ERROR ${error.stack}\n`;await window.TraditionalScrollCleanup();}
})();
