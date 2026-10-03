// Test-only native worker accounting. Injected before the local converter loads.
(()=>{
 const NativeWorker=window.Worker,live=new Set(),urls=[];let created=0,terminated=0;
 window.Worker=class extends NativeWorker {
  constructor(...args){super(...args);created++;live.add(this);urls.push(String(args[0]));}
  terminate(){if(live.delete(this))terminated++;return super.terminate();}
 };
 window.__PT_CONVERTER_WORKERS__={snapshot:()=>({created,terminated,live:live.size,urls})};
})();
