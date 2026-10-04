(async()=>{
 const results=parent.document.getElementById('results'),el=id=>document.getElementById(id),fixture=window.ProductionLifecycleFixture,midi=window.MidiFixture;
 results.textContent='';const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const until=async(predicate,label)=>{for(let i=0;i<150;i++){if(predicate())return;await wait(30);}throw Error('Timeout: '+label);};
 const transition=(type,persisted)=>window.dispatchEvent(new PageTransitionEvent(type,{persisted}));
 const key=note=>document.querySelector(`.key[data-midi="${note}"]`);
 const send=(input,note,down)=>input.onmidimessage({data:new Uint8Array([down?0x90:0x80,note,down?100:0]),receivedTime:performance.now()});
 let finalized=false;
 try{
  check([...document.scripts].some(script=>/\/js\/generated\/app\.js/.test(script.src))&&!window.PianoTrainerTest,'actual production bundle/main entry runs without test facade');
  await until(()=>typeof midi.first.onmidimessage==='function','MIDI startup');
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text(),data=new DataTransfer();data.items.add(new File([xml],'page-cache.musicxml',{type:'application/xml'}));el('file-input').files=data.files;el('file-input').dispatchEvent(new Event('change',{bubbles:true}));
  await until(()=>document.querySelector('#osmd-container svg')&&el('file-input').value==='','native score import');
  const svg=document.querySelector('#osmd-container svg'),firstKey=key(64),baseline=fixture.snapshot().listeners;
  check(!!svg&&document.querySelectorAll('#virtual-keyboard .key').length===88,'actual production file input loads OSMD and one keyboard');
  for(const id of ['check-metronome','check-looper','check-autoscroll'])el(id).checked=false;
  const layout=document.querySelector('select#select-score-layout');
  firstKey.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));await until(()=>firstKey.classList.contains('active'),'virtual down');
  check(firstKey.dataset.virtualDown==='1','native virtual key works before cache');
  for(let cycle=1;cycle<=2;cycle++){
   el('btn-scores').click();await until(()=>fixture.snapshot().databases===1,'open native library before cache');el('btn-scores').click();
   el('btn-play').click();await until(()=>el('btn-play').textContent.includes('Pause'),'Play');
   if(cycle===1){await until(()=>document.querySelector('.key.expected-l,.key.expected-r'),'native count-in handoff');send(midi.first,61,true);send(midi.first,61,false);check(!el('live-score').textContent.includes('100'),'production input creates a non-default score before suspension');}
   const cachedSvg=document.querySelector('#osmd-container svg');
   const score=el('live-score').textContent,cursor=document.querySelector('[id^="cursorImg"]')?.style.left;
   transition('pagehide',true);transition('pagehide',true);
   check(el('btn-play').textContent.includes('Play')&&document.querySelector('#osmd-container svg')===cachedSvg&&key(64)===firstKey,`cache ${cycle}: pause retains score SVG, keys and UI owners`);
   check(firstKey.dataset.virtualDown==='0'&&!firstKey.classList.contains('active')&&midi.access.onstatechange===null&&midi.first.onmidimessage===null,`cache ${cycle}: held input is released and MIDI detached`);
   check(fixture.snapshot().databases===0,`cache ${cycle}: native library connection is closed`);
   const requests=midi.requests;
   const replacement={id:midi.first.id,name:'Returned Keyboard '+cycle,state:'connected',onmidimessage:null};midi.access.inputs.set(replacement.id,replacement);
   transition('pageshow',true);transition('pageshow',true);
   await until(()=>typeof replacement.onmidimessage==='function','MIDI return');
   await until(()=>fixture.snapshot().listeners===baseline,'settled UI binding ownership after cache');
   check(midi.requests===requests+1&&fixture.snapshot().listeners===baseline,`cache ${cycle}: reconnect once without duplicate bindings`);
   check(el('live-score').textContent===score&&document.querySelector('[id^="cursorImg"]')?.style.left===cursor,`cache ${cycle}: score and displayed position survive`);
   firstKey.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));await until(()=>firstKey.classList.contains('active'),'returned virtual input');firstKey.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
   check(!firstKey.classList.contains('active')&&firstKey.dataset.virtualDown==='0',`cache ${cycle}: same virtual key handles down/up again`);
   send(replacement,70,true);check(key(70).classList.contains('active'),`cache ${cycle}: returned MIDI port drives production input`);send(replacement,70,false);
   el('btn-play').click();await until(()=>el('btn-play').textContent.includes('Pause'),'returned Play');el('btn-reset').click();
   check(el('btn-play').textContent.includes('Play')&&el('live-score').textContent.includes('100'),`cache ${cycle}: Play/Reset work after return`);
   if(layout){layout.value=cycle===1?'horizontal':'traditional';layout.dispatchEvent(new Event('change',{bubbles:true}));check(localStorage.getItem('pt_scoreLayout')===layout.value,`cache ${cycle}: layout control stays bound`);}
   const saved=el('midi-in').value;midi.access.inputs.delete(replacement.id);midi.access.onstatechange();check(replacement.onmidimessage===null,`cache ${cycle}: device removal detaches returned input`);midi.access.inputs.set(replacement.id,replacement);midi.access.onstatechange();check(typeof replacement.onmidimessage==='function'&&el('midi-in').value===saved,`cache ${cycle}: hotplug selects the saved input again`);
   midi.first=replacement;
  }
  el('btn-scores').click();await until(()=>fixture.snapshot().databases===1,'library reopened');
  check(fixture.snapshot().databases===1,'native library opens lazily after restoration');
  transition('pagehide',false);finalized=true;
  check(fixture.snapshot().listeners===0&&fixture.snapshot().databases===0&&document.querySelectorAll('#virtual-keyboard .key').length===0,'ordinary pagehide performs final production disposal');
  const requests=midi.requests;transition('pageshow',true);await wait(60);check(midi.requests===requests&&document.querySelectorAll('#virtual-keyboard .key').length===0,'final disposal cannot be revived by a later pageshow');
 }catch(error){results.textContent+='ERROR '+error.stack+'\n';}
 finally{if(!finalized)transition('pagehide',false);try{results.textContent+='CLEANUP '+await window.__PT_LIBRARY_FIXTURE__.cleanup()+' disposable databases\n';}catch(error){results.textContent+='CLEANUP ERROR '+error.stack+'\n';}results.textContent+='RESOURCES '+JSON.stringify(fixture.snapshot())+'\n';}
 if(!/(?:FAIL|ERROR)/.test(results.textContent))results.textContent+='DONE\n';
})();
