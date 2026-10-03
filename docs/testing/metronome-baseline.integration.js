(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const api=window.PianoTrainerTest,a=api.audio,metro=api.metronome;
 const f=window.MetronomeFixture,m=window.MidiFixture;
 const stop=()=>{api.pause();metro.dispose();};
 try{
  a.hidePanels();await api.midi.initService();
  a.pianoVolume(0);a.metroVolume(0);await a.ensureReady();
  check(Tone.context.state==='running','real audio context is unlocked for native timer checks');
  check(f.nodes.length===1&&f.nodes[0].options.pitchDecay===.008&&f.nodes[0].options.octaves===1.5,'one actual MembraneSynth owns the original metronome options');
  metro.initOutput();check(f.nodes.length===1,'repeated init allocates no second metronome node');
  document.getElementById('check-looper').checked=false;
  document.getElementById('check-metronome').checked=true;
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();await api.loadScore(xml,{fileName:'simple-repeat.musicxml'});
  check(metro.readCacheCount()===3&&metro.readTiming(0).startTimestamp===0&&metro.readTiming(1).actualLengthWhole===0,'actual repeat traversal retains original timing cache and zero repeat-boundary length');
  metro.prepare();
  f.events.length=0;const startMs=performance.now();metro.startCountIn();
  check(metro.readSnapshot().countIn&&f.events.filter(e=>e.note).length===1,'count-in starts with a synchronous downbeat');
  await wait(1080);
  const countEvents=f.events.filter(e=>e.note);
  check(countEvents.length===4&&metro.readSnapshot().handoffs===1&&!metro.readSnapshot().countIn,'four native count-in clicks hand off after the final full beat');
  check(countEvents.map(e=>e.note).join(',')==='G6,C6,C6,C6','actual Tone clicks retain accented downbeat and unaccented notes');
  check(countEvents.every(e=>e.duration==='64n'&&Math.abs(e.time-e.now)<.03)&&countEvents.slice(1).every((e,i)=>Math.abs(e.performanceMs-countEvents[i].performanceMs-250)<90),
   'native count-in timer intervals and Tone target times remain on the original beat cadence');
  check(performance.now()-startMs>=1000,'native handoff waits through the last count-in beat');
  f.events.length=0;metro.startWait(0);await wait(560);metro.stopWait();
  const waitEvents=f.events.filter(e=>e.note);check(waitEvents.length>=2&&waitEvents[0].note==='G6','Wait metronome ticks while no input advancement occurs');
  const countAtStop=f.events.length;await wait(290);check(f.events.length===countAtStop,'Wait stop cancels the next native beat');
  metro.selectMode('follow');f.events.length=0;const audioStart=Tone.now();metro.scheduleWindow(audioStart,0,0,.25,1);await wait(70);
  const windowEvent=f.events.find(e=>e.note);check(windowEvent&&Math.abs(windowEvent.time-windowEvent.immediate)<.03,'Follow window uses actual immediate audio time at its native timeout');
  check(windowEvent&&Math.abs(windowEvent.performanceMs-performance.now())<130,'native window click is emitted during the current beat window');
  metro.setMidiOutput(true);a.metroVolume(50);metro.muteOutput();m.sent.length=0;
  metro.click(true,Tone.now()+.03);await wait(150);
  check(JSON.stringify(m.sent)===JSON.stringify([[0x99,75,59],[0x89,75,0]]),'native metronome MIDI click/release uses Channel 10 and original volume quantization');
  metro.setMidiOutput(false);metro.selectMode('wait');f.events.length=0;metro.startCountIn();
  api.pause();const afterPause=f.events.length;await wait(300);
  check(f.events.length===afterPause&&!metro.readSnapshot().countIn,'pause gates pending native count-in tick');
  metro.setPlaying(true);metro.startCountIn();const beforeDispose=f.events.length;metro.dispose();await wait(300);
  check(f.events.length===beforeDispose&&metro.readSnapshot().clock.timers===0,'explicit dispose cancels native count-in and pulse resources');
  check(!document.getElementById('btn-tempo').classList.contains('metronome-pulse'),'visual pulse cleanup removes its DOM class');
  // Native startup through the real coordinator, with actual muted Tone voices.
  for(const mode of ['wait','follow','realtime']){
   stop();metro.disposeCoordinator();await api.loadScore(xml,{fileName:'simple-repeat.musicxml'});metro.clearVisuals();
   metro.prepareCoordinator(mode);
   metro.updateTempo(200);a.pianoVolume(0);a.metroVolume(0);
   f.events.length=0;AudioFixture.events.length=0;
   await metro.startPlayback();await wait(1130);api.pause();
   const notes=f.events.filter(event=>event.note),piano=AudioFixture.events.find(event=>event[0]==='attack'||event[0]==='attack-release');
   const pianoTime=piano?.[piano[0]==='attack'?3:4];
   const lookAhead=Tone.getContext().lookAhead;
   results.textContent+=`NATIVE_SYNC ${mode} ${JSON.stringify({pianoTime,lastCountInTarget:notes[3]?.time,lastCountInImmediate:notes[3]?.immediate,firstWindowTarget:notes[4]?.time,lookAhead})}\n`;
   check(notes.length>=5&&piano&&piano[1]===(mode==='wait'?'sampler':'synth'),`${mode}: native coordinator count-in reaches actual routed piano and metronome voices`);
   check(Math.abs(pianoTime+(mode==='wait'?lookAhead:0)-notes[4].time)<.08,`${mode}: native piano and playback-window click preserve the original mode time offset`);
   check(Math.abs(pianoTime-(notes[3].immediate+.25))<.10,`${mode}: native piano handoff follows the last count-in callback by a full beat`);
  }
  metro.disposeOutput();metro.initOutput();metro.muteOutput();
  check(f.nodes.length===2&&f.events.some(e=>e.kind==='dispose'),'actual metronome output can be disposed and reinitialized once');
  check(api.practice.readLed().enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'metronome checks complete with the selected default/no-op LED port');

 }catch(error){results.textContent+=`ERROR: ${error.stack}\n`;}
 finally{stop();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();parent.document.getElementById('run').disabled=false;if(!results.textContent.includes('ERROR'))results.textContent+='DONE\n';}
})();
