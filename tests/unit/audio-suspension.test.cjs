const {test}=require('node:test'),assert=require('node:assert/strict');
const {audioHarness}=require('../helpers/audio-harness.cjs');
test('cached-page suspension retains sampler loading/nodes but cancels the pre-cache deferred attack',async()=>{
 const h=audioHarness();h.audio.playLocalPianoNote(60);const nodes=[...h.nodes];h.audio.suspend();await h.ready();await Promise.resolve();
 assert.equal(h.audio.isReady(),true);assert.equal(h.nodes.length,nodes.length);assert.equal(h.calls.some(call=>call[0]==='attack'),false);assert.equal(h.calls.some(call=>call[0]==='dispose'),false);
 h.audio.playLocalPianoNote(60);assert.equal(h.calls.filter(call=>call[0]==='attack').length,1);
});
test('cached-page suspension cancels release timers and a captured old release cannot silence a fresh attack',async()=>{
 const h=audioHarness();await h.ready();h.audio.playLocalPianoNote(60,100,500);const old=[...h.timers.values()][0].cb;
 h.audio.suspend();assert.equal(h.timers.size,0);h.audio.playLocalPianoNote(60);const before=h.calls.length;old();assert.equal(h.calls.length,before);
 h.audio.dispose();assert.equal(h.calls.filter(call=>call[0]==='dispose').length,3);
});
