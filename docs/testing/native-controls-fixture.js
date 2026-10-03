// Test entry only: observe native resources owned by the migrated controls.
(()=>{
 const modules=['toolbar','display-controls','tempo-controls','audio-level-controls','loop-controls'];
 const owner=()=>{
  // Async caller frames can mention toolbar while library-list owns the listener.
  // Skip the shared binder, then attribute only the nearest UI implementation.
  return window.__PT_MODULE_SOURCE__.nearestUi(new Error().stack,modules);
 };
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;let listeners=[];
 EventTarget.prototype.addEventListener=function(event,handler,options){const result=add.call(this,event,handler,options),module=owner();if(module&&!listeners.some(x=>x.target===this&&x.event===event&&x.handler===handler))listeners.push({module,target:this,event,handler,stack:new Error().stack});return result;};
 EventTarget.prototype.removeEventListener=function(event,handler,options){listeners=listeners.filter(x=>!(x.target===this&&x.event===event&&x.handler===handler));return remove.call(this,event,handler,options);};
 const frames=new Map(),timers=new Map(),intervals=new Map(),request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window),setTimer=window.setTimeout.bind(window),clearTimer=window.clearTimeout.bind(window),setRepeater=window.setInterval.bind(window),clearRepeater=window.clearInterval.bind(window);
 window.requestAnimationFrame=callback=>{const module=owner();let id;id=request(time=>{frames.delete(id);callback(time);});if(module)frames.set(id,module);return id;};window.cancelAnimationFrame=id=>{frames.delete(id);return cancel(id);};
 window.setTimeout=(callback,delay,...args)=>{const module=owner();let id;id=setTimer((...values)=>{timers.delete(id);callback(...values);},delay,...args);if(module)timers.set(id,module);return id;};window.clearTimeout=id=>{timers.delete(id);return clearTimer(id);};
 window.setInterval=(callback,delay,...args)=>{const module=owner(),id=setRepeater(callback,delay,...args);if(module)intervals.set(id,module);return id;};window.clearInterval=id=>{intervals.delete(id);return clearRepeater(id);};
 window.__PT_NATIVE_CONTROLS_FIXTURE__={describe:()=>listeners.filter(x=>x.target===window||x.target===document||x.target.isConnected).map(x=>({module:x.module,target:x.target===window?'window':x.target===document?'document':x.target.id||x.target.className,event:x.event,stack:x.stack})),snapshot:()=>Object.fromEntries(modules.map(module=>[module,{
  listeners:listeners.filter(x=>x.module===module&&(x.target===window||x.target===document||x.target.isConnected)).length,
  frames:[...frames.values()].filter(x=>x===module).length,timers:[...timers.values()].filter(x=>x===module).length,
  intervals:[...intervals.values()].filter(x=>x===module).length
 }]))};
})();
