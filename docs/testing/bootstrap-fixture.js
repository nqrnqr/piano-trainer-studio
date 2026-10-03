// Test entry only: observe native resources allocated through the application bundle.
(()=>{
 const owned=()=>String(new Error().stack).includes('/docs/testing/generated/test-app.js');
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 const listeners=[];
 EventTarget.prototype.addEventListener=function(event,handler,options){
  const result=add.call(this,event,handler,options);
  if(owned()&&(this===window||this===document||this instanceof Element)&&!listeners.some(x=>x.target===this&&x.event===event&&x.handler===handler))listeners.push({target:this,event,handler});
  return result;
 };
 EventTarget.prototype.removeEventListener=function(event,handler,options){
  const index=listeners.findIndex(x=>x.target===this&&x.event===event&&x.handler===handler);
  if(index>=0)listeners.splice(index,1);return remove.call(this,event,handler,options);
 };
 const timers=new Map(),intervals=new Set(),frames=new Set();
 const setTimer=window.setTimeout.bind(window),clearTimer=window.clearTimeout.bind(window),setIntervalNative=window.setInterval.bind(window),clearIntervalNative=window.clearInterval.bind(window),request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);
 window.setTimeout=(callback,delay,...args)=>{const mine=owned(),stack=new Error().stack;let id;id=setTimer((...values)=>{timers.delete(id);callback(...values);},delay,...args);if(mine)timers.set(id,{delay,stack});return id;};
 window.clearTimeout=id=>{timers.delete(id);return clearTimer(id);};
 window.setInterval=(callback,delay,...args)=>{const mine=owned(),id=setIntervalNative(callback,delay,...args);if(mine)intervals.add(id);return id;};
 window.clearInterval=id=>{intervals.delete(id);return clearIntervalNative(id);};
 window.requestAnimationFrame=callback=>{const mine=owned();let id;id=request(time=>{frames.delete(id);callback(time);});if(mine)frames.add(id);return id;};
 window.cancelAnimationFrame=id=>{frames.delete(id);return cancel(id);};
 window.__PT_BOOTSTRAP_FIXTURE__={snapshot:()=>({listeners:listeners.length,timers:timers.size,intervals:intervals.size,frames:frames.size}),describeTimers:()=>[...timers.values()]};
})();
