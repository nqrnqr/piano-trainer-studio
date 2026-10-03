const {test}=require('node:test'),assert=require('node:assert/strict');const {transpose,modules}=require('../helpers/score-transform-harness.cjs');
const turn=()=>new Promise(setImmediate);
test('transpose commands are cold and apply preserves original metadata until async load completes',async()=>{
 let finish;const h=transpose({load:()=>new Promise(r=>finish=r)});h.app.transpose.mode='semitone';h.app.transpose.semitones=2;
 const identity=h.app.transpose;assert.equal(h.events.length,0);const pending=h.service.applyTranspose();await turn();
 assert.equal(h.app.transpose.active,false);const load=h.events.find(e=>e[0]==='load');
 assert.equal(load[2].fileName,'Original.musicxml');assert.equal(load[2].originalFileName,'Original.mxl');assert.equal(load[2].originalFileType,'mxl');
 assert.equal(load[2].originalRawData,h.app.currentScoreOriginalData);assert.equal(load[2].skipTransposeReset,true);assert.equal(load[2].libraryScoreId,'id');
 finish();await pending;assert.equal(h.app.transpose,identity);assert.equal(identity.activeLabel,'+2 semitones');
});
test('repeated transpose uses original source and post-load mode reads remain live',async()=>{
 let finish;const h=transpose({load:()=>new Promise(r=>finish=r)});h.app.transpose.mode='semitone';h.app.transpose.semitones=2;
 const first=h.service.applyTranspose();await turn();h.app.transpose.mode='key';finish();await first;assert.equal(h.app.transpose.activeLabel,'to D major / B minor');
 h.app.transpose.mode='semitone';h.app.currentScoreData='<score-partwise>already-transposed</score-partwise>';
 const next=h.service.applyTranspose();await turn();finish();await next;
 assert.deepEqual(h.events.filter(e=>e[0]==='transform').map(e=>e[1]),[h.app.currentScoreOriginalData,h.app.currentScoreOriginalData]);
});
test('same-signature key request stops before transform/load and preserves the original status',async()=>{
 const h=transpose();h.app.transpose.targetKey='sig-0';await h.service.applyTranspose();
 assert.equal(h.events.some(e=>e[0]==='load'),false);assert.deepEqual(h.events.at(-1),['status','Target key already matches the current key. Choose a different key or use semitones.',true]);
});
test('availability fallback does not replace the original-data argument used by apply',async()=>{
 const h=transpose();h.app.currentScoreOriginalData=null;h.app.transpose.mode='semitone';await h.service.applyTranspose();
 assert.equal(h.app.transpose.available,true);assert.equal(h.events.find(e=>e[0]==='transform')[1],null);
 assert.equal(h.events.some(e=>e[0]==='load'),false);assert.equal(h.events.at(-1)[2],true);
});
test('missing engine disables transpose without reading or loading a score',async()=>{
 const h=transpose({noEngine:true});h.app.transpose.active=true;await h.service.applyTranspose();
 assert.equal(h.app.transpose.available,false);assert.equal(h.app.transpose.active,false);assert.equal(h.app.transpose.sourceKeyLabel,'Unavailable for this score');
 assert.deepEqual(h.events,['sync']);
});
test('load errors are reported as status without rethrow or marking a successful transposition',async()=>{
 const error=new Error('load failure'),h=transpose({load:async()=>{throw error;}});h.app.transpose.mode='semitone';await h.service.applyTranspose();
 assert.equal(h.app.transpose.active,false);assert.equal(h.events.at(-2)[2],error);assert.deepEqual(h.events.at(-1),['status','load failure',true]);
});
test('reset loads original source, preserves metadata/speed command option, then resets active state and inferred target',async()=>{
 const h=transpose();h.app.transpose.active=true;h.app.transpose.semitones=5;await h.service.resetTranspose();
 const load=h.events.find(e=>e[0]==='load');assert.equal(load[1],h.app.currentScoreOriginalData);assert.equal(load[2].fileName,'Original.mxl');assert.equal(load[2].skipTransposeReset,true);
 assert.equal(h.app.transpose.active,false);assert.equal(h.app.transpose.semitones,0);assert.equal(h.app.transpose.targetKey,'sig-0');assert.equal(h.events.at(-1),'sync');
});
test('handle-score-loaded preserves transpose object identity while restoring its defaults',()=>{
 const h=transpose(),identity=h.app.transpose;identity.mode='semitone';identity.active=true;h.service.handleScoreLoaded();
 assert.equal(h.app.transpose,identity);assert.equal(identity.mode,'key');assert.equal(identity.active,false);assert.equal(identity.available,true);
});
test('explicit dispose suppresses a pending apply UI commit, while init permits a new command',async()=>{
 let finish;const h=transpose({load:()=>new Promise(r=>finish=r)});h.app.transpose.mode='semitone';const pending=h.service.applyTranspose();
 await turn();const before=h.events.length;h.service.dispose();h.service.dispose();finish();await pending;
 assert.equal(h.events.length,before);assert.equal(h.app.transpose.active,false);h.service.init();const next=h.service.applyTranspose();await turn();finish();await next;assert.equal(h.app.transpose.active,true);
});
class Element {
 value='';checked=false;disabled=false;textContent='';innerHTML='';listeners=new Map();classes=new Set();
 classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};
 addEventListener(name,handler){const list=this.listeners.get(name)??new Set();list.add(handler);this.listeners.set(name,list);}
 removeEventListener(name,handler){this.listeners.get(name)?.delete(handler);}
 getAttribute(){return this.row;}
}
class Select extends Element{}class Input extends Element{}class Button extends Element{}
test('transpose controls bind once, parse values in their boundary and remove all owned listeners',async()=>{
 const m=modules({HTMLElement:Element,HTMLSelectElement:Select,HTMLInputElement:Input,HTMLButtonElement:Button});
 const state={available:true,sourceKeyLabel:'C',mode:'key',targetKey:'sig-0',semitones:0,updateKeySignature:true,active:false};
 const elements=Object.fromEntries(['transpose-popup','transpose-current-key','transpose-mode','transpose-target-key','transpose-semitones','transpose-semitones-value',
  'transpose-update-key-signature','btn-transpose-apply','btn-transpose-reset','transpose-status'].map(id=>[id,id.includes('btn-')?new Button():['transpose-mode','transpose-target-key'].includes(id)?new Select():
   ['transpose-semitones','transpose-update-key-signature'].includes(id)?new Input():new Element()]));
 const row=new Element();row.row='semitone';let applies=0;
 const commands={ensureTransposeState:()=>state,applyTranspose:async()=>applies++,resetTranspose:async()=>{}};
 const ui=m.api('PianoTrainerTransposeControls').create({document:{getElementById:id=>elements[id]??null,querySelectorAll:()=>[row]},commands,getEngine:()=>m.api('PianoTrainerTransposeEngine')});
 ui.init();ui.init();assert.equal(elements['btn-transpose-apply'].listeners.get('click').size,1);
 elements['transpose-mode'].value='semitone';for(const fn of elements['transpose-mode'].listeners.get('change'))fn();assert.equal(state.mode,'semitone');assert.equal(row.classes.has('hidden'),false);
 elements['transpose-semitones'].value='-3';for(const fn of elements['transpose-semitones'].listeners.get('input'))fn();assert.equal(state.semitones,-3);
 for(const fn of elements['btn-transpose-apply'].listeners.get('click'))await fn();assert.equal(applies,1);ui.dispose();ui.dispose();
 assert.equal([...Object.values(elements)].flatMap(e=>[...e.listeners.values()]).reduce((n,s)=>n+s.size,0),0);
});
