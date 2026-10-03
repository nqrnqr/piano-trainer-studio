const {test}=require('node:test'),assert=require('node:assert/strict');const {modules,conversion}=require('../helpers/score-transform-harness.cjs');
const turn=()=>new Promise(setImmediate);
test('converter chooses original suffixes, excludes MXL, and reads after readiness before load/export/soft destroy',async()=>{
 const h=conversion();const file=new File([new Uint8Array([1,2])],'Song.MID');const result=await h.service.convertFileToScore(file);
 assert.deepEqual(h.events,['ensure','read',['load','midi',[1,2]],'export',['destroy',undefined]]);
 assert.deepEqual({...result},{rawData:'<score/>',fileName:'Song.musicxml',fileType:'musicxml',title:'Song'});
 assert.equal(h.service.isConverterImportFileName('native.mxl'),false);
 for(const suffix of ['.mid','.midi','.mscz','.mscx','.gp','.gp3','.gp4','.gp5','.gpx','.gtp','.ptb'])assert.equal(h.service.isConverterImportFileName('file'+suffix),true);
});
test('export fallback variants preserve method receiver and precedence',async()=>{
 for(const method of ['saveXml','saveMusicXml','saveMxml','saveMusicXML']){
  const score={[method]:async function(){assert.equal(this,score);return '<xml/>';}};
  const h=conversion({score});assert.equal((await h.service.convertFileToScore(new File(['x'],'a.mid'))).rawData,'<xml/>');
 }
 const h=conversion({score:{saveXml:async()=>'<first/>',saveMusicXml:async()=>{throw Error('wrong priority');}}});
 assert.equal((await h.service.convertFileToScore(new File(['x'],'a.mid'))).rawData,'<first/>');
});
test('vendor decoder accepts original text/buffer/view shapes and retains zero-length fallback and offset errors',()=>{
 const adapter=modules().api('PianoTrainerWebmscoreAdapter'),bytes=new TextEncoder().encode('AéZ');
 assert.equal(adapter.uint8ArrayToString('AéZ'),'AéZ');assert.equal(adapter.uint8ArrayToString(bytes.buffer),'AéZ');
 assert.equal(adapter.uint8ArrayToString(new DataView(bytes.buffer,1,2)),'é');
 assert.equal(adapter.uint8ArrayToString({buffer:bytes.buffer,byteOffset:1,byteLength:2}),'é');
 assert.equal(adapter.uint8ArrayToString({buffer:bytes.buffer,byteLength:0}),'AéZ');
 assert.throws(()=>adapter.uint8ArrayToString({buffer:bytes.buffer,byteOffset:1,byteLength:0}),{name:'RangeError'});
 assert.throws(()=>adapter.uint8ArrayToString({}),/Converted score was not returned as text/);
});
test('XML normalization avoids converter readiness and preserves decoding errors',async()=>{
 const h=conversion();assert.equal(await h.service.normalizeScoreToMusicXml(new TextEncoder().encode('<xml/>'),{fileType:'xml'}),'<xml/>');
 assert.equal(h.events.length,0);await assert.rejects(h.service.normalizeScoreToMusicXml({}, {fileType:'xml'}),/Converted score was not returned as text/);
});
test('MXL normalization passes existing bytes without extra read and retains original error/finally behavior',async()=>{
 const error=new Error('export failed'),h=conversion({score:{saveXml:async()=>{throw error;},destroy:soft=>h.events.push(['destroy',soft])}});
 const bytes=new Uint8Array([1,2]);let observed;h.vendor.load=async(format,data)=>{observed=data;return h.score;};
 await assert.rejects(h.service.normalizeScoreToMusicXml(bytes,{fileType:'mxl'}),value=>value===error);
 assert.equal(observed,bytes);assert.deepEqual(h.events,['ensure',['destroy',undefined]]);
});
test('converter readiness/read failures remain outside the generic conversion catch',async()=>{
 const error=new Error('read failed'),h=conversion({read:async()=>{throw error;}});
 await assert.rejects(h.service.convertFileToScore(new File(['x'],'a.mid')),value=>value===error);assert.deepEqual(h.events,['ensure','read']);
 const ready=conversion();ready.ports.ensureWebMscoreLoaded=async()=>{throw error;};
 await assert.rejects(ready.service.convertFileToScore(new File(['x'],'a.mid')),value=>value===error);assert.equal(ready.events.length,0);
});
test('conversion load/export errors are logged then wrapped, with destroy errors ignored',async()=>{
 const error=new Error('broken');const h=conversion({score:{saveXml:async()=>{throw error;},destroy:()=>{h.events.push('destroy');throw Error('cleanup');}}});
 await assert.rejects(h.service.convertFileToScore(new File(['x'],'Bad.mid')),/Could not convert "Bad.mid"/);
 assert.equal(h.events.at(-2)[2],error);assert.equal(h.events.at(-1),'destroy');
 const absent=conversion({score:null});await assert.rejects(absent.service.convertFileToScore(new File(['x'],'Null.mid')),/Could not convert "Null.mid"/);
});
test('explicit dispose releases completed soft-destroyed worker handles once',async()=>{
 const h=conversion();await h.service.convertFileToScore(new File(['x'],'a.mid'));h.service.dispose();h.service.dispose();
 assert.deepEqual(h.events.slice(-2),[['destroy',undefined],['destroy',false]]);
});
test('explicit dispose during export hard-destroys once and suppresses the late conversion result',async()=>{
 let finish;const h=conversion({score:{saveXml:()=>new Promise(r=>finish=r),destroy:soft=>h.events.push(['destroy',soft])}});
 const pending=h.service.convertFileToScore(new File(['x'],'a.mid'));await turn();h.service.dispose();finish('<late/>');
 await assert.rejects(pending,{name:'AbortError'});assert.deepEqual(h.events.filter(e=>Array.isArray(e)&&e[0]==='destroy'),[['destroy',false]]);
});
test('a score returned after disposal is hard-destroyed without export',async()=>{
 let finish;const h=conversion({load:()=>new Promise(r=>finish=r)});const pending=h.service.convertFileToScore(new File(['x'],'a.mid'));
 await turn();h.service.dispose();finish(h.score);await assert.rejects(pending,{name:'AbortError'});
 assert.equal(h.events.includes('export'),false);assert.deepEqual(h.events.at(-1),['destroy',false]);
});
test('convert-and-load waits for conversion cleanup and returns metadata only after app load completes',async()=>{
 let finish;const h=conversion({loader:(raw,config)=>{h.events.push(['app-load',raw,config.fileName]);return new Promise(r=>finish=r);}});
 let done=false;const pending=h.service.convertAndLoadScoreFile(new File(['x'],'a.mid')).then(value=>{done=true;return value;});
 await turn();assert.equal(done,false);assert.deepEqual(h.events.slice(-2),[['destroy',undefined],['app-load','<score/>','a.musicxml']]);
 finish();assert.equal((await pending).fileName,'a.musicxml');
});
function scriptHarness(existing=false){
 const m=modules();let vendor;const scripts=[],events=[];
 const external={remove:()=>events.push('removed-external')};
 const document={querySelector:()=>existing?external:scripts.find(script=>!script.removed)??null,
  createElement:()=>({dataset:{},remove(){this.removed=true;events.push('removed-owned');}}),head:{appendChild:script=>{scripts.push(script);events.push('append');}}};
 const service=m.api('PianoTrainerWebmscoreAdapter').create({document,getVendor:()=>vendor});return {service,scripts,events,setVendor:value=>vendor=value};
}
test('concurrent script requests share one script and wait for native vendor ready before returning',async()=>{
 const h=scriptHarness();let ready;const vendor={ready:new Promise(r=>ready=r)};
 const a=h.service.ensureWebMscoreLoaded(),b=h.service.ensureWebMscoreLoaded();assert.deepEqual(h.events,['append']);
 h.setVendor(vendor);h.scripts[0].onload();let done=false;a.then(()=>done=true);await turn();assert.equal(done,false);
 ready();assert.equal(await a,vendor);assert.equal(await b,vendor);
});
test('script failure remains cached until explicit dispose, while external markers remain untouched',async()=>{
 const h=scriptHarness();const pending=h.service.ensureWebMscoreLoaded();h.scripts[0].onerror();
 await assert.rejects(pending,/Could not load the local webmscore/);await assert.rejects(h.service.ensureWebMscoreLoaded(),/Could not load the local webmscore/);
 assert.equal(h.scripts.length,1);h.service.dispose();assert.equal(h.scripts[0].removed,true);
 const external=scriptHarness(true);await assert.rejects(external.service.ensureWebMscoreLoaded(),/webmscore did not initialize correctly/);
 external.service.dispose();assert.equal(external.events.length,0);
});
test('disposing a pending script rejects it and ignores the captured load callback',async()=>{
 const h=scriptHarness();const pending=h.service.ensureWebMscoreLoaded(),load=h.scripts[0].onload;
 h.service.dispose();h.service.dispose();load();await assert.rejects(pending,{name:'AbortError'});assert.deepEqual(h.events,['append','removed-owned']);
});
test('a captured old script callback cannot erase a later lifecycle rejection handler',async()=>{
 const h=scriptHarness();const old=h.service.ensureWebMscoreLoaded(),oldLoad=h.scripts[0].onload;
 h.service.dispose();await assert.rejects(old,{name:'AbortError'});
 const fresh=h.service.ensureWebMscoreLoaded();oldLoad();h.service.dispose();await assert.rejects(fresh,{name:'AbortError'});
 assert.deepEqual(h.events,['append','removed-owned','append','removed-owned']);
});
