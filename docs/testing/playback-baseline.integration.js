// Controlled time, real loaded score/cursor/DOM/input; no production test API.
(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,message)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${message}\n`;if(!ok)throw Error(message);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const f=window.__PT_PLAYBACK_CLOCK_TEST__,originalCountIn=trainerMetronome.doCountInAndStart;
 trainerMetronome.doCountInAndStart=callback=>{AppState.countInActive=true;f.countIns.push(callback);};
 const finishCountIn=()=>{const callback=f.countIns.shift();if(!callback)throw Error('Missing count-in callback');AppState.countInActive=false;if(AppState.isPlaying)callback();};
 const position=()=>({measure:osmd.cursor.Iterator.CurrentMeasureIndex,time:osmd.cursor.Iterator.currentTimeStamp.RealValue});
 const release=()=>{for(const midi of [...AppState.pressedKeys])triggerVirtualKey(midi,false,'ui');};
 const hit=()=>{for(const note of [...AppState.expectedNotes])if(!note.hit)triggerVirtualKey(note.midi,true,'ui');release();};
 const clean=()=>{pausePlaybackFromToolbar();release();trainerPlayback.dispose();f.countIns.length=0;};
 const load=async name=>{await loadScoreIntoApp(await(await fetch(`/docs/testing/fixtures/${name}.musicxml`)).text(),{fileName:`${name}.musicxml`});};
 const play=async()=>{document.getElementById('btn-play').click();await wait(0);};
 const begin=async()=>{await play();finishCountIn();};
 const advance=()=>{if(AppState.mode!=='realtime')hit();return f.fireNext();};
 const setup=async(layout,mode)=>{
  clean();await load('simple-repeat');ScoreDisplay.setMode(layout,{save:false});clearVisuals();
  AppState.mode=mode;syncActiveHandStateFromMode();AppState.practice.left=AppState.practice.right=true;
  AppState.fullscreenOnPlay=false;AppState.loopCountInEnabled=false;AppState.speedPercent=1;
  document.getElementById('check-looper').checked=false;document.getElementById('check-metronome').checked=false;
  AppState.score.correct=AppState.score.wrong=0;f.now=10;
 };
 try{
  hideToolbarPanels();document.getElementById('help-modal')?.classList.add('hidden');
  AppState.ledOutputMode='none';AppState.visualPulseEnabled=false;
  for(const key of Object.keys(AppState.audioEnabled))AppState.audioEnabled[key]=false;
  for(const key of Object.keys(AppState.midiOutEnabled))AppState.midiOutEnabled[key]=false;
  document.getElementById('check-autoscroll').checked=false;
  for(const layout of ['traditional','horizontal'])for(const mode of ['wait','follow','realtime']){
   await setup(layout,mode);const label=`${mode}/${layout}`;
   const area=document.getElementById('music-area');area.scrollTop=37;area.scrollLeft=23;const saved=[area.scrollTop,area.scrollLeft];
   await play();
   check(AppState.isPlaying&&AppState.countInActive&&f.countIns.length===1&&document.getElementById('btn-play').textContent.includes('Pause'),`${label}: toolbar Play enters count-in once`);
   check(area.scrollTop===saved[0]&&area.scrollLeft===saved[1],`${label}: timeline build preserves pre-play viewport`);
   finishCountIn();
   check(!AppState.countInActive&&AppState.currentExpectedContext.timestamp===0&&position().time>.0,`${label}: count-in handoff paints current event and prefetches next`);
   check(AppState.expectedNotes.length===2,`${label}: started event builds both staff expectations`);
   const initial=AppState.currentExpectedContext.timestamp;
   triggerVirtualKey(90,true,'ui');triggerVirtualKey(90,false,'ui');
   check(AppState.score.wrong===1&&AppState.currentExpectedContext.timestamp===initial,`${label}: wrong input grades without advancing immediately`);
   const current=AppState.expectedNotes.map(n=>n.midi);
   if(mode!=='realtime')hit();
   const delay=f.fireNext();
   check(Math.abs(delay-(mode==='wait'?10:500))<1e-7&&AppState.currentExpectedContext.timestamp===.25,`${label}: original first event delay advances actual cursor`);
   check(mode==='realtime'?AppState.score.wrong===3:AppState.score.correct===2,`${label}: correct or missed chord grading keeps original counts`);
   updateTempo('percent',150);if(mode!=='realtime')hit();f.fireNext();
   if(mode!=='realtime')hit();const speedDelay=f.nextTimer()[1].delay;
   check(Math.abs(speedDelay-(mode==='wait'?10:mode==='follow'?333:1000/3))<1e-7,`${label}: speed change affects subsequent beat window with original mode rounding`);
   document.getElementById('btn-play').click();const stopped=JSON.stringify(AppState.currentExpectedContext);f.fireNext();
   check(!AppState.isPlaying&&JSON.stringify(AppState.currentExpectedContext)===stopped&&!document.body.classList.contains('app-playing'),`${label}: toolbar Pause gates the existing pending callback`);
   await begin();
   check(AppState.isPlaying&&AppState.currentExpectedContext.timestamp===.75,`${label}: resume starts from original prefetched iterator position`);
   document.getElementById('btn-play').click();await play();document.getElementById('btn-play').click();finishCountIn();
   check(!AppState.isPlaying&&!AppState.countInActive,`${label}: rapid Play/Pause keeps stopped count-in handoff gated`);
   document.getElementById('btn-reset').click();
   check(!AppState.isPlaying&&position().measure===0&&position().time===0&&AppState.score.correct===0&&AppState.score.wrong===0,`${label}: toolbar Reset restores first cursor and clears score`);

   await setup(layout,mode);document.getElementById('check-looper').checked=true;
   document.getElementById('val-loop-min').value='1';document.getElementById('val-loop-max').value='1';
   await begin();for(let i=0;i<4;i++)advance();
   check(AppState.isPlaying&&AppState.currentExpectedContext.timestamp===0&&AppState.score.correct===0&&AppState.score.wrong===0,`${label}: Loop boundary grades then seeks and restarts with reset score`);
   AppState.loopCountInEnabled=true;for(let i=0;i<4;i++)advance();
   check(AppState.countInActive&&f.countIns.length===1,`${label}: Loop count-in postpones restart handoff`);finishCountIn();
   check(AppState.isPlaying&&!AppState.countInActive&&AppState.currentExpectedContext.timestamp===0,`${label}: Loop count-in resumes one coordinator at the loop start`);
   document.getElementById('val-loop-min').value='2';document.getElementById('val-loop-max').value='2';document.getElementById('btn-reset').click();
   check(position().measure===1&&position().time===1,`${label}: Reset respects the UI Loop minimum`);

   clean();await load('first-second-ending');document.getElementById('check-looper').checked=false;
   AppState.mode=mode;syncActiveHandStateFromMode();AppState.practice.left=AppState.practice.right=true;AppState.speedPercent=1;AppState.fullscreenOnPlay=false;
   await begin();const measures=[],events=[];let steps=0;
   while(AppState.isPlaying&&steps++<150){const context=AppState.currentExpectedContext;
    if(context){if(measures.at(-1)!==context.measureIndex)measures.push(context.measureIndex);events.push({measure:context.measureIndex,time:context.timestamp});}
    advance();}
   check(JSON.stringify(measures)===JSON.stringify([0,1,2,0,1,3,4]),`${label}: coordinator follows actual repeat and first/second endings`);
   check(!AppState.isPlaying&&steps<150&&osmd.cursor.Iterator.EndReached,`${label}: song end pauses and retains final iterator`);
   check(events.length===28,`${label}: repeat traversal visits the original number of timed events`);
   results.textContent+=`SNAPSHOT ${label} ${JSON.stringify(events)}\n`;
   await load('simple-repeat');AppState.mode=mode;AppState.practice.left=AppState.practice.right=true;AppState.speedPercent=1;await begin();
   if(mode!=='realtime')hit();const oldSheet=osmd.Sheet;await load('first-second-ending');
   check(!AppState.isPlaying&&osmd.Sheet!==oldSheet&&AppState.currentScoreFileName==='first-second-ending.musicxml',`${label}: switching song while playing stops and installs the new score`);
   const switched=JSON.stringify(position());f.fireNext();
   check(!AppState.isPlaying&&JSON.stringify(position())===switched,`${label}: old pending callback remains gated after song switch`);
  }
  check(optionalLedOutput.enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'playback matrix completes with the selected default/no-op LED port');
  results.textContent+='DONE\n';
 }catch(error){results.textContent+=`ERROR: ${error.stack}\n`;}
 finally{clean();trainerMetronome.doCountInAndStart=originalCountIn;parent.document.getElementById('run').disabled=false;}
})();
