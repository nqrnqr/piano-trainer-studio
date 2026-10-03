// Test iframe only. Wrap the injected port while retaining the actual Tone node.
(()=>{
 const fixture=window.MetronomeFixture={events:[],nodes:[]};
  class MembraneSynth{
   constructor(options){this.node=new Tone.MembraneSynth(options);this.volume=this.node.volume;fixture.nodes.push({node:this.node,options});}
   toDestination(){this.node.toDestination();this.node.volume.value=-Infinity;return this;}
   triggerAttackRelease(note,duration,time,velocity){
    fixture.events.push({note,duration,time,velocity,now:Tone.now(),immediate:Tone.immediate(),performanceMs:performance.now()});
    return this.node.triggerAttackRelease(note,duration,time,velocity);
   }
   dispose(){this.node.dispose();fixture.events.push({kind:'dispose'});}
  }
  fixture.tone={MembraneSynth};
})();
