const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {audioHarness,deferred,plain} = require('../helpers/audio-harness.cjs');
const {runScript} = require('../helpers/legacy-script.cjs');

test('sampler maps both codecs to the original local assets; explicit init shares one destination and disposes each node', () => {
    for(const extension of ['ogg','mp3']) {
        const h=audioHarness({extension});
        assert.equal(h.nodes.length,0);
        h.audio.init();h.audio.init();
        assert.equal(h.nodes.length,3);
        const [volume,synth,sampler]=h.nodes;
        assert.equal(sampler.destination,volume);assert.equal(synth.destination,volume);
        assert.deepEqual(synth.config,{maxPolyphony:24,volume:-6,options:{oscillator:{type:'triangle'},envelope:{attack:0.001,decay:0.08,sustain:0.18,release:0.12}}});
        const names=['A0','C1','Ds1','Fs1','A1','C2','Ds2','Fs2','A2','C3','Ds3','Fs3','A3','C4','Ds4','Fs4','A4','C5','Ds5','Fs5','A5','C6','Ds6','Fs6','A6','C7','Ds7','Fs7','A7','C8'];
        assert.deepEqual(Object.values(sampler.config.urls),names.map(name=>`${name}.${extension}`));
        assert.equal(sampler.config.urls['D#4'],`Ds4.${extension}`);
        assert.equal(sampler.config.release,1);assert.equal(sampler.config.baseUrl,'assets/audio/salamander/');
        h.clear();h.audio.dispose();h.audio.dispose();
        assert.deepEqual(h.calls,[['release-all','sampler'],['release-all','synth'],['dispose','sampler'],['dispose','synth'],['dispose','volume']]);
        h.audio.init();assert.equal(h.nodes.length,6);
    }
});

test('codec probe preserves probably/maybe, empty/no, unsupported and exception fallback', () => {
    for(const [result,expected] of [['probably','ogg'],['maybe','ogg'],['','mp3'],['no','mp3'],[null,'mp3'],['throw','mp3']]) {
        const realm=vm.createContext({document:{createElement:()=>{
            if(result==='throw')throw Error('no audio');
            return result===null?{}:{canPlayType:format=>{assert.equal(format,'audio/ogg; codecs="vorbis"');return result;}};
        }}});
        runScript(realm,'js/generated/ui/audio-capabilities.js');
        assert.equal(realm.getPreferredPianoSampleExtension(),expected);
    }
});

test('Follow latency profile restores captured context values for Wait and Realtime without changing the playback clock', () => {
    const h=audioHarness();h.audio.init();
    h.audio.applyToneLatencyProfileForMode('follow');
    assert.deepEqual([h.context.lookAhead,h.context.updateInterval,h.context.latencyHint],[0.005,0.005,0.001]);
    for(const mode of ['wait','realtime']) {
        h.audio.applyToneLatencyProfileForMode(mode);
        assert.deepEqual([h.context.lookAhead,h.context.updateInterval,h.context.latencyHint],[0.1,0.03,'interactive']);
    }
    assert.equal(h.audio.getLiveAudioTime(),12.5);
    assert.equal(audioHarness({withoutImmediate:true}).audio.getLiveAudioTime(),12.6);
    Object.defineProperty(h.context,'latencyHint',{get:()=> 'interactive'});
    h.audio.applyToneLatencyProfileForMode('follow');
    assert.equal(h.context.lookAhead,0.005);assert.equal(h.context.latencyHint,'interactive');
    assert.equal(h.warnings.length,0);
    h.tone.getContext=()=>{throw Error('context unavailable');};
    h.audio.applyToneLatencyProfileForMode('follow');assert.equal(h.warnings.length,0);
});

test('unlock waits for shared sampler loading before start/resume; running context skips unlocking', async () => {
    const h=audioHarness();h.audio.init();h.clear();
    const first=h.audio.ensurePianoSamplerLoaded(),second=h.audio.ensurePianoSamplerLoaded();
    assert.equal(first,second);
    const unlock=h.audio.ensureLiveAudioReady();
    await Promise.resolve();assert.deepEqual(h.calls,[]);assert.equal(h.loadedCalls,1);
    h.loading.resolve();await unlock;
    assert.deepEqual(h.calls,[['start'],['resume']]);assert.equal(await first,true);
    h.clear();await h.audio.ensureLiveAudioReady();assert.deepEqual(h.calls,[]);
});

