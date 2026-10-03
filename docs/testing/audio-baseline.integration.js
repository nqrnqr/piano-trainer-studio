(async()=>{
    const results=parent.document.getElementById('results');results.textContent='';
    const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
    const api=window.PianoTrainerTest,a=api.audio;
    const f=window.AudioFixture,m=window.MidiFixture;
    const clear=()=>{f.events.length=0;m.sent.length=0;};
    const near=(a,b)=>Math.abs(a-b)<1e-6;
    try {
        a.hidePanels();
        await api.midi.initService();
        a.pianoVolume(0);
        check(f.nodes.length===3,'actual startup allocates exactly one sampler, synth and volume');
        a.initOutput();check(f.nodes.length===3,'repeated init retains the same three real Tone nodes');
        await a.ensureReady();
        check(a.isReady()&&f.readyCalls===1,'local sampler assets load and share the startup promise');
        check(Tone.context.state==='running','user-initiated check unlocks the real audio context');
        const sampler=f.nodes.find(node=>node.kind==='sampler');
        const extension=a.sampleExtension();
        const requested=performance.getEntriesByType('resource').filter(entry=>entry.name.includes('/assets/audio/salamander/'));
        check(Object.keys(sampler.config.urls).length===30&&sampler.config.urls['D#4']===`Ds4.${extension}`&&requested.length===30,
            'all 30 chosen-codec local samples are requested and decoded');
        a.applyLatency('follow');
        const ctx=Tone.getContext();
        check(near(ctx.lookAhead,0.005)&&near(ctx.updateInterval,0.005)&&ctx.latencyHint===f.defaultProfile.latencyHint,
            'Follow applies writable context fields and preserves the vendor getter');
        a.applyLatency('wait');
        check(near(ctx.lookAhead,f.defaultProfile.lookAhead)&&near(ctx.updateInterval,f.defaultProfile.updateInterval),
            'Wait restores the captured latency profile');
        api.pause();
        a.setRouting({hands:false,other:false,instrument:false,virtual:true},{hands:false,other:false,instrument:false,virtual:false});
        clear();api.dispatchNote({kind:'note-on',note:60,velocity:12,source:'ui',channel:null,receivedAtMs:performance.now()});api.dispatchInput(60,false);
        check(f.events.map(event=>event[0]+':'+event[1]).join(',')==='release:sampler,attack:sampler,release:sampler'&&near(f.events[1][4],100/127)&&m.sent.length===0,
            'common UI input uses sampler with fixed velocity and local-only release');
        a.setRouting({virtual:false},{virtual:true});
        clear();api.dispatchNote({kind:'note-on',note:61,velocity:12,source:'ui',channel:null,receivedAtMs:performance.now()});api.dispatchInput(61,false);
        check(f.events.length===0&&JSON.stringify(m.sent)===JSON.stringify([[0x90,61,100],[0x80,61,0]]),
            'common UI input can route only to MIDI output');
        a.setRouting({instrument:true},{instrument:true});a.setInputVelocity(150,true);
        clear();m.first.onmidimessage({data:Uint8Array.from([0x90,62,64])});m.first.onmidimessage({data:Uint8Array.from([0x80,62,0])});
        check(f.events.length===3&&near(f.events[1][4],96/127)&&JSON.stringify(m.sent)===JSON.stringify([[0x90,62,64],[0x80,62,0]]),
            'raw MIDI input boosts only local monitoring and preserves output velocity');
        for(const [mode,lowLatency,kind]of [['wait',true,'sampler'],['follow',true,'synth'],['realtime',true,'synth'],['follow',false,'sampler']]) {
            a.selectMode(mode,lowLatency);clear();
            a.schedule(64,40,80,{toLocalAudio:true,toMidiOut:true});
            check(f.events.some(event=>event[1]===kind)&&!f.events.some(event=>event[1]!==kind)&&m.sent[0][2]===80,
                `${mode} lowLatency=${lowLatency}: accompaniment selects ${kind} and MIDI independently`);
            await new Promise(resolve=>setTimeout(resolve,75));
            check(m.sent.at(-1)[0]===0x80&&m.sent.at(-1)[1]===64,
                `${mode} lowLatency=${lowLatency}: original millisecond note-off timer releases MIDI`);
        }
        clear();a.silence();
        check(f.events.map(event=>event[1]).join(',')==='sampler,synth'&&JSON.stringify(m.sent)===JSON.stringify([[0xB0,64,0],[0xB0,123,0],[0xB0,120,0]]),
            'pause/reset silence releases both local voices before the unchanged MIDI CC sequence');
        a.pianoVolume(50);
        check(near(f.nodes[0].node.volume.value,20*Math.log10(0.5))&&document.getElementById('slider-piano-vol').value==='50',
            'volume UI sends the same decibel conversion to the owned node');
        a.pianoVolume(0);
        clear();a.disposeRouting();a.disposeOutput();
        check(f.events.filter(event=>event[0]==='dispose').length===2&&f.nodes.every(({node})=>node.disposed),
            'explicit dispose tears down real Tone voices and their destination');
        a.initOutput();a.setPianoVolume(0);await a.loadSampler();
        check(f.nodes.length===6&&a.isReady(),'reinitialization creates a fresh usable sampler exactly once');
        check(api.practice.readLed().enabled===window.__PT_BOOT_OPTIONS__.ledEnabled,
            'audio and routing work with the selected default/no-op LED adapter');

    } catch(error) {results.textContent+=`ERROR ${error.stack||error}\n`;console.error(error);}
    finally {
        a.silence();api.pause();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();
        if(!results.textContent.includes('ERROR'))results.textContent+='DONE\n';
        parent.document.getElementById('run').disabled=false;
    }
})();
