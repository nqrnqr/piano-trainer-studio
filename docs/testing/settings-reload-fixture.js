// Test entry only. Keep isolated storage/DB names across actual iframe reloads.
(()=>{
 const harness=parent.SettingsBaseline;
 harness.boots=(harness.boots||0)+1;
 if(!harness.scope) {
  const copy=storage=>new Map(Array.from({length:storage.length},(_,index)=>{const key=storage.key(index);return [key,storage.getItem(key)];}));
  harness.scope={prefix:'__pt_library_test_'+crypto.randomUUID()+'_',databases:new Set(),values:copy(localStorage),sessionValues:copy(sessionStorage)};
 }
 window.__PT_LIBRARY_SCOPE__=harness.scope;
 window.addEventListener('pagehide',()=>{harness.pageHides=(harness.pageHides||0)+1;window.PianoTrainerTest?.dispose();},{once:true});
})();
