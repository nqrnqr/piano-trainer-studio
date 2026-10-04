const assert=require('node:assert/strict');const {test}=require('node:test');const {harness,Mouse,Pointer,Touch,Key}=require('../helpers/keyboard-controls-harness.cjs');
const plain=value=>JSON.parse(JSON.stringify(value));
test('preview priority keeps ties, expected over future over pressed; view replaces only the first recognized class',()=>{
 const h=harness(),rules=h.api('PianoTrainerKeyboardState');assert.equal(rules.choose('future1-r','future2-l'),'future1-r');assert.equal(rules.choose('expected-l','future1-r'),'expected-l');assert.equal(rules.choose('pressed-r','future1-l'),'future1-l');
 h.inputs.createKeyboard();const key=h.key(60);key.classList.add('expected-l','wrong','future2-r');Object.assign(key.style,{filter:'blur(1px)',boxShadow:'old',transform:'old'});h.view.drawKey(60,'pressed-r');assert.ok(!key.classes.has('expected-l'));assert.ok(key.classes.has('wrong')&&key.classes.has('future2-r')&&key.classes.has('pressed-r'));assert.deepEqual(key.style,{filter:'',boxShadow:'',transform:''});
 h.view.drawKey(60,'active',true);assert.ok(!key.classes.has('wrong')&&!key.classes.has('pressed-r'));assert.ok(key.classes.has('future2-r')&&key.classes.has('active'));
});
test('calibration renders the optional map first, skips sustain effects, and preserves outside-range active key presentation',()=>{
 const h=harness();h.inputs.createKeyboard();h.state.ledCalibrationMode=true;h.state.ledCalibrationSelectedMidi=60;h.presentationPorts.isMidiInRange=()=>false;h.viewPorts.isMidiInRange=()=>false;h.presentation.render(null,1);
 assert.deepEqual(plain(h.effects[0]),['led-render',[],null]);assert.ok(!h.effects.some(x=>x[0]==='prune'||x[0]==='hardware'));assert.ok(h.key(60).classes.has('active')&&h.key(60).classes.has('out-of-range'));
});
test('keyboard controller distinguishes preview display from base hardware and updates only changed hardware cache entries',()=>{
 const h=harness();h.inputs.createKeyboard();h.state.sustainedVisuals=[{midi:60,staffId:2}];h.state.lastLedPreviewEvents=[{notes:[{midi:62,state:'future1-r'}]}];h.presentation.render();
 assert.deepEqual(h.effects.filter(x=>x[0]==='hardware'),[['hardware',60,'expected-l',null]]);assert.ok(h.key(60).classes.has('expected-l')&&h.key(62).classes.has('future1-r'));assert.equal(h.state.hardwareLEDState.has(62),false);
 h.effects.length=0;h.presentation.render();assert.ok(!h.effects.some(x=>x[0]==='hardware'));h.state.sustainedVisuals=[];h.presentation.render();assert.deepEqual(h.effects.filter(x=>x[0]==='hardware'),[['hardware',60,null,'expected-l']]);
});
test('held carry keeps expected color, correct highlight follows hand, expired held notes do not become red',()=>{
 const h=harness();h.inputs.createKeyboard();h.state.isPlaying=true;h.state.sustainedVisuals=[{midi:60,staffId:2}];h.state.pressedKeys.add(60);h.state.preExpectedHeldNotes.add(60);h.presentation.render();assert.ok(h.key(60).classes.has('expected-l'));
 h.state.preExpectedHeldNotes.clear();h.presentation.render();assert.ok(h.key(60).classes.has('pressed-l'));h.state.correctHighlightEnabled=false;h.presentation.render();assert.ok(h.key(60).classes.has('expected-l'));
 h.state.heldCorrectNotes.set(60,2);h.state.sustainedVisuals=[];h.state.expectedNotes=[];h.presentation.render();assert.ok(!h.key(60).classes.has('wrong')&&!h.key(60).classes.has('expected-l'));h.state.heldCorrectNotes.clear();h.presentation.render();assert.ok(h.key(60).classes.has('wrong'));
});
test('explicit current frame still collects depth zero after sustain pruning and commits the exact returned preview array',()=>{
 const h=harness();h.state.futurePreviewEnabled=false;const events=[];h.presentation.render({collectPreview:depth=>{h.effects.push(['preview',depth]);return events;}},0.5);assert.deepEqual(h.effects.slice(0,3),[['prune',0.5],['preview',0],['led-render',[],0]]);assert.equal(h.state.lastLedPreviewEvents,events);
});
test('keyboard init builds 52 white/36 black keys, one listener lifetime and passive touch semantics',()=>{
 const h=harness();h.inputs.init();h.inputs.init();assert.equal(h.container.children.length,88);assert.equal(h.container.children.filter(k=>k.classes.has('white')).length,52);assert.equal(h.container.children.filter(k=>k.classes.has('black')).length,36);assert.equal(h.count(),892);assert.equal(h.key(21).dataset.virtualDown,'0');assert.equal(h.key(108).dataset.midi,'108');assert.equal(h.key(60).listeners.find(x=>x.event==='touchstart').options.passive,false);
});
test('pointer and compatibility mouse events deduplicate a down key; mismatched release preserves active input',async()=>{
 const h=harness();h.inputs.init();const key=h.key(60);key.dispatch(new Pointer('pointerdown',{pointerId:7}));key.dispatch(new Mouse('mousedown'));await h.tick();assert.deepEqual(h.effects.filter(x=>x[0]==='input'),[['input',60,true,'ui']]);h.window.dispatch(new Pointer('pointerup',{pointerId:8}));assert.ok(h.state.pressedKeys.has(60));key.dispatch(new Pointer('pointerup',{pointerId:7}));assert.ok(!h.state.pressedKeys.has(60));assert.equal(key.dataset.virtualDown,'0');
});
test('touch tokens and fallback cancel release correctly, switching pitches releases the former active note first',async()=>{
 const h=harness();h.inputs.init();h.key(60).dispatch(new Touch('touchstart',{changedTouches:[{identifier:9}]}));await h.tick();h.key(62).dispatch(new Touch('touchstart'));await h.tick();assert.deepEqual(h.effects.filter(x=>x[0]==='input'),[['input',60,true,'ui'],['input',60,false,'ui'],['input',62,true,'ui']]);h.window.dispatch(new Touch('touchcancel'));assert.ok(!h.state.pressedKeys.has(62));
});
test('mouse leave, blur and hidden visibility release input; visible/focus/pageshow/gesture events preserve unlock commands',async()=>{
 const h=harness();h.inputs.init();h.key(60).dispatch(new Mouse('mousedown'));await h.tick();h.key(60).dispatch(new Mouse('mouseleave'));assert.ok(!h.state.pressedKeys.has(60));h.key(60).dispatch(new Mouse('mousedown'));await h.tick();h.window.dispatch(new Mouse('blur'));assert.ok(!h.state.pressedKeys.has(60));assert.equal(h.key(60).dataset.virtualDown,'1');h.key(60).dispatch(new Mouse('mouseup'));h.key(60).dispatch(new Mouse('mousedown'));await h.tick();h.effects.length=0;h.document.hidden=true;h.document.dispatch(new Mouse('visibilitychange'));assert.deepEqual(h.effects,[['input',60,false,'ui']]);
 h.document.hidden=false;for(const [target,type]of [[h.document,'visibilitychange'],[h.window,'focus'],[h.window,'pageshow'],[h.document,'touchstart'],[h.document,'pointerdown'],[h.document,'mousedown']])target.dispatch(new Mouse(type));assert.equal(h.effects.filter(x=>x[0]==='ready').length,6);
});
test('ordinary release and keyboard rebuild preserve delayed attack; explicit disposal invalidates it across reinit',async()=>{
 const h=harness();let finish;h.inputPorts.ensureLiveAudioReady=()=>new Promise(resolve=>finish=resolve);h.inputs.init();const old=h.key(60);old.dispatch(new Mouse('mousedown'));old.dispatch(new Mouse('mouseup'));h.inputs.createKeyboard();finish();await h.tick();assert.ok(h.state.pressedKeys.has(60));assert.equal(old.dataset.virtualDown,'0');
 h.inputs.dispose();assert.ok(!h.state.pressedKeys.has(60));h.inputs.init();h.key(62).dispatch(new Pointer('pointerdown',{pointerId:11}));const pending=finish;h.inputs.dispose();h.inputs.init();pending();await h.tick();assert.ok(!h.state.pressedKeys.has(62));assert.equal(h.count(),892);
});
test('cached-page suspension releases pointer/capture and delayed unlock while retaining the same key bindings',async()=>{
 const h=harness();h.inputs.init();const key=h.key(60),bindings=h.count();
 key.dispatch(new Pointer('pointerdown',{pointerId:7}));await h.tick();h.inputs.suspend();
 assert.equal(h.count(),bindings);assert.equal(h.key(60),key);assert.equal(key.dataset.virtualDown,'0');assert.equal(key.captured.size,0);assert.equal(h.state.pressedKeys.size,0);
 let finish;h.inputPorts.ensureLiveAudioReady=()=>new Promise(resolve=>finish=resolve);
 key.dispatch(new Mouse('mousedown'));h.inputs.suspend();finish();await h.tick();assert.equal(h.state.pressedKeys.size,0);
 h.inputPorts.ensureLiveAudioReady=async()=>{};key.dispatch(new Mouse('mousedown'));await h.tick();assert.ok(h.state.pressedKeys.has(60));
 key.dispatch(new Mouse('mouseup'));assert.equal(h.state.pressedKeys.size,0);assert.equal(h.count(),bindings);
});
test('dispose removes owned keys/capture/listeners and releases its active note without clearing other pressed notes',async()=>{
 const h=harness();h.inputs.init();const key=h.key(60),saved=key.listeners.find(x=>x.event==='mousedown').handler;h.state.pressedKeys.add(65);key.dispatch(new Pointer('pointerdown',{pointerId:17}));await h.tick();h.inputs.dispose();h.inputs.dispose();assert.equal(h.count(),0);assert.equal(h.container.children.length,0);assert.equal(key.captured.size,0);assert.ok(h.state.pressedKeys.has(65)&&!h.state.pressedKeys.has(60));h.inputs.init();h.effects.length=0;saved(new Mouse('mousedown'));await h.tick();assert.equal(h.effects.length,0);
});
test('staff identity uses exact objects across instruments, all aliases, right first-note fallback and fresh rebuild',()=>{
 const h=harness(),a={id:0},b={id:0},c={id:3};h.renderer.Sheet.Instruments=[{Staves:[a,b]},{staffs:[a,c]}];h.adapter.rebuildStaffIdentity();assert.equal(h.adapter.resolveStaffIdFromNote({ParentStaff:a}),1);assert.equal(h.adapter.resolveStaffIdFromNote({parentStaff:b}),2);assert.equal(h.adapter.resolveStaffIdFromNote({ParentVoiceEntry:{ParentSourceStaffEntry:{ParentStaff:c}}}),3);assert.equal(h.adapter.resolveStaffIdFromNote({parentVoiceEntry:{parentSourceStaffEntry:{parentStaff:b}}}),2);assert.equal(h.adapter.resolveStaffIdFromNote({SourceStaff:c}),3);assert.equal(h.adapter.resolveStaffIdFromNote({sourceStaff:a}),1);
 assert.equal(h.adapter.resolveStaffIdFromNote({ParentStaff:{id:0}}),0);assert.equal(h.adapter.resolveStaffIdFromNote({ParentStaff:{id:'bad'}}),null);assert.equal(h.adapter.resolveStaffIdFromEntry({Notes:[],notes:[{ParentStaff:b}]}),2);h.renderer.Sheet.Instruments=[];h.renderer.Sheet.instruments=[{Staves:[b]}];h.adapter.rebuildStaffIdentity();assert.equal(h.adapter.resolveStaffIdFromNote({ParentStaff:b}),0);h.adapter.dispose();
});
test('score seek keeps inclusive first-box precedence, loop bounds and real duplicate measure traversal',()=>{
 const h=harness();h.seek.seek(250,30);assert.deepEqual(h.effects,[['stop'],['reset'],['advance',0],['advance',1],['advance',2],['update'],['scroll'],['clear']]);h.effects.length=0;h.seek.seek(100,30);assert.deepEqual(h.effects,[['stop'],['reset'],['update'],['scroll'],['clear']]);
 h.effects.length=0;h.seekPorts.isLoopEnabled=()=>true;h.state.looper={min:2,max:3};h.seek.seek(50,30);assert.equal(h.effects.length,0);h.seek.seek(210,30);assert.ok(h.effects.some(x=>x[0]==='update'));
});
test('score seek guards absent sheet/playing/panels/coordinate failures and owns exactly one native click handler',()=>{
 const h=harness();for(const guard of ['hasGraphicSheet','isAnyToolbarPanelOpen','clientPointToSvg']){const original=h.seekPorts[guard];h.seekPorts[guard]=()=>guard==='hasGraphicSheet'?false:guard==='isAnyToolbarPanelOpen'?true:null;h.seek.seek(200,30);assert.equal(h.effects.length,0);h.seekPorts[guard]=original;}h.state.isPlaying=true;h.seek.seek(200,30);assert.equal(h.effects.length,0);h.state.isPlaying=false;h.seekUi.init();h.seekUi.init();const node=h.nodes.get('canvas-wrapper'),saved=node.listeners[0].handler;assert.equal(node.listeners.length,1);node.dispatch({type:'click',clientX:200,clientY:30});assert.equal(h.effects.length,0);node.dispatch(new Mouse('click',{clientX:250,clientY:30}));assert.ok(h.effects.some(x=>x[0]==='update'));h.seekUi.dispose();h.seekUi.init();h.effects.length=0;saved(new Mouse('click',{clientX:250,clientY:30}));assert.equal(h.effects.length,0);
});
test('score status reads live score state and song UI retains metadata, defaults, score reset and command order',()=>{
 const h=harness(),status=h.api('PianoTrainerScoreStatus').create(h.document,()=>h.state.score);status.update();assert.equal(h.nodes.get('live-score').innerText,'100%');h.state.score={correct:10,wrong:2};status.update();assert.equal(h.nodes.get('live-score').innerText,'83%');
 const fx=name=>(...args)=>h.effects.push([name,...args]);let reads=0;const ui=h.api('PianoTrainerScoreUiController').create({state:h.state,rebuildStaffIdentity:fx('staff'),rebuildMeasureTimingCache:fx('timing'),getMeasureCount:()=>4,resetLoopRange:fx('range'),getFirstTempo:()=>{reads++;return 90;},updateTempo:fx('tempo'),getStaffCount:()=>2,resetHandAssignments:fx('assign'),updateScoreDisplay:fx('score'),renderLooper:fx('loop')});ui.initSongUI();assert.deepEqual(h.effects,[['staff'],['timing'],['range',4],['tempo','percent',100],['assign',2],['score'],['loop']]);assert.equal(reads,2);assert.equal(h.state.baseBpm,90);assert.deepEqual(h.state.score,{correct:0,wrong:0});
});
