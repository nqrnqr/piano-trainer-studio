const test=require('node:test');
const assert=require('node:assert/strict');
const {midiHarness}=require('../helpers/midi-harness.cjs');

test('decoded domain input carries channel/source/time, two-byte release and rejects malformed notes',async()=>{
    const h=await midiHarness();
    const input=h.api.input.decode(Uint8Array.from([0x9F,127,55]),0,1234);
    assert.deepEqual(JSON.parse(JSON.stringify(input)),{kind:'note-on',note:127,velocity:55,source:'midi',channel:16,receivedAtMs:1234});
    assert.equal(h.api.input.decode([0x90,60],0,0).kind,'note-off');
    for(const data of [null,[],[0x90],Array(3),[undefined,60,100],[0x90,undefined,100],[0x90,60,undefined],
        [0x90,-1,100],[0x90,128,100],[0x90,60,128],[0x90,60,3.5],[0x90,60,NaN],[0xB0,60,100]]) {
        assert.equal(h.api.input.decode(data,0,0),null);
    }
});
test('service init is idempotent; state/input listeners detach on dispose and can bind after reinit',async()=>{
    const h=await midiHarness();
    await Promise.all([h.service.init(),h.service.init()]);
    assert.equal(h.requests,1);
    const previousCallback=h.access.onstatechange;
    h.service.dispose();h.service.dispose();
    assert.equal(h.input.onmidimessage,null);
    assert.equal(h.access.onstatechange,null);
    await h.service.init();h.service.selectInput(h.input.id);
    assert.equal(h.requests,2);
    assert.equal(h.access.onstatechange,previousCallback);
    h.input.onmidimessage({data:[0x90,60,100]});
    assert.equal(h.received.length,1);
});
test('hotplug clears removed input callbacks and rebinds a replacement object with the same device ID',async()=>{
    const h=await midiHarness();
    const replacement={...h.input,onmidimessage:null};
    h.access.inputs.set(h.input.id,replacement);
    h.access.onstatechange();
    assert.equal(h.input.onmidimessage,null);
    replacement.onmidimessage({data:[0x90,61,100]});
    assert.deepEqual(h.received,[[61,true,'midi',100]]);
    h.access.inputs.delete(replacement.id);
    h.access.onstatechange();
    assert.equal(replacement.onmidimessage,null);
    assert.equal(h.service.isInputBound(replacement.id),false);
});
test('pending access requests share work; dispose invalidates late success and stale failure',async()=>{
    const h=await midiHarness();
    let resolveAccess;
    let ready=0,errors=0,requests=0;
    const service=h.api.service.create({requestAccess:()=>{requests++;return new Promise(resolve=>{resolveAccess=resolve;});},
        onReady:()=>ready++,onAccessError:()=>errors++});
    const first=service.init(),second=service.init();
    assert.equal(first,second);assert.equal(requests,1);
    service.dispose();resolveAccess(h.access);await first;
    assert.equal(ready,0);assert.equal(service.isReady(),false);assert.equal(errors,0);
    let rejectAccess;
    const rejected=h.api.service.create({requestAccess:()=>new Promise((resolve,reject)=>{rejectAccess=reject;}),onAccessError:()=>errors++});
    const pending=rejected.init();rejected.dispose();rejectAccess(new Error('denied'));await pending;
    assert.equal(errors,0);
});
test('access denial reports once; unavailable API stays quiet; disposal preserves handlers owned elsewhere',async()=>{
    const h=await midiHarness();let denied;
    const error=new Error('permission denied');
    const service=h.api.service.create({requestAccess:async()=>{throw error;},onAccessError:value=>{denied=value;}});
    await service.init();assert.equal(denied,error);
    await h.api.service.create({requestAccess:null}).init();
    const external=()=>{};
    h.input.onmidimessage=external;h.access.onstatechange=external;
    h.service.dispose();
    assert.equal(h.input.onmidimessage,external);assert.equal(h.access.onstatechange,external);
});
test('echo window uses strict expiry and preserves bounded replacement/pruning on non-note messages',async()=>{
    const h=await midiHarness();
    const original=h.state.recentMidiEchoes;
    for(let i=0;i<257;i++)h.echo.remember(0x90,i%128,100);
    assert.equal(h.state.recentMidiEchoes.length,128);
    assert.notEqual(h.state.recentMidiEchoes,original);
    h.advance(119);assert.equal(h.echo.isRecent(0x90,0,100),true);
    h.advance(1);h.input.onmidimessage({data:[0xB0,64,0]});
    assert.equal(h.state.recentMidiEchoes.length,0);
    assert.equal(h.received.length,0);
    for (const data of [[],[0xF8],[0xC0,4]]) {
        h.echo.remember(0x90,60,100);h.advance(120);h.input.onmidimessage({data});
        assert.equal(h.state.recentMidiEchoes.length,0,'short native messages still prune expired echoes');
        assert.equal(h.received.length,0);
    }
});
test('output expression/silence preserve CC order; scheduled release chooses current output and disposal cancels timer',async()=>{
    const h=await midiHarness();
    h.state.midiOutChannel=4;h.output.expression(50);h.output.silence();
    assert.deepEqual(h.sent,[[0xB3,11,64],[0xB3,64,0],[0xB3,123,0],[0xB3,120,0]]);
    h.sent.length=0;
    h.output.scheduleNote(60,-10,0);
    const [id,timer]=h.timers.entries().next().value;
    assert.equal(timer.delay,0);
    h.timers.delete(id);h.element('midi-out').value='none';timer.cb();
    assert.deepEqual(h.sent,[[0x93,60,1]]);
    h.element('midi-out').value='test-output';h.output.scheduleNote(62,200,100);
    h.output.dispose();assert.equal(h.timers.size,0);
    h.access.outputs.get('test-output').state='disconnected';
    assert.equal(h.output.noteOff(62),false);
});
