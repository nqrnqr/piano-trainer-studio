(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const run=(raw,options)=>{try{return {result:window.TransposeEngine.transposeXml(raw,options)};}catch(error){return {error:{name:error.name,message:error.message}};}};
 const el=id=>document.getElementById(id),change=(id,value,event='change')=>{el(id).value=value;el(id).dispatchEvent(new Event(event));};
 const pitch=()=>osmd.cursor.Iterator.CurrentVoiceEntries[0].Notes[0].Pitch.getHalfTone()+12;
 async function until(predicate){const deadline=performance.now()+5000;while(!predicate()){if(performance.now()>deadline)throw Error('UI command did not settle');await new Promise(resolve=>setTimeout(resolve,20));}}
 const nativeLoad=window.loadScoreIntoApp;let loads=0;
 try{
  pausePlaybackFromToolbar();trainerPlayback.dispose();
  const golden=await(await fetch('/docs/testing/fixtures/transpose.e91ca87.json')).json();
  for(const item of golden.cases)check(JSON.stringify(run(item.raw,item.options))===JSON.stringify(item.expected),`native XML ${item.id} matches ${golden.baseline}`);
  check(el('btn-transpose-apply').disabled&&el('transpose-status').textContent.includes('Load a MusicXML'),'initial controls report unavailable without a score');
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();
  await nativeLoad(xml,{fileName:'Original.musicxml',title:'Original',fileType:'musicxml'});
  const state=AppState.transpose;updateTempo('percent',75);
  check(!el('btn-transpose-apply').disabled&&el('transpose-target-key').options.length===15,'load enables controls with original preset list');
  el('btn-transpose-apply').click();
  check(el('transpose-status').classList.contains('is-error')&&el('transpose-status').textContent.includes('already matches'),'native key Apply rejects the original matching signature');
  change('transpose-mode','semitone');change('transpose-semitones','3','input');
  check(state.mode==='semitone'&&state.semitones===3&&el('transpose-semitones-value').textContent==='3','native mode and slider events update typed state');
  window.loadScoreIntoApp=async(...args)=>{loads++;return nativeLoad(...args);};
  window.TransposeUI.init();window.TransposeUI.init();
  el('btn-transpose-apply').click();await until(()=>state.active&&pitch()===63);
  check(loads===1&&el('transpose-status').textContent==='Applied: +3 semitones','repeated init gives one load and the original positive status');
  check(AppState.currentScoreOriginalData===xml&&AppState.currentScoreOriginalFileName==='Original.musicxml'&&AppState.speedPercent===.75,'button Apply preserves original metadata and speed');
  change('transpose-semitones','-2','input');
  el('transpose-update-key-signature').checked=false;el('transpose-update-key-signature').dispatchEvent(new Event('change'));
  el('btn-transpose-apply').click();await until(()=>state.activeLabel==='-2 semitones'&&pitch()===58);
  check(loads===2&&window.TransposeEngine.detectScoreKey(window.TransposeEngine.parseXml(AppState.currentScoreData)).fifths===0,'repeated Apply starts from original and keeps unchecked key signature');
  el('btn-transpose-reset').click();await until(()=>!state.active&&pitch()===60);
  check(loads===3&&state.semitones===0&&state.targetKey==='sig-0'&&el('transpose-status').textContent.includes('Ready.'),'native Reset restores original pitch, preset and status');
  check(AppState.transpose===state&&AppState.currentScoreOriginalData===xml&&AppState.speedPercent===.75,'Reset preserves state identity, source and speed');
  window.TransposeUI.dispose();window.TransposeUI.dispose();
  change('transpose-mode','key');el('btn-transpose-apply').click();
  check(state.mode==='semitone'&&loads===3,'explicit disposal removes actual UI listeners');
  window.TransposeUI.init();change('transpose-mode','key');
  check(state.mode==='key'&&el('transpose-semitones').value==='0','controls reinitialize after explicit disposal');
  check(optionalLedOutput.enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'transpose runs with default/no-op LED composition');
  results.textContent+='DONE\n';
 }catch(error){results.textContent+='ERROR '+error.stack+'\n';}
 finally{window.loadScoreIntoApp=nativeLoad;pausePlaybackFromToolbar();}
})();
