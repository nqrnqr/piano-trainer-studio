// Native rAF trajectories through real production playback/input commits.
// ?music=native also uses production Tone.now/setTimeout scheduling; only
// audio output and count-in handoff are isolated. No seek in forward scenarios.
(async()=>{
 const results=parent.document.getElementById('results'),api=window.PianoTrainerTest,f=api.playback;
 const params=new URLSearchParams(parent.location.search),nativeMusic=params.get('music')==='native';
 results.textContent='';
 const controlled=params.get('frames')==='controlled',el=id=>document.getElementById(id),area=el('music-area');
 const nativeRaf=window.requestAnimationFrame,nativeCancel=window.cancelAnimationFrame,queue=new Map();
 let frameId=1000000,frameTime=performance.now(),phase='',checks=0,sampling=false,frame=0,trajectory=[],lastSample=0;
 if(controlled){window.requestAnimationFrame=cb=>{queue.set(++frameId,cb);return frameId;};window.cancelAnimationFrame=id=>{queue.delete(id);nativeCancel(id);};}
 const pump=ms=>{if(controlled)for(let i=0;i<Math.max(1,Math.ceil(ms/16.67));i++){frameTime+=16.67;const c=[...queue.values()];queue.clear();c.forEach(cb=>cb(frameTime));}};
 const wait=async ms=>{await new Promise(r=>setTimeout(r,ms));pump(ms);};
 const check=(ok,message)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${message}\n`;if(!ok)throw Error(message);checks++;};
 const until=async(predicate,message,timeout=5000)=>{const start=performance.now();while(!predicate()){if(performance.now()-start>timeout)throw Error(message);await wait(10);}};
 const toggle=(id,value)=>{el(id).checked=value;el(id).dispatchEvent(new Event('change',{bubbles:true}));};
 const state=()=>api.render.traditionalState();
 const sample=time=>{if(!sampling)return;const s=state(),p=api.readViewportSnapshot();const dense=s.position?.systemId===1&&(phase==='realtime-200'||phase==='long-note');
  if(dense||time-lastSample>=50){lastSample=time;trajectory.push({phase,time,clock:f.readClock().now,
  height:area.clientHeight,scroll:area.scrollTop,top:s.system?.top-area.scrollTop,bottom:s.system?.bottom-area.scrollTop,
  eventId:s.position?.eventId,systemId:s.position?.systemId,painted:p.painted,traversal:p.traversal,animation:s.animation,active:s.active});}frame=requestAnimationFrame(sample);};
 window.TraditionalScrollCleanup=async()=>{sampling=false;cancelAnimationFrame(frame);api.dispose();if(controlled){window.requestAnimationFrame=nativeRaf;window.cancelAnimationFrame=nativeCancel;}await window.__PT_LIBRARY_FIXTURE__.cleanup();results.textContent+='DONE\n';parent.document.getElementById('dispose').disabled=true;};
 const start=async(mode='wait',speed=100)=>{
  api.pause();f.clearScheduled();f.clearCountIns();toggle('check-looper',false);toggle('check-autoscroll',false);el('btn-reset').click();
  area.scrollTop=0;f.selectMode(mode);f.prepareScenario();f.updateSpeed(speed);toggle('check-autoscroll',true);
  el('btn-play').click();await until(()=>f.readClock().countIns>0,'count-in missing');f.finishCountIn();await wait(40);
 };
 const advance=async()=>{
  const event=api.horizontal.position().eventId;
  if(api.readPracticeSnapshot().mode!=='realtime'){
   const notes=new Set(api.readPracticeSnapshot().expected.filter(n=>!n.hit).map(n=>n.midi));
   for(const note of notes)api.dispatchInput(note,true);for(const note of notes)api.dispatchInput(note,false);
  }
  if(!nativeMusic){if(!f.nextTimer())throw Error('no real coordinator advance scheduled');f.fireNext();}
  await until(()=>api.horizontal.position().eventId!==event||f.readClock().countIns>0,'actual event did not advance');await wait(20);
 };
 const enter=async system=>{const target=api.render.systemBounds()[system].firstMeasureIndex;
  for(let i=0;api.horizontal.position().source.sourceMeasureIndex<target&&i<200;i++)await advance();
  await until(()=>state().position?.systemId===system,'painted system not committed');
 };
 const playFor=async ms=>{
  if(nativeMusic){await wait(ms);return;}
  const start=performance.now();while(performance.now()-start<ms){const dt=controlled?16:16;f.setNow(f.readClock().now+dt/1000);
   for(let i=0;i<20&&f.nextTimer()?.[1].due<=f.readClock().now;i++)f.fireNext();await wait(dt);}
 };
 try{
  api.practice.muteOutputs();f.disablePulse();
  const xml=await(await fetch('/docs/testing/fixtures/traditional-scroll.musicxml')).text();await api.loadScore(xml);await api.setLayout('traditional');
  const baseline=await(await fetch('/docs/testing/validation/traditional-baseline.json')).json(),raw=api.render.systemBounds();
  check(raw.length>=4,'original complete piano score has at least four systems');
  check(raw.every((s,i)=>s.firstMeasureIndex===baseline.layout.layout[i].measures[0]&&s.lastMeasureIndex===baseline.layout.layout[i].measures.at(-1)
   &&Math.abs(s.top-(baseline.layout.layout[i].position.y+baseline.layout.layout[i].borders.top)*10)<.01
   &&Math.abs(s.bottom-(baseline.layout.layout[i].position.y+baseline.layout.layout[i].borders.bottom)*10)<.01),'original OSMD assignments and full visual borders equal pre-change baseline');
  check(raw[0].top<=150&&raw[1].bottom>660,'full piano bounds include ledger, lyric and dynamic extents');
  const height=baseline.motion.height;area.style.cssText=`height:${height}px;min-height:${height}px;max-height:${height}px;flex:none`;
  parent.document.querySelector('iframe').style.height=(height+300)+'px';await wait(100);
  phase='realtime-200';sampling=true;frame=requestAnimationFrame(sample);await start('realtime',200);await enter(1);
  const entry=state().animation;check(entry.progress<.10&&entry.target<entry.dock-50,'actual system entry starts near zero musical progress, without a full fixed-time settle');
  const firstEvent=state().position.eventId;await playFor(450);const early=state().animation;
  check(early.progress>entry.progress&&early.target>entry.target&&area.scrollTop>entry.from+1,'current row moves before it has finished, following actual progress');
  check(state().position.systemId===1&&api.readViewportSnapshot().painted.measureIndex<=raw[1].lastMeasureIndex,'current painted system governs movement despite prefetched next events');
  await playFor(5200);api.pause();await wait(100);const docked=state(),currentTop=area.scrollTop;
  const points=trajectory.filter(p=>p.phase===phase&&p.systemId===1&&p.painted.measureIndex>=raw[1].firstMeasureIndex&&p.painted.measureIndex<=raw[1].lastMeasureIndex),intermediate=points.filter(p=>p.animation?.progress>0&&p.animation.progress<.60);
  check(points.length>80&&intermediate.length>40,`${controlled?'controlled':'native'} rAF records many moving frames during the current row`);
  check(points.every((p,i)=>!i||p.scroll>=points[i-1].scroll-1),'normal row trajectory has no reverse motion');
  check(new Set(intermediate.map(p=>Math.round(p.animation.target))).size>15,'row target changes with progress rather than a fixed full-row destination');
  const arrived=points.find(p=>p.animation?.progress>=.60&&Math.abs(p.scroll-p.animation.dock)<1);
  results.textContent+=`DOCK_DEBUG ${JSON.stringify({entry,early,arrived,last:points.at(-1),window:f.readWindow(),now:f.readClock().now})}\n`;
  check(!!arrived&&arrived.painted.measureIndex<=raw[1].lastMeasureIndex,'docking is reached while still playing this row');
  const system=points.at(-1),pt=Math.max(12,Math.min(32,.04*area.clientHeight),
   (area.querySelector('.score-overlay-controls')?.getBoundingClientRect().bottom??area.getBoundingClientRect().top)-area.getBoundingClientRect().top-area.clientTop+4);
  const anchor=pt+(area.clientHeight-pt-Math.min(32,Math.max(12,.04*area.clientHeight)))*.06;
  check(Math.abs(system.top-anchor)<2,'full system graphic top docks higher at 6% of usable viewport below controls and safety margin');
  check(system.bottom<=area.clientHeight-12&&raw[2].bottom+14-system.scroll<=area.clientHeight-12,'current piano system and next complete system fit after docking');
  if(!controlled)check(points.every((p,i)=>!i||p.time-points[i-1].time<250),'native trajectory is foreground, without throttled frame gaps');
  results.textContent+=`PRIMARY ${JSON.stringify({nativeMusic,frames:controlled?'controlled':'native',height:area.clientHeight,entry,early,firstEvent,arrived,final:system,points:points.length,intermediate:intermediate.length})}\n`;
  check(!docked.framePending,'pause releases the owned scroll frame immediately');
  phase='wait-50';await start('wait',50);await enter(1);const waitEntry=state().animation;await wait(900);
  check(Math.abs(area.scrollTop-waitEntry.from)<1&&state().animation.progress===0,'Wait never settles a full row merely on entry');
  await advance();await wait(1200);const slow=state().animation,slowTop=area.scrollTop,frames=state().framesRun;
  check(slow.progress>0&&slow.progress<.60&&slow.target<slow.dock,'Wait input advances only a partial musical-progress target');
  await wait(1000);check(Math.abs(area.scrollTop-slowTop)<1&&state().framesRun===frames,'Wait stops without input and owns no idle frames');
  api.render.autoScroll();api.render.autoScroll();await wait(100);
  check(state().animation.from===slow.from&&state().animation.target===slow.target,'same-system duplicates preserve baseline and target');
  phase='wait-200';await start('wait',200);await enter(1);await advance();await wait(1200);
  check(Math.abs(state().animation.progress-slow.progress)<1e-6&&Math.abs(state().animation.target-slow.target)<1,'Wait target depends on actual durations, independent of configured BPM');
  await advance();await wait(60);api.pause();const paused=area.scrollTop;await wait(400);
  check(Math.abs(area.scrollTop-paused)<1&&!state().framePending,'pause in partial motion has no late writes');
  el('btn-play').click();await until(()=>f.readClock().countIns>0,'resume count-in missing');f.finishCountIn();await wait(100);
  check(Math.abs(area.scrollTop-paused)<1&&state().animation.from>=paused-1,'resume rebuilds baseline from actual scroll rather than old target');
  await advance();await wait(80);area.dispatchEvent(new WheelEvent('wheel',{deltaY:60}));const manual=area.scrollTop;
  api.render.autoScroll();await wait(400);check(Math.abs(area.scrollTop-manual)<1&&!state().active,'wheel cancels, duplicate callback does not reclaim view');
  toggle('check-autoscroll',false);area.scrollTop=50;const offTop=area.scrollTop;api.render.autoScroll();await wait(80);check(area.scrollTop===offTop,'follow off owns no writes');
  toggle('check-autoscroll',true);await wait(100);check(state().animation.from===offTop&&Math.abs(area.scrollTop-offTop)<1,'follow on rebases current event rather than playing an old settle');
  await advance();await wait(60);area.dispatchEvent(new Event('touchstart'));const touch=area.scrollTop;await wait(400);check(Math.abs(area.scrollTop-touch)<1,'touch cancels current smoothing');
  phase='follow';await start('follow',200);await enter(1);await advance();await wait(1200);const follow=state().animation,followTop=area.scrollTop;
  await wait(800);check(Math.abs(area.scrollTop-followTop)<1&&state().animation.progress===follow.progress,'Follow waiting does not extrapolate musical progress from BPM');
  phase='rapid';await start('wait');await enter(1);await advance();await wait(40);const from=area.scrollTop;await enter(2);
  check(state().animation.systemId===2&&state().animation.from>=from-1,'rapid actual input across rows replaces the current baseline');
  api.pause();toggle('check-autoscroll',false);area.scrollTop=180;const token=api.render.captureIdentity();api.render.render();await wait(100);
  check(Math.abs(area.scrollTop-180)<1&&api.render.readIdentity(token).iteratorSame,'reflow preserves scroll and live iterator identity');
  for(const zoom of [50,100,150]){api.render.zoom(zoom);await wait(100);check(api.render.systemBounds().every(s=>Number.isFinite(s.top)&&s.layoutRevision>raw[0].layoutRevision),`${zoom}% zoom invalidates geometry without stale frames`);}
  api.render.zoom(100);await wait(100);check(api.render.systemBounds().every((s,i)=>s.firstMeasureIndex===raw[i].firstMeasureIndex&&Math.abs(s.top-raw[i].top)<.01),'100% restores original OSMD layout');
  parent.document.querySelector('iframe').style.width='760px';window.dispatchEvent(new Event('resize'));await wait(500);
  check(!state().framePending&&api.render.systemBounds()[0].layoutRevision>raw[0].layoutRevision,'resize drops old geometry and animation');
  parent.document.querySelector('iframe').style.width='1100px';window.dispatchEvent(new Event('resize'));await wait(500);
  const painted=JSON.stringify(api.readViewportSnapshot().painted);await api.controls.requestFullscreen();await wait(400);
  check(JSON.stringify(api.readViewportSnapshot().painted)===painted&&!state().framePending,'fullscreen/fallback preserves painted position and cancels motion');
  results.textContent+=`FULLSCREEN ${JSON.stringify({native:!!document.fullscreenElement,pseudo:api.controls.readSnapshot().pseudoFullscreen})}\n`;await api.controls.exitFullscreen();await wait(400);
  area.style.height=area.style.minHeight=area.style.maxHeight='130px';api.render.seekMeasure(raw[1].firstMeasureIndex,false);area.scrollTop=0;toggle('check-autoscroll',true);await wait(1600);
  check(!state().active&&Number.isFinite(area.scrollTop),'oversized system uses finite cursor visibility fallback');
  area.style.height=area.style.minHeight=area.style.maxHeight=height+'px';await wait(100);
  phase='loop';await start('wait');el('val-loop-min').value='1';el('val-loop-max').value='8';toggle('check-looper',true);f.enableLoopCountIn();
  for(let i=0;i<100&&!f.readClock().countIns;i++)await advance();await wait(500);
  check(f.readClock().countIns>0&&api.readViewportSnapshot().painted.measureIndex===0&&!state().active,'Loop count-in return clears outgoing target before formal restart');
  f.finishCountIn();await wait(150);check(api.horizontal.position().loopIteration>0&&state().animation.progress===0,'formal Loop restart rebuilds a zero-progress baseline');
  api.pause();toggle('check-looper',false);api.render.seekMeasure(20);await wait(500);api.render.seekMeasure(0);await wait(500);
  check(state().position.measureIndex===0&&!state().framePending,'seek/reset retains original return behavior');
  const repeatXml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();await api.loadScore(repeatXml);await start('wait');
  for(let i=0;i<8;i++)await advance();check(api.horizontal.position().traceStepIndex===8&&state().lastKind==='navigation','same-system repeat is actual navigation, even with advance reason');
  const repeated=new DOMParser().parseFromString(xml,'application/xml'),measures=[...repeated.querySelectorAll('measure')];
  for(const [index,direction,location]of [[0,'forward','left'],[11,'backward','right']]){const bar=repeated.createElement('barline'),mark=repeated.createElement('repeat');bar.setAttribute('location',location);mark.setAttribute('direction',direction);bar.append(mark);measures[index].append(bar);}
  await api.loadScore(new XMLSerializer().serializeToString(repeated));await start('wait');for(let i=0;i<48;i++)await advance();
  check(api.horizontal.position().source.sourceMeasureIndex===0&&state().lastKind==='navigation'&&state().animation.progress===0,'cross-system repeat rebuilds baseline without outgoing animation pullback');
  const sparse=new DOMParser().parseFromString(xml,'application/xml');for(const measure of sparse.querySelectorAll('measure')){
   const upper=[...measure.querySelectorAll('note')].filter(n=>n.querySelector('staff')?.textContent==='1');upper.slice(1).forEach(n=>n.remove());upper[0].querySelector('duration').textContent='4';upper[0].querySelector('type').textContent='whole';}
  // Extra original fixture measures provide page space; no production score
  // duplication. Pass initial visibility correction before testing interpolation.
  const sparsePart=sparse.querySelector('part'),sparseMeasures=[...sparsePart.querySelectorAll('measure')];
  for(const note of sparseMeasures[15].querySelectorAll('note')){note.querySelector('pitch')?.remove();note.insertBefore(sparse.createElement('rest'),note.firstChild);}
  sparseMeasures.forEach((measure,i)=>{const copy=measure.cloneNode(true);copy.setAttribute('number',String(25+i));sparsePart.append(copy);});
  phase='long-note';await api.loadScore(new XMLSerializer().serializeToString(sparse));await start('realtime',200);await enter(1);
  for(let i=0;i<3;i++)await advance();
  const longEvent=api.horizontal.position().eventId,longBefore=state().animation;await playFor(450);
  check(api.horizontal.position().eventId===longEvent&&state().animation.progress>longBefore.progress&&state().animation.target>longBefore.target,'Realtime long note progresses within same formally displayed event using playback clock');
  await advance();const restEvent=api.horizontal.position().eventId,restBefore=state().animation;await playFor(350);
  check(api.readPracticeSnapshot().expected.length===0&&api.horizontal.position().eventId===restEvent
   &&state().animation.progress>restBefore.progress&&state().animation.target>restBefore.target,'Realtime whole rest uses the same scheduled musical window between formal commits');
  api.pause();await api.loadScore(xml);const source=api.score.readSnapshot();check(source.dataText===xml&&source.originalText===xml,'raw/original MusicXML remains unchanged');
  await start('wait');await enter(1);const media=window.matchMedia;window.matchMedia=q=>q==='(prefers-reduced-motion: reduce)'?{matches:true}:media(q);
  await advance();const reduced=state().animation;window.matchMedia=media;
  check(!state().active&&Math.abs(area.scrollTop-reduced.target)<1&&reduced.target<reduced.dock,'reduced motion applies the partial progress target');
  api.pause();await api.loadScore(repeatXml);for(let i=0;i<2;i++){await api.setLayout('horizontal');await api.setLayout('traditional');}
  await until(()=>!state().framePending,'layout visibility check did not release frame');
  check(!state().framePending,'layout switches leave no vertical frame');
  sampling=false;cancelAnimationFrame(frame);results.textContent+=`TRAJECTORY ${JSON.stringify(trajectory)}\nCHECKS ${checks}\nREADY_FOR_CAPTURE\n`;parent.document.getElementById('dispose').disabled=false;
 }catch(error){results.textContent+=`ERROR ${error.stack}\nTRAJECTORY ${JSON.stringify(trajectory)}\n`;await window.TraditionalScrollCleanup();}
})();
