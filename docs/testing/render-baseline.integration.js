(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const originalLayout=document.getElementById('select-score-layout').value;
 const originalAutoScroll=document.getElementById('check-autoscroll').checked;
 const collect=()=>{
  pausePlaybackFromToolbar();clearVisuals();AppState.practice.left=AppState.practice.right=true;
  const cursor=osmd.cursor;cursor.reset();const records=[];
  let step=0;
  while(!cursor.Iterator.EndReached&&step<1000){
   cursor.update();const iterator=cursor.Iterator;
   buildExpectedNotesFromEntries(iterator.CurrentVoiceEntries||[],iterator.CurrentMeasureIndex,iterator.currentTimeStamp.RealValue);
   for(const note of AppState.expectedNotes)records.push({step,measure:note.mIdx,midi:note.midi,staff:note.staffId,anchor:note.anchor?{x:note.anchor.x,y:note.anchor.y}:null});
   cursor.Iterator.moveToNext();step++;
  }
  if(step>=1000)throw Error('Fixture did not terminate');
  return records;
 };
 try{
  hideToolbarPanels();document.getElementById('help-modal')?.classList.add('hidden');
  for(const key of Object.keys(AppState.audioEnabled))AppState.audioEnabled[key]=false;
  for(const key of Object.keys(AppState.midiOutEnabled))AppState.midiOutEnabled[key]=false;
  document.getElementById('check-metronome').checked=false;AppState.ledOutputMode='none';AppState.mode='wait';
  const xml=await(await fetch('/docs/testing/fixtures/geometry.musicxml')).text();
  await loadScoreIntoApp(xml,{fileName:'geometry.musicxml'});
  applyZoom(100,{save:false});AppState.hands.left=2;AppState.hands.right=1;
  const data={referenceCommit:'e6f8095',osmdVersion:'1.9.7',frameWidth:1200};
  for(const layout of ['traditional','horizontal']){
   ScoreDisplay.setMode(layout,{save:false});data[layout]=collect();
   check(data[layout].length>15&&data[layout].every(note=>note.anchor&&Number.isFinite(note.anchor.x)&&Number.isFinite(note.anchor.y)),`${layout}: beam/chord/dot/grace/tie fixture resolves finite notehead anchors`);
  }
  parent.document.getElementById('golden').textContent=JSON.stringify(data);
  const golden=await(await fetch('/docs/testing/fixtures/geometry.p4b.json')).json();
  for(const layout of ['traditional','horizontal']){
   const actual=data[layout],expected=golden[layout];
   check(actual.length===expected.length&&actual.every((note,i)=>{
    const old=expected[i];return note.step===old.step&&note.measure===old.measure&&note.midi===old.midi&&note.staff===old.staff&&Math.abs(note.anchor.x-old.anchor.x)<0.01&&Math.abs(note.anchor.y-old.anchor.y)<0.01;
   }),`${layout}: every expected note and SVG anchor matches the P4b real-OSMD baseline`);
  }
  check(!data.horizontal.some(note=>note.measure===1&&[71,72].includes(note.midi)),'hidden B4 and cue C5 do not become practice expectations');
  osmd.cursor.reset();osmd.cursor.update();buildExpectedNotesFromEntries(osmd.cursor.Iterator.CurrentVoiceEntries,0,0);
  const expected=AppState.expectedNotes.slice(),samePitch=expected.filter(note=>note.midi===60);
  check(samePitch.length===2&&samePitch[0].noteRef.id!==samePitch[1].noteRef.id&&samePitch.every(note=>osmdAdapter.resolveNote(note.noteRef)?.halfTone+12===note.midi),
   'same-pitch cross-staff expectations own distinct revision-scoped exact sources');
  check(expected.every(note=>!('logicalNote'in note)&&Object.isFrozen(note.noteRef)),'expected state keeps immutable NoteRef without vendor source objects');
  expected[0].hit=true;AppState.score.correct=3;AppState.score.wrong=2;AppState.realtimeWrongPressInCurrentContext=true;
  const live=osmd.cursor.Iterator,refs=expected.map(note=>note.noteRef);live.moveToNext();
  ScoreDisplay.setMode('traditional',{save:false});
  check(AppState.realtimeWrongPressInCurrentContext,'layout switch preserves the original realtime wrong flag');
  applyZoom(125,{save:false});ScoreDisplay.setMode('horizontal',{save:false});
  check(osmd.cursor.Iterator===live&&expected.every((note,i)=>AppState.expectedNotes[i]===note&&note.noteRef===refs[i])&&expected[0].hit&&AppState.score.correct===3&&AppState.score.wrong===2,
   'Wait relayout/zoom retains live iterator, expectation/ref identities, hit state and score');
  check(!AppState.realtimeWrongPressInCurrentContext,'zoom keeps the original visual cleanup rule for realtime wrong flag');
  const positions=osmdAdapter.readPositions();
  check(positions.painted.timestampWhole===0&&positions.traversal.timestampWhole>0,'adapter distinguishes the painted event from actual prefetch');
  applyZoom(100,{save:false});
  document.getElementById('check-looper').checked=true;AppState.looper.min=2;AppState.looper.max=3;renderLooper();
  check(document.querySelectorAll('#pt-looper-group rect').length===4,'Loop overlay draws two shades and two inclusive boundaries');
  document.getElementById('check-looper').checked=false;renderLooper();
  check(document.querySelectorAll('#pt-looper-group rect').length===0,'disabled Loop clears only its overlay');
  const oldRef=refs[0];await loadScoreIntoApp(xml,{fileName:'geometry-reloaded.musicxml'});
  check(osmdAdapter.resolveNote(oldRef)===null,'loading a new sheet invalidates all old note references');
  osmd.cursor.reset();osmd.cursor.update();buildExpectedNotesFromEntries(osmd.cursor.Iterator.CurrentVoiceEntries,0,0);
  check(AppState.expectedNotes[0].noteRef.scoreRevision!==oldRef.scoreRevision,'new expectations bind to the new sheet revision');
  const longScore=await(await fetch('/docs/testing/continuous-score.musicxml')).text();
  await loadScoreIntoApp(longScore,{fileName:'native-scroll.musicxml'});ScoreDisplay.setMode('horizontal',{save:false});
  document.getElementById('check-autoscroll').checked=true;
  const viewport=document.getElementById('music-area');osmd.cursor.reset();osmd.cursor.show();osmd.cursor.update();ScoreDisplay.follow({immediate:true});
  while(!osmd.cursor.Iterator.EndReached&&osmd.cursor.Iterator.CurrentMeasureIndex<20)osmd.cursor.Iterator.moveToNext();osmd.cursor.update();
  const before=viewport.scrollLeft;ScoreDisplay.follow();await wait(180);
  check(document.visibilityState==='visible'&&viewport.scrollLeft>before,'foreground native rAF moves the horizontal viewport');
  await wait(1200);const rect=osmd.cursor.cursorElement.getBoundingClientRect(),bounds=viewport.getBoundingClientRect();
  check(Math.abs(rect.left+rect.width/2-bounds.left-viewport.clientWidth*0.33)<3,'native rAF settles around the original 33% cursor target');
  ScoreDisplay.dispose();const stopped=viewport.scrollLeft;await wait(100);
  check(viewport.scrollLeft===stopped,'viewport dispose cancels native frame ownership');ScoreDisplay.init();
  check(ScoreDisplay.isHorizontal()=== (localStorage.getItem(TRAINER_SCORE_LAYOUT_STORAGE_KEY)==='horizontal'),'viewport reinit reads the same persisted layout');
  results.textContent+='DONE\n';
 }catch(error){results.textContent+=`ERROR ${error.stack||error}\n`;console.error(error);}
 finally{pausePlaybackFromToolbar();ScoreDisplay.setMode(originalLayout,{save:false});document.getElementById('check-autoscroll').checked=originalAutoScroll;}
})();
