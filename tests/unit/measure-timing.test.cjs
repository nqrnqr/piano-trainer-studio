const test=require('node:test'),assert=require('node:assert/strict');
const {harness,plain}=require('../helpers/metronome-harness.cjs');
function setup(events,measures,savedIndex=0){
 const h=harness();let index=savedIndex;const restores=[];
 const iterator={get CurrentMeasureIndex(){return events[index]?.measure??events.at(-1)?.measure??0;},get currentTimeStamp(){return {RealValue:events[index]?.time??0};},get EndReached(){return index>=events.length;},moveToNext(){index++;}};
 const cursor={Iterator:iterator,reset(){index=0;},update(){}};
 const service=h.api('PianoTrainerMeasureTiming').create({getMeasure:i=>measures[i]||null,getMeasureCount:()=>measures.length,getCursor:()=>cursor,
  restoreToPosition(measure,timestamp){restores.push([measure,timestamp]);index=events.findIndex(e=>e.measure===measure&&e.time===timestamp);}});
 return {...h,service,cursor,restores,getIndex:()=>index};
}
test('measure cache follows actual repeat occurrences then restores the original first-match position',()=>{
 const h=setup([{measure:0,time:0},{measure:0,time:.25},{measure:1,time:1},{measure:1,time:1.25},{measure:0,time:0},{measure:1,time:1},{measure:2,time:2}],Array.from({length:3},()=>({ActiveTimeSignature:{Numerator:4,Denominator:4}})),5);
 const cache=h.service.rebuild();assert.deepEqual(plain(cache.map(c=>[c.startTimestamp,c.actualLengthWhole])),[[0,1],[1,0],[2,1]]);
 assert.deepEqual(h.restores,[[1,1]]);assert.equal(h.getIndex(),2);assert.equal(h.service.getCachedMeasureCount(),3);
 assert.equal(h.service.getInfo(1).actualLengthWhole,0);assert.equal(h.service.getInfo(1).nominalMeasureLengthWhole,1);
});
test('time signatures and pickup lengths keep cached actual length versus nominal beat grid',()=>{
 const h=setup([{measure:0,time:0},{measure:1,time:.25},{measure:2,time:1}],
  [{ActiveTimeSignature:{Numerator:3,Denominator:8}},{ActiveTimeSignature:{Numerator:3,Denominator:4}},{ActiveTimeSignature:{Numerator:2,Denominator:4}}]);
 h.service.rebuild();assert.equal(h.service.getInfo(0).actualLengthWhole,.25);assert.equal(h.service.getInfo(0).nominalMeasureLengthWhole,.375);
 assert.equal(h.service.getInfo(0).beatLengthWhole,.125);assert.equal(h.service.getInfo(1).actualLengthWhole,.75);
 assert.equal(h.service.getInfo(2).actualLengthWhole,.5);
});
test('missing measure falls back to first time signature and undefined index retains the same defaults',()=>{
 const h=setup([],[{ActiveTimeSignature:{Numerator:7,Denominator:8}}]);
 assert.deepEqual(plain(h.service.getInfo(undefined)),{numerator:7,denominator:8,beatLengthWhole:.125,nominalMeasureLengthWhole:.875,actualLengthWhole:.875,startTimestamp:0});
});
test('missing cursor resets cache and stuck iterator retains 100000 safety limit',()=>{
 const h=harness();let moves=0;const cursor={Iterator:{CurrentMeasureIndex:0,currentTimeStamp:{RealValue:0},EndReached:false,moveToNext(){moves++;}},reset(){},update(){}};
 let active=cursor;const service=h.api('PianoTrainerMeasureTiming').create({getMeasure:()=>null,getMeasureCount:()=>1,getCursor:()=>active,restoreToPosition(){}});
 service.rebuild();assert.equal(moves,100000);assert.equal(service.getCachedMeasureCount(),1);active=null;
 assert.equal(service.rebuild().length,0);assert.equal(service.getCachedMeasureCount(),0);
});
