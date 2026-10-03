(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const api=window.PianoTrainerTest,s=api.score,snapshot=s.readSnapshot;
 const run=(raw,options)=>{try{return {result:s.transposeXml(raw,options)};}catch(error){return {error:{name:error.name,message:error.message}};}};
 const el=id=>document.getElementById(id),change=(id,value,event='change')=>{el(id).value=value;el(id).dispatchEvent(new Event(event));};
 const pitch=s.readFirstPitch;
 async function until(predicate){const deadline=performance.now()+5000;while(!predicate()){if(performance.now()>deadline)throw Error('UI command did not settle');await new Promise(resolve=>setTimeout(resolve,20));}}

 try{
  api.pause();s.disposeCoordinator();
  const golden=await(await fetch('/docs/testing/fixtures/transpose.e91ca87.json')).json();
  for(const item of golden.cases)check(JSON.stringify(run(item.raw,item.options))===JSON.stringify(item.expected),`native XML ${item.id} matches ${golden.baseline}`);
  check(el('btn-transpose-apply').disabled&&el('transpose-status').textContent.includes('Load a MusicXML'),'initial controls report unavailable without a score');
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();
  await api.loadScore(xml,{fileName:'Original.musicxml',title:'Original',fileType:'musicxml'});
  s.capture();s.updateTempo(75);
  check(!el('btn-transpose-apply').disabled&&el('transpose-target-key').options.length===15,'load enables controls with original preset list');
  el('btn-transpose-apply').click();
  check(el('transpose-status').classList.contains('is-error')&&el('transpose-status').textContent.includes('already matches'),'native key Apply rejects the original matching signature');
  change('transpose-mode','semitone');change('transpose-semitones','3','input');
  check(snapshot().transpose.mode==='semitone'&&snapshot().transpose.semitones===3&&el('transpose-semitones-value').textContent==='3','native mode and slider events update typed state');
  s.observeLoads();
  s.initTranspose();s.initTranspose();
  el('btn-transpose-apply').click();await until(()=>snapshot().transpose.active&&pitch()===63);
  check(snapshot().loads===1&&el('transpose-status').textContent==='Applied: +3 semitones','repeated init gives one load and the original positive status');
  check(snapshot().originalText===xml&&snapshot().originalFileName==='Original.musicxml'&&snapshot().speed===.75,'button Apply preserves original metadata and speed');
  change('transpose-semitones','-2','input');
  el('transpose-update-key-signature').checked=false;el('transpose-update-key-signature').dispatchEvent(new Event('change'));
  el('btn-transpose-apply').click();await until(()=>snapshot().transpose.activeLabel==='-2 semitones'&&pitch()===58);
  check(snapshot().loads===2&&s.readKeyFifths()===0,'repeated Apply starts from original and keeps unchecked key signature');
  el('btn-transpose-reset').click();await until(()=>!snapshot().transpose.active&&pitch()===60);
  check(snapshot().loads===3&&snapshot().transpose.semitones===0&&snapshot().transpose.targetKey==='sig-0'&&el('transpose-status').textContent.includes('Ready.'),'native Reset restores original pitch, preset and status');
  check(snapshot().transposeSameAsCapture&&snapshot().originalText===xml&&snapshot().speed===.75,'Reset preserves state identity, source and speed');
  s.disposeTranspose();s.disposeTranspose();
  change('transpose-mode','key');el('btn-transpose-apply').click();
  check(snapshot().transpose.mode==='semitone'&&snapshot().loads===3,'explicit disposal removes actual UI listeners');
  s.initTranspose();change('transpose-mode','key');
  check(snapshot().transpose.mode==='key'&&el('transpose-semitones').value==='0','controls reinitialize after explicit disposal');
  check(api.practice.readLed().enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'transpose runs with default/no-op LED composition');

 }catch(error){results.textContent+='ERROR '+error.stack+'\n';}
 finally{api.pause();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();if(!results.textContent.includes('ERROR'))results.textContent+='DONE\n';parent.document.getElementById('run').disabled=false;}
})();
