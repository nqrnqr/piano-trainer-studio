const vm=require('node:vm');
const {runScript}=require('./legacy-script.cjs');
const boxNode=(x,y,width,height,tag='path')=>({tagName:tag,getBBox:()=>({x,y,width,height}),getAttribute:name=>name==='fill'?'black':''});
const root=(nodes,box={x:0,y:0,width:120,height:80})=>({querySelectorAll:()=>nodes,getBBox:()=>box});
function geometryHarness() {
    const realm=vm.createContext({});
    for(const file of ['geometry-engine','feedback-overlay','loop-overlay'])runScript(realm,`js/generated/render/${file}.js`);
    const api=vm.runInContext('({geometry:PianoTrainerGeometry,feedback:PianoTrainerFeedbackOverlay,loop:PianoTrainerLoopOverlay})',realm);
    const drawn=[],cleared=[],logs=[];
    const groups=new Map();
    const group=id=>{if(!groups.has(id))groups.set(id,{replaceChildren:()=>cleared.push(id),appendChild:node=>drawn.push({group:id,...node})});return groups.get(id);};
    const svg={querySelector:selector=>groups.get(selector.slice(1))||null,
        getBoundingClientRect:()=>({left:100,top:50,width:200,height:100}),viewBox:{baseVal:{x:10,y:20,width:400,height:200}}};
    const document={createElementNS:(_ns,tag)=>({tag,attrs:{},setAttribute(name,value){this.attrs[name]=String(value);}})};
    const graphicalNotes=new Map();
    let boxVersion=0;
    const ports={score:{getGraphicalNote:note=>graphicalNotes.get(note)||null,
        getMeasureBox:(index,_staff,units)=>({x:index*units+boxVersion,y:40,width:20,height:80}),
        getCursorElement:()=>({getBoundingClientRect:()=>({left:150,top:70,width:10,height:10})}),
        getCurrentMeasureIndex:()=>2,getStaffTopY:(_measure,staff)=>staff===0?100:200},
        document,getSvg:()=>svg,getComputedStyle:()=>({fill:'black',stroke:'none'}),
        clearOverlays:()=>cleared.push('all'),fallbackHands:()=>({left:2,right:1}),
        describeNote:()=>({}),describeGraphicalNote:()=>({}),debugLog:(...args)=>logs.push(args)};
    const geometry=api.geometry.create(ports);
    return {api,geometry,ports,svg,document,group,groups,drawn,cleared,logs,graphicalNotes,
        moveBoxes:()=>{boxVersion+=10;},boxNode,root};
}
module.exports={geometryHarness,boxNode,root};
