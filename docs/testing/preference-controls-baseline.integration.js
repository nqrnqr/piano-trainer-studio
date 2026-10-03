(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const el=id=>document.getElementById(id),change=(id,value)=>{if(value!==undefined)el(id).checked=value;el(id).dispatchEvent(new Event('change',{bubbles:true}));};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),f=window.__PT_PREFERENCE_CONTROLS_FIXTURE__,services=[practiceControls,handAssignmentControls,settingsActions],oldAlert=window.alert,oldConfirm=window.confirm;
 try{
  pausePlaybackFromToolbar();trainerPlayback.dispose();hideToolbarPanels(true);updatePianoVolume(0,{save:false});updateMetroVolume(0,{save:false});
  await loadScoreIntoApp(await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text(),{fileName:'simple-repeat.musicxml'});
  const initial=f.snapshot();results.textContent+='INITIAL '+JSON.stringify(initial)+'\n';for(const service of services){service.init();service.init();}
  check(JSON.stringify(f.snapshot())===JSON.stringify(initial),'repeated init retains one native listener set');
  check(initial['hand-assignment-controls']===2&&initial['settings-actions']===4,'score load and settings buttons bind their original two/four listeners');
  el('mode-follow').click();check(AppState.mode==='follow'&&localStorage.getItem(TRAINER_MODE_STORAGE_KEY)==='follow','native mode radio commits and saves Follow');
  check(!AppState.practice.left&&AppState.practice.right&&AppState.playback.left&&!AppState.playback.right,'Follow starts with its original right-practice/left-playback pair');
  el('practice-rh').click();check(el('practice-rh').checked&&AppState.practice.right,'Follow keeps the selected practice hand checked');
  el('practice-lh').click();check(AppState.practice.left&&!AppState.practice.right&&!AppState.playback.left&&AppState.playback.right,'native Follow hand click selects its opposite accompaniment');
  check(el('enable-staff-lh').disabled&&el('enable-staff-rh').disabled&&el('practice-wait-note').textContent.includes('opposite hand'),'Follow updates disabled playback controls and note');
  el('mode-realtime').click();change('practice-lh',false);change('enable-staff-rh',false);const realtime=AppState.modeSettings.realtime;
  el('mode-wait').click();check(AppState.mode==='wait'&&AppState.practice.left&&AppState.practice.right&&!AppState.playback.left&&!AppState.playback.right,'Wait retains its independent hand settings');
  change('enable-staff-rh',true);check(!el('enable-staff-rh').checked&&!AppState.playback.right,'Wait rejects programmatic playback toggle edits');
  change('enable-hand-staves',false);el('mode-follow').click();check(!AppState.audioEnabled.hands&&!el('enable-hand-staves').checked&&AppState.practice.left,'mode changes retain saved audio preference and previous Follow hand');
  el('mode-realtime').click();check(AppState.modeSettings.realtime===realtime&&!AppState.practice.left&&!AppState.playback.right,'returning to Realtime restores its original settings object and choices');
  change('enable-instrument',true);check(AppState.audioEnabled.instrument&&localStorage.getItem(TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY)==='true'&&!el('routing-midiin-boost-row').classList.contains('hidden'),'instrument audio routing updates boost visibility');
  change('enable-midiout-virtual-keyboard',true);check(AppState.midiOutEnabled.virtual&&localStorage.getItem(TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY)==='true','MIDI virtual route persists independently');
  change('check-low-latency-playback',true);change('check-low-latency-playback',false);check(!AppState.lowLatencyPlaybackEnabled&&localStorage.getItem(TRAINER_LOW_LATENCY_PLAYBACK_STORAGE_KEY)==='false','native low-latency toggle persists its disabled preference');
  change('check-fullscreen-on-play',true);check(AppState.fullscreenOnPlay&&localStorage.getItem(TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY)==='true','fullscreen-on-play native preference updates state and storage');
  change('check-autoscroll',false);check(localStorage.getItem(TRAINER_AUTOSCROLL_STORAGE_KEY)==='false','Auto Scroll native preference saves its checkbox');
  change('check-future-preview',false);check(!AppState.futurePreviewEnabled&&AppState.futurePreviewDepth===1&&AppState.lastLedPreviewEvents.length===0&&localStorage.getItem(TRAINER_FUTURE_PREVIEW_STORAGE_KEY)==='false','future preview edit preserves depth one and invalidates its current events');
  change('check-correct-highlight',false);check(!AppState.correctHighlightEnabled&&localStorage.getItem(TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY)==='false','correct highlight native preference persists');
  change('check-feedback',false);check(!AppState.feedbackEnabled&&localStorage.getItem(TRAINER_FEEDBACK_STORAGE_KEY)==='false','feedback checkbox commits its preference');
  change('check-keyboard',false);check(el('virtual-keyboard-container').classList.contains('hidden'),'keyboard toggle hides native container');change('check-keyboard',true);check(!el('virtual-keyboard-container').classList.contains('hidden'),'keyboard toggle shows and redraws native container');
  el('assign-lh').value='';el('assign-rh').value='2';el('assign-rh').dispatchEvent(new Event('change'));check(AppState.hands.left===null&&AppState.hands.right===2&&AppState.ledPreviewTimelineDirty,'native staff assignment accepts the left none option and rebuilds its preview');
  check(AppState.expectedNotes.length>0&&AppState.expectedNotes.every(note=>getAssignedHandRoleForStaff(note.staffId)==='right'),'captured OSMD frame uses the newly assigned practiced staff');
  const oldHands=JSON.stringify(AppState.hands);el('assign-rh').value='';el('assign-rh').dispatchEvent(new Event('change'));check(JSON.stringify(AppState.hands)===oldHands,'empty right-staff assignment retains the previous committed hands');
  localStorage.setItem(TRAINER_MODE_STORAGE_KEY,'saved-invalid');localStorage.setItem(TRAINER_MIDIOUT_VOL_STORAGE_KEY,'999');localStorage.setItem(TRAINER_MIDIIN_BOOST_STORAGE_KEY,'25');localStorage.setItem(TRAINER_ZOOM_STORAGE_KEY,'');applyPersistedTrainerAndSettingsPreferences();
  check(AppState.mode==='saved-invalid'&&el('mode-realtime').checked&&AppState.midiOutVolume===100&&AppState.midiInBoost===50,'persisted application retains invalid mode fallback and clamped levels');
  check(localStorage.getItem(TRAINER_ZOOM_STORAGE_KEY)==='100'&&AppState.inputVelocityEnabled&&AppState.liveLowLatencyMonitoringEnabled,'persisted application seeds empty zoom and forces monitoring flags');
  // MIDI permission denial leaves channel option lists empty. Populate through
  // the production UI command so this case checks the normal selected values.
  populateMidiChannelSelect('midi-out-channel',1);populateMidiChannelSelect('midi-lights-channel',1);
  const selected=[],handlers=[];for(const id of ['midi-in','midi-out','midi-out-channel','midi-lights','midi-lights-channel']){const handler=()=>selected.push([id,el(id).value]);el(id).addEventListener('change',handler);handlers.push([id,handler]);}
  const pressed=AppState.pressedKeys,reservations=AppState.earlyGraceReservations;restoreDefaultPreferences({reloadDevices:false});for(const [id,handler]of handlers)el(id).removeEventListener('change',handler);
  results.textContent+='MIDI_RESET '+JSON.stringify(selected)+'\n';
  check(JSON.stringify(selected)===JSON.stringify([['midi-in','none'],['midi-out','none'],['midi-out-channel','1'],['midi-lights','none'],['midi-lights-channel','1']]),'reset dispatches the five native MIDI change events in the original order');
  check(AppState.mode==='realtime'&&el('mode-realtime').checked&&!ScoreDisplay.isHorizontal()&&AppState.zoom===1,'reset restores Realtime, traditional layout and 100 percent zoom');
  check(AppState.hands.left===2&&AppState.hands.right===1&&el('assign-lh').value==='2'&&el('assign-rh').value==='1','reset restores actual score default staff assignments');
  check(AppState.pressedKeys===pressed&&AppState.earlyGraceReservations===reservations&&AppState.futurePreviewEnabled&&AppState.correctHighlightEnabled,'reset retains shared Set/Map identity and highlight defaults');
  check(el('val-piano-vol').value==='80'&&el('val-metro-vol').value==='25'&&AppState.midiInBoost===100,'reset restores original volume and MIDI boost defaults');updatePianoVolume(0,{save:false});updateMetroVolume(0,{save:false});
  window.confirm=()=>false;AppState.feedbackEnabled=false;el('btn-reset-preferences').click();check(!AppState.feedbackEnabled,'cancelled native reset confirmation retains preferences');
  window.confirm=()=>true;el('btn-reset-preferences').click();check(AppState.feedbackEnabled,'confirmed native reset invokes the full preference command');updatePianoVolume(0,{save:false});updateMetroVolume(0,{save:false});
  const alerts=[];window.alert=text=>alerts.push(text);const data=new DataTransfer();data.items.add(new File(['{}'],'invalid-settings.json',{type:'application/json'}));el('input-settings-import').files=data.files;el('input-settings-import').dispatchEvent(new Event('change',{bubbles:true}));check(el('input-settings-import').value==='','native import binding clears the input immediately after starting FileReader');
  await wait(100);check(alerts.includes('Invalid settings backup file.'),'native file selection reaches the existing invalid-backup alert');
  for(const service of services){service.dispose();service.dispose();}check(Object.values(f.snapshot()).every(count=>count===0),'explicit dispose removes all three owned listener sets');
  const old=AppState.feedbackEnabled;change('check-feedback',!old);check(AppState.feedbackEnabled===old,'disposed native change events do not mutate preference state');
  for(const service of services){service.init();service.init();}check(JSON.stringify(f.snapshot())===JSON.stringify(initial),'reinit restores the same native listener counts and markers');
  check(optionalLedOutput.enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'practice/preferences controls work with default and no-op LED');
 }catch(error){results.textContent+='ERROR '+error.stack+'\n';}
 finally{window.alert=oldAlert;window.confirm=oldConfirm;for(const service of services)service.dispose();pausePlaybackFromToolbar();trainerPlayback.dispose();window.ScoresUI.dispose();ScoreLibrary.dispose();results.textContent+='RESOURCES '+JSON.stringify(f.snapshot())+'\n';try{results.textContent+='CLEANUP '+await window.__PT_LIBRARY_FIXTURE__.cleanup()+' disposable databases\n';}catch(error){results.textContent+='CLEANUP ERROR '+error.stack+'\n';}}
 if(!/(?:FAIL|ERROR)/.test(results.textContent))results.textContent+='DONE\n';
})();
