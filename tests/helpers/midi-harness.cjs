const vm=require('node:vm');
const {runScript}=require('./legacy-script.cjs');

async function midiHarness() {
    const elements=new Map();
    const input={id:'test-input',name:'Test input',state:'connected',onmidimessage:null};
    const second={id:'second-input',name:'Second input',state:'connected',onmidimessage:null};
    const received=[],sent=[],events=[];
    let now=1000,requests=0;
    const element=id=>{if(!elements.has(id))elements.set(id,{value:'none'});return elements.get(id);};
    const state={midiInChannel:0,midiOutChannel:1,midiOutVolume:100,recentMidiEchoes:[]};
    const access={inputs:new Map([[input.id,input],[second.id,second]]),outputs:new Map([
        ['test-output',{id:'test-output',name:'Test output',state:'connected',send:bytes=>sent.push(Array.from(bytes))}]
    ]),onstatechange:null};
    const context=vm.createContext({});
    runScript(context,'js/generated/domain/preference-values.js');
    Object.assign(context,vm.runInContext('PianoTrainerPreferenceValues',context));
    runScript(context,'js/generated/domain/velocity.js');
    for(const file of ['midi-input','midi-service','midi-output'])runScript(context,`js/generated/midi/${file}.js`);
    const api=vm.runInContext('({input:PianoTrainerMidiInput,service:PianoTrainerMidiService,output:PianoTrainerMidiOutput,velocity:PianoTrainerVelocity})',context);
    const echo=api.input.createEchoFilter(state,()=>now);
    const service=api.service.create({requestAccess:async()=>{requests++;return access;},
        onReady:()=>events.push('ready'),onDevicesChanged:()=>events.push('devices'),onAccessError:error=>events.push(error),
        selectedInputChannel:()=>context.normalizeMidiInputChannel(element('midi-in-channel').value,state.midiInChannel || 0),
        isEcho:echo.isRecent,nowMs:()=>now,
        dispatch:note=>received.push([note.note,note.kind==='note-on',note.source,note.velocity])});
    const timers=new Map();let timerSeq=0;
    const output=api.output.create({
        getOutput:()=>{const id=element('midi-out').value;const port=service.getOutput(id);return port&&port.state!=='disconnected'?port:null;},
        getChannel:()=>state.midiOutChannel,getVolume:()=>state.midiOutVolume,
        normalizeChannel:value=>context.normalizeMidiChannel(value,1),normalizeVelocity:value=>api.velocity.normalizeLiveVelocity(value).midi,
        remember:echo.remember,setTimer:(cb,delay)=>{timers.set(++timerSeq,{cb,delay});return timerSeq;},clearTimer:id=>timers.delete(id)});
    await service.init();
    element('midi-in-channel').value='0';element('midi-out-channel').value='1';element('midi-out').value='test-output';
    service.selectInput(input.id);
    return {context,api,service,output,echo,state,access,input,second,received,sent,events,timers,
        element,select:id=>service.selectInput(id),advance:ms=>{now+=ms;},get requests(){return requests;}};
}
module.exports={midiHarness};
