const vm=require('node:vm');const {runScript}=require('./legacy-script.cjs');
function modules(globals={}){
 const context=vm.createContext({ArrayBuffer,Uint8Array,DataView,Blob,File,TextDecoder,DOMException,...globals});
 for(const name of ['score/transpose-engine','score/transpose-controller','ui/transpose-controls','score/webmscore-adapter','score/score-conversion'])runScript(context,`js/generated/${name}.js`);
 return {context,api:name=>vm.runInContext(name,context)};
}
function conversion(options={}){
 const m=modules(),events=[];
 const score=options.score===undefined?{saveXml:async()=>{events.push('export');return options.xml??'<score/>';},destroy:soft=>events.push(['destroy',soft])}:options.score;
 const vendor={ready:options.ready??Promise.resolve(),load:async(format,bytes)=>{events.push(['load',format,[...bytes]]);return options.load?options.load(format,bytes):score;}};
 const ports={ensureWebMscoreLoaded:async()=>{events.push('ensure');await vendor.ready;return vendor;},
  readArrayBuffer:async file=>{events.push('read');return options.read?options.read(file):file.arrayBuffer();},
  getLoader:()=>options.loader,reportError:(message,error)=>events.push(['error',message,error])};
 const service=m.api('PianoTrainerScoreConversion').create(ports);return {...m,service,score,vendor,ports,events};
}
function transpose(options={}){
 const m=modules(),events=[],native=m.api('PianoTrainerTransposeEngine');
 const key={found:true,label:'C major / A minor',mode:'major',tonic:0,fifths:0,bias:'sharp',presetValue:'sig-0'};
 const engine={...native,parseXml:raw=>({raw}),detectScoreKey:()=>({...key,...options.key}),
  transposeXml:(raw,config)=>{events.push(['transform',raw,{...config}]);if(!native.isXmlString(raw))return native.transposeXml(raw,config);
   return {xmlString:'<score-partwise>transposed</score-partwise>',semitoneDelta:config.semitones??2,targetKeyLabel:'D major / B minor'};}};
 const app={transpose:m.api('PianoTrainerTransposeController').getDefaultState(),currentScoreData:'<score-partwise>current</score-partwise>',
  currentScoreOriginalData:'<score-partwise>original</score-partwise>',currentScoreOriginalFileName:'Original.mxl',currentScoreFileName:'Current.xml',
  currentScoreOriginalFileType:'mxl',currentScoreFileType:'xml',currentScoreLibraryId:'id',currentScoreTitle:'Title'};
 const load=async(raw,config)=>{events.push(['load',raw,{...config}]);await options.load?.(raw,config);};
 const ports={getApp:()=>app,getEngine:()=>options.noEngine?undefined:engine,getLoader:()=>options.noLoader?undefined:load,
  syncUi:()=>events.push('sync'),setStatus:(text,error)=>events.push(['status',text,!!error]),reportError:(text,error)=>events.push(['error',text,error]),
  errorText:(error,fallback)=>error?.message||fallback};
 const service=m.api('PianoTrainerTransposeController').create(ports);return {...m,service,ports,app,engine,events};
}
module.exports={modules,conversion,transpose};
