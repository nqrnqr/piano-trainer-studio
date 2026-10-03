(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const el=id=>document.getElementById(id),change=(id,value)=>{if(value!==undefined)el(id).checked=value;el(id).dispatchEvent(new Event('change',{bubbles:true}));};
 const api=window.PianoTrainerTest,p=api.preferences,snapshot=p.readSnapshot;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),f=window.__PT_PREFERENCE_CONTROLS_FIXTURE__,oldAlert=window.alert,oldConfirm=window.confirm;
 try{
  api.pause();api.score.disposeCoordinator();api.controls.hidePanels(true);api.audio.pianoVolume(0);api.audio.metroVolume(0);
  await api.loadScore(await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text(),{fileName:'simple-repeat.musicxml'});
  const initial=f.snapshot();results.textContent+='INITIAL '+JSON.stringify(initial)+'\n';p.init();p.init();
  check(JSON.stringify(f.snapshot())===JSON.stringify(initial),'repeated init retains one native listener set');
  check(initial['hand-assignment-controls']===2&&initial['settings-actions']===4,'score load and settings buttons bind their original two/four listeners');
  el('mode-follow').click();check(snapshot().mode==='follow'&&localStorage.getItem("pt_trainerMode")==='follow','native mode radio commits and saves Follow');
  check(!snapshot().practice.left&&snapshot().practice.right&&snapshot().playback.left&&!snapshot().playback.right,'Follow starts with its original right-practice/left-playback pair');
  el('practice-rh').click();check(el('practice-rh').checked&&snapshot().practice.right,'Follow keeps the selected practice hand checked');
  el('practice-lh').click();check(snapshot().practice.left&&!snapshot().practice.right&&!snapshot().playback.left&&snapshot().playback.right,'native Follow hand click selects its opposite accompaniment');
  check(el('enable-staff-lh').disabled&&el('enable-staff-rh').disabled&&el('practice-wait-note').textContent.includes('opposite hand'),'Follow updates disabled playback controls and note');
  el('mode-realtime').click();change('practice-lh',false);change('enable-staff-rh',false);p.captureRealtime();
  el('mode-wait').click();check(snapshot().mode==='wait'&&snapshot().practice.left&&snapshot().practice.right&&!snapshot().playback.left&&!snapshot().playback.right,'Wait retains its independent hand settings');
  change('enable-staff-rh',true);check(!el('enable-staff-rh').checked&&!snapshot().playback.right,'Wait rejects programmatic playback toggle edits');
  change('enable-hand-staves',false);el('mode-follow').click();check(!snapshot().audio.hands&&!el('enable-hand-staves').checked&&snapshot().practice.left,'mode changes retain saved audio preference and previous Follow hand');
  el('mode-realtime').click();check(snapshot().realtimeSame&&!snapshot().practice.left&&!snapshot().playback.right,'returning to Realtime restores its original settings object and choices');
  change('enable-instrument',true);check(snapshot().audio.instrument&&localStorage.getItem("pt_audioInstrument")==='true'&&!el('routing-midiin-boost-row').classList.contains('hidden'),'instrument audio routing updates boost visibility');
  change('enable-midiout-virtual-keyboard',true);check(snapshot().midi.virtual&&localStorage.getItem("pt_midiOutVirtualKeyboard")==='true','MIDI virtual route persists independently');
  change('check-low-latency-playback',true);change('check-low-latency-playback',false);check(!snapshot().lowLatency&&localStorage.getItem("pt_lowLatencyPlaybackEnabled")==='false','native low-latency toggle persists its disabled preference');
  change('check-fullscreen-on-play',true);check(snapshot().fullscreenOnPlay&&localStorage.getItem("pt_fullscreenOnPlay")==='true','fullscreen-on-play native preference updates state and storage');
  change('check-autoscroll',false);check(localStorage.getItem("pt_autoScroll")==='false','Auto Scroll native preference saves its checkbox');
  change('check-future-preview',false);check(!snapshot().futurePreview&&snapshot().futureDepth===1&&snapshot().previewEvents===0&&localStorage.getItem("pt_futurePreviewEnabled")==='false','future preview edit preserves depth one and invalidates its current events');
  change('check-correct-highlight',false);check(!snapshot().correctHighlight&&localStorage.getItem("pt_correctHighlightEnabled")==='false','correct highlight native preference persists');
  change('check-feedback',false);check(!snapshot().feedback&&localStorage.getItem("pt_feedbackEnabled")==='false','feedback checkbox commits its preference');
  change('check-keyboard',false);check(el('virtual-keyboard-container').classList.contains('hidden'),'keyboard toggle hides native container');change('check-keyboard',true);check(!el('virtual-keyboard-container').classList.contains('hidden'),'keyboard toggle shows and redraws native container');
  el('assign-lh').value='';el('assign-rh').value='2';el('assign-rh').dispatchEvent(new Event('change'));check(snapshot().hands.left===null&&snapshot().hands.right===2&&snapshot().timelineDirty,'native staff assignment accepts the left none option and rebuilds its preview');
  check(snapshot().expectedRoles.length>0&&snapshot().expectedRoles.every(role=>role==='right'),'captured OSMD frame uses the newly assigned practiced staff');
  const oldHands=JSON.stringify(snapshot().hands);el('assign-rh').value='';el('assign-rh').dispatchEvent(new Event('change'));check(JSON.stringify(snapshot().hands)===oldHands,'empty right-staff assignment retains the previous committed hands');
  localStorage.setItem("pt_trainerMode",'saved-invalid');localStorage.setItem("pt_trainerMidiOutVolume",'999');localStorage.setItem("pt_trainerMidiInBoost",'25');localStorage.setItem("pt_trainerZoom",'');p.applySaved();
  check(snapshot().mode==='saved-invalid'&&el('mode-realtime').checked&&snapshot().midiOutVolume===100&&snapshot().midiInBoost===50,'persisted application retains invalid mode fallback and clamped levels');
  check(localStorage.getItem("pt_trainerZoom")==='100'&&snapshot().inputVelocity&&snapshot().liveLowLatency,'persisted application seeds empty zoom and forces monitoring flags');
  // MIDI permission denial leaves channel option lists empty. Populate through
  // the production UI command so this case checks the normal selected values.
  api.midi.populateChannels('midi-out-channel');api.midi.populateChannels('midi-lights-channel');
  const selected=[],handlers=[];for(const id of ['midi-in','midi-out','midi-out-channel','midi-lights','midi-lights-channel']){const handler=()=>selected.push([id,el(id).value]);el(id).addEventListener('change',handler);handlers.push([id,handler]);}
  p.captureInputs();p.restoreDefaults();for(const [id,handler]of handlers)el(id).removeEventListener('change',handler);
  results.textContent+='MIDI_RESET '+JSON.stringify(selected)+'\n';
  check(JSON.stringify(selected)===JSON.stringify([['midi-in','none'],['midi-out','none'],['midi-out-channel','1'],['midi-lights','none'],['midi-lights-channel','1']]),'reset dispatches the five native MIDI change events in the original order');
  check(snapshot().mode==='realtime'&&el('mode-realtime').checked&&!snapshot().horizontal&&snapshot().zoom===1,'reset restores Realtime, traditional layout and 100 percent zoom');
  check(snapshot().hands.left===2&&snapshot().hands.right===1&&el('assign-lh').value==='2'&&el('assign-rh').value==='1','reset restores actual score default staff assignments');
  check(snapshot().pressedSame&&snapshot().reservationsSame&&snapshot().futurePreview&&snapshot().correctHighlight,'reset retains shared Set/Map identity and highlight defaults');
  check(el('val-piano-vol').value==='80'&&el('val-metro-vol').value==='25'&&snapshot().midiInBoost===100,'reset restores original volume and MIDI boost defaults');api.audio.pianoVolume(0);api.audio.metroVolume(0);
  window.confirm=()=>false;p.setFeedback(false);el('btn-reset-preferences').click();check(!snapshot().feedback,'cancelled native reset confirmation retains preferences');
  window.confirm=()=>true;el('btn-reset-preferences').click();check(snapshot().feedback,'confirmed native reset invokes the full preference command');api.audio.pianoVolume(0);api.audio.metroVolume(0);
  const alerts=[];window.alert=text=>alerts.push(text);const data=new DataTransfer();data.items.add(new File(['{}'],'invalid-settings.json',{type:'application/json'}));el('input-settings-import').files=data.files;el('input-settings-import').dispatchEvent(new Event('change',{bubbles:true}));check(el('input-settings-import').value==='','native import binding clears the input immediately after starting FileReader');
  await wait(100);check(alerts.includes('Invalid settings backup file.'),'native file selection reaches the existing invalid-backup alert');
  p.dispose();p.dispose();check(Object.values(f.snapshot()).every(count=>count===0),'explicit dispose removes all three owned listener sets');
  const old=snapshot().feedback;change('check-feedback',!old);check(snapshot().feedback===old,'disposed native change events do not mutate preference state');
  p.init();p.init();check(JSON.stringify(f.snapshot())===JSON.stringify(initial),'reinit restores the same native listener counts and markers');
  check(api.practice.readLed().enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'practice/preferences controls work with default and no-op LED');
 }catch(error){results.textContent+='ERROR '+error.stack+'\n';}
 finally{window.alert=oldAlert;window.confirm=oldConfirm;p.dispose();api.pause();api.score.disposeCoordinator();api.dispose();results.textContent+='RESOURCES '+JSON.stringify(f.snapshot())+'\n';try{results.textContent+='CLEANUP '+await window.__PT_LIBRARY_FIXTURE__.cleanup()+' disposable databases\n';}catch(error){results.textContent+='CLEANUP ERROR '+error.stack+'\n';}}
 if(!/(?:FAIL|ERROR)/.test(results.textContent))results.textContent+='DONE\n';
})();
