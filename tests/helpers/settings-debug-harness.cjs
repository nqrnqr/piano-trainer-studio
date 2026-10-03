const vm=require('node:vm');
const {harness:base,Node,Input,event}=require('./native-controls-harness.cjs');
const {runScript}=require('./legacy-script.cjs');
class Element extends Node {
 constructor(tag){super();this.tag=tag;this.children=[];}
 setAttribute(name,value){this.attrs[name]=String(value);if(name==='id')this.id=String(value);}
 appendChild(node){node.parent=this;this.children.push(node);return node;}
 replaceChildren(...children){for(const child of this.children)child.parent=null;this.children=[];for(const child of children)this.appendChild(child);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);this.parent=null;}
 querySelector(selector){if(selector==='#'+this.id)return this;for(const child of this.children){const found=child.querySelector(selector);if(found)return found;}return null;}
 snapshot(){return {tag:this.tag,attrs:this.attrs,text:this.textContent,children:this.children.map(child=>child.snapshot())};}
}
function harness(){
 const h=base(),readers=[],links=[],svg=new Element('svg');
 h.document.createElementNS=(_,tag)=>new Element(tag);h.document.body=new Element('body');
 h.document.createElement=tag=>{const node=new Element(tag);node.click=()=>h.effects.push(['click',node.href,node.download]);links.push(node);return node;};
 h.add('check-debug',Input);
 Object.assign(h.state,{debugPersistentAnchors:false,debugEventFlow:false,debugMatchLogs:false,debugAnchorResolution:false,debugFrameSeq:0,debugAnchorHistory:[],debugStickyFrameLimit:10,expectedNotes:[]});
 for(const file of ['ui/settings-controls','ui/feedback-debug','score/osmd-debug-observation'])runScript(h.context,`js/generated/${file}.js`);
 class Reader {constructor(){this.result=null;this.onload=null;this.onloadend=null;this.abortCount=0;readers.push(this);}
  readAsText(file){h.effects.push(['read',file]);if(file.throwRead)throw Error('read failed');}
  finish(result){this.result=result;this.onload?.();this.onloadend?.();}
  abort(){this.abortCount++;h.effects.push(['abort']);this.onloadend?.();}
 }
 const date=()=>new Date('2026-10-03T12:34:56.000Z'),trace=name=>(...args)=>h.effects.push([name,...args]);
 const settingsPorts={document:h.document,createReader:()=>new Reader(),createBlob:(parts,options)=>{h.effects.push(['blob',parts,options]);return {parts,options};},
 createObjectURL:()=>{h.effects.push(['url']);return 'blob:settings';},revokeObjectURL:trace('revoke'),now:date,
 buildPayload:()=>({version:1,exportedAt:date().toISOString(),appVersion:'1.2.4',settings:{pt_scoreLayout:'horizontal'}}),
 importPayload:trace('import'),alert:trace('alert'),reload:trace('reload'),warn:(label,error)=>h.effects.push(['warn',label,error.message])};
 const debugPorts={document:h.document,state:h.state,getSvg:()=>svg,ensureGroup:id=>{let group=svg.querySelector('#'+id);if(!group){group=new Element('g');group.setAttribute('id',id);svg.appendChild(group);}return group;},
 readEnabled:()=>{h.effects.push(['read-enabled']);return false;},saveEnabled:trace('save-debug'),publishStickyEnabled:trace('sticky'),
 setInterval:h.window.setInterval,clearInterval:h.window.clearInterval,now:date,log:trace('log'),warn:trace('warn'),error:trace('error')};
 const settings=h.api('PianoTrainerSettingsFiles').create(settingsPorts),debug=h.api('PianoTrainerFeedbackDebug').create(debugPorts);
 return {...h,settings,settingsPorts,debug,debugPorts,readers,links,svg,Element,event,Reader};
}
module.exports={harness,Element};
