// Test entry only. Production does not reference this provider or its API.
(() => {
    const makeInput=(id,name)=>({id,name,state:'connected',onmidimessage:null});
    const first=makeInput('fixture-in','Fixture Keyboard');
    const second=makeInput('fixture-second','Second Keyboard');
    const sent=[];
    const output={id:'fixture-out',name:'Fixture Output',state:'connected',send:data=>sent.push(Array.from(data))};
    const access={inputs:new Map([[first.id,first],[second.id,second]]),outputs:new Map([[output.id,output]]),onstatechange:null};
    const fixture={access,first,second,output,sent,requests:0};
    Object.defineProperty(navigator,'requestMIDIAccess',{configurable:true,value:async()=>{fixture.requests++;return access;}});
    window.__PT_BOOT_OPTIONS__={ledEnabled:new URLSearchParams(parent.location.search).get('led') !== 'off'};
    window.MidiFixture=fixture;
    localStorage.setItem('pt_savedMidiIn',first.id);
    localStorage.setItem('pt_savedMidiInChannel','0');
    localStorage.setItem('pt_savedMidiOut',output.id);
    localStorage.setItem('pt_savedMidiOutChannel','1');
    localStorage.setItem('pt_savedMidiLights','none');
    localStorage.setItem('pt_ledOutputMode','none');
})();
