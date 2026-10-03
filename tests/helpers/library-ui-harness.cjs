const vm=require('node:vm');const {runScript}=require('./legacy-script.cjs');
function modules(){const context=vm.createContext({ArrayBuffer,Uint8Array,Blob,File,Reflect});for(const file of ['domain/library-view','ui/library-controls-state','ui/library-actions'])runScript(context,`js/generated/${file}.js`);
 return {view:vm.runInContext('PianoTrainerLibraryView',context),controls:vm.runInContext('PianoTrainerLibraryControlsState',context),actions:vm.runInContext('PianoTrainerLibraryActions',context)};}
function harness(){const m=modules(),events=[],state={currentScoreData:'Original',currentScoreFileName:'Original.xml',currentScoreFileType:'xml',currentScoreTitle:'Original',currentScoreLibraryId:null,
 scoreLibrarySelectedFolderId:'__all__',scoreLibraryView:'folders',scoreLibraryManageMode:true,scoreLibrarySelectedScoreIds:['a'],scoreLibraryFolderManageMode:true,scoreLibrarySelectedFolderIds:['f']};
 const lifetime=m.controls.createLifetime(),selection=m.controls.create(state),folders=[{id:'f',name:'Folder'}];
 const library={getAllFolders:async()=>{events.push('folders');return folders;},saveScore:async score=>{events.push(['save',score]);return {...score,id:'saved'};},createFolder:async name=>({name,id:'new-folder'}),
  exportBackup:async()=>({version:1,scores:[],folders:[]}),importBackup:async payload=>events.push(['import',payload])};
 const ports={state,lifetime,selection,library,dialogs:{promptForLibraryFolderChoice:async options=>{events.push(['choose',options]);return 'f';}},
  format:{getScoreDisplayTitle:name=>name.replace(/\.xml$/,''),getScoreFileTypeFromName:()=> 'xml'},
  prompt:(...args)=>{events.push(['prompt',...args]);return 'Saved title';},alert:message=>events.push(['alert',message]),reportError:(...args)=>events.push(['error',...args]),
  refreshScoresDrawer:async()=>{events.push('refresh');},ensureScoresDrawerOpen:()=>events.push('open'),now:()=>123,
  getConverter:()=>({isConverterImportFileName:name=>name.endsWith('.mid'),convertFileToScore:async file=>{events.push(['convert',file.name]);return {rawData:'Converted',title:'Midi',fileName:'Midi.musicxml',fileType:'musicxml'};}}),
  readScoreFile:async file=>{events.push(['read',file.name]);return {rawData:'Read',title:'Xml',fileName:file.name,fileType:'xml'};}};
 const service=m.actions.create(ports);return {...m,events,state,lifetime,selection,library,ports,service};
}
module.exports={modules,harness};
