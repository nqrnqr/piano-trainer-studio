const {test}=require('node:test');const assert=require('node:assert/strict');
const {harness}=require('../helpers/score-data-harness.cjs');const {zip}=require('../helpers/zip-fixture.cjs');
const turn=()=>new Promise(setImmediate);

test('ZIP container chooses its declared score over root and nested fallbacks, for stored and deflated MXL',async()=>{
 for(const method of [0,8]){
  const h=harness();const raw=zip([{path:'META-INF/container.xml',text:'<rootfile full-path="music/main.musicxml"/>',method},
   {path:'a.xml',text:'wrong-root',method},{path:'music/main.musicxml',text:'<score-partwise>chosen</score-partwise>',method}]);
  assert.equal(await h.format.extractMusicXmlFromMxl(raw),'<score-partwise>chosen</score-partwise>');assert.equal(h.events.length,0);
 }
});
test('ZIP fallback preserves depth/name ordering and ignores malformed container contents',async()=>{
 const h=harness();
 assert.equal(await h.format.extractMusicXmlFromMxl(zip([{path:'META-INF/container.xml',text:'not xml'},
  {path:'z.xml',text:'z'},{path:'a.musicxml',text:'a'},{path:'music/0.xml',text:'nested'}])),'a');
 assert.equal(await h.format.extractMusicXmlFromMxl(zip([{path:'b/z.xml',text:'bz'},{path:'a/a.xml',text:'aa'}])),'aa');
});
test('invalid MXL falls back only for transpose normalization and keeps warning order on double failure',async()=>{
 const raw=new Uint8Array([1,2,3]).buffer;const normalizeError=new Error('convert failed');
 const h=harness({normalize:async()=>{throw normalizeError;}});
 assert.equal(await h.format.getCanonicalMusicXmlForTranspose(raw,{fileType:'mxl'}),null);
 assert.deepEqual(h.events.map(e=>e[1]),['Could not normalize MXL to MusicXML for transpose support.','Direct MXL XML extraction also failed.']);
 assert.equal(h.events[0][2],normalizeError);
 const noConverter=harness();assert.equal(await noConverter.format.getCanonicalMusicXmlForTranspose(raw,{fileType:'mxl'}),null);
 assert.equal(noConverter.events[0][1],'Could not extract MXL to MusicXML for transpose support.');
});
test('unsupported ZIP methods and missing embedded XML retain their specific errors',async()=>{
 const h=harness();await assert.rejects(h.format.extractMusicXmlFromMxl(zip([{path:'score.xml',text:'x',method:12}])),/Unsupported MXL compression method: 12/);
 await assert.rejects(h.format.extractMusicXmlFromMxl(zip([{path:'META-INF/container.xml',text:'x'}])),/Could not find the embedded MusicXML/);
});
test('binary copies respect view offsets and MXL payload preserves neutral MIME and File identity',async()=>{
 const h=harness(),bytes=new Uint8Array([9,1,2,3,8]),view=bytes.subarray(1,4);
 const clone=h.format.cloneScoreRawData(view);assert.deepEqual([...new Uint8Array(clone)],[1,2,3]);bytes[1]=7;assert.equal(new Uint8Array(clone)[0],1);
 const file=new File(['x'],'picked.mxl',{type:'application/test'});assert.equal(h.format.getOsmdLoadPayload(file,'mxl','ignored.mxl'),file);
 const payload=h.format.getOsmdLoadPayload(clone,'mxl','Library.mxl');assert.equal(payload.name,'Library.mxl');assert.equal(payload.type,'');
 assert.deepEqual([...new Uint8Array(await payload.arrayBuffer())],[1,2,3]);assert.equal(h.format.getOsmdLoadPayload('xml','xml'),'xml');
});
test('loader factory is cold; render/state/notify wait for OSMD and library completion',async()=>{
 let finishLoad,finishMark,finishRefresh;
 const h=harness({load:()=>new Promise(r=>finishLoad=r),library:{markScoreOpened:()=>{h.events.push('mark-opened');return new Promise(r=>finishMark=r);}},
  refresh:()=>new Promise(r=>finishRefresh=r)});assert.equal(h.events.length,0);
 let done=false;const pending=h.service.loadScoreIntoApp('<score/>',{fileName:'Demo.xml',libraryScoreId:'id'}).then(value=>{done=true;assert.equal(value,undefined);});
 await turn();assert.deepEqual(h.events,['reset-playback','tempo-100','load']);assert.equal(h.state.currentScoreData,'old');
 finishLoad();await turn();assert.equal(h.state.currentScoreData,'<score/>');assert.equal(done,false);assert.equal(h.events.at(-1),'mark-opened');
 finishMark();await turn();assert.equal(h.events.at(-1),'library-refresh');assert.equal(done,false);
 finishRefresh();await pending;
 assert.deepEqual(h.events,['reset-playback','tempo-100','load','render','song-ui','reset-cursor','show','paint','scroll','mark-opened','library-refresh',['transpose',false],'success']);
});
test('MXL render receives original bytes while normalized XML only becomes the transpose source',async()=>{
 const raw=new Uint8Array([1,2,3]).buffer;let normalizedRaw;
 const h=harness({normalize:async data=>{normalizedRaw=data;return '<normalized/>';}});
 await h.service.loadScoreIntoApp(raw,{fileName:'Original.mxl',fileType:'mxl'});
 assert.notEqual(normalizedRaw,raw);assert.equal(h.state.currentScoreData,raw);assert.equal(h.state.currentScoreOriginalData,'<normalized/>');
 assert.equal(h.getPayload().name,'Original.mxl');assert.equal(h.getPayload().type,'');
 assert.deepEqual([...new Uint8Array(await h.getPayload().arrayBuffer())],[1,2,3]);
});
test('skipTransposeReset preserves original metadata and speed while loading the current transposition',async()=>{
 const h=harness({cursor:false});await h.service.loadScoreIntoApp('<transposed/>',{fileName:'Current.musicxml',fileType:'musicxml',title:'Title',
  originalRawData:'<original/>',originalFileName:'Origin.mxl',originalFileType:'mxl',skipTransposeReset:true});
 assert.equal(h.state.currentScoreOriginalData,'<original/>');assert.equal(h.state.currentScoreOriginalFileName,'Origin.mxl');
 assert.equal(h.state.currentScoreOriginalFileType,'mxl');assert.equal(h.state.currentScoreTitle,'Title');
 assert.equal(h.events.includes('tempo-100'),false);assert.equal(h.events.includes('reset-cursor'),false);
 assert.deepEqual(h.events.slice(-2),[['transpose',true],'success']);
});
test('OSMD failure reports then rethrows the same error without rolling back playback reset',async()=>{
 const error=new Error('bad score');const h=harness({load:async()=>{throw error;}});
 await assert.rejects(h.service.loadScoreIntoApp('<bad/>'),value=>value===error);
 assert.equal(h.state.currentScoreData,'old');assert.deepEqual(h.events,['reset-playback','tempo-100','load',['error',error]]);
});
test('library failure occurs after new score state writes and does not notify successful load',async()=>{
 const error=new Error('db failure');const h=harness({library:{markScoreOpened:async()=>{throw error;}}});
 await assert.rejects(h.service.loadScoreIntoApp('new',{libraryScoreId:'id'}),value=>value===error);
 assert.equal(h.state.currentScoreData,'new');assert.equal(h.events.at(-1)[1],error);assert.equal(h.events.includes('success'),false);
});

