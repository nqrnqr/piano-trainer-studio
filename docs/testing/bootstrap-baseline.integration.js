(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,message)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${message}\n`;if(!ok)throw Error(message);};
 const app=window.PianoTrainerTest;
 try{
  check(app && !('AppState' in app) && !('osmd' in app),'test facade exposes commands and observations');
  check(typeof AppState==='undefined' && typeof osmd==='undefined' && !window.ScoreLibrary && !window.PTTiming,'bundle keeps application state, score and business services private');
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();
  for(const layout of ['traditional','horizontal'])for(const mode of ['wait','follow','realtime']){
   app.pause();await app.loadScore(xml,{fileName:'simple-repeat.musicxml'});await app.setLayout(layout);app.beginScenario(mode);
   const before=app.readPracticeSnapshot(),viewport=app.readViewportSnapshot();
   check(before.playing&&before.expected.length>0,`${mode}/${layout}: real score enters playback with expected notes`);
   check(viewport.layout===layout&&viewport.measureCount===3,`${mode}/${layout}: viewport observes the requested layout and real score`);
   const observed=app.readPracticeSnapshot();observed.score.correct=999;observed.expected.length=0;
   check(app.readPracticeSnapshot().score.correct!==999&&app.readPracticeSnapshot().expected.length>0,`${mode}/${layout}: returned observations cannot mutate internal practice state`);
   app.dispatchInput(before.expected[0].midi,true);app.dispatchInput(before.expected[0].midi,false);
   check(!app.readPracticeSnapshot().pressed.includes(before.expected[0].midi),`${mode}/${layout}: input command releases the note`);
   app.pause();check(!app.readPracticeSnapshot().playing,`${mode}/${layout}: pause stops playback`);
  }
  const resources=window.__PT_BOOTSTRAP_FIXTURE__,before=resources.snapshot();
  app.init();app.init();check(document.querySelectorAll('.key[data-midi]').length===88,'duplicate init keeps one keyboard');
  check(JSON.stringify(resources.snapshot())===JSON.stringify(before),'duplicate init does not allocate another listener, timer, interval or frame');
  app.dispose();app.dispose();app.init();check(!app.readPracticeSnapshot().playing,'duplicate dispose and later init cannot revive the old application');
  const disposed=resources.snapshot();results.textContent+='RESOURCES '+JSON.stringify(disposed)+'\n';
  if(disposed.timers)results.textContent+='TIMERS '+JSON.stringify(resources.describeTimers())+'\n';
  check(Object.values(disposed).every(value=>value===0),'full application disposal releases all observed native resources');
  app.recreate();await app.loadScore(xml,{fileName:'fresh.musicxml'});app.beginScenario('wait');check(app.readPracticeSnapshot().expected.length>0,'fresh application initializes and loads after full disposal');
  app.pause();
 }catch(error){results.textContent+='ERROR '+error.stack+'\n';}finally{app?.dispose();try{await window.__PT_LIBRARY_FIXTURE__?.cleanup();}catch(error){results.textContent+='ERROR CLEANUP '+error.message+'\n';}}
 if(!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent))results.textContent+='DONE\n';
})();
