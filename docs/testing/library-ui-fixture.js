// Test entry only: count connected library listeners and its native frame ownership.
(()=>{
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 let listeners=[];const frames=new Set(),downloads=[],urls=new Map(),revoked=new Set();
 const capture=options=>typeof options==='boolean'?options:!!options?.capture;
 const owned=(target,event,handler)=>handler&&(target===window?event==='resize'&&['onPositionResize','onLayoutResize'].includes(handler.name):target===document?event==='keydown'&&handler.name==='onKeyDown':target instanceof HTMLElement&&(/^(btn-scores-|score-import-input$|library-backup-input$)/.test(target.id)||/(?:^|\s)scores-/.test(target.className)));
 EventTarget.prototype.addEventListener=function(event,handler,options){const result=add.call(this,event,handler,options);if(owned(this,event,handler)&&!listeners.some(item=>item.target===this&&item.event===event&&item.handler===handler&&item.capture===capture(options)))listeners.push({target:this,event,handler,capture:capture(options)});return result;};
 EventTarget.prototype.removeEventListener=function(event,handler,options){listeners=listeners.filter(item=>!(item.target===this&&item.event===event&&item.handler===handler&&item.capture===capture(options)));return remove.call(this,event,handler,options);};
 const request=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);
 window.requestAnimationFrame=callback=>{const mine=window.__PT_MODULE_SOURCE__.includesSource(new Error().stack,'/ui/scores-drawer.ts');let id;id=request(time=>{frames.delete(id);callback(time);});if(mine)frames.add(id);return id;};
 window.cancelAnimationFrame=id=>{frames.delete(id);return cancel(id);};
 const create=URL.createObjectURL,revoke=URL.revokeObjectURL,click=HTMLAnchorElement.prototype.click;
 URL.createObjectURL=function(blob){const url=create.call(this,blob);urls.set(url,blob);return url;};
 URL.revokeObjectURL=function(url){revoked.add(url);return revoke.call(this,url);};
 HTMLAnchorElement.prototype.click=function(){if(this.download!=='Scores-Library-Backup.json')return click.call(this);downloads.push({name:this.download,url:this.href,blob:urls.get(this.href)});const event=new MouseEvent('click',{bubbles:true,cancelable:true});event.preventDefault();this.dispatchEvent(event);};
 const inputClick=HTMLInputElement.prototype.click;let pickerCalls=0;
 HTMLInputElement.prototype.click=function(){if(this.id==='file-input'){pickerCalls++;return;}return inputClick.call(this);};
 window.__PT_LIBRARY_UI_FIXTURE__={downloads,revoked,pickerCalls:()=>pickerCalls,describe:()=>listeners.filter(item=>item.target===window||item.target===document||item.target.isConnected).map(item=>({target:item.target===window?'window':item.target===document?'document':item.target.id||item.target.className,event:item.event,name:item.handler.name})),snapshot:()=>{const connected=listeners.filter(item=>item.target===window||item.target===document||item.target.isConnected);return {listeners:connected.length,static:connected.filter(item=>item.target instanceof HTMLElement&&/^(btn-scores-|score-import-input$|library-backup-input$)/.test(item.target.id)).length,resize:connected.filter(item=>item.target===window).length,keydown:connected.filter(item=>item.target===document).length,frames:frames.size};}};
})();
