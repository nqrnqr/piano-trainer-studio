const {harness:base,Node}=require('./preference-controls-harness.cjs');const {runScript}=require('./legacy-script.cjs');
class Mouse {constructor(type,values={}){Object.assign(this,{type,clientX:0,clientY:0,...values});}preventDefault(){this.defaultPrevented=true;}stopPropagation(){}}
class Pointer extends Mouse {constructor(type,values={}){super(type,{pointerId:1,pointerType:'mouse',...values});}}
class Touch extends Mouse {constructor(type,values={}){super(type,{changedTouches:[],...values});}}
class Key extends Node {
 constructor(id=''){super(id);this.children=[];this.parentNode=null;this.captured=new Set();this.html='';this.classList[Symbol.iterator]=()=>this.classes.values();this.dataset=new Proxy({}, {set:(target,key,value)=>{target[key]=String(value);return true;}});}
 set className(value){this.classes.clear();String(value).split(/\s+/).filter(Boolean).forEach(x=>this.classes.add(x));}get className(){return [...this.classes].join(' ');}
 set innerHTML(value){this.html=value;for(const node of this.children)node.parentNode=null;this.children=[];}get innerHTML(){return this.html;}
 appendChild(node){node.parentNode=this;this.children.push(node);return node;}
 remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(x=>x!==this);this.parentNode=null;}}
 setPointerCapture(id){this.captured.add(id);}hasPointerCapture(id){return this.captured.has(id);}releasePointerCapture(id){this.captured.delete(id);}
 addEventListener(type,handler,options){super.addEventListener(type,handler);const record=this.listeners.find(x=>x.event===type&&x.handler===handler);record.options=options;}
}
function harness(){
 const h=base(),allKeys=[];Object.assign(h.context,{MouseEvent:Mouse,PointerEvent:Pointer,TouchEvent:Touch});
 const container=h.add('virtual-keyboard',Key);h.add('canvas-wrapper',Key);h.add('live-score',Key);
 h.document.createElement=()=>{const key=new Key();allKeys.push(key);return key;};h.document.querySelector=selector=>{const midi=selector.match(/data-midi="(\d+)"/);return midi?container.children.find(x=>x.dataset.midi===midi[1])||null:null;};
 for(const file of ['domain/keyboard-state','render/virtual-keyboard','app/keyboard-controller','ui/virtual-keyboard-controls','app/score-seek-controller','ui/score-seek-controls','ui/score-status','app/score-ui-controller','score/osmd-adapter'])runScript(h.context,`js/generated/${file}.js`);
 Object.assign(h.state,{ledCalibrationMode:false,ledCalibrationSelectedMidi:null,sustainedVisuals:[],visualNotesToStart:[],pressedKeys:new Set(),preExpectedHeldNotes:new Set(),heldCorrectNotes:new Map(),hardwareLEDState:new Map(),score:{correct:0,wrong:0}});
 h.effects.length=0;h.document.hidden=false;
 const trigger=(midi,down,source)=>{h.effects.push(['input',midi,down,source]);if(down)h.state.pressedKeys.add(midi);else h.state.pressedKeys.delete(midi);};
 const inputPorts={document:h.document,window:h.window,pressedKeys:h.state.pressedKeys,isMidiInRange:midi=>midi>=21&&midi<=108,ensureLiveAudioReady:async()=>{h.effects.push(['ready']);},triggerVirtualKey:trigger};
 const inputs=h.api('PianoTrainerVirtualKeyboardControls').create(inputPorts);
 const viewPorts={document:h.document,isMidiInRange:inputPorts.isMidiInRange},view=h.api('PianoTrainerVirtualKeyboardView').create(viewPorts);
 const drawKey=view.drawKey;
 const presentationPorts={state:h.state,isMidiInRange:inputPorts.isMidiInRange,getHandRole:staff=>staff===2?'left':staff===1?'right':null,
 sustains:{pruneAtTimestamp:timestamp=>h.effects.push(['prune',timestamp]),markHeldPreview:(midi,preview)=>h.effects.push(['mark',midi,preview])},
 led:{render:(states,depth)=>h.effects.push(['led-render',[...states],depth]),updateHardware:(midi,next,previous)=>h.effects.push(['hardware',midi,next,previous])},
 drawKey:(midi,desired,calibration)=>{h.effects.push(['draw',midi,desired,!!calibration]);drawKey(midi,desired,calibration);}};
 const presentation=h.api('PianoTrainerKeyboardController').create(presentationPorts);
 let position=0;const traversal=[0,0,1,2,1,2,3];const seekPorts={state:h.state,hasGraphicSheet:()=>true,isAnyToolbarPanelOpen:()=>false,
 clientPointToSvg:(x,y)=>({x,y}),getMeasureCount:()=>4,getMeasureBox:index=>({x:index*100,y:10,width:100,height:40}),isLoopEnabled:()=>false,
 stopTransport:()=>h.effects.push(['stop']),resetCursor:()=>{h.effects.push(['reset']);position=0;},isEndReached:()=>position>=traversal.length-1,
 getCurrentMeasureIndex:()=>traversal[position],advance:()=>{position++;h.effects.push(['advance',traversal[position]]);},
 updateCursor:()=>h.effects.push(['update']),scroll:()=>h.effects.push(['scroll']),clearVisuals:()=>h.effects.push(['clear'])};
 const seek=h.api('PianoTrainerScoreSeek').create(seekPorts),seekUi=h.api('PianoTrainerScoreSeekControls').create({document:h.document,seek:seek.seek});
 const renderer={Sheet:{SourceMeasures:[]},GraphicSheet:{MeasureList:[[]]},cursor:null};const adapter=h.api('PianoTrainerOsmdAdapter').create({getRenderer:()=>renderer,describeNote:()=>({}),describeGraphicalNote:()=>({}),debugLog:()=>{},reportError:()=>{}});
 return {...h,allKeys,container,inputPorts,inputs,viewPorts,view,presentationPorts,presentation,seekPorts,seek,seekUi,renderer,adapter,
 key:midi=>container.children.find(x=>x.dataset.midi===String(midi)),tick:async()=>{for(let i=0;i<6;i++)await Promise.resolve();},
 count:()=>allKeys.reduce((sum,key)=>sum+key.listeners.length,0)+h.window.listeners.length+h.document.listeners.length};
}
module.exports={harness,Mouse,Pointer,Touch,Key};
