const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const {root}=require('../helpers/legacy-script.cjs');
function harness(){
 const calls=[],window=new EventTarget(),app=Object.fromEntries(['init','suspend','resume','dispose'].map(name=>[name,()=>calls.push(name)]));
 const realm=vm.createContext({window,exports:{},require:name=>{assert.equal(name,'./app/bootstrap');return {createApplication:()=>{calls.push('create');return app;}};}});
 vm.runInContext(fs.readFileSync(path.join(root,'.cache/test-modules/main.js'),'utf8'),realm,{filename:'src/main.ts'});
 return {calls,event(type,persisted){const event=new Event(type);Object.defineProperty(event,'persisted',{value:persisted});window.dispatchEvent(event);}};
}
test('real production entry preserves one application through repeated cached hides/shows and disposes only on final leave',()=>{
 const h=harness();h.event('pageshow',false);assert.deepEqual(h.calls,['create','init']);
 for(let i=0;i<2;i++){h.event('pagehide',true);h.event('pageshow',true);}
 assert.deepEqual(h.calls,['create','init','suspend','resume','suspend','resume']);
 h.event('pagehide',false);assert.equal(h.calls.at(-1),'dispose');const length=h.calls.length;
 h.event('pageshow',true);h.event('pagehide',false);h.event('pagehide',true);assert.equal(h.calls.length,length);
});
test('first ordinary pagehide disposes instead of retaining an unloaded application',()=>{
 const h=harness();h.event('pagehide',false);assert.deepEqual(h.calls,['create','init','dispose']);
});
