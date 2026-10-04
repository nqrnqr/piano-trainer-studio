(async()=>{
 const results=parent.document.getElementById('results'),api=window.PianoTrainerTest,f=api.playback;
 results.textContent='';const check=(ok,message)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${message}\n`;if(!ok)throw Error(message);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),area=document.getElementById('music-area');
 let sampling=true,frame=0;const trajectory=[];
 const sample=time=>{
  if(!sampling)return;const cursor=document.querySelector('.pt-performance-cursor');
  if(cursor){const rect=cursor.getBoundingClientRect(),bounds=area.getBoundingClientRect(),resources=api.horizontal.resources();
   trajectory.push({time,eventId:Number(cursor.dataset.eventId),worldX:Number(cursor.dataset.logicalX),scroll:area.scrollLeft,origin:resources.origin,screenX:rect.left+rect.width/2-bounds.left});}
  frame=requestAnimationFrame(sample);
 };
 try{
  api.practice.muteOutputs();f.disablePulse();const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();
  await api.loadScore(xml,{fileName:'native-motion.musicxml'});await api.setLayout('horizontal');
  document.getElementById('check-autoscroll').checked=true;f.selectMode('realtime');f.prepareScenario();f.setNow(10);
  document.getElementById('btn-play').click();await wait(0);f.finishCountIn();frame=requestAnimationFrame(sample);
  for(let step=0;step<12;step++){await wait(200);f.fireNext();}
  await wait(1100);api.pause();
  const repeatMotion=trajectory.slice();check(document.visibilityState==='visible'&&repeatMotion.length>60,'native foreground rAF produced a repeat trajectory');
  check(repeatMotion.every((point,index)=>!index||point.worldX>=repeatMotion[index-1].worldX-.01),'native repeat traversal has no logical backward movement');
  check(repeatMotion.every((point,index)=>!index||point.scroll>=repeatMotion[index-1].scroll-1),'finite repeat introduces no backward viewport movement');
  const settled=repeatMotion.at(-1);check(Math.abs(settled.screenX-area.clientWidth*.33)<3,'native follow settles within 3 CSS px of the 33% region');
  // Click the actual SVG box of the second A, through the production seek listener.
  const occurrence=api.horizontal.measureBounds().find(measure=>measure.measureOccurrenceId===2),svg=document.querySelector('.pt-horizontal-canvas'),rect=svg.getBoundingClientRect(),viewBox=svg.viewBox.baseVal;
  const x=rect.left+(occurrence.box.x+occurrence.box.width/2)/viewBox.width*rect.width,y=rect.top+(occurrence.box.y+occurrence.box.height/2)/viewBox.height*rect.height;
  document.getElementById('canvas-wrapper').dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:x,clientY:y}));
  check(api.horizontal.position().traceStepIndex===8&&api.practice.readTraversal().measure===0,'clicking the second A seeks its exact second-pass source step');
  const eventId=api.horizontal.position().eventId;api.render.zoom(50);await api.horizontal.ready();api.render.zoom(150);await api.horizontal.ready();
  check(api.horizontal.position().eventId===eventId,'50% and 150% zoom preserve the selected performed event');
  const score=api.score.readSnapshot();check(score.dataText===xml&&score.originalText===xml,'derived chunks never replace raw or original MusicXML');
  api.pause();f.disposeCoordinator();f.clearCountIns();await api.loadScore(xml,{fileName:'native-loop.musicxml'});await api.setLayout('horizontal');api.render.zoom(100);await api.horizontal.ready();
  document.getElementById('check-looper').checked=true;document.getElementById('val-loop-min').value='1';document.getElementById('val-loop-max').value='1';
  document.getElementById('check-autoscroll').checked=true;f.selectMode('realtime');f.prepareScenario();await api.horizontal.ready();
  document.getElementById('btn-play').click();await wait(0);f.finishCountIn();const loopBegin=trajectory.length;
  for(let i=0;i<64;i++){await wait(100);f.fireNext();}await wait(1000);api.pause();
  const loopMotion=trajectory.slice(loopBegin),recycled=loopMotion.some((p,i)=>i&&p.origin!==loopMotion[i-1].origin);
  check(recycled&&loopMotion.length>200,'native rAF observes automatic Loop recycling');
  check(loopMotion.every((p,i)=>!i||p.worldX>=loopMotion[i-1].worldX-.01),'automatic Loop trajectory keeps moving right across origin changes');
  check(api.horizontal.resources().lastRebase.error<=1,'native Loop origin compensation stays within one CSS pixel');
  document.getElementById('check-autoscroll').checked=false;
  for(let i=0;i<30&&api.horizontal.resources().windowStart>0;i++){area.scrollLeft=0;area.dispatchEvent(new Event('scroll'));await api.horizontal.ready();}
  check(api.horizontal.resources().windowStart===0,'manual scrolling rebuilds already recycled history');
  const heldWindow=api.horizontal.resources().windowStart,idBefore=api.horizontal.position().eventId;
  document.getElementById('btn-play').click();await wait(0);f.finishCountIn();f.fireNext();await api.horizontal.ready();api.pause();
  check(api.horizontal.resources().windowStart===heldWindow&&api.horizontal.position().eventId>idBefore,'automatic follow off preserves the history window during playback');
  document.getElementById('check-autoscroll').checked=true;await api.horizontal.ready();api.render.follow(true);
  check(api.horizontal.resources().windowStart>0,'reenabling follow reconstructs the current Loop window');
  results.textContent+=`LOOP_TRAJECTORY ${JSON.stringify({viewport:area.clientWidth,samples:loopMotion.length,eventIntervalMs:100,points:loopMotion.filter((_,index)=>index%12===0),resources:api.horizontal.resources()})}\n`;
  sampling=false;cancelAnimationFrame(frame);
  results.textContent+=`TRAJECTORY ${JSON.stringify({viewport:area.clientWidth,samples:repeatMotion.length,eventIntervalMs:200,maxTargetError:Math.abs(settled.screenX-area.clientWidth*.33),points:repeatMotion.filter((_,index)=>index%6===0)})}\n`;
 }catch(error){results.textContent+=`ERROR ${error.stack}\n`;}
 finally{sampling=false;cancelAnimationFrame(frame);api.pause();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();parent.document.getElementById('run').disabled=false;}
 if(!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent))results.textContent+='DONE\n';
})();
