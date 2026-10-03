// Test entry only: redirect native IndexedDB to disposable databases; preferences stay in memory.
(()=>{
 const native=window.indexedDB,shared=window.__PT_LIBRARY_SCOPE__,prefix=shared?.prefix??'__pt_library_test_'+crypto.randomUUID()+'_',databases=shared?.databases??new Set();
 const mapped=(name,scope='app')=>{const target=prefix+scope+'_'+name;databases.add(target);return target;};
 const scoped=scope=>({open:(name,version)=>native.open(mapped(name,scope),version),deleteDatabase:name=>native.deleteDatabase(mapped(name,scope)),cmp:native.cmp.bind(native)});
 Object.defineProperty(window,'indexedDB',{configurable:true,value:scoped('app')});
 const original=window.localStorage,values=shared?.values??new Map();if(!shared)for(let i=0;i<original.length;i++){const key=original.key(i);values.set(key,original.getItem(key));}
 values.set('pt_starterLibraryImported_v1','true');
 const storage=()=>{const items=new Map();return {getItem:key=>items.get(key)??null,setItem:(key,value)=>items.set(key,String(value))};};
 const memoryStorage=items=>({getItem:key=>items.get(key)??null,setItem:(key,value)=>items.set(key,String(value)),removeItem:key=>items.delete(key),clear:()=>items.clear(),key:index=>[...items.keys()][index]??null,get length(){return items.size;}});
 Object.defineProperty(window,'localStorage',{configurable:true,value:memoryStorage(values)});
 if(shared)Object.defineProperty(window,'sessionStorage',{configurable:true,value:memoryStorage(shared.sessionValues)});
 window.__PT_LIBRARY_FIXTURE__={scoped,storage,async cleanup(){for(const name of databases)await new Promise((resolve,reject)=>{const request=native.deleteDatabase(name);request.onsuccess=resolve;request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Fixture database still has an open connection: '+name));});return databases.size;}};
})();
