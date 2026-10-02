(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const stop=()=>{pausePlaybackFromToolbar();for(const midi of [...AppState.pressedKeys])triggerVirtualKey(midi,false,'ui');};
 const oldLayout=document.getElementById('select-score-layout').value;
 const originalHandle=practiceInput.handle,originalUnlock=ensureLiveAudioReady,inputs=[];
 practiceInput.handle=input=>{inputs.push(input);return originalHandle(input);};
 // Exercise keyboard DOM without waiting for real audio activation in this
 // muted fixture; the real Tone loading/monitoring path has its own baseline.
 ensureLiveAudioReady=async()=>{};
 const prepare=(mode='wait',practice={left:true,right:true})=>{
  stop();clearVisuals();AppState.mode=mode;AppState.practice={...practice};
  AppState.score.correct=AppState.score.wrong=0;AppState.isPlaying=true;AppState.isAudioBusy=false;
 };
 const at=(measure,timestamp)=>{
  const cursor=osmd.cursor;cursor.reset();let limit=0;
  while(!cursor.Iterator.EndReached&&limit++<1000){
   const it=cursor.Iterator;
   if(it.CurrentMeasureIndex===measure&&Math.abs(it.currentTimeStamp.RealValue-timestamp)<1e-6){
    cursor.update();AppState.currentExpectedContext={measureIndex:measure,timestamp,signature:makeLedPreviewEntrySignature(it.CurrentVoiceEntries)};
    buildExpectedNotesFromEntries(it.CurrentVoiceEntries,measure,timestamp);return;
   }
   it.moveToNext();
  }
  throw Error(`Missing fixture event ${measure}|${timestamp}`);
 };
 const press=async(midi,kind='mousedown')=>{
  const key=document.querySelector(`.key[data-midi="${midi}"]`);
  key.dispatchEvent(kind==='pointerdown'?new PointerEvent(kind,{bubbles:true,pointerId:19,pointerType:'mouse'}):new MouseEvent(kind,{bubbles:true}));
  await wait(10);return key;
 };
 try{
  hideToolbarPanels();document.getElementById('help-modal')?.classList.add('hidden');
  AppState.ledOutputMode='none';for(const key of Object.keys(AppState.audioEnabled))AppState.audioEnabled[key]=false;
  for(const key of Object.keys(AppState.midiOutEnabled))AppState.midiOutEnabled[key]=false;
  document.getElementById('check-metronome').checked=false;document.getElementById('check-looper').checked=false;
  document.getElementById('check-autoscroll').checked=false;AppState.hands={right:1,left:2};setPlayerPianoType(88,{save:false});
  await loadScoreIntoApp(await(await fetch('/docs/testing/fixtures/geometry.musicxml')).text(),{fileName:'geometry.musicxml'});
  AppState.hands={right:1,left:2};
  for(const layout of ['traditional','horizontal']){
   ScoreDisplay.setMode(layout,{save:false});prepare();at(0,0);
   const firstRefs=AppState.expectedNotes.filter(n=>n.midi===60).map(n=>n.noteRef);
   check(AppState.expectedNotes.length===3&&firstRefs.length===2&&firstRefs[0]!==firstRefs[1],`${layout}: same pitch across actual piano staves retains two source identities`);
   const key=await press(60);
   check(AppState.score.correct===1&&AppState.expectedNotes.filter(n=>n.hit).length===1,`${layout}: DOM mouse press grades only one chord candidate`);
   key.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));await wait(10);
   check(AppState.score.correct===1,`${layout}: duplicate DOM down is suppressed by the existing virtual key guard`);
   key.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
   check(!AppState.pressedKeys.has(60),`${layout}: DOM mouse release clears physical input`);
   dispatchTrainerNoteInput({kind:'note-on',note:60,velocity:72,source:'midi',channel:7,receivedAtMs:performance.now()});
   check(AppState.score.correct===2&&AppState.expectedNotes.some(n=>!n.hit),`${layout}: MIDI bridge consumes the other staff and leaves the partial chord waiting`);
   triggerVirtualKey(60,true,'ui');check(AppState.score.correct===2&&AppState.score.wrong===0,`${layout}: already-hit re-press remains ungraded`);
   triggerVirtualKey(61,true,'ui');check(AppState.score.correct===3&&AppState.expectedNotes.every(n=>n.hit),`${layout}: final chord note completes all expectations`);
   check(inputs.some(i=>i.source==='ui'&&i.channel===null)&&inputs.some(i=>i.source==='midi'&&i.channel===7),`${layout}: DOM and MIDI enter one controller with their original source metadata`);
   triggerVirtualKey(90,true,'ui');const marker=AppState.activeHeldIncorrectFeedback.get(90);
   triggerVirtualKey(90,false,'ui');check(AppState.score.wrong===1&&AppState.releasedIncorrectFeedback.includes(marker),`${layout}: wrong release transfers the same feedback marker to history`);
   prepare();at(0,0);const pointerKey=await press(60,'pointerdown');pointerKey.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:19}));
   check(AppState.score.correct===1&&!AppState.pressedKeys.has(60),`${layout}: virtual pointer cancel releases through the shared controller`);
   prepare('realtime');at(0,0);triggerVirtualKey(90,true,'ui');const before=document.querySelectorAll('#pt-feedback-group circle').length;
   processMissedNotes();check(before===1&&AppState.score.wrong===4&&document.querySelectorAll('#pt-feedback-group circle').length===before,`${layout}: realtime wrong input suppresses miss visuals while each unhit staff still counts`);
   prepare('wait',{left:false,right:true});at(1,1);check(AppState.expectedNotes.every(n=>n.staffId===1)&&AppState.expectedNotes.some(n=>n.midi===74),`${layout}: practice-hand filtering keeps visible grace and excludes accompaniment`);
   triggerVirtualKey(48,true,'ui');check(AppState.score.wrong===1,`${layout}: accompaniment pitch input retains original wrong-note semantics`);
   at(1,1.5);check(!AppState.expectedNotes.some(n=>n.midi===71),`${layout}: hidden source note creates no expectation`);
   at(1,1.75);check(!AppState.expectedNotes.some(n=>n.midi===72),`${layout}: cue source note creates no expectation`);
   prepare();at(2,2);check(AppState.expectedNotes.filter(n=>n.midi===64).length===1,`${layout}: duplicate same-staff pitch merges into one expectation`);
   at(2,2.25);const tieVisual=AppState.visualNotesToStart.find(n=>n.midi===64);
   check(AppState.expectedNotes.some(n=>n.midi===64)&&tieVisual.durationMs>850,`${layout}: actual tied source combines the original sustain duration`);
   startVisualSustains();triggerVirtualKey(64,true,'ui');at(3,3);
   check(!AppState.expectedNotes.some(n=>n.midi===64)&&findSatisfiedOrSustainedMatchForMidi(64)?.source==='sustained-visual',`${layout}: tie continuation skips attack matching while active sustain accepts repeats`);
   const scoreBefore=JSON.stringify(AppState.score);triggerVirtualKey(64,true,'ui');
   check(JSON.stringify(AppState.score)===scoreBefore,`${layout}: tie sustain re-press does not change scoring`);
   prepare();setPlayerPianoType(25,{save:false});at(2,2);
   check(AppState.outOfRangeCurrentNotes.some(n=>n.midi===48)&&AppState.outOfRangeCurrentNotes.some(n=>n.midi===50)&&AppState.expectedNotes.every(n=>isMidiInPlayerRange(n.midi)),`${layout}: small keyboard reports out-of-range notes without expectations`);
   setPlayerPianoType(88,{save:false});
  }
  results.textContent+='DONE\n';
 }catch(error){results.textContent+=`ERROR: ${error.stack}\n`;}
 finally{
  stop();ensureLiveAudioReady=originalUnlock;practiceInput.handle=originalHandle;
  setPlayerPianoType(getStoredNumber(PLAYER_PIANO_STORAGE_KEY,88),{save:false});ScoreDisplay.setMode(oldLayout,{save:false});
  parent.document.getElementById('run').disabled=false;
 }
})();
