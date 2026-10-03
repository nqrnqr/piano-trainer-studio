// Test entry only: track the nearest UI creator, skipping the shared DOM binder.
(()=>{
 const modules=['practice-controls','hand-assignment-controls','settings-actions'],listeners=[];
 const owner=()=>window.__PT_MODULE_SOURCE__.nearestUi(new Error().stack,modules);
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 EventTarget.prototype.addEventListener=function(event,handler,options){const result=add.call(this,event,handler,options),module=owner();if(module&&!listeners.some(x=>x.target===this&&x.event===event&&x.handler===handler))listeners.push({module,target:this,event,handler});return result;};
 EventTarget.prototype.removeEventListener=function(event,handler,options){for(let i=listeners.length-1;i>=0;i--)if(listeners[i].target===this&&listeners[i].event===event&&listeners[i].handler===handler)listeners.splice(i,1);return remove.call(this,event,handler,options);};
 window.__PT_PREFERENCE_CONTROLS_FIXTURE__={snapshot:()=>Object.fromEntries(modules.map(module=>[module,listeners.filter(x=>x.module===module&&(x.target===window||x.target===document||x.target.isConnected)).length]))};
})();
