// Test-only resource accounting; no scheduling or file event replacement.
(()=>{
 const listeners=[],intervals=new Set(),readers=[],owned=()=>/\/ui\/feedback-debug\.js\b/.test(new Error().stack||'');
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 EventTarget.prototype.addEventListener=function(event,handler,options){const result=add.call(this,event,handler,options);if(owned()&&!listeners.some(x=>x.target===this&&x.event===event&&x.handler===handler))listeners.push({target:this,event,handler});return result;};
 EventTarget.prototype.removeEventListener=function(event,handler,options){for(let i=listeners.length-1;i>=0;i--)if(listeners[i].target===this&&listeners[i].event===event&&listeners[i].handler===handler)listeners.splice(i,1);return remove.call(this,event,handler,options);};
 const set=window.setInterval.bind(window),clear=window.clearInterval.bind(window);
 window.setInterval=(callback,delay,...args)=>{const id=set(callback,delay,...args);if(owned())intervals.add(id);return id;};window.clearInterval=id=>{intervals.delete(id);return clear(id);};
 const NativeReader=window.FileReader;window.FileReader=class extends NativeReader {constructor(){super();if(/\/ui\/settings-controls\.js\b/.test(new Error().stack||''))readers.push(this);}};
 window.__PT_SETTINGS_DEBUG_FIXTURE__={readers,snapshot:()=>({listeners:listeners.length,intervals:intervals.size,loading:readers.filter(reader=>reader.readyState===NativeReader.LOADING).length})};
})();