test('failed sampler promise remains cached, warns once, and unlock still runs; failed resume is contained', async () => {
    const h=audioHarness();h.audio.init();h.clear();
    const first=h.audio.ensurePianoSamplerLoaded();
    const rejected=assert.rejects(first,/sample failed/);
    h.loading.reject(Error('sample failed'));await rejected;
    assert.equal(h.audio.ensurePianoSamplerLoaded(),first);
    await h.audio.ensureLiveAudioReady();
    assert.equal(h.loadedCalls,1);assert.equal(h.warnings.length,1);
    assert.deepEqual(h.calls,[['start'],['resume']]);assert.equal(h.audio.isReady(),false);
    h.context.state='suspended';h.context.resume=async()=>{throw Error('permission');};
    await h.audio.ensureLiveAudioReady();assert.equal(h.warnings.length,2);
    assert.match(h.warnings[1][0],/resume Tone/);
    const withoutLoaded=audioHarness({withoutLoaded:true});assert.equal(await withoutLoaded.audio.ensurePianoSamplerLoaded(),true);
});

test('loading defers attacks; old global fallback guard intentionally excludes hands and reads live routing on completion', async () => {
    for(const enabled of [false,true]) {
        const h=audioHarness();Object.assign(h.state.audioEnabled,{hands:true,virtual:false,instrument:false});
        h.audio.init();h.clear();h.audio.playLocalPianoNote(60,64,500);
        assert.deepEqual(h.calls,[]);assert.equal(h.timers.size,0);
        h.state.audioEnabled.virtual=enabled;
        await h.ready();
        assert.deepEqual(h.calls,enabled?[['release','sampler','note-60',12.5],['attack','sampler','note-60',12.5,64/127]]:[]);
        assert.equal(h.timers.size,enabled?1:0);
    }
});

test('live input retriggers sampler at immediate time, preserves gain floor and releases using a fresh time', async () => {
    const h=audioHarness();await h.ready();h.clear();
    h.audio.playLocalPianoNote(60,0,125);
    assert.deepEqual(h.calls,[['release','sampler','note-60',12.5],['attack','sampler','note-60',12.5,0.05]]);
    const [id,timer]=[...h.timers][0];assert.equal(timer.delay,125);
    h.advance(0.5);h.fire(id);assert.deepEqual(h.calls.at(-1),['release','sampler','note-60',13]);
    h.clear();h.audio.playLocalPianoNote(60,65.5,null,{retrigger:false});
    assert.deepEqual(h.calls,[['attack','sampler','note-60',13,65.5/127]]);
    h.clear();h.audio.playLocalPianoNote(60,100,null,{retrigger:false,lowLatencyLive:true});
    assert.deepEqual(h.calls,[['release','sampler','note-60',13],['attack','sampler','note-60',13,100/127]]);
    h.clear();for(const midi of [-1,NaN,Infinity])h.audio.playLocalPianoNote(midi);
    assert.deepEqual(h.calls,[]);
});

test('scheduled Follow/Realtime use synth only when enabled; Wait uses sampler and preserves duration minimum', async () => {
    const h=audioHarness();await h.ready();
    for(const [mode,enabled,voice]of [['wait',true,'sampler'],['follow',true,'synth'],['realtime',true,'synth'],['follow',false,'sampler']]) {
        h.state.mode=mode;h.state.lowLatencyPlaybackEnabled=enabled;h.clear();
        h.audio.playScheduledPlaybackNote(64,127,5);
        assert.deepEqual(h.calls,voice==='synth'?[['attack-release','synth','note-64',0.01,12.5,1]]:
            [['release','sampler','note-64',12.5],['attack','sampler','note-64',12.5,1]]);
    }
    h.clear();h.audio.playLowLatencyPlaybackNote(64,100,null);
    assert.deepEqual(h.calls,[['release','synth','note-64',12.5],['attack','synth','note-64',12.5,100/127]]);
});

test('UI and MIDI monitor routes are independent; input boost changes local gain while MIDI preserves input velocity', async () => {
    const h=audioHarness();await h.ready();h.clear();
    Object.assign(h.state.midiOutEnabled,{instrument:true,virtual:true});
    h.routing.monitorNoteOn(60,'midi',64);h.routing.monitorNoteOff(60,'midi');
    assert.deepEqual(h.calls,[['release','sampler','note-60',12.5],['attack','sampler','note-60',12.5,96/127],['midi-on',60,64],['release','sampler','note-60',12.5],['midi-off',60]]);
    h.clear();h.routing.monitorNoteOn(61,'ui',12);
    assert.deepEqual(h.calls,[['release','sampler','note-61',12.5],['attack','sampler','note-61',12.5,100/127],['midi-on',61,100]]);
    h.state.audioEnabled.virtual=false;h.clear();h.routing.monitorNoteOn(61,'ui',12);h.routing.monitorNoteOff(61,'ui');
    assert.deepEqual(h.calls,[['midi-on',61,100],['midi-off',61]]);
    h.state.midiOutEnabled.instrument=false;h.state.inputVelocityEnabled=false;h.state.midiInBoost=50;h.clear();
    h.routing.monitorNoteOn(60,'midi',12);
    assert.deepEqual(h.calls,[['release','sampler','note-60',12.5],['attack','sampler','note-60',12.5,50/127]]);
    h.clear();h.routing.monitorNoteOn(60,'unknown',12);h.routing.monitorNoteOff(60,'unknown');assert.deepEqual(h.calls,[]);
});

