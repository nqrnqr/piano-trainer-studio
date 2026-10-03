const vm=require('node:vm');const {runScript}=require('./legacy-script.cjs');
function modules(){const context=vm.createContext({ArrayBuffer,Uint8Array,Blob,DOMException,Reflect});
 for(const name of ['score/library-backup','score/score-library'])runScript(context,`js/generated/${name}.js`);
 return {codec:vm.runInContext('PianoTrainerLibraryBackup',context),repository:vm.runInContext('PianoTrainerScoreLibrary',context)};
}
function harness(){const m=modules(),events=[],transactions=[],requests=[],flags=new Map();let tick=100,id=0;
 const stores={folders:{getAll(){const request={};requests.push(request);return request;}},scores:{getAll(){const request={};requests.push(request);return request;}}};
 const db={objectStoreNames:{contains:name=>true},close:()=>events.push('close'),transaction:(names,mode)=>{
  events.push(['transaction',names,mode]);const tx={objectStore:name=>stores[name],abort(){events.push('abort');tx.onabort?.();}};transactions.push(tx);return tx;
 }};
 const openRequests=[];
 const ports={hasIndexedDB:()=>true,getIndexedDB:()=>({open:(name,version)=>{events.push(['open',name,version]);const request={result:db};openRequests.push(request);return request;}}),
  makeId:()=>`id-${++id}`,now:()=>++tick,isoNow:()=> '2026-10-03T00:00:00.000Z',format:{getScoreDisplayTitle:name=>name.replace(/\.(?:xml|musicxml|mxl)$/i,''),getScoreFileTypeFromName:name=>/\.mxl$/i.test(name)?'mxl':'xml'},
  storage:{getItem:key=>flags.get(key)??null,setItem:(key,value)=>{events.push(['flag',key,value]);flags.set(key,value);}},starterUrl:'http://local/assets/Starter_Scores.json',
  fetch:async(url,options)=>{events.push(['fetch',url,options]);return {ok:true,json:async()=>({folders:[],scores:[]})};}};
 const service=m.repository.create(ports);return {...m,service,ports,events,transactions,requests,openRequests,db,stores,flags};
}
module.exports={modules,harness};
