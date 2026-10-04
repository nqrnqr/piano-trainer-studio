const test=require('node:test'),assert=require('node:assert/strict');
const {PianoTrainerHorizontalChunks:api}=require('../../.cache/test-modules/render/horizontal-chunks.js');
const make=path=>({steps:[],measures:path.map((sourceMeasureIndex,index)=>({sourceMeasureIndex,measureOccurrenceId:index,firstTraceStepIndex:index,lastTraceStepIndex:index}))});
function sizes(sequence){for(const d of sequence.definitions){d.width=d.measures.length*200;d.height=200;}sequence.layout();return sequence;}
test('finite long scores split into eight-measure blocks with exact right-hand offsets',()=>{
 const sequence=sizes(api.define(make(Array.from({length:240},(_,i)=>i)),{enabled:false,min:1,max:240}));
 assert.equal(sequence.definitions.length,30);assert.equal(sequence.address(29).offset,46400);assert.equal(sequence.address(30),null);
 assert.equal(sequence.forEvent({measureOccurrenceId:239,loopIteration:0}).index,29);
});
test('Loop retains vendor repeats inside the selected range and addresses a million rounds arithmetically',()=>{
 const sequence=sizes(api.define(make([0,1,0,1,2]),{enabled:true,min:1,max:2}));
 assert.deepEqual(sequence.repeated.flatMap(d=>d.measures.map(m=>m.sourceMeasureIndex)),[0,1,0,1]);
 assert.equal(sequence.definitions.length,2);assert.equal(sequence.forEvent({measureOccurrenceId:0,loopIteration:1000000}).offset,800000000);
 assert.equal(sequence.definitions.length,2);assert.equal(api.windowAround(1000000,null).end-api.windowAround(1000000,null).start+1,7);
});
test('partial range matches coordinator reset-to-min and first-outside-max stopping semantics',()=>{
 const sequence=sizes(api.define(make([0,1,2,0,1,3,4]),{enabled:true,min:2,max:3},1));
 assert.deepEqual(sequence.repeated.flatMap(d=>d.measures.map(m=>m.sourceMeasureIndex)),[1,2,0,1]);
 assert.equal(sequence.forEvent({measureOccurrenceId:1,loopIteration:5}).iteration,5);
});
test('local-origin compensation preserves the screen coordinate across both forward recycling and history reconstruction',()=>{
 for(const zoom of [.5,1,1.5])for(const [oldOrigin,newOrigin]of [[0,200],[100000000,99999800]]){
  const oldScroll=600,world=oldOrigin+1500;
  const newScroll=api.compensatedScroll(oldScroll,oldOrigin,newOrigin,zoom);
  assert.equal((world-oldOrigin)*zoom-oldScroll,(world-newOrigin)*zoom-newScroll);
 }
});