class Reader {
 result=null;error=null;mode=null;aborts=0;
 readAsText(file){this.mode='text';this.file=file;}
 readAsArrayBuffer(file){this.mode='buffer';this.file=file;}
 abort(){this.aborts++;this.onabort();}
}
test('FileReader chooses text/binary by original extension and propagates reader error',async()=>{
 const h=harness();const readers=[];const service=h.api('PianoTrainerScoreFileReader').create({format:h.format,createReader:()=>{const r=new Reader();readers.push(r);return r;}});
 const pending=service.readScoreFile(new File(['x'],'Score.MXL'));assert.equal(readers[0].mode,'buffer');
 readers[0].result=new ArrayBuffer(1);readers[0].onload();const result=await pending;assert.equal(result.fileType,'mxl');assert.equal(result.title,'Score');
 const next=service.readScoreFile(new File(['x'],'Song.musicxml'));assert.equal(readers[1].mode,'text');
 const error=new Error('read failed');readers[1].error=error;readers[1].onerror();await assert.rejects(next,e=>e===error);
 service.dispose();assert.equal(readers[0].aborts,0);assert.equal(readers[1].aborts,0);
});
test('explicit reader dispose rejects only pending reads and is idempotent',async()=>{
 const h=harness();const r=new Reader();const service=h.api('PianoTrainerScoreFileReader').create({format:h.format,createReader:()=>r});
 const pending=service.readScoreFile(new File(['x'],'pending.xml'));service.dispose();service.dispose();await assert.rejects(pending,{name:'AbortError'});assert.equal(r.aborts,1);
});
class Input {
 listeners=new Set();files=[];value='chosen';clicks=0;
 addEventListener(kind,fn){this.listeners.add(fn);}removeEventListener(kind,fn){this.listeners.delete(fn);}click(){this.clicks++;}
}
test('file controls bind once, convert supported files before load, and close the drawer only on success',async()=>{
 const h=harness({Input}),input=new Input(),events=[];
 const service=h.api('PianoTrainerScoreFileControls').create({input,resumeAudio:()=>events.push('resume'),
  readFile:async()=>{throw Error('must convert');},getConverter:()=>({isConverterImportFileName:()=>true,convertFileToScore:async()=>{events.push('convert');return{rawData:'xml',fileName:'Converted.musicxml'};}}),
  load:async()=>events.push('load'),closeDrawer:()=>events.push('close')});
 service.init();service.init();assert.equal(input.listeners.size,1);service.openScoreFilePicker();assert.equal(input.clicks,1);
 input.files=[new File(['x'],'input.mid')];await [...input.listeners][0]({target:input});assert.equal(input.value,'');
 assert.deepEqual(events,['resume','convert','load','close']);service.dispose();service.dispose();assert.equal(input.listeners.size,0);
});
test('file change clears input in finally, propagates load failure, and ignores non-input targets',async()=>{
 const h=harness({Input}),input=new Input(),error=new Error('bad import');let closed=false;
 const service=h.api('PianoTrainerScoreFileControls').create({input,resumeAudio:()=>{},getConverter:()=>undefined,
  readFile:async()=>({rawData:'bad'}),load:async()=>{throw error;},closeDrawer:()=>closed=true});
 service.init();const change=[...input.listeners][0];await change({target:{}});assert.equal(input.value,'chosen');
 input.files=[new File(['x'],'bad.xml')];await assert.rejects(change({target:input}),e=>e===error);assert.equal(input.value,'');assert.equal(closed,false);
});
