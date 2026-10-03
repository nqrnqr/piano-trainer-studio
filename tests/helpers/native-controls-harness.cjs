const vm=require('node:vm');const {runScript}=require('./legacy-script.cjs');
class Target {
 constructor(){this.listeners=[];}
 addEventListener(event,handler){if(!this.listeners.some(x=>x.event===event&&x.handler===handler))this.listeners.push({event,handler});}
 removeEventListener(event,handler){this.listeners=this.listeners.filter(x=>x.event!==event||x.handler!==handler);}
 dispatch(event,target=this){event.target=target;for(const x of [...this.listeners])if(x.event===event.type)x.handler(event);}
}
class Node extends Target {
 constructor(id=''){super();this.id=id;this.attrs={};this.dataset={};this.style={};this.textContent='';this.scrollTop=0;this.scrollLeft=0;this.parent=null;this.classes=new Set();
 this.classList={contains:x=>this.classes.has(x),add:(...xs)=>xs.forEach(x=>this.classes.add(x)),remove:(...xs)=>xs.forEach(x=>this.classes.delete(x)),toggle:(x,enabled)=>{const on=enabled===undefined?!this.classes.has(x):enabled;if(on)this.classes.add(x);else this.classes.delete(x);return on;}};}
 setAttribute(key,value){this.attrs[key]=value;}
 closest(selector){if(selector==='#'+this.id)return this;if(selector==='label')return this.label??null;return this.parent?.closest(selector)??null;}
 querySelector(selector){return this.child?.selector===selector?this.child:null;}
 getBoundingClientRect(){return {bottom:48.4};}
}
class Input extends Node {constructor(id){super(id);this.value='';this.checked=false;this.disabled=false;this.min='';this.max='';}}
class Button extends Node {constructor(id){super(id);this.onclick=null;this.captured=new Set();}setPointerCapture(id){this.captured.add(id);}hasPointerCapture(id){return this.captured.has(id);}releasePointerCapture(id){this.captured.delete(id);}}
class Pointer {constructor(type,values={}){Object.assign(this,{type,button:0,buttons:1,pointerId:7,...values});}preventDefault(){this.defaultPrevented=true;}stopPropagation(){this.propagationStopped=true;}}
function event(type,values={}){return new Pointer(type,values);}
function harness(){
 const nodes=new Map(),document=new Target(),window=new Target(),effects=[],timers=new Map(),intervals=new Map(),frames=new Map();let next=0;
 document.body=new Node('body');document.documentElement=new Node('root');document.getElementById=id=>nodes.get(id)??null;
 const add=(id,Type=Node)=>{const node=new Type(id);nodes.set(id,node);return node;};
 for(const id of ['scores-panel','options-overlay','tempo-popup','practice-popup','looper-popup','more-popup','audio-popup','display-popup','transpose-popup','help-overlay'])add(id).classList.add('hidden');
 for(const id of ['btn-scores','btn-options','btn-tempo','btn-practice','btn-looper','btn-more','btn-help-close','btn-help-got-it','btn-more-tempo','btn-more-loop','btn-more-audio','btn-more-display','btn-more-transpose','btn-more-help','btn-play','btn-reset','btn-score-fullscreen','btn-loop-min-decrease','btn-loop-min-increase','btn-loop-max-decrease','btn-loop-max-increase'])add(id,Button);
 for(const id of ['slider-zoom','val-zoom','slider-speed','val-speed','val-bpm','slider-piano-vol','val-piano-vol','slider-midiout-vol','val-midiout-vol','slider-midiin-boost','val-midiin-boost','slider-metro-vol','val-metro-vol','check-accented-downbeat','check-visual-pulse','check-metronome-midiout','check-metronome','check-looper','check-loop-countin','slider-loop-min','slider-loop-max','val-loop-min','val-loop-max'])add(id,Input);
 for(const id of ['static-menu','music-area','tempo-metro-volume-label','tempo-midiout-metronome-hint','routing-midiin-boost-row','looper-countin-row'])add(id);
 nodes.get('val-loop-min').value='1';nodes.get('val-loop-max').value='100';nodes.get('slider-loop-max').max='100';
 window.setTimeout=(callback,delay)=>{const id=++next;timers.set(id,{callback,delay});return id;};window.clearTimeout=id=>timers.delete(id);
 window.setInterval=(callback,delay)=>{const id=++next;intervals.set(id,{callback,delay});return id;};window.clearInterval=id=>intervals.delete(id);
 window.requestAnimationFrame=callback=>{const id=++next;frames.set(id,callback);return id;};window.cancelAnimationFrame=id=>frames.delete(id);
 const context=vm.createContext({HTMLElement:Node,Element:Node,HTMLInputElement:Input,HTMLButtonElement:Button,PointerEvent:Pointer});
 for(const name of ['controls-dom','toolbar','display-controls','tempo-controls','audio-level-controls','loop-controls'])runScript(context,`js/generated/ui/${name}.js`);
 const api=name=>vm.runInContext(name,context),state={scoreLibraryView:'scores',isPlaying:false,pseudoFullscreenActive:false,zoom:1,baseBpm:120,speedPercent:1,mode:'wait',countInActive:false,accentedDownbeatEnabled:true,visualPulseEnabled:true,metronomeMidiOutEnabled:false,midiOutVolume:65,midiInBoost:100,audioEnabled:{instrument:true},looper:{min:1,max:100,enabled:false},loopCountInEnabled:true};
 const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>{values.set(key,value);effects.push(['storage',key,value]);}};
 const toolbarPorts={document,window,state,storage,refreshScoresDrawer:async()=>effects.push('refresh')};
 const displayPorts={document,window,state,saveZoom:value=>effects.push(['save-zoom',value]),hideToolbarPanels:()=>effects.push('hide'),reportWarning:(message,error)=>effects.push(['warn',message,error.message]),pause:()=>effects.push('pause'),play:async()=>effects.push('play'),reset:()=>effects.push('reset'),isReadyToRender:()=>true,setZoom:value=>effects.push(['zoom',value]),clearFeedbackVisualStatePreserveScoring:()=>effects.push('clear-feedback'),renderScoreAndRefreshGeometry:()=>effects.push('render'),positionCalibrationPanel:()=>effects.push('position')};
 const tempoPorts={document,state,hasMidiOutput:()=>false,setBpm:value=>effects.push(['bpm',value]),getCurrentMeasureIndex:()=>undefined,getWaitMeasureIndex:()=>4,rebuildWaitModeMetronome:value=>effects.push(['rebuild',value]),saveBool:(...args)=>effects.push(['save-bool',...args]),clearTempoVisualPulse:()=>effects.push('clear-pulse'),clearScheduledMetronomeEvents:()=>effects.push('clear-metronome'),stopWaitModeMetronome:()=>effects.push('stop-wait')};
 const audioPorts={document,state,save:(...args)=>effects.push(['save-level',...args]),setPianoVolume:value=>effects.push(['piano',value]),sendMidiOutExpressionLevel:value=>effects.push(['expression',value]),setMetronomeVolumeDecibels:value=>effects.push(['metro-db',value])};
 const loopPorts={document,window,state,renderLooper:()=>effects.push('loop-render'),enforceLooperBounds:()=>effects.push('enforce'),saveLoopCountIn:value=>effects.push(['loop-save',value])};
 const toolbar=api('PianoTrainerToolbar').create(toolbarPorts),display=api('PianoTrainerDisplayControls').create(displayPorts),tempo=api('PianoTrainerTempoControls').create(tempoPorts),audio=api('PianoTrainerAudioLevelControls').create(audioPorts),loop=api('PianoTrainerLoopControls').create(loopPorts);
 const fireTimer=id=>{const timer=timers.get(id);timers.delete(id);timer.callback();},fireFrames=()=>{for(const [id,callback]of [...frames]){frames.delete(id);callback(0);}};
 return {api,context,nodes,add,document,window,state,effects,values,timers,intervals,frames,fireTimer,fireFrames,toolbar,display,tempo,audio,loop,toolbarPorts,displayPorts,tempoPorts,audioPorts,loopPorts};
}
module.exports={harness,event,Node,Input,Button};
