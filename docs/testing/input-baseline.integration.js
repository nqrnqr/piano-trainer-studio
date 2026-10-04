(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const api=window.PianoTrainerTest,snapshot=()=>api.readPracticeSnapshot();
 const stop=()=>api.practice.stop();
 const oldLayout=document.getElementById('select-score-layout').value;
 api.practice.muteInputActivation();
 const prepare=(mode='wait',practice={left:true,right:true})=>api.practice.prepare(mode,practice);
 const at=(measure,timestamp)=>api.practice.selectEvent(measure,timestamp);
 const press=async(midi,kind='mousedown')=>{
  const key=document.querySelector(`.key[data-midi="${midi}"]`);
  key.dispatchEvent(kind==='pointerdown'?new PointerEvent(kind,{bubbles:true,pointerId:19,pointerType:'mouse'}):new MouseEvent(kind,{bubbles:true}));
  await wait(10);return key;
 };
 try{
  api.practice.muteOutputs();api.practice.assignPianoHands();api.practice.setPlayerKeyCount(88);
  await api.loadScore(await(await fetch('/docs/testing/fixtures/geometry.musicxml')).text(),{fileName:'geometry.musicxml'});
  api.practice.assignPianoHands();
  for(const layout of ['traditional','horizontal']){
   await api.setLayout(layout);prepare();at(0,0);
   const firstRefs=snapshot().expected.filter(n=>n.midi===60).map(n=>n.noteId);
   check(snapshot().expected.length===3&&firstRefs.length===2&&firstRefs[0]!==firstRefs[1],`${layout}: same pitch across actual piano staves retains two source identities`);
   const key=await press(60);
   check(snapshot().score.correct===1&&snapshot().expected.filter(n=>n.hit).length===1,`${layout}: DOM mouse press grades only one chord candidate`);
   key.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));await wait(10);
   check(snapshot().score.correct===1,`${layout}: duplicate DOM down is suppressed by the existing virtual key guard`);
   key.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
   check(!snapshot().pressed.includes(60),`${layout}: DOM mouse release clears physical input`);
   api.dispatchNote({kind:'note-on',note:60,velocity:72,source:'midi',channel:7,receivedAtMs:performance.now()});
   check(snapshot().score.correct===2&&snapshot().expected.some(n=>!n.hit),`${layout}: MIDI bridge consumes the other staff and leaves the partial chord waiting`);
   api.dispatchInput(60,true,'ui');check(snapshot().score.correct===2&&snapshot().score.wrong===0,`${layout}: already-hit re-press remains ungraded`);
   api.dispatchInput(61,true,'ui');check(snapshot().score.correct===3&&snapshot().expected.every(n=>n.hit),`${layout}: final chord note completes all expectations`);
   check(api.practice.readInputs().some(i=>i.source==='ui'&&i.channel===null)&&api.practice.readInputs().some(i=>i.source==='midi'&&i.channel===7),`${layout}: DOM and MIDI enter one controller with their original source metadata`);
   api.dispatchInput(90,true,'ui');const marker=snapshot().activeIncorrect.find(n=>n.midi===90).id;
   api.dispatchInput(90,false,'ui');check(snapshot().score.wrong===1&&snapshot().releasedIncorrect.includes(marker),`${layout}: wrong release transfers the same feedback marker to history`);
   prepare();at(0,0);const pointerKey=await press(60,'pointerdown');pointerKey.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:19}));
   check(snapshot().score.correct===1&&!snapshot().pressed.includes(60),`${layout}: virtual pointer cancel releases through the shared controller`);
   prepare('realtime');at(0,0);api.dispatchInput(90,true,'ui');const before=document.querySelectorAll('#pt-feedback-group circle').length;
   api.practice.processMisses();check(before===1&&snapshot().score.wrong===4&&document.querySelectorAll('#pt-feedback-group circle').length===before,`${layout}: realtime wrong input suppresses miss visuals while each unhit staff still counts`);
   prepare('wait',{left:false,right:true});at(1,1);check(snapshot().expected.every(n=>n.staffId===1)&&snapshot().expected.some(n=>n.midi===74),`${layout}: practice-hand filtering keeps visible grace and excludes accompaniment`);
   api.dispatchInput(48,true,'ui');check(snapshot().score.wrong===1,`${layout}: accompaniment pitch input retains original wrong-note semantics`);
   at(1,1.5);check(!snapshot().expected.some(n=>n.midi===71),`${layout}: hidden source note creates no expectation`);
   at(1,1.75);check(!snapshot().expected.some(n=>n.midi===72),`${layout}: cue source note creates no expectation`);
   prepare();at(2,2);check(snapshot().expected.filter(n=>n.midi===64).length===1,`${layout}: duplicate same-staff pitch merges into one expectation`);
   at(2,2.25);const tieVisual=snapshot().visualNotes.find(n=>n.midi===64);
   check(snapshot().expected.some(n=>n.midi===64)&&tieVisual.durationMs>850,`${layout}: actual tied source combines the original sustain duration`);
   api.practice.startSustains();api.dispatchInput(64,true,'ui');at(3,3);
   check(!snapshot().expected.some(n=>n.midi===64)&&api.practice.findSatisfied(64)?.source==='sustained-visual',`${layout}: tie continuation skips attack matching while active sustain accepts repeats`);
   const scoreBefore=JSON.stringify(snapshot().score);api.dispatchInput(64,true,'ui');
   check(JSON.stringify(snapshot().score)===scoreBefore,`${layout}: tie sustain re-press does not change scoring`);
   prepare();api.practice.setPlayerKeyCount(25);at(2,2);
   check(snapshot().outOfRange.some(n=>n.midi===48)&&snapshot().outOfRange.some(n=>n.midi===50)&&snapshot().expected.every(n=>api.practice.isMidiInRange(n.midi)),`${layout}: small keyboard reports out-of-range notes without expectations`);
   api.practice.setPlayerKeyCount(88);
  }

 }catch(error){results.textContent+=`ERROR: ${error.stack}\n`;}
 finally{
  stop();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();
  parent.document.getElementById('run').disabled=false;
 }
    if (!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent)) results.textContent += '\nAll checks passed.\n';
})();
