// Test entry only: connected and detached native listeners stay attributed to their owner.
(()=>{
 const modules=['virtual-keyboard-controls','score-seek-controls'],listeners=[];
 const owner=()=>{for(const match of (new Error().stack||'').matchAll(/\/ui\/([\w-]+)\.js\b/g)){if(match[1]==='controls-dom')continue;return modules.includes(match[1])?match[1]:undefined;}};
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 EventTarget.prototype.addEventListener=function(event,handler,options){const result=add.call(this,event,handler,options),module=owner();if(module&&!listeners.some(x=>x.target===this&&x.event===event&&x.handler===handler))listeners.push({module,target:this,event,handler});return result;};
 EventTarget.prototype.removeEventListener=function(event,handler,options){for(let i=listeners.length-1;i>=0;i--)if(listeners[i].target===this&&listeners[i].event===event&&listeners[i].handler===handler)listeners.splice(i,1);return remove.call(this,event,handler,options);};
 window.__PT_KEYBOARD_CONTROLS_FIXTURE__={snapshot:()=>Object.fromEntries(modules.map(module=>[module,{owned:listeners.filter(x=>x.module===module).length,connected:listeners.filter(x=>x.module===module&&(x.target===window||x.target===document||x.target.isConnected)).length}]))};
})();
