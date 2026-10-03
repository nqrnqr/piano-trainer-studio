const {test}=require('node:test'),assert=require('node:assert/strict');const {modules,harness}=require('../helpers/library-ui-harness.cjs');const turn=()=>new Promise(setImmediate);
test('name metadata preserves original prefix/extension/ASCII rules, and unfiled filtering uses falsy folder IDs',()=>{
 const {view}=modules();assert.equal(view.shouldShowScoreFileName('Song','Song.musicxml'),false);assert.equal(view.shouldShowScoreFileName('Song extended','song.xml'),false);assert.equal(view.shouldShowScoreFileName('Different','Song.xml'),true);assert.equal(view.shouldShowScoreFileName('你好','世界.xml'),false);
 const scores=[{id:'a',folderId:null},{id:'b',folderId:'f'},{id:'c',folderId:''}];assert.deepEqual(Array.from(view.getFilteredLibraryScores(scores,'__unfiled__'),x=>x.id),['a','c']);assert.equal(view.getFilteredLibraryScores(scores,'__all__').length,3);
});
test('folder and score selections own independent arrays; returned Sets are copies and leaving manage clears only that selection',()=>{
 const h=harness();h.selection.setScoreLibrarySelection(['a','a','','b']);h.selection.getScoreLibrarySelectionSet().clear();assert.deepEqual(Array.from(h.state.scoreLibrarySelectedScoreIds),['a','b']);
 h.selection.setFolderLibrarySelection(['f','f','']);h.selection.setFolderLibraryManageMode(false);assert.equal(h.state.scoreLibrarySelectedFolderIds.length,0);assert.equal(h.state.scoreLibrarySelectedScoreIds.length,2);
 h.selection.setScoreLibraryManageMode(false);assert.equal(h.state.scoreLibrarySelectedScoreIds.length,0);
});
test('UI lifetime changes only on explicit dispose and old callbacks stay invalid after reinitialization',()=>{
 const {controls}=modules(),lifetime=controls.createLifetime(),first=lifetime.capture();lifetime.init();assert.equal(lifetime.current(first),true);lifetime.dispose();lifetime.dispose();assert.equal(lifetime.current(first),false);lifetime.init();assert.equal(lifetime.current(first),false);assert.equal(lifetime.current(lifetime.capture()),true);
});
test('file import waits for folder selection and cancellation performs no reads, conversion or save',async()=>{
 const h=harness();h.ports.dialogs.promptForLibraryFolderChoice=async()=> '__cancel__';// create captures the callback at factory time
 const service=h.actions.create(h.ports);await service.importFilesToLibrary([new File(['x'],'one.mid')]);assert.deepEqual(h.events,['folders']);assert.equal(h.state.scoreLibraryManageMode,true);
});
test('file import reads/converts/saves in sequence and updates selection only after the last save and refresh',async()=>{
 const h=harness();let finish;h.library.saveScore=score=>{h.events.push(['save',score]);if(h.events.filter(x=>Array.isArray(x)&&x[0]==='save').length===1)return new Promise(resolve=>finish=resolve);return Promise.resolve({...score,id:'saved'});};
 const pending=h.service.importFilesToLibrary([new File(['a'],'one.mid'),new File(['b'],'two.xml')]);await turn();assert.equal(h.events.some(x=>Array.isArray(x)&&x[0]==='read'),false);assert.equal(h.state.scoreLibraryManageMode,true);
 finish({id:'first'});await pending;assert.deepEqual(h.events.filter(x=>Array.isArray(x)&&['read','convert'].includes(x[0])),[['convert','one.mid'],['read','two.xml']]);assert.equal(h.state.scoreLibrarySelectedFolderId,'f');assert.equal(h.state.scoreLibraryView,'scores');assert.equal(h.state.scoreLibraryManageMode,false);assert.equal(h.state.scoreLibraryFolderManageMode,false);assert.deepEqual(h.events.slice(-2),['refresh','open']);
});
test('file failure preserves existing UI state, stops the remaining files, and keeps original error/alert text',async()=>{
 const h=harness(),error=new Error('Read failed');h.ports.readScoreFile=async()=>{throw error;};const service=h.actions.create(h.ports);
 await service.importFilesToLibrary([new File(['a'],'one.xml'),new File(['b'],'two.xml')]);assert.equal(h.state.scoreLibraryView,'folders');assert.equal(h.state.scoreLibraryManageMode,true);assert.deepEqual(h.events.slice(-2),[['error','Could not import score files',error],['alert','Read failed']]);assert.equal(h.events.some(x=>Array.isArray(x)&&x[0]==='save'),false);
});
test('save current retains the original live-state read after awaiting folder choice',async()=>{
 const h=harness();let finish;h.ports.dialogs.promptForLibraryFolderChoice=()=>new Promise(resolve=>finish=resolve);const service=h.actions.create(h.ports),pending=service.saveCurrentScoreToLibrary();await turn();
 h.state.currentScoreData='Changed';h.state.currentScoreFileName='Changed.mxl';h.state.currentScoreFileType='mxl';finish(null);await pending;
 const saved=h.events.find(x=>Array.isArray(x)&&x[0]==='save')[1];assert.equal(saved.title,'Saved title');assert.equal(saved.rawData,'Changed');assert.equal(saved.fileName,'Changed.mxl');assert.equal(saved.lastOpenedAt,123);assert.equal(h.state.currentScoreLibraryId,'saved');assert.equal(h.state.scoreLibrarySelectedFolderId,'__unfiled__');
});
test('backup export preserves content, MIME, filename and append/click/remove/revoke ordering',async()=>{
 const h=harness();let blob,listener;const link={addEventListener:(_,handler)=>listener=handler,click(){h.events.push(['click',this.download,this.href]);listener({stopPropagation:()=>h.events.push('stop')});},remove:()=>h.events.push('remove')};
 h.ports.document={createElement:()=>link,body:{appendChild:()=>h.events.push('append')}};h.ports.url={createObjectURL:value=>{blob=value;h.events.push('url');return 'blob:test';},revokeObjectURL:value=>h.events.push(['revoke',value])};
 await h.actions.create(h.ports).exportScoreLibraryBackup();assert.equal(blob.type,'application/json');assert.equal(await blob.text(),JSON.stringify({version:1,scores:[],folders:[]},null,2));assert.deepEqual(h.events,['url','append',['click','Scores-Library-Backup.json','blob:test'],'stop','remove',['revoke','blob:test']]);
});
test('backup JSON failure does not reach repository and uses the original fixed alert',async()=>{
 const h=harness();await h.service.importScoreLibraryBackupFile(new File(['broken'],'bad.json'));assert.equal(h.events[0][1],'Could not import library backup');assert.deepEqual(h.events.at(-1),['alert','Invalid library backup file.']);assert.equal(h.events.some(x=>Array.isArray(x)&&x[0]==='import'),false);
});
test('backup import waits for refresh, accepts unknown version, and restores the folder view without new schema validation',async()=>{
 const h=harness();let finish;h.ports.refreshScoresDrawer=()=>new Promise(resolve=>finish=resolve);const service=h.actions.create(h.ports);let done=false;const pending=service.importScoreLibraryBackupFile(new File(['{"version":99,"scores":[]}'],'backup.json')).then(()=>done=true);
 await turn();assert.equal(done,false);assert.equal(h.state.scoreLibraryView,'folders');assert.equal(h.events[0][1].version,99);finish();await pending;assert.equal(done,true);assert.equal(h.state.scoreLibraryManageMode,false);
});
test('explicit disposal during a read suppresses late save/status work and errors across a fresh init',async()=>{
 const h=harness();let finish;h.ports.readScoreFile=()=>new Promise(resolve=>finish=resolve);const service=h.actions.create(h.ports),pending=service.importFilesToLibrary([new File(['x'],'one.xml')]);await turn();h.lifetime.dispose();h.lifetime.init();finish({rawData:'Late',fileName:'Late.xml',title:'Late',fileType:'xml'});await pending;
 assert.equal(h.events.some(x=>Array.isArray(x)&&['save','alert','error'].includes(x[0])),false);assert.equal(h.state.scoreLibraryManageMode,true);assert.equal(h.events.includes('open'),false);
});
test('explicit disposal after export readiness creates no download URL or DOM work',async()=>{
 const h=harness();let finish;h.library.exportBackup=()=>new Promise(resolve=>finish=resolve);const pending=h.service.exportScoreLibraryBackup();h.lifetime.dispose();finish({version:1,scores:[]});await pending;assert.equal(h.events.length,0);
});
