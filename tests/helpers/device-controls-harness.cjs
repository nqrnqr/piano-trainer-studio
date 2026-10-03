const {harness:base,Node,Input,Button,event}=require('./native-controls-harness.cjs');
const {runScript}=require('./legacy-script.cjs');
const {storage}=require('./state-harness.cjs');
class Select extends Node{constructor(id){super(id);this.value='';}}
function harness(){
 const h=base(),controllers=[],requests=[],pending=[];h.context.HTMLSelectElement=Select;h.context.URL=URL;h.context.AbortController=AbortController;
 for(const id of ['select-player-piano-type','midi-in','midi-out','midi-lights'])h.add(id,Select);
 for(const id of ['player-piano-range-label','app-version-display','update-status'])h.add(id);
 h.add('btn-check-updates',Button);
 for(const id of ['midi-in-connection-status','midi-out-connection-status','led-connection-status']){const parent=h.add(id),dot=new Node(),label=new Node();parent.querySelector=selector=>selector==='.status-dot'?dot:label;parent.dot=dot;parent.label=label;}
 Object.assign(h.state,{playerPianoType:88,playerRange:null,expectedNotes:[{midi:20},{midi:60}],visualNotesToStart:[{midi:60},{midi:80}],sustainedVisuals:[{midi:40},{midi:65}],outOfRangeCurrentNotes:[{midi:15},{midi:70}],heldCorrectNotes:new Map([[20,1],[60,2]]),ledPreviewTimelineDirty:false,lastLedPreviewEvents:[{}],ledPreviewTraversalIndex:4,
 updateInfo:null,updateStatus:'',updateManifestUrl:'/manifest.json',updateLastCheckedAt:0,ledOutputMode:'none',wledIp:'',wledConnectionState:'none'});
 for(const file of ['domain/playable-range','domain/version','app/update-controller','ui/player-range-controls','ui/connection-status','ui/update-controls'])runScript(h.context,`js/generated/${file}.js`);
 const values=storage(),location={href:'http://127.0.0.1:8081/index.html?led=off#score',hostname:'127.0.0.1',protocol:'http:',replace:url=>h.effects.push(['replace',url]),reload:()=>h.effects.push(['reload'])},trace=name=>(...args)=>h.effects.push([name,...args]);
 const rangePorts={document:h.document,state:h.state,normalize:h.context.normalizePlayerPianoType,derive:h.context.derivePlayerRangeFromKeyboardSize,
 getRange:()=>h.state.playerRange,inRange:midi=>h.context.isMidiInPlayableRange(midi,h.state.playerRange),readSaved:()=>values.getItem('range'),save:value=>{values.setItem('range',value);h.effects.push(['save-range',value]);},renderKeyboard:trace('keyboard'),led:{refreshMapping:trace('mapping'),invalidate:trace('invalidate'),renderOutputs:trace('outputs')}};
 const range=h.api('PianoTrainerPlayerRangeControls').create(rangePorts);
 const updatePorts={state:h.state,version:'1.2.4',releaseUrl:'https://example.test/releases',manifestUrl:'/manifest.json',storage:values,keys:{assetOverride:'override',manifestUrl:'manifest'},location,replaceHistory:trace('history'),
 createAbortController:()=>{const controller=new AbortController();controllers.push(controller);return controller;},nowMs:()=>1234567890,getErrorMessage:error=>error?.message,
 fetch:(url,options)=>{requests.push({url,options});return new Promise((resolve,reject)=>pending.push({resolve,reject}));},setChecking:()=>ui.setChecking(),syncControls:()=>ui.syncUpdateControls()};
 const update=h.api('PianoTrainerUpdateController').create(updatePorts),uiPorts={document:h.document,state:h.state,version:'1.2.4',commands:update,open:trace('open'),alert:trace('alert'),confirm:()=>false},ui=h.api('PianoTrainerUpdateControls').create(uiPorts);
 const connectionPorts={document:h.document,state:h.state,getPort:(direction,id)=>id==='device'?{state:'connected'}:null,syncMidiOutChannelVisibility:trace('channel-ui'),syncWledStatus:trace('wled-ui')},connection=h.api('PianoTrainerConnectionStatus').create(connectionPorts);
 return {...h,range,rangePorts,update,updatePorts,ui,uiPorts,connection,connectionPorts,controllers,requests,pending,location,storage:values,event};
}
module.exports={harness,Select};
