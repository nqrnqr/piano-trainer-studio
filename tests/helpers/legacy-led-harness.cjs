const {harness:base,Node,Input,Button,event}=require('./native-controls-harness.cjs');
const {runScript}=require('./legacy-script.cjs');
function harness({enabled=true}={}){
 const h=base(),readers=[],requests=[],pending=[],urls=new Set(),links=new Set(),controllers=[];
 h.context.window=h.window;h.context.performance={now:()=>123};h.context.Blob=Blob;
 class FixedDate extends Date{static now(){return 100000;}constructor(...args){super(...(args.length?args:[100000]));}}h.context.Date=FixedDate;
 for(const id of ['btn-led-calibration-toggle','btn-led-calibration-left','btn-led-calibration-right','btn-led-calibration-reset-key','btn-led-calibration-reset-all','btn-led-calibration-done','btn-led-calibration-export','btn-led-calibration-import','btn-test-wled','btn-resend-wled','btn-test-midi-led'])h.add(id,Button);
 for(const id of ['input-led-count','slider-led-master','val-led-master','slider-led-future1','val-led-future1','led-output-mode','input-wled-ip','wled-transport','check-led-reverse','check-wled-ddp-debug','input-led-calibration-import','midi-lights','check-debug'])h.add(id,Input);
 for(const id of ['led-calibration-panel','led-calibration-current','led-calibration-hint','wled-transport-hint','wled-transport-runtime','wled-helper-status','row-wled-ddp-debug','fs-display-debug','wled-status','midi-lights-row','wled-settings','led-count-row','led-brightness-settings','led-calibration-settings','midi-led-test-status'])h.add(id);
 h.nodes.get('check-debug').parentElement=new Node();h.nodes.get('midi-lights').value='device';
 const range={minMidi:21,maxMidi:108}; const state=h.state;Object.assign(state,{feedbackEnabled:true,hardwareLEDState:new Map(),helperVersion:'',ledCalibrationMode:false,ledCalibrationSelectedMidi:null,ledOutputMode:'none',ledReverse:false,midiLedLowVelocity:false,playerPianoType:88,wledActiveTransport:'http-json',wledConnectionState:'none',wledDdpDebugEnabled:false,wledDdpLastError:'',wledDdpLastSendAt:0,wledDdpLastSendOk:false,wledHelperAvailable:false,wledHelperStatus:'Helper: Not detected.',wledIp:'',wledStatus:'WLED idle.',wledTransport:'http-json'});
 const trace=name=>(...args)=>h.effects.push([name,...args]);
 const resourcePorts={setTimer:h.window.setTimeout,clearTimer:h.window.clearTimeout,setInterval:h.window.setInterval,clearInterval:h.window.clearInterval,requestFrame:h.window.requestAnimationFrame,cancelFrame:h.window.cancelAnimationFrame,
  createReader:()=>{const reader={readyState:0,onload:null,onloadend:null,result:null,aborts:0,readAsText(file){this.readyState=1;this.file=file;},abort(){this.aborts++;this.readyState=2;},complete(text){this.result=text;this.readyState=2;this.onload?.();this.onloadend?.();}};readers.push(reader);return reader;},
  createRequest:()=>{const controller=new AbortController();controllers.push(controller);return controller;},
  createUrl:()=>{const url='blob:test-'+(urls.size+1);urls.add(url);h.effects.push(['create-url',url]);return url;},revokeUrl:url=>{urls.delete(url);h.effects.push(['revoke-url',url]);},
  createLink:()=>{const node=new Node();node.click=()=>h.effects.push(['download',node.download,node.href]);node.remove=()=>{links.delete(node);h.effects.push(['remove-link']);};return node;}};
 h.document.body.appendChild=node=>{links.add(node);h.effects.push(['append-link']);};
 for(const file of ['js/generated/optional/led/legacy-led-resources.js','js/led.js','js/optional/midi-led-test.js'])runScript(h.context,file);
 const resources=h.api('PianoTrainerLegacyLedResources').create(resourcePorts),midiResources=h.api('PianoTrainerLegacyLedResources').create(resourcePorts);
 const keys=Object.fromEntries(['LED_CALIBRATION_STORAGE_KEY','LED_COUNT_STORAGE_KEY','LED_FUTURE1_PCT_STORAGE_KEY','LED_FUTURE2_PCT_STORAGE_KEY','LED_MASTER_BRIGHTNESS_STORAGE_KEY','LED_OUTPUT_MODE_STORAGE_KEY','LED_REVERSE_STORAGE_KEY','WLED_DDP_DEBUG_STORAGE_KEY','WLED_IP_STORAGE_KEY','WLED_TRANSPORT_STORAGE_KEY','WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY'].map(key=>[key,key]));
 const storage={getItem:key=>h.values.get(key)??null,setItem:(key,value)=>{h.values.set(key,value);h.effects.push(['storage',key,value]);}};
 const output={id:'device',state:'connected',send:data=>h.effects.push(['send',...data])};
 let midiTest;
 const ports={state,document:h.document,storage,console:{warn:(message,error)=>h.effects.push(['warn',message,error?.message])},
  fetch:(url,options)=>{requests.push({url,options});return new Promise((resolve,reject)=>pending.push({resolve,reject}));},resources,view:{innerHeight:700,crypto:{randomUUID:()=> 'session'},alert:trace('alert'),confirm:()=>true},keys,FULL_PIANO_KEY_COUNT:88,FULL_PIANO_MIDI_MIN:21,getMidiTest:()=>midiTest?.controller,
  clearWledPermissionHelp:trace('clear-permission'),closeToolbarPanel:trace('close-panel'),getClampedNumber:(key,min,max,fallback)=>h.values.has(key)?Math.max(min,Math.min(max,Number(h.values.get(key))||fallback)):fallback,
  getLegacyMidiOutput:id=>id==='device'?output:null,getMidiKeyPosition01:midi=>(midi-21)/87,getMidiLightsStatus:base=>base+1,getPlayerPlayableRange:()=>range,getStoredBool:(key,fallback)=>h.values.has(key)?h.values.get(key)==='true':fallback,
  getWledPermissionHelpText:kind=>'permission '+kind,initUpdateControls:trace('updates'),isLikelyBrowserAccessIssue:error=>/fetch|blocked|cors/i.test(String(error?.message??error)),
  normalizeLedCount:value=>Math.max(1,Math.min(500,Math.round(Number(value)||88))),normalizeLedFuturePct:(value,fallback)=>Number.isFinite(Number(value))?Math.max(0,Math.min(100,Number(value))):fallback,normalizeLedMasterBrightness:value=>Math.max(1,Math.min(100,Number(value)||25)),
  rememberOutgoingMidiMessage:trace('remember'),renderVirtualKeyboard:trace('keyboard'),setStoredBool:(key,value)=>storage.setItem(key,String(value)),showWledPermissionHelp:trace('permission'),syncToolbarButtonStates:trace('toolbar'),updateConnectionStatuses:trace('connection'),wipeHardwareLEDs:()=>led.legacyWipeHardwareLEDs()};
 const led=h.window.PianoTrainerLegacyLed.create(ports);
 const midiPorts={state,document:h.document,console:ports.console,resources:midiResources,LedEngine:led.LedEngine,buildChromaticTestNotes:()=>led.buildChromaticTestNotes(),getLegacyMidiOutput:ports.getLegacyMidiOutput,getMidiStatus:(base,channel)=>base+channel-1,getPlayerPlayableRange:ports.getPlayerPlayableRange,getSelectedMidiLightsChannel:()=>2,optionalLedOutput:{enabled},rememberOutgoingMidiMessage:ports.rememberOutgoingMidiMessage,renderVirtualKeyboard:ports.renderVirtualKeyboard,wipeHardwareLEDs:ports.wipeHardwareLEDs};
 midiTest=h.window.PianoTrainerLegacyMidiLedTest.create(midiPorts);
 return {...h,state,range,led,ports,midiTest,midiPorts,resources,midiResources,resourcePorts,readers,requests,pending,controllers,urls,links,storage,keys,output,event};
}
module.exports={harness};
