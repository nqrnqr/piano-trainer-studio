(async()=>{
 const results=parent.document.getElementById('results'),el=id=>document.getElementById(id),wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const until=async(predicate,label)=>{for(let i=0;i<1200;i++){if(predicate())return;await wait(10);}throw Error('Timeout '+label);};
 const change=(id,value)=>{const input=el(id);if(input.type==='checkbox')input.checked=value;else input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}));};
 const pause=()=>{if(el('btn-play').textContent.includes('Pause'))el('btn-play').click();};
 const cursor=()=>el('select-score-layout').value==='horizontal'?document.querySelector('.pt-performance-cursor'):document.querySelector('#source-score [id^="cursorImg"]');
 const hit=()=>{for(const key of document.querySelectorAll('.key.expected-l,.key.expected-r')){key.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));key.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));}};
 let disposed=false;
 window.HorizontalProductionCleanup=async()=>{if(disposed)return;disposed=true;window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false}));
  try{await window.__PT_LIBRARY_FIXTURE__.cleanup();check(window.ProductionLifecycleFixture.snapshot().listeners===0&&window.ProductionLifecycleFixture.snapshot().databases===0,'production disposal releases all application bindings and database connections');results.textContent+='DONE\n';}catch(error){results.textContent+=`ERROR ${error.stack}\n`;}
  parent.document.getElementById('dispose').disabled=true;};
 try{
  check(!window.PianoTrainerTest&&[...document.scripts].some(script=>script.src.includes('/js/generated/app.js')),'production main runs without facade');
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text(),file=new DataTransfer();file.items.add(new File([xml],'production-repeat.musicxml',{type:'application/xml'}));
  change('select-score-layout','traditional');el('file-input').files=file.files;el('file-input').dispatchEvent(new Event('change',{bubbles:true}));await until(()=>document.querySelector('#source-score svg')&&el('file-input').value==='','native file import');
  change('check-metronome',false);change('check-looper',false);change('check-autoscroll',true);change('val-speed','200');
  const observed={};
  for(const mode of ['wait','follow','realtime'])for(const layout of ['traditional','horizontal']){
   pause();el('btn-reset').click();change('select-score-layout',layout);if(layout==='horizontal')await until(()=>document.querySelector('.pt-performance-cursor')?.dataset.eventId,'derived score commit');
   el('mode-'+mode).click();for(const id of ['practice-lh','practice-rh'])if(!el(id).checked)el(id).click();
   el('btn-play').click();await until(()=>el('btn-play').textContent.includes('Pause'),'native Play');
   await until(()=>document.querySelector('.key.expected-l,.key.expected-r'),'native count-in handoff');
   let previous='',points=[],world=-Infinity;
   for(let guard=0;guard<1400&&el('btn-play').textContent.includes('Pause');guard++){
    const node=cursor(),keys=[...document.querySelectorAll('.key.expected-l,.key.expected-r')].map(key=>Number(key.dataset.midi)).sort((a,b)=>a-b),identity=layout==='horizontal'?node?.dataset.eventId:node?.style.left+'/'+node?.style.top;
    if(keys.length&&identity&&identity!==previous){points.push({keys,score:el('live-score').textContent});previous=identity;
     if(layout==='horizontal'){const x=Number(node.dataset.logicalX);check(x>=world,`${mode}: native formal event ${points.length} moves right`);world=x;}
     hit();}
    await wait(10);
   }
   check(el('btn-play').textContent.includes('Play')&&points.length===20,`${mode}/${layout}: native clock and virtual input finish all 20 repeated events`);
   observed[mode+'/'+layout]={pitches:points.map(point=>point.keys),score:el('live-score').textContent};
   results.textContent+=`OBSERVED ${mode}/${layout} ${JSON.stringify(observed[mode+'/'+layout])}\n`;
   if(layout==='horizontal')check(JSON.stringify(observed[mode+'/traditional'])===JSON.stringify(observed[mode+'/horizontal']),mode+': production layouts have identical input order and final score');
  }
  change('select-score-layout','horizontal');el('mode-realtime').click();change('check-looper',true);change('val-loop-min','1');change('val-loop-max','1');el('btn-reset').click();
  let rounds=new Set(),maxWorld=-Infinity;el('btn-play').click();await until(()=>el('btn-play').textContent.includes('Pause'),'Loop Play');
  for(let i=0;i<1200&&rounds.size<4;i++){const node=cursor();if(node?.dataset.eventId){maxWorld=Math.max(maxWorld,Number(node.dataset.logicalX));for(const chunk of document.querySelectorAll('.pt-horizontal-canvas > svg'))if(chunk.querySelector('path'))rounds.add(chunk.dataset.loopIteration);}hit();await wait(10);}
  await until(()=>Number(cursor().dataset.logicalX)>700,'native Loop advances into later copies');maxWorld=Number(cursor().dataset.logicalX);pause();
  const event=cursor().dataset.eventId,score=el('live-score').textContent,before=window.ProductionLifecycleFixture.snapshot();
  window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));await wait(120);
  check(cursor().dataset.eventId===event&&el('live-score').textContent===score,'production cache suspend/resume retains the exact Loop display event and score');
  check(window.ProductionLifecycleFixture.snapshot().listeners===before.listeners,'production cache return preserves single listener ownership');
  change('select-score-layout','traditional');change('select-score-layout','horizontal');await until(()=>cursor()?.dataset.eventId===event,'layout return');
  check(el('live-score').textContent===score,'production Loop layout roundtrip preserves score');
  check(document.querySelectorAll('.pt-horizontal-canvas > svg').length<=7,'production Loop keeps the mounted SVG window bounded');
  results.textContent+=`PRODUCTION ${JSON.stringify({observed,window:document.querySelectorAll('.pt-horizontal-canvas > svg').length,maxWorld,resources:window.ProductionLifecycleFixture.snapshot()})}\nREADY_FOR_CAPTURE\n`;
  parent.document.getElementById('dispose').disabled=false;
 }catch(error){results.textContent+=`ERROR ${error.stack}\n`;await window.HorizontalProductionCleanup();}
})();