test('playback routing orders local before MIDI, does not release failed MIDI sends, and retains timers across silence', async () => {
    const h=audioHarness();await h.ready();h.state.mode='follow';h.clear();
    for(const [midi,duration]of [[-1,500],[NaN,500],[60,0],[60,-1]])h.routing.schedulePlaybackForDestinations(midi,duration,100,{toLocalAudio:true,toMidiOut:true});
    assert.deepEqual(h.calls,[]);
    h.routing.schedulePlaybackForDestinations(60,500,65.5,{toLocalAudio:true,toMidiOut:true});
    assert.deepEqual(h.calls,[['attack-release','synth','note-60',0.5,12.5,65.5/127],['midi-on',60,65.5]]);
    const [id,timer]=[...h.timers][0];assert.equal(timer.delay,500);
    h.audio.silence();assert.equal(h.timers.size,1);h.fire(id);
    assert.deepEqual(h.calls.slice(-3),[['release-all','sampler'],['release-all','synth'],['midi-off',60]]);
    h.setMidiAvailable(false);h.clear();h.routing.schedulePlaybackForDestinations(61,500,100,{toMidiOut:true});
    assert.deepEqual(h.calls,[['midi-on',61,100]]);assert.equal(h.timers.size,0);
    h.setMidiAvailable(true);h.routing.schedulePlaybackForDestinations(62,NaN,100,{toMidiOut:true});
    assert.ok(Number.isNaN([...h.timers.values()][0].delay));
});

test('volume uses decibels including zero silence; file-picker resume keeps its non-waiting behavior', () => {
    const h=audioHarness();h.audio.init();h.clear();
    h.audio.setPianoVolume(0);assert.equal(h.nodes[0].volume.value,-Infinity);
    h.audio.setPianoVolume(50);assert.equal(h.nodes[0].volume.value,20*Math.log10(0.5));
    h.audio.setPianoVolume(100);assert.equal(h.nodes[0].volume.value,0);
    h.audio.resumeWithoutWaiting();assert.deepEqual(h.calls,[['resume']]);
    h.audio.resumeWithoutWaiting();assert.equal(h.calls.length,1);
});

test('dispose invalidates pending sample/unlock work, queued releases and timers across reinitialization', async () => {
    const h=audioHarness();h.audio.init();
    const pending=h.audio.ensurePianoSamplerLoaded(),unlock=h.audio.ensureLiveAudioReady();
    h.audio.playLocalPianoNote(60);h.audio.dispose();h.audio.init();h.clear();
    h.loading.resolve();assert.equal(await pending,false);await unlock;
    assert.deepEqual(h.calls,[]);assert.equal(h.audio.isReady(),false);
    await h.ready();h.audio.playLocalPianoNote(60,100,200);
    h.routing.schedulePlaybackForDestinations(61,200,100,{toMidiOut:true});
    const queued=[...h.timers.values()].map(timer=>timer.cb);
    h.audio.dispose();h.routing.dispose();assert.equal(h.timers.size,0);h.audio.init();h.clear();
    queued.forEach(callback=>callback());assert.deepEqual(h.calls,[]);
    const starting=deferred(),entered=deferred();h.tone.start=()=>{entered.resolve();return starting.promise;};
    const nextUnlock=h.audio.ensureLiveAudioReady();await entered.promise;
    h.audio.dispose();h.clear();starting.resolve();await nextUnlock;assert.deepEqual(h.calls,[]);
});

test('shared velocity keeps legacy coercions, fractions, non-finite fallback and local gain floor', () => {
    const h=audioHarness();
    for(const [input,midi,gain]of [[0,1,0.05],[null,1,0.05],['65.5',65.5,65.5/127],[NaN,100,100/127],[Infinity,100,100/127],[-99,1,0.05],[999,127,1]]) {
        assert.deepEqual(plain(h.api.velocity.normalizeLiveVelocity(input)),{midi,gain});
    }
});
