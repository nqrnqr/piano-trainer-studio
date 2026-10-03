const assert=require('node:assert/strict'),{test}=require('node:test');
const {harness,Element}=require('../helpers/settings-debug-harness.cjs');
const plain=value=>JSON.parse(JSON.stringify(value));
test('settings file factory is cold; initialized export retains payload, filename, DOM and revoke order',()=>{
 const h=harness();assert.deepEqual(h.effects,[]);h.settings.downloadSettingsBackup();assert.deepEqual(h.effects,[]);h.settings.init();h.settings.init();h.settings.downloadSettingsBackup();
 assert.deepEqual(h.effects.map(x=>x[0]),['blob','url','click','revoke']);assert.equal(h.effects[2][2],'Piano-Trainer-Settings-Backup-2026-10-03.json');assert.equal(h.effects[0][2].type,'application/json');assert.equal(JSON.parse(h.effects[0][1][0]).settings.pt_scoreLayout,'horizontal');assert.equal(h.document.body.children.length,0);h.settings.dispose();assert.equal(h.effects.filter(x=>x[0]==='revoke').length,1);
});
test('settings concurrent imports retain completion order and ordinary null/parse/import failures',()=>{
 const h=harness();h.settings.init();h.settings.handleSettingsBackupImportFile(null);h.settings.handleSettingsBackupImportFile(undefined);assert.equal(h.readers.length,0);
 h.settings.handleSettingsBackupImportFile({name:'first'});h.settings.handleSettingsBackupImportFile({name:'second'});h.readers[1].finish('{"settings":{"pt_scoreLayout":"horizontal"}}');h.readers[0].finish('invalid');
 assert.deepEqual(h.effects.slice(2).map(x=>x[0]),['import','alert','reload','warn','alert']);assert.equal(h.effects.at(-1)[1],'Invalid settings backup file.');assert.equal(h.effects[3][1],'Settings imported. The app will now reload to apply them.');
 h.settingsPorts.importPayload=()=>{throw Error('unsupported');};h.settings.handleSettingsBackupImportFile({});h.readers[2].finish(null);assert.equal(h.effects.at(-2)[2],'unsupported');
});
test('explicit settings dispose aborts only owned pending readers and suppresses captured callbacks after reinit',()=>{
 const h=harness(),external=new h.Reader();h.settings.init();h.settings.handleSettingsBackupImportFile({});const own=h.readers[1],callback=own.onload;h.settings.dispose();h.settings.dispose();assert.equal(own.abortCount,1);assert.equal(external.abortCount,0);assert.equal(own.onload,null);h.settings.init();own.result='{"settings":{"pt_scoreLayout":"horizontal"}}';callback();assert.equal(h.effects.some(x=>x[0]==='import'),false);
 h.settings.handleSettingsBackupImportFile({});h.readers[2].finish('{"fresh":true}');assert.equal(h.effects.filter(x=>x[0]==='import').length,1);h.settings.dispose();assert.equal(h.readers[2].abortCount,0);
});
test('settings native read errors/abort remain silent; synchronous read throw still escapes and is not disposed later',()=>{
 const h=harness();h.settings.init();assert.throws(()=>h.settings.handleSettingsBackupImportFile({throwRead:true}),/read failed/);h.settings.handleSettingsBackupImportFile({});h.readers[1].onloadend();h.settings.dispose();assert.equal(h.readers[0].abortCount,0);assert.equal(h.readers[1].abortCount,0);assert.equal(h.effects.some(x=>x[0]==='alert'),false);
});
test('failed settings export retains original warning/alert and explicit dispose cleans its residual link and URL',()=>{
 const h=harness();h.settings.init();h.document.createElement=()=>{const link=new Element('a');link.click=()=>{throw Error('click failed');};return link;};h.settings.downloadSettingsBackup();assert.deepEqual(h.effects.slice(-2),[['warn','Settings backup export failed','click failed'],['alert','Could not export settings backup.']]);assert.equal(h.document.body.children.length,1);h.settings.dispose();h.settings.dispose();assert.equal(h.document.body.children.length,0);assert.equal(h.effects.filter(x=>x[0]==='revoke').length,1);
});
test('debug factory is cold, startup retains two preference reads, native toggle binds once and heartbeat observes live state',()=>{
 const h=harness();assert.equal(h.intervals.size,0);h.debug.init();h.debug.init();assert.equal(h.nodes.get('check-debug').listeners.length,1);assert.equal(h.intervals.size,1);assert.equal(h.effects.filter(x=>x[0]==='read-enabled').length,2);assert.equal([...h.intervals.values()][0].delay,4000);
 const checkbox=h.nodes.get('check-debug');checkbox.checked=true;checkbox.dispatch(h.event('change'));assert.ok(h.state.debugPersistentAnchors&&h.state.debugMatchLogs&&h.state.debugAnchorResolution);assert.equal(h.effects.at(-1)[1],'[PianoTrainer debug TOGGLE]');h.state.isPlaying=true;h.state.expectedNotes=[{},{}];[...h.intervals.values()][0].callback();assert.equal(h.effects.at(-1)[2].expectedNotes,2);assert.equal(h.effects.at(-1)[2].isPlaying,true);
});
test('sticky frames filter invalid coordinates, snapshot anchor values, trim history and render separate SVG rings/labels',()=>{
 const h=harness();h.debug.init();h.debug.setDebugEnabled(true,{logChange:false});h.debug.setDebugStickyFrames(1);const anchor={x:20,y:30};h.debug.pushStickyDebugFrame({measureIndex:2,timestamp:0.5,kind:'expected',notes:[{midi:60,staffId:1,kind:'expected',hit:false,anchor},{midi:61,staffId:1,anchor:{x:NaN,y:1}},{midi:62,staffId:1,anchor:null}]});anchor.x=999;
 assert.equal(h.state.debugFrameSeq,1);assert.equal(h.state.debugAnchorHistory[0].notes.length,1);assert.equal(h.state.debugAnchorHistory[0].notes[0].anchor.x,20);const group=h.svg.querySelector('#pt-debug-group');assert.equal(group.children[0].children[0].attrs.cx,'20');assert.equal(group.children[0].children[3].textContent,'2:1:60');
 h.debug.pushStickyDebugFrame({measureIndex:3,kind:'feedback',notes:[{midi:60,staffId:1,kind:'feedback',hit:true,anchor:{x:40,y:50}}]});assert.equal(h.state.debugAnchorHistory.length,1);assert.equal(h.state.debugAnchorHistory[0].seq,2);assert.equal(group.children[0].children[0].attrs.r,'8');assert.equal(group.children[0].children[0].attrs.stroke,'rgba(46, 204, 113, 0.95)');
 h.debug.setDebugEnabled(false,{clearHistory:false,logChange:false});assert.equal(group.children.length,0);assert.equal(h.state.debugAnchorHistory.length,1);h.debug.clearStickyDebug();assert.equal(h.state.debugAnchorHistory.length,0);
});
test('debug explicit disposal removes only owned checkbox/heartbeat/SVG resources and old handlers stay invalid after reinit',()=>{
 const h=harness(),externalId=h.window.setInterval(()=>{},10),externalGroup=new Element('g');externalGroup.setAttribute('id','external');h.svg.appendChild(externalGroup);h.debug.init();h.debug.setDebugEnabled(true,{logChange:false});h.debug.pushStickyDebugFrame({kind:'expected',notes:[{midi:60,staffId:1,anchor:{x:1,y:2}}]});const checkbox=h.nodes.get('check-debug'),callback=checkbox.listeners[0].handler,heartbeat=[...h.intervals.entries()].find(([id])=>id!==externalId)[1].callback,history=h.state.debugAnchorHistory;
 h.debug.dispose();h.debug.dispose();assert.equal(checkbox.listeners.length,0);assert.equal(checkbox.dataset.ptDebugBound,undefined);assert.equal(h.intervals.size,1);assert.equal(h.svg.querySelector('#pt-debug-group'),null);assert.equal(h.svg.children[0],externalGroup);assert.equal(h.state.debugAnchorHistory,history);
 h.debug.init();h.effects.length=0;callback({target:checkbox});heartbeat();assert.deepEqual(h.effects,[]);assert.equal(h.intervals.size,2);h.debug.dispose();
});
test('debug external binding/group ownership and invalid native event targets stay at the DOM boundary',()=>{
 const h=harness(),checkbox=h.nodes.get('check-debug');checkbox.dataset.ptDebugBound='external';const group=new Element('g');group.setAttribute('id','pt-debug-group');h.svg.appendChild(group);h.debug.init();h.debug.setDebugEnabled(true,{logChange:false});assert.equal(checkbox.listeners.length,0);h.debug.dispose();assert.equal(checkbox.dataset.ptDebugBound,'external');assert.equal(h.svg.querySelector('#pt-debug-group'),group);
 delete checkbox.dataset.ptDebugBound;h.debug.init();h.effects.length=0;checkbox.dispatch(h.event('change'),new Element('div'));assert.deepEqual(h.effects,[]);h.debug.dispose();
});
test('vendor debug observations retain null/defaults and snapshot fields without mutating notes',()=>{
 const h=harness(),observe=h.api('PianoTrainerOsmdDebugObservation'),note={halfTone:48,ParentStaff:{id:2},ParentVoiceEntry:{Timestamp:{RealValue:0.5}},Length:{RealValue:0.25},isRest:()=>false,NoteTie:{}};
 assert.deepEqual(plain(observe.describeLogicalNoteForDebug(note,3,1)),{measureIndex:3,staffIndex:1,staffId:2,midi:60,halfTone:48,length:0.25,timestamp:0.5,isRest:false,hasTie:true});const gn={sourceNote:note,PositionAndShape:{AbsolutePosition:{x:2,y:3},Size:{width:4,height:5}}};assert.equal(observe.describeGraphicalNoteForDebug(gn).width,4);assert.equal(observe.describeLogicalNoteForDebug(null).midi,null);assert.equal(observe.describeGraphicalNoteForDebug(null).absX,null);assert.equal(note.halfTone,48);
});
