(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const api=window.PianoTrainerTest,snapshot=()=>api.readPracticeSnapshot();
 const originalLayout=document.getElementById('select-score-layout').value;
 const originalAutoScroll=document.getElementById('check-autoscroll').checked;
 const collect=()=>{
  api.practice.prepare();api.pause();api.practice.resetTraversal();const records=[];
  let step=0;
  while(!api.practice.readTraversal().end&&step<1000){
   api.render.updateCursor();api.practice.buildCurrentExpectations();
   for(const note of snapshot().expected)records.push({step,measure:note.mIdx,midi:note.midi,staff:note.staffId,anchor:note.anchor});
   api.practice.advanceTraversal();step++;
  }
  if(step>=1000)throw Error('Fixture did not terminate');
  return records;
 };
 try{
  api.practice.muteOutputs();
  const xml=await(await fetch('/docs/testing/fixtures/geometry.musicxml')).text();
  await api.loadScore(xml,{fileName:'geometry.musicxml'});
  api.render.zoom(100);api.practice.assignPianoHands();
  const data={referenceCommit:'e6f8095',osmdVersion:'1.9.7',frameWidth:1200};
  for(const layout of ['traditional','horizontal']){
   await api.setLayout(layout,{save:false});data[layout]=collect();
   check(data[layout].length>15&&data[layout].every(note=>note.anchor&&Number.isFinite(note.anchor.x)&&Number.isFinite(note.anchor.y)),`${layout}: beam/chord/dot/grace/tie fixture resolves finite notehead anchors`);
  }
  parent.document.getElementById('golden').textContent=JSON.stringify(data);
  const golden=await(await fetch('/docs/testing/fixtures/geometry.p4b.json')).json();
  for(const layout of ['traditional','horizontal']){
   const actual=data[layout],expected=golden[layout];
   const offset=layout==='horizontal'?{x:actual[0].anchor.x-expected[0].anchor.x,y:actual[0].anchor.y-expected[0].anchor.y}:{x:0,y:0};
   check(actual.length===expected.length&&actual.every((note,i)=>{
    const old=expected[i];return note.step===old.step&&note.measure===old.measure&&note.midi===old.midi&&note.staff===old.staff&&Math.abs(note.anchor.x-old.anchor.x-offset.x)<0.01&&Math.abs(note.anchor.y-old.anchor.y-offset.y)<0.01;
   }),`${layout}: every expected note and SVG anchor matches the P4b real-OSMD baseline`);
  }
  check(!data.horizontal.some(note=>note.measure===1&&[71,72].includes(note.midi)),'hidden B4 and cue C5 do not become practice expectations');
  api.practice.selectEvent(0,0);
  const identity=api.render.captureIdentity(),expected=snapshot().expected,samePitch=expected.filter(note=>note.midi===60);
  check(samePitch.length===2&&samePitch[0].noteId!==samePitch[1].noteId&&api.render.readIdentity(identity).sourcesMatch,
   'same-pitch cross-staff expectations own distinct revision-scoped exact sources');
  check(api.render.readIdentity(identity).refsFrozen,'expected state keeps immutable NoteRef without vendor source objects');
  api.render.seedScore(3,2);api.render.setWrongContext(true);
  api.practice.advanceTraversal();
  await api.setLayout('traditional',{save:false});
  check(snapshot().wrongContext,'layout switch preserves the original realtime wrong flag');
  api.render.zoom(125);await api.setLayout('horizontal',{save:false});
  check(api.render.readIdentity(identity).iteratorSame&&api.render.readIdentity(identity).expectationsSame&&api.render.readIdentity(identity).refsSame&&snapshot().expected[0].hit&&snapshot().score.correct===3&&snapshot().score.wrong===2,
   'Wait relayout/zoom retains live iterator, expectation/ref identities, hit state and score');
  check(snapshot().wrongContext,'zoom preserves the current realtime wrong flag while reprojecting feedback');
  const positions=api.readViewportSnapshot();
  check(positions.painted.timestampWhole===0&&positions.traversal.timestampWhole>0,'adapter distinguishes the painted event from actual prefetch');
  api.render.zoom(100);
  document.getElementById('check-looper').checked=true;api.render.renderLoop(2,3);await api.horizontal.ready();api.render.renderLoop(2,3);
  check(document.querySelectorAll('#pt-looper-group rect').length===4*api.horizontal.resources().chunks,'Loop overlay draws the two shades and two inclusive boundaries in each displayed copy');
  document.getElementById('check-looper').checked=false;api.render.renderLoop();
  check(document.querySelectorAll('#pt-looper-group rect').length===0,'disabled Loop clears only its overlay');
  await api.loadScore(xml,{fileName:'geometry-reloaded.musicxml'});
  check(!api.render.readIdentity(identity).oldRefValid,'loading a new sheet invalidates all old note references');
  api.practice.selectEvent(0,0);
  check(api.render.readIdentity(identity).revisionChanged,'new expectations bind to the new sheet revision');
  const longScore=await(await fetch('/docs/testing/continuous-score.musicxml')).text();
  await api.loadScore(longScore,{fileName:'native-scroll.musicxml'});await api.setLayout('horizontal',{save:false});
  document.getElementById('check-autoscroll').checked=true;
  const viewport=document.getElementById('music-area');api.render.seekMeasure(0,false);api.render.follow(true);
  api.render.seekMeasure(20,false);
  const before=viewport.scrollLeft;api.render.follow();await wait(180);
  check(document.visibilityState==='visible'&&viewport.scrollLeft>before,'foreground native rAF moves the horizontal viewport');
  await wait(1200);const rect=api.readViewportSnapshot().cursorBounds,bounds=viewport.getBoundingClientRect();
  check(Math.abs(rect.left+rect.width/2-bounds.left-viewport.clientWidth*0.33)<3,'native rAF settles around the original 33% cursor target');
  api.render.disposeViewport();const stopped=viewport.scrollLeft;await wait(100);
  check(viewport.scrollLeft===stopped,'viewport dispose cancels native frame ownership');api.render.initViewport();
  check((api.readViewportSnapshot().layout==='horizontal')=== (localStorage.getItem('pt_scoreLayout')==='horizontal'),'viewport reinit reads the same persisted layout');

 }catch(error){results.textContent+=`ERROR ${error.stack||error}\n`;console.error(error);}
 finally{api.pause();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();parent.document.getElementById('run').disabled=false;}
 if (!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent)) results.textContent+='DONE\n';
})();
