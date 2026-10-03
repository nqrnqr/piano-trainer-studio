const vm=require('node:vm');
const {runScript}=require('./legacy-script.cjs');
function harness(options={}){
 const events=[];
 const context=vm.createContext({ArrayBuffer,Uint8Array,Blob,File,TextDecoder,TextEncoder,DecompressionStream,Response,DOMException,
  HTMLInputElement:options.Input??class {},window:{}});
 for(const name of ['score/musicxml-io','score/score-loader','ui/score-file-reader','ui/score-file-controls'])runScript(context,`js/generated/${name}.js`);
 const api=name=>vm.runInContext(name,context);
 const format=api('PianoTrainerMusicXmlIO').create({getNormalizer:()=>options.normalize??null,warn:(message,error)=>events.push(['warn',message,error])});
 const state={ledPreviewTimeline:['old'],ledPreviewTimelineDirty:false,ledPreviewTraversalIndex:4,lastLedPreviewEvents:['old'],
  currentScoreData:'old',currentScoreOriginalData:'old-source',currentScoreFileName:'old.xml',currentScoreOriginalFileName:'old.xml',
  currentScoreFileType:'xml',currentScoreOriginalFileType:'xml',currentScoreLibraryId:null,currentScoreTitle:'old'};
 let payload;
 const ports={state,format,score:{load:async raw=>{events.push('load');payload=raw;await options.load?.(raw);},hasCursor:()=>options.cursor!==false,
   reset:()=>events.push('reset-cursor'),showCursor:()=>events.push('show'),updateCursor:()=>events.push('paint')},
  resetPlayback:()=>events.push('reset-playback'),resetTempo:()=>events.push('tempo-100'),render:()=>events.push('render'),initSongUI:()=>events.push('song-ui'),
  scroll:()=>events.push('scroll'),getLibrary:()=>options.library,refreshLibrary:async()=>{events.push('library-refresh');await options.refresh?.();},
  notifyTranspose:skip=>events.push(['transpose',skip]),success:()=>events.push('success'),reportError:error=>events.push(['error',error])};
 const service=api('PianoTrainerScoreLoader').create(ports);
 return {context,api,format,state,ports,events,service,getPayload:()=>payload};
}
module.exports={harness};
