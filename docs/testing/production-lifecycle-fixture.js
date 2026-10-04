// Observe the actual production entry; no application state/service is exposed.
(()=>{
 localStorage.setItem('pt_firstRunIntroSeen','true');
 for(const key of ['pt_audioVirtualKeyboard','pt_audioInstrument','pt_audioHands','pt_audioOther','pt_midiOutHands','pt_midiOutVirtualKeyboard','pt_midiOutInstrument','pt_midiOutOther','pt_fullscreenOnPlay'])localStorage.setItem(key,'false');
 localStorage.setItem('pt_trainerMode','wait');
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener,listeners=[];
 const owned=()=>/\/js\/generated\/app\.js/.test(String(new Error().stack));
 EventTarget.prototype.addEventListener=function(type,listener,options){const mine=owned()&&(this===window||this===document||this instanceof Element);const result=add.call(this,type,listener,options);if(mine&&!listeners.some(record=>record.target===this&&record.type===type&&record.listener===listener))listeners.push({target:this,type,listener});return result;};
 EventTarget.prototype.removeEventListener=function(type,listener,options){const index=listeners.findIndex(record=>record.target===this&&record.type===type&&record.listener===listener);if(index>=0)listeners.splice(index,1);return remove.call(this,type,listener,options);};
 const nativeOpen=IDBFactory.prototype.open,nativeClose=IDBDatabase.prototype.close,databases=new Set();
 IDBFactory.prototype.open=function(...args){const request=nativeOpen.apply(this,args);if(String(args[0]).startsWith('__pt_library_test_'))add.call(request,'success',()=>databases.add(request.result));return request;};
 IDBDatabase.prototype.close=function(){databases.delete(this);return nativeClose.call(this);};
 window.ProductionLifecycleFixture={snapshot:()=>({listeners:listeners.length,databases:databases.size}),
  events:[],record(type,persisted,trusted){this.events.push({type,persisted,trusted});}};
 for(const type of ['pagehide','pageshow'])add.call(window,type,event=>window.ProductionLifecycleFixture.record(type,event.persisted,event.isTrusted));
})();
