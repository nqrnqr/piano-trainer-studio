const {test}=require('node:test'),assert=require('node:assert/strict');const {harness,event,Node}=require('../helpers/native-controls-harness.cjs');const turn=()=>new Promise(setImmediate);
test('toolbar keeps ordinary queued opens and closing transition/220ms fallback behavior',()=>{
 const h=harness();h.toolbar.init();const panel=h.nodes.get('tempo-popup');h.toolbar.showToolbarPanel(panel);h.toolbar.closeToolbarPanel(panel,true);h.fireFrames();
 assert.equal(panel.classList.contains('hidden'),true);assert.equal(panel.classList.contains('is-open'),true,'baseline late frame is retained on ordinary close');
 h.toolbar.showToolbarPanel(panel);h.fireFrames();h.toolbar.closeToolbarPanel(panel);assert.equal([...h.timers.values()][0].delay,220);
 panel.dispatch(event('transitionend'),new Node());assert.equal(panel.classList.contains('hidden'),false);panel.dispatch(event('transitionend'));assert.equal(panel.classList.contains('hidden'),true);assert.equal(panel.listeners.length,0);
});
test('toolbar owns one binding set and explicit disposal cancels frames/timers/transition handlers without reviving old callbacks',()=>{
 const h=harness();h.toolbar.init();h.toolbar.init();assert.equal(h.nodes.get('btn-options').listeners.length,1);const panel=h.nodes.get('tempo-popup');h.toolbar.showToolbarPanel(panel);const frame=[...h.frames.values()][0];h.fireFrames();h.toolbar.closeToolbarPanel(panel);const timer=[...h.timers.values()][0].callback;
 h.toolbar.dispose();h.toolbar.dispose();assert.equal(h.timers.size,0);assert.equal(h.frames.size,0);assert.equal(panel.listeners.length,0);assert.equal(h.document.listeners.length,0);
 h.toolbar.init();frame();timer();assert.equal(panel.classList.contains('hidden'),false);assert.equal(panel.classList.contains('is-open'),false);assert.equal(h.nodes.get('btn-options').listeners.length,1);
});
test('pending Scores refresh cannot toggle the drawer after explicit toolbar disposal/reinit',async()=>{
 const h=harness();let finish;h.toolbarPorts.refreshScoresDrawer=()=>new Promise(resolve=>finish=resolve);const ui=h.api('PianoTrainerToolbar').create(h.toolbarPorts);ui.init();h.nodes.get('btn-scores').dispatch(event('click'));assert.equal(h.state.scoreLibraryView,'folders');ui.dispose();ui.init();finish();await turn();assert.equal(h.frames.size,0);assert.equal(h.nodes.get('scores-panel').classList.contains('hidden'),true);
});
test('intro preserves storage truthiness and marks seen when an active intro is closed',()=>{
 const h=harness();h.toolbar.init();h.values.set('pt_firstRunIntroSeen','false');assert.equal(h.toolbar.maybeShowFirstRunIntro(),true);h.fireFrames();h.toolbar.closeFirstRunIntro();assert.equal(h.values.get('pt_firstRunIntroSeen'),'true');assert.equal(h.toolbar.maybeShowFirstRunIntro(),false);
});
test('fullscreen failure falls back after hiding panels; explicit disposal suppresses late native fullscreen UI commits',async()=>{
 const h=harness();h.display.init();h.document.documentElement.requestFullscreen=async()=>{throw Error('denied');};await h.display.requestAppFullscreen();assert.equal(h.effects[0],'hide');assert.equal(h.state.pseudoFullscreenActive,true);assert.equal(h.nodes.get('btn-score-fullscreen').attrs['aria-pressed'],'true');await h.display.exitAppFullscreen();assert.equal(h.state.pseudoFullscreenActive,false);
 let finish;h.document.documentElement.requestFullscreen=()=>new Promise(resolve=>finish=resolve);const pending=h.display.requestAppFullscreen();h.state.pseudoFullscreenActive=true;h.display.dispose();h.display.init();finish();await pending;assert.equal(h.state.pseudoFullscreenActive,true);
});
test('zoom input only previews while change commits/render clears in order; resize debounce is owned and disposed',()=>{
 const h=harness();h.display.init();const slider=h.nodes.get('slider-zoom');slider.value='127';slider.dispatch(event('input'));assert.equal(h.state.zoom,1);assert.equal(h.nodes.get('val-zoom').value,'127');assert.equal(h.effects.length,0);slider.dispatch(event('change'));assert.equal(h.state.zoom,1.27);assert.deepEqual(h.effects,[['save-zoom','127'],['zoom',1.27],'clear-feedback','render']);
 h.window.dispatch(event('resize'));h.window.dispatch(event('resize'));assert.equal(h.timers.size,1);assert.equal([...h.timers.values()][0].delay,300);h.fireTimer([...h.timers.keys()][0]);assert.deepEqual(h.effects.slice(-3),['clear-feedback','render','position']);h.window.dispatch(event('resize'));const oldPlay=h.nodes.get('btn-play').onclick,oldReset=h.nodes.get('btn-reset').onclick;h.display.dispose();assert.equal(h.timers.size,0);assert.equal(h.nodes.get('btn-play').onclick,null);h.display.init();const before=h.effects.length;oldPlay();oldReset();assert.equal(h.effects.length,before,'old onclick callbacks cannot start the new lifecycle');h.nodes.get('btn-play').onclick();assert.equal(h.effects.at(-1),'play');
});
test('tempo preview keeps base/state; commit preserves differing radix/BPM rules and Wait-only rebuild after setting transport',()=>{
 const h=harness();h.tempo.init();h.state.baseBpm=0;h.state.isPlaying=true;h.tempo.syncTempoPreviewFromPercent('0x20');assert.equal(h.nodes.get('val-speed').value,'100');assert.equal(h.state.speedPercent,1);
 h.tempo.updateTempo('percent','0x20');assert.equal(h.state.speedPercent,.32);assert.deepEqual(h.effects.slice(-2),[['bpm',38],['rebuild',4]]);h.tempo.updateTempo('bpm',600);assert.equal(h.state.speedPercent,5);assert.equal(h.nodes.get('val-speed').value,'500');h.state.countInActive=true;h.tempo.updateTempo('percent',150);assert.deepEqual(h.effects.at(-1),['bpm',180]);
});
test('metronome disable clears beats/wait/pulse in order and disabled optional controls retain UI state',()=>{
 const h=harness();h.tempo.init();const check=h.nodes.get('check-metronome');check.checked=false;check.dispatch(event('change'));assert.deepEqual(h.effects.slice(-3),['clear-metronome','stop-wait','clear-pulse']);assert.equal(h.nodes.get('slider-metro-vol').disabled,true);h.tempo.dispose();const before=h.effects.length;check.dispatch(event('change'));assert.equal(h.effects.length,before);
});
test('audio levels clamp/parse and save before numeric outputs; boost is local and optional DOM can be absent',()=>{
 const h=harness();h.audio.init();h.audio.updatePianoVolume('105.8');assert.deepEqual(h.effects.slice(-2),[['save-level','pianoVolume','100'],['piano',100]]);h.audio.updateMidiOutVolume(-10,{save:false});assert.equal(h.state.midiOutVolume,0);assert.deepEqual(h.effects.at(-1),['expression',0]);h.audio.updateMetroVolume(0);assert.deepEqual(h.effects.at(-1),['metro-db',-Infinity]);h.audio.updateMidiInBoost('');assert.equal(h.state.midiInBoost,100);assert.equal(h.effects.at(-1)[0],'save-level');h.nodes.delete('val-midiin-boost');h.audio.updateMidiInBoost(220,{save:false});assert.equal(h.state.midiInBoost,200);
});
test('loop editing distinguishes empty preview/commit and moves the other bound when crossed',()=>{
 const h=harness();h.loop.init();h.loop.resetRangeForScore(8);const min=h.nodes.get('val-loop-min');min.value='';min.dispatch(event('input'));assert.equal(h.effects.length,0);min.dispatch(event('change'));assert.equal(h.state.looper.min,1);min.value='9';min.dispatch(event('change'));assert.equal(h.state.looper.min,8);assert.equal(h.state.looper.max,8);h.nodes.get('val-loop-max').value='3';h.nodes.get('val-loop-max').dispatch(event('change'));assert.equal(h.state.looper.min,3);assert.equal(h.state.looper.max,3);assert.deepEqual(h.effects.slice(-2),['loop-render','enforce']);
});
test('loop hold waits 320ms then repeats at 170ms and pointer release/dispose clears capture, styling and both resources',()=>{
 const h=harness();h.loop.init();const button=h.nodes.get('btn-loop-min-increase');button.dispatch(event('pointerdown'));assert.equal(h.state.looper.min,1);assert.equal([...h.timers.values()][0].delay,320);h.fireTimer([...h.timers.keys()][0]);assert.equal([...h.intervals.values()][0].delay,170);[...h.intervals.values()][0].callback();assert.equal(h.state.looper.min,2);h.document.dispatch(event('pointerup'));assert.equal(h.intervals.size,0);assert.equal(button.captured.size,0);assert.equal(button.classList.contains('is-holding'),false);
 button.dispatch(event('pointerdown'));const stale=[...h.timers.values()][0].callback;h.loop.dispose();h.loop.dispose();assert.equal(h.timers.size,0);assert.equal(h.intervals.size,0);assert.equal(button.listeners.length,0);h.loop.init();button.dispatch(event('pointerdown'));stale();assert.equal(h.intervals.size,0,'old delay cannot arm a new hold after init');h.loop.clearLooperHold();button.dispatch(event('click'));assert.equal(h.state.looper.min,3);
});
test('typed DOM rejects missing required/wrong optional controls and ignores unrelated event targets',()=>{
 const h=harness(),dom=h.api('PianoTrainerControlDom').create(h.document);assert.throws(()=>dom.input('missing'),/Missing required/);h.add('wrong',Node);assert.throws(()=>dom.optionalInput('wrong'),/Invalid trainer/);const input=h.nodes.get('val-speed');let called=0;dom.onInput(input,'change',()=>called++);input.dispatch(event('change'),new Node());assert.equal(called,0);dom.dispose();assert.equal(input.listeners.length,0);
});
