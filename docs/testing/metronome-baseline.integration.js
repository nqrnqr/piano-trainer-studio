(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const f=window.MetronomeFixture,m=window.MidiFixture;
 const stop=()=>{pausePlaybackFromToolbar();trainerMetronome.dispose();};
 try{
  hideToolbarPanels();document.getElementById('help-modal')?.classList.add('hidden');await setupMIDI();
  updatePianoVolume(0,{save:false});updateMetroVolume(0,{save:false});await ensureLiveAudioReady();
  check(Tone.context.state==='running','real audio context is unlocked for native timer checks');
  check(f.nodes.length===1&&f.nodes[0].options.pitchDecay===.008&&f.nodes[0].options.octaves===1.5,'one actual MembraneSynth owns the original metronome options');
  metronomeOutput.init();check(f.nodes.length===1,'repeated init allocates no second metronome node');
  AppState.ledOutputMode='none';document.getElementById('check-looper').checked=false;
  document.getElementById('check-metronome').checked=true;AppState.visualPulseEnabled=true;AppState.metronomeMidiOutEnabled=false;
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();await loadScoreIntoApp(xml,{fileName:'simple-repeat.musicxml'});
  check(scoreMeasureTiming.getCachedMeasureCount()===3&&getMeasureTimingInfo(0).startTimestamp===0&&getMeasureTimingInfo(1).actualLengthWhole===0,'actual repeat traversal retains original timing cache and zero repeat-boundary length');
  osmd.cursor.reset();AppState.mode='wait';AppState.baseBpm=240;AppState.speedPercent=1;AppState.isPlaying=true;
  f.events.length=0;let handoff=0;const startMs=performance.now();doCountInAndStart(()=>handoff++);
  check(AppState.countInActive&&f.events.filter(e=>e.note).length===1,'count-in starts with a synchronous downbeat');
  await wait(1080);
  const countEvents=f.events.filter(e=>e.note);
  check(countEvents.length===4&&handoff===1&&!AppState.countInActive,'four native count-in clicks hand off after the final full beat');
  check(countEvents.map(e=>e.note).join(',')==='G6,C6,C6,C6','actual Tone clicks retain accented downbeat and unaccented notes');
  check(countEvents.every(e=>e.duration==='64n'&&Math.abs(e.time-e.now)<.03)&&countEvents.slice(1).every((e,i)=>Math.abs(e.performanceMs-countEvents[i].performanceMs-250)<90),
   'native count-in timer intervals and Tone target times remain on the original beat cadence');
  check(performance.now()-startMs>=1000,'native handoff waits through the last count-in beat');
  f.events.length=0;startWaitModeMetronome(0);await wait(560);stopWaitModeMetronome();
  const waitEvents=f.events.filter(e=>e.note);check(waitEvents.length>=2&&waitEvents[0].note==='G6','Wait metronome ticks while no input advancement occurs');
  const countAtStop=f.events.length;await wait(290);check(f.events.length===countAtStop,'Wait stop cancels the next native beat');
  AppState.mode='follow';f.events.length=0;const audioStart=Tone.now();scheduleMetronomeForPlaybackWindow(audioStart,0,0,.25,1);await wait(70);
  const windowEvent=f.events.find(e=>e.note);check(windowEvent&&Math.abs(windowEvent.time-windowEvent.immediate)<.03,'Follow window uses actual immediate audio time at its native timeout');
  check(windowEvent&&Math.abs(windowEvent.performanceMs-performance.now())<130,'native window click is emitted during the current beat window');
  AppState.metronomeMidiOutEnabled=true;updateMetroVolume(50,{save:false});metronomeOutput.setVolumeDecibels(-Infinity);m.sent.length=0;
  playMetronomeClick(true,Tone.now()+.03);await wait(150);
  check(JSON.stringify(m.sent)===JSON.stringify([[0x99,75,59],[0x89,75,0]]),'native metronome MIDI click/release uses Channel 10 and original volume quantization');
  AppState.metronomeMidiOutEnabled=false;AppState.mode='wait';f.events.length=0;doCountInAndStart(()=>handoff++);
  pausePlaybackFromToolbar();const afterPause=f.events.length;await wait(300);
  check(f.events.length===afterPause&&!AppState.countInActive,'pause gates pending native count-in tick');
  AppState.isPlaying=true;doCountInAndStart(()=>handoff++);const beforeDispose=f.events.length;trainerMetronome.dispose();await wait(300);
  check(f.events.length===beforeDispose&&metronomeClock.readResources().timers===0,'explicit dispose cancels native count-in and pulse resources');
  check(!document.getElementById('btn-tempo').classList.contains('metronome-pulse'),'visual pulse cleanup removes its DOM class');
  metronomeOutput.dispose();metronomeOutput.init();metronomeOutput.setVolumeDecibels(-Infinity);
  check(f.nodes.length===2&&f.events.some(e=>e.kind==='dispose'),'actual metronome output can be disposed and reinitialized once');
  check(optionalLedOutput.enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'metronome checks complete with the selected default/no-op LED port');
  results.textContent+='DONE\n';
 }catch(error){results.textContent+=`ERROR: ${error.stack}\n`;}
 finally{stop();updateMetroVolume(getClampedNumber(METRONOME_VOL_STORAGE_KEY,0,100,25),{save:false});parent.document.getElementById('run').disabled=false;parent.restoreMetronomeTestPreferences();}
})();
