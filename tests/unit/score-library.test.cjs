const {test}=require('node:test'),assert=require('node:assert/strict');const {modules,harness}=require('../helpers/library-harness.cjs');
const turn=()=>new Promise(setImmediate);
const plain=value=>JSON.parse(JSON.stringify(value));
async function open(h){const pending=h.service.init();h.openRequests.at(-1).onsuccess();return pending;}
test('library factory is cold, missing IndexedDB rejects, and open/failed promises remain cached until disposal',async()=>{
 const h=harness();assert.equal(h.events.length,0);h.ports.hasIndexedDB=()=>false;await assert.rejects(h.service.init(),/IndexedDB is not available/);
 h.ports.hasIndexedDB=()=>true;const first=h.service.init(),second=h.service.init();assert.equal(h.openRequests.length,1);
 const error=new Error('open failed');h.openRequests[0].error=error;h.openRequests[0].onerror();await assert.rejects(first,value=>value===error);await assert.rejects(second,value=>value===error);
 await assert.rejects(h.service.init(),value=>value===error);assert.equal(h.openRequests.length,1);h.service.dispose();await open(h);assert.equal(h.openRequests.length,2);
});
test('schema creates only missing v1 stores with the original nonunique indexes',async()=>{
 const h=harness(),events=[];h.db.objectStoreNames.contains=name=>name==='folders';h.db.createObjectStore=(name,options)=>{events.push([name,options]);return {createIndex:(...args)=>events.push(args)};};
 const pending=h.service.init();h.openRequests[0].onupgradeneeded();h.openRequests[0].onsuccess();await pending;
 assert.deepEqual(plain(events),[['scores',{keyPath:'id'}],['by_folderId','folderId',{unique:false}],['by_lastOpenedAt','lastOpenedAt',{unique:false}],['by_title','title',{unique:false}]]);
});
test('read request success does not settle a library command before native transaction completion',async()=>{
 const h=harness();await open(h);let done=false;const pending=h.service.getAllFolders().then(value=>{done=true;return value;});await turn();
 h.requests[0].result=[{name:'Z'},{name:'A'}];h.requests[0].onsuccess();await turn();assert.equal(done,false);
 h.transactions[0].oncomplete();assert.deepEqual((await pending).map(x=>x.name),['A','Z']);
});
test('executor throw rejects the original error before abort; native transaction error/abort fallbacks stay distinct',async()=>{
 const h=harness();await open(h);const error=new Error('executor');await assert.rejects(h.service.transaction(['folders'],'readwrite',()=>{throw error;}),value=>value===error);assert.equal(h.events.at(-1),'abort');
 const failed=h.service.transaction(['scores'],'readonly',()=>42);await turn();h.transactions.at(-1).onerror();await assert.rejects(failed,/Library transaction failed/);
 const aborted=h.service.transaction(['scores'],'readonly',()=>42);await turn();h.transactions.at(-1).onabort();await assert.rejects(aborted,/Library transaction was aborted/);
});
test('CRUD write resolves after complete and preserves folder versus score timestamp reads',async()=>{
 const h=harness(),records=[];h.stores.folders.put=value=>records.push(value);h.stores.scores.put=value=>records.push(value);await open(h);
 const folder=h.service.createFolder(' A ');await turn();assert.equal(records[0].createdAt,101);assert.equal(records[0].updatedAt,102);h.transactions.at(-1).oncomplete();assert.equal((await folder).name,'A');
 const score=h.service.saveScore({fileName:'Tune.mxl',rawData:new ArrayBuffer(2)});await turn();h.transactions.at(-1).oncomplete();const saved=await score;
 assert.equal(saved.title,'Tune');assert.equal(saved.fileType,'mxl');assert.equal(saved.createdAt,103);assert.equal(saved.updatedAt,103);assert.equal(saved.folderId,null);
});
test('backup codec retains original ArrayBuffer-only serialization and byte coercion',()=>{
 const codec=modules().codec;assert.deepEqual({...codec.serializeScoreRawData(new Uint8Array([1,2]))},{kind:'text',text:'1,2'});
 assert.deepEqual([...new Uint8Array(codec.deserializeScoreRawData({kind:'arraybuffer',bytes:['257',-1,NaN]}))],[1,255,0]);
 assert.equal(codec.deserializeScoreRawData(null),'');assert.equal(codec.deserializeScoreRawData({text:12}),'12');
 assert.equal(codec.deserializeScoreRawData({kind:'arraybuffer',bytes:new Uint8Array([2])}).byteLength,0);
 assert.deepEqual(Array.from(codec.serializeScoreRawData(new Uint8Array([0,255]).buffer).bytes),[0,255]);
});
test('backup import preserves permissive array checks, generated IDs, remapping, default/coercion and atomic transaction',async()=>{
 const h=harness(),records=[];h.stores.folders.put=value=>records.push(['folder',value]);h.stores.scores.put=value=>records.push(['score',value]);await open(h);
 const pending=h.service.importBackup({version:99,folders:[{id:'old',name:' ',createdAt:'7'}],scores:[{folderId:'old',fileName:'Song.xml',rawData:{kind:'text',text:'XML'}},{folderId:'missing',rawData:{kind:'arraybuffer',bytes:[1,256]}}]});
 await turn();assert.equal(h.transactions.length,1);assert.deepEqual(Array.from(h.events.find(e=>Array.isArray(e)&&e[0]==='transaction')[1]),['folders','scores']);
 assert.equal(records[0][1].name,'New Folder');assert.equal(records[0][1].createdAt,7);assert.equal(records[1][1].folderId,'id-1');assert.equal(records[1][1].title,'Song');assert.equal(records[2][1].folderId,null);
 assert.deepEqual([...new Uint8Array(records[2][1].rawData)],[1,0]);h.transactions[0].oncomplete();assert.equal(await pending,undefined);
});
test('bulk move queues put in request success inside the original transaction and returns requested unique count',async()=>{
 const h=harness(),gets=[],puts=[];h.stores.scores.get=id=>{const request={};gets.push([id,request]);return request;};h.stores.scores.put=score=>puts.push(score);await open(h);
 const pending=h.service.moveScoresToFolder(['a','a','missing',''],null);await turn();assert.equal(gets.length,2);assert.equal(puts.length,0);
 gets[0][1].result={id:'a',folderId:'old'};gets[0][1].onsuccess();gets[1][1].onsuccess();assert.equal(puts[0].folderId,null);assert.equal(h.transactions.length,1);
 h.transactions[0].oncomplete();assert.equal(await pending,2);
});
test('starter flag skips fetch, and an existing library marks seeded without importing',async()=>{
 const h=harness();h.flags.set('pt_starterLibraryImported_v1','true');assert.equal(await h.service.importStarterLibraryOnce(),false);assert.equal(h.events.length,0);
 h.flags.clear();await open(h);const pending=h.service.importStarterLibraryOnce();await turn();h.requests[0].result=[{title:'Existing'}];h.requests[0].onsuccess();h.transactions[0].oncomplete();assert.equal(await pending,false);
 assert.equal(h.flags.get('pt_starterLibraryImported_v1'),'true');assert.equal(h.events.some(e=>Array.isArray(e)&&e[0]==='fetch'),false);
});
test('starter fetch uses original URL/cache, sets flag only after import completion, and preserves HTTP failure',async()=>{
 const h=harness();h.service.getAllScores=async()=>[];let finish;h.service.importBackup=()=>new Promise(resolve=>finish=resolve);
 const pending=h.service.importStarterLibraryOnce();await turn();assert.equal(h.flags.size,0);assert.deepEqual(plain(h.events[0]),['fetch',h.ports.starterUrl,{cache:'no-store'}]);finish();assert.equal(await pending,true);assert.equal(h.flags.size,1);
 h.flags.clear();h.ports.fetch=async()=>({ok:false,status:404});await assert.rejects(h.service.importStarterLibraryOnce(),/Could not load starter library \(404\)/);assert.equal(h.flags.size,0);
});
test('explicit disposal closes an opened database once, aborts only owned transactions, and permits new init',async()=>{
 const h=harness();await open(h);const pending=h.service.transaction(['scores'],'readwrite',()=>42);await turn();h.service.dispose();h.service.dispose();await assert.rejects(pending,/Library transaction was aborted/);
 assert.equal(h.events.filter(x=>x==='close').length,1);assert.equal(h.events.filter(x=>x==='abort').length,1);await open(h);assert.equal(h.openRequests.length,2);
});
test('disposal rejects pending opens and closes late connections without replacing a fresh lifecycle',async()=>{
 const h=harness(),old=h.service.init();h.service.dispose();await assert.rejects(old,{name:'AbortError'});const fresh=h.service.init();h.openRequests[0].onsuccess();assert.equal(h.events.at(-1),'close');
 h.openRequests[1].onsuccess();await fresh;h.service.dispose();assert.equal(h.events.filter(x=>x==='close').length,2);
});
test('disposal during starter fetch suppresses import and seeded flag after a late response',async()=>{
 const h=harness();h.service.getAllScores=async()=>[];let finish,imports=0;h.ports.fetch=()=>new Promise(resolve=>finish=resolve);h.service.importBackup=async()=>imports++;
 const pending=h.service.importStarterLibraryOnce();await turn();h.service.dispose();finish({ok:true,json:async()=>({})});await assert.rejects(pending,{name:'AbortError'});assert.equal(imports,0);assert.equal(h.flags.size,0);
});
test('disposal after a pending read prevents a rename from reopening a new database or writing',async()=>{
 const h=harness();let finish;h.service.getScoreById=()=>new Promise(resolve=>finish=resolve);
 const pending=h.service.renameScore('id','Late');h.service.dispose();finish({id:'id',title:'Before'});await assert.rejects(pending,{name:'AbortError'});assert.equal(h.openRequests.length,0);
});
test('disposal between backup reads suppresses the next query and late export metadata',async()=>{
 const h=harness();let finish,scoreQueries=0;h.service.getAllFolders=()=>new Promise(resolve=>finish=resolve);h.service.getAllScores=async()=>{scoreQueries++;return [];};
 const pending=h.service.exportBackup();h.service.dispose();finish([]);await assert.rejects(pending,{name:'AbortError'});assert.equal(scoreQueries,0);
});
