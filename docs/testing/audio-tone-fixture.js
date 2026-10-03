// Test entry only: instrument the injected Tone port, retaining real nodes,
// context, asset decoding and original method arguments. Production has no API.
(() => {
    const fixture={events:[],nodes:[],profiles:[],readyCalls:0};
    const voice=(kind,node,config)=>{
        fixture.nodes.push({kind,node,config});
        const port={connect:destination=>{node.connect(destination);return port;},
            dispose:()=>{fixture.events.push(['dispose',kind]);node.dispose();}};
        for(const [method,label]of [['triggerAttack','attack'],['triggerRelease','release'],['triggerAttackRelease','attack-release'],['releaseAll','release-all']]) {
            port[method]=(...args)=>{fixture.events.push([label,kind,...args]);return node[method](...args);};
        }
        return port;
    };
        const real=Tone;
        const ctx=real.getContext();
        fixture.defaultProfile={lookAhead:ctx.lookAhead,updateInterval:ctx.updateInterval,latencyHint:ctx.latencyHint};
        fixture.tone={context:real.context,getContext:()=>real.getContext(),Synth:real.Synth,
            Transport:real.Transport,MembraneSynth:real.MembraneSynth,
            loaded:()=>{fixture.readyCalls++;return real.loaded();},
            start:()=>real.start(),now:()=>real.now(),immediate:()=>real.immediate(),
            Frequency:(...args)=>real.Frequency(...args),
            Volume:class {constructor(db){const node=new real.Volume(db);fixture.nodes.push({kind:'volume',node});return node;}},
            PolySynth:class {constructor(type,config){return voice('synth',new real.PolySynth(type,config),config);}},
            Sampler:class {constructor(config){return voice('sampler',new real.Sampler(config),config);}}};
    window.AudioFixture=fixture;
})();
