const test=require('node:test'),assert=require('node:assert/strict');
const {harness}=require('../helpers/legacy-led-harness.cjs');
const turn=()=>new Promise(resolve=>setImmediate(resolve));
const zero=h=>{for(const [key,value]of Object.entries(h.resources.snapshot()))if(key!=='active')assert.equal(value,0,key);};
function init(h){h.midiTest.init();h.led.initLedCountControl();h.led.initLedBrightnessControls();h.led.initLedCalibrationControls();h.led.LedEngine.init();h.led.initLedOutputControls();}
test('retained hardware JS has no unresolved application identifier outside its supplied ports',()=>{
 const ts=require('typescript');
 for(const file of ['js/led.js','js/optional/midi-led-test.js']){
  const program=ts.createProgram([file],{allowJs:true,noEmit:true,target:ts.ScriptTarget.ES2020}),checker=program.getTypeChecker(),source=program.getSourceFile(file),free=new Set();
  function visit(node){if(ts.isIdentifier(node)&&!checker.getSymbolAtLocation(node)){
   const parent=node.parent,key=ts.isPropertyAccessExpression(parent)&&parent.name===node||ts.isPropertyAssignment(parent)&&parent.name===node||ts.isBindingElement(parent)&&parent.propertyName===node||ts.isMethodDeclaration(parent)&&parent.name===node;
   if(!key)free.add(node.text);
  }ts.forEachChild(node,visit);}visit(source);assert.deepEqual([...free],[],file);
 }
});
test('retained JS factories have explicit ports, create no native resources, and bind once at original init commands',()=>{
 const h=harness();assert.equal(h.context.AppState,undefined);assert.equal(h.window.MidiLedTestController,undefined);zero(h);assert.equal(h.effects.length,0);
 init(h);const count=h.resources.snapshot().listeners,midi=h.midiResources.snapshot().listeners;assert.equal(count,31);assert.equal(midi,1);assert.equal(h.resources.snapshot().markers,21);init(h);assert.equal(h.resources.snapshot().listeners,count);assert.equal(h.midiResources.snapshot().listeners,midi);assert.equal(h.led.LedEngine.frame.length,88);
 const off=harness({enabled:false});off.midiTest.init();assert.equal(off.midiResources.snapshot().listeners,0);
});
test('native calibration holds preserve delays and dispose cancels owned repeat/capture/listeners; old callbacks cannot revive',()=>{
 const h=harness();init(h);h.led.setLedCalibrationMode(true);h.led.selectLedCalibrationMidi(60);const left=h.nodes.get('btn-led-calibration-left'),old=left.listeners.find(x=>x.event==='pointerdown').handler;
 left.dispatch(h.event('pointerdown',{pointerType:'mouse'}));assert.equal(h.led.getLedCalibrationOffsetForMidi(60),-1);assert.equal(h.timers.size,1);assert.equal([...h.timers.values()][0].delay,320);h.fireTimer([...h.timers.keys()][0]);assert.equal([...h.intervals.values()][0].delay,150);[...h.intervals.values()][0].callback();assert.equal(h.led.getLedCalibrationOffsetForMidi(60),-2);
 const external=h.window.setInterval(()=>{},500);left.dataset.external='yes';h.led.dispose();h.led.dispose();zero(h);assert.equal(left.captured.size,0);assert.equal(h.intervals.size,1);assert.ok(h.intervals.has(external));assert.equal(left.listeners.length,0);assert.equal(left.dataset.external,'yes');
 h.led.activate();init(h);const before=h.effects.length;old(h.event('pointerdown',{pointerType:'mouse'}));assert.equal(h.effects.length,before);left.dispatch(h.event('click'));assert.equal(h.led.getLedCalibrationOffsetForMidi(60),-3);h.led.dispose();
});
test('calibration file resources abort only pending owned readers and old onload stays invalid after fresh init',()=>{
 const h=harness();h.led.handleLedCalibrationImportFile({});const reader=h.readers[0],old=reader.onload;h.led.dispose();assert.equal(reader.aborts,1);assert.equal(reader.onload,null);zero(h);h.led.activate();reader.result='{"60":9}';old();assert.equal(h.led.getLedCalibrationOffsetForMidi(60),0);
 h.led.handleLedCalibrationImportFile({});h.readers[1].complete('{"ledCalibration":{"60":4,"61":100}}');assert.equal(h.led.getLedCalibrationOffsetForMidi(60),4);assert.equal(h.led.getLedCalibrationOffsetForMidi(61),40);assert.equal(h.resources.snapshot().readers,0);h.led.dispose();assert.equal(h.readers[1].aborts,0);
});
test('download keeps filename/effect order and disposal releases resources left by an ordinary click error',()=>{
 const h=harness();h.led.downloadLedCalibrationBackup();assert.deepEqual(h.effects.map(x=>x[0]),['create-url','append-link','download','remove-link','revoke-url']);assert.match(h.effects[2][1],/^LED-Calibration-Export-1970-01-01.json$/);zero(h);
 const create=h.resourcePorts.createLink;h.resourcePorts.createLink=()=>{const link=create();link.click=()=>{throw Error('blocked');};return link;};h.led.downloadLedCalibrationBackup();assert.equal(h.urls.size,1);assert.equal(h.links.size,1);assert.equal(h.effects.at(-1)[0],'alert');h.led.dispose();assert.equal(h.urls.size,0);assert.equal(h.links.size,0);zero(h);
});
test('owned fetch disposal prevents reconnect/status/permission fallback after rejection or resolution across reinit',async()=>{
 for(const rejected of [true,false]){const h=harness();h.state.ledOutputMode='wled';h.state.wledIp='device';const work=h.led.WLEDController.ensureSolidMode();assert.equal(h.requests.length,1);const signal=h.requests[0].options.signal;h.led.dispose();assert.ok(signal.aborted);zero(h);h.led.activate();const before=JSON.stringify({state:h.state,effects:h.effects});if(rejected)h.pending[0].reject(Error('Failed to fetch'));else h.pending[0].resolve({ok:true});await work;await turn();assert.equal(h.requests.length,1);assert.equal(JSON.stringify({state:h.state,effects:h.effects}),before);zero(h);}
});
test('helper JSON continuation and scheduled transport promises cannot commit after disposal/reinit',async()=>{
 const h=harness();h.state.ledOutputMode='wled';h.state.wledIp='device';h.state.wledTransport='ddp';let resolveJson;const work=h.led.WLEDController.checkLocalHelperAvailability({force:true});h.pending[0].resolve({ok:true,json:()=>new Promise(resolve=>{resolveJson=resolve;})});await turn();assert.equal(typeof resolveJson,'function');h.led.dispose();h.led.activate();const before=JSON.stringify({state:h.state,effects:h.effects});resolveJson({ok:true,version:'9.0'});await work;await turn();assert.equal(JSON.stringify({state:h.state,effects:h.effects}),before);assert.equal(h.frames.size,0);zero(h);
 h.led.setWledTransport('ddp');const pendingCount=h.requests.length;h.led.dispose();h.led.activate();await turn();assert.equal(h.requests.length,pendingCount);zero(h);
});
test('WLED test and flush waits settle on disposal, without restoring an old frame or scheduling retry',async()=>{
 const h=harness();h.state.ledOutputMode='wled';h.state.wledIp='device';h.led.LedEngine.init();h.led.updateLedKeyMapping();const work=h.led.WLEDController.testPattern();h.pending[0].resolve({ok:true});await turn();assert.equal(h.requests.length,2);h.pending[1].resolve({ok:true});await turn();assert.ok(h.resources.snapshot().waits>0);h.led.dispose();h.led.activate();const before=JSON.stringify({state:h.state,effects:h.effects,frame:h.led.LedEngine.frame});await work;await turn();assert.equal(JSON.stringify({state:h.state,effects:h.effects,frame:h.led.LedEngine.frame}),before);assert.equal(h.led.WLEDController.testPatternRunning,false);assert.equal(h.requests.length,2);zero(h);
 const q=harness();q.state.ledOutputMode='wled';q.state.wledIp='device';q.led.WLEDController.queueFrame([[255,0,0]]);q.fireFrames();q.led.WLEDController.queueFrame([[0,255,0]]);q.pending[0].resolve({ok:true});await turn();assert.equal(q.resources.snapshot().waits,1);assert.equal([...q.timers.values()][0].delay,20);q.led.dispose();q.led.activate();const trace=q.effects.length;await turn();assert.equal(q.effects.length,trace);assert.equal(q.requests.length,1);assert.equal(q.led.WLEDController.lastFrameSignature,'');assert.equal(q.led.WLEDController.sending,false);zero(q);
});
test('MIDI LED sweep retains channel/note/velocity and releases own active note once; disposed waits cannot restart',async()=>{
 const h=harness();h.state.ledOutputMode='midi';h.midiTest.init();const work=h.midiTest.controller.run();assert.deepEqual(h.effects.find(x=>x[0]==='send'),['send',0x91,21,100]);assert.equal([...h.timers.values()][0].delay,55);h.midiTest.dispose();h.midiTest.dispose();assert.ok(h.effects.some(x=>JSON.stringify(x)===JSON.stringify(['send',0x81,21,0])));assert.equal(h.effects.filter(x=>x[0]==='send'&&x[1]===0xb1).length,1);assert.equal(h.timers.size,0);h.midiTest.init();const before=h.effects.length;await work;assert.equal(h.effects.length,before);assert.equal(h.midiResources.snapshot().listeners,1);assert.equal(h.midiTest.controller.isRunning,false);
});

test('a failed hardware note-off cannot prevent explicit native resource cleanup',()=>{
 const h=harness();init(h);h.state.ledOutputMode='midi';h.state.hardwareLEDState.set(60,'expected-r');h.output.send=()=>{throw Error('device removed');};
 h.led.dispose();zero(h);assert.equal(h.effects.at(-1)[0],'warn');assert.equal(h.effects.at(-1)[1],'LED disposal note-off error');
});
