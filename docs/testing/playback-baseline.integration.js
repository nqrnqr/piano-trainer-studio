// Controlled composition ports and copied facade observations; real score/DOM/input.
(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,message)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${message}\n`;if(!ok)throw Error(message);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const api=window.PianoTrainerTest,snapshot=()=>api.readPracticeSnapshot(),f=api.playback;
 const finishCountIn=()=>f.finishCountIn();
 const position=()=>{const p=api.practice.readTraversal();return {measure:p.measure,time:p.timestamp};};
 const release=()=>{for(const midi of [...snapshot().pressed])api.dispatchInput(midi,false,'ui');};
 const hit=()=>{for(const note of [...snapshot().expected])if(!note.hit)api.dispatchInput(note.midi,true,'ui');release();};
 const clean=()=>{api.pause();release();f.disposeCoordinator();f.clearCountIns();};
 const load=async name=>{await api.loadScore(await(await fetch(`/docs/testing/fixtures/${name}.musicxml`)).text(),{fileName:`${name}.musicxml`});};
 const play=async()=>{document.getElementById('btn-play').click();await wait(0);};
 const begin=async()=>{await play();finishCountIn();};
 const advance=()=>{if(snapshot().mode!=='realtime')hit();return f.fireNext();};
 const setup=async(layout,mode)=>{
  clean();await load('simple-repeat');api.setLayout(layout);f.prepareScenario();f.selectMode(mode);
  document.getElementById('check-looper').checked=false;document.getElementById('check-metronome').checked=false;
  f.setNow(10);
 };
 try{
  api.practice.muteOutputs();f.disablePulse();
  for(const layout of ['traditional','horizontal'])for(const mode of ['wait','follow','realtime']){
   await setup(layout,mode);const label=`${mode}/${layout}`;
   const area=document.getElementById('music-area');area.scrollTop=37;area.scrollLeft=23;const saved=[area.scrollTop,area.scrollLeft];
   await play();
   check(snapshot().playing&&snapshot().countIn&&f.readClock().countIns===1&&document.getElementById('btn-play').textContent.includes('Pause'),`${label}: toolbar Play enters count-in once`);
   check(area.scrollTop===saved[0]&&area.scrollLeft===saved[1],`${label}: timeline build preserves pre-play viewport`);
   finishCountIn();
   check(!snapshot().countIn&&snapshot().context.timestamp===0&&position().time>.0,`${label}: count-in handoff paints current event and prefetches next`);
   check(snapshot().expected.length===2,`${label}: started event builds both staff expectations`);
   const initial=snapshot().context.timestamp;
   api.dispatchInput(90,true,'ui');api.dispatchInput(90,false,'ui');
   check(snapshot().score.wrong===1&&snapshot().context.timestamp===initial,`${label}: wrong input grades without advancing immediately`);
   const current=snapshot().expected.map(n=>n.midi);
   if(mode!=='realtime')hit();
   const delay=f.fireNext();
   check(Math.abs(delay-(mode==='wait'?10:500))<1e-7&&snapshot().context.timestamp===.25,`${label}: original first event delay advances actual cursor`);
   check(mode==='realtime'?snapshot().score.wrong===3:snapshot().score.correct===2,`${label}: correct or missed chord grading keeps original counts`);
   f.updateSpeed(150);if(mode!=='realtime')hit();f.fireNext();
   if(mode!=='realtime')hit();const speedDelay=f.nextTimer()[1].delay;
   check(Math.abs(speedDelay-(mode==='wait'?10:mode==='follow'?333:1000/3))<1e-7,`${label}: speed change affects subsequent beat window with original mode rounding`);
   document.getElementById('btn-play').click();const stopped=JSON.stringify(snapshot().context);f.fireNext();
   check(!snapshot().playing&&JSON.stringify(snapshot().context)===stopped&&!document.body.classList.contains('app-playing'),`${label}: toolbar Pause gates the existing pending callback`);
   await begin();
   check(snapshot().playing&&snapshot().context.timestamp===.75,`${label}: resume starts from original prefetched iterator position`);
   document.getElementById('btn-play').click();await play();document.getElementById('btn-play').click();finishCountIn();
   check(!snapshot().playing&&!snapshot().countIn,`${label}: rapid Play/Pause keeps stopped count-in handoff gated`);
   document.getElementById('btn-reset').click();
   check(!snapshot().playing&&position().measure===0&&position().time===0&&snapshot().score.correct===0&&snapshot().score.wrong===0,`${label}: toolbar Reset restores first cursor and clears score`);

   await setup(layout,mode);document.getElementById('check-looper').checked=true;
   document.getElementById('val-loop-min').value='1';document.getElementById('val-loop-max').value='1';
   await begin();for(let i=0;i<4;i++)advance();
   check(snapshot().playing&&snapshot().context.timestamp===0&&snapshot().score.correct===0&&snapshot().score.wrong===0,`${label}: Loop boundary grades then seeks and restarts with reset score`);
   f.enableLoopCountIn();for(let i=0;i<4;i++)advance();
   check(snapshot().countIn&&f.readClock().countIns===1,`${label}: Loop count-in postpones restart handoff`);finishCountIn();
   check(snapshot().playing&&!snapshot().countIn&&snapshot().context.timestamp===0,`${label}: Loop count-in resumes one coordinator at the loop start`);
   document.getElementById('val-loop-min').value='2';document.getElementById('val-loop-max').value='2';document.getElementById('btn-reset').click();
   check(position().measure===1&&position().time===1,`${label}: Reset respects the UI Loop minimum`);

   clean();await load('first-second-ending');document.getElementById('check-looper').checked=false;
   f.selectMode(mode);
   await begin();const measures=[],events=[];let steps=0;
   while(snapshot().playing&&steps++<150){const context=snapshot().context;
    if(context){if(measures.at(-1)!==context.measureIndex)measures.push(context.measureIndex);events.push({measure:context.measureIndex,time:context.timestamp});}
    advance();}
   check(JSON.stringify(measures)===JSON.stringify([0,1,2,0,1,3,4]),`${label}: coordinator follows actual repeat and first/second endings`);
   check(!snapshot().playing&&steps<150&&api.practice.readTraversal().end,`${label}: song end pauses and retains final iterator`);
   check(events.length===28,`${label}: repeat traversal visits the original number of timed events`);
   results.textContent+=`SNAPSHOT ${label} ${JSON.stringify(events)}\n`;
   await load('simple-repeat');f.selectMode(mode,false);await begin();
   if(mode!=='realtime')hit();const oldRevision=api.readViewportSnapshot().scoreRevision;await load('first-second-ending');
   check(!snapshot().playing&&api.readViewportSnapshot().scoreRevision!==oldRevision&&snapshot().fileName==='first-second-ending.musicxml',`${label}: switching song while playing stops and installs the new score`);
   const switched=JSON.stringify(position());f.fireNext();
   check(!snapshot().playing&&JSON.stringify(position())===switched,`${label}: old pending callback remains gated after song switch`);
  }
  check(api.practice.readLed().enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'playback matrix completes with the selected default/no-op LED port');

 }catch(error){results.textContent+=`ERROR: ${error.stack}\n`;}
 finally{
  clean();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();
  const clock=f.readClock();
  check(clock.timers===0&&clock.frames===0&&clock.countIns===0&&clock.owned.timers===0&&clock.owned.frames===0,
   'controlled fixture disposal releases backend and coordinator clock ownership');
  parent.document.getElementById('run').disabled=false;
 }
 if (!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent)) results.textContent+='DONE\n';
})();
