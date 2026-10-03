const assert=require('node:assert/strict');const {test}=require('node:test');
const {harness,Select,event,Node}=require('../helpers/preference-controls-harness.cjs');
const plain=value=>JSON.parse(JSON.stringify(value));
test('staff parsing keeps decimal prefix and null behavior, right-hand precedence and empty staff fallback',()=>{
 const h=harness(),domain=h.api('PianoTrainerHandRouting');
 for(const [value,expected]of [['',null],['-',null],[null,null],[undefined,null],['2staff',2],['0x10',null],['1.9',1],[-3,null],[Infinity,null]])assert.equal(domain.parseAssignment(value),expected);
 assert.deepEqual(plain(domain.defaultAssignment(0)),{left:2,right:1});assert.deepEqual(plain(domain.defaultAssignment(1)),{left:null,right:1});
 h.state.hands.left=1;assert.equal(h.routing.getAssignedHandRoleForStaff(1),'right');h.state.hands.right=null;assert.equal(h.routing.getAssignedHandRoleForStaff(null),'right');assert.equal(h.routing.getAssignedHandRoleForStaff(NaN),null);
});
test('Follow normalizes ambiguous practice pairs while invalid modes and missing mode settings retain fallback',()=>{
 const h=harness(),practice=h.state.practice,playback=h.state.playback;
 for(const [left,right]of [[false,false],[true,true],[true,false],[false,true]]){h.state.mode='follow';Object.assign(h.state.modeSettings.follow.practice,{left,right});h.routing.syncActiveHandStateFromMode();assert.equal(h.state.practice.left,left&&!right);assert.equal(h.state.playback.right,left&&!right);assert.equal(h.state.practice.right,!h.state.practice.left);}
 h.state.mode='saved-invalid';delete h.state.modeSettings.realtime;h.routing.syncActiveHandStateFromMode();assert.deepEqual(h.state.practice,{left:true,right:true});assert.equal(h.state.practice,practice);assert.equal(h.state.playback,playback);assert.equal(h.state.mode,'saved-invalid');
});
test('mode event preserves pause/clear/latency/read-level ordering and ignores unchecked or invalid targets',()=>{
 const h=harness();h.practice.initModeAndFeedback();h.state.countInActive=true;h.nodes.get('val-piano-vol').value='37';h.nodes.get('val-metro-vol').value='19';
 h.change('mode-follow',true);assert.equal(h.state.mode,'follow');assert.deepEqual(plain(h.effects),[['pause'],['mode','follow'],['clear-metronome'],['stop-wait'],['silence'],['transient',{clearVisualState:true}],['latency'],['tempo-ui'],['latency'],['piano','37'],['metro','19']]);
 h.effects.length=0;h.change('mode-realtime',false);h.nodes.get('mode-wait').dispatch(event('change'),new Node());assert.equal(h.effects.length,0);
});
test('Follow cannot uncheck its selected practice hand; Wait playback rejects edits without rewriting audio preferences',()=>{
 const h=harness();h.practice.init();h.state.mode='follow';h.practice.applyModeSettings();h.effects.length=0;
 h.change('practice-rh',false);assert.equal(h.nodes.get('practice-rh').checked,true);assert.equal(h.effects.length,0);
 h.change('practice-lh',true);assert.equal(h.state.practice.left,true);assert.equal(h.state.playback.right,true);assert.equal(h.nodes.get('practice-rh').checked,false);
 h.state.audioEnabled.hands=false;h.nodes.get('enable-hand-staves').checked=false;h.state.mode='wait';h.practice.applyModeSettings();h.change('enable-staff-lh',true);assert.equal(h.nodes.get('enable-staff-lh').checked,false);assert.equal(h.state.audioEnabled.hands,false);assert.equal(h.nodes.get('enable-hand-staves').checked,false);
 h.state.mode='realtime';h.change('practice-lh',false);h.change('enable-staff-rh',false);assert.equal(h.state.modeSettings.realtime.practice.left,false);assert.equal(h.state.modeSettings.realtime.playback.right,false);assert.equal(h.state.modeSettings.wait.practice.left,true);
});
test('routing summary strips Disconnected suffix and keeps the final routing sync override in Wait',()=>{
 const h=harness();h.practicePorts.getSelectedMidiOutOutput=()=>({id:'out'});h.nodes.get('midi-out').selectedOptions=[{textContent:'Keyboard (Disconnected)'}];h.state.mode='wait';h.practice.applyModeSettings();
 assert.equal(h.nodes.get('trainer-midi-out-summary').textContent,'Send playback and input to Keyboard.');assert.equal(h.nodes.get('enable-midiout-other').disabled,false);assert.equal(h.nodes.get('enable-other').disabled,true);
 h.practicePorts.getSelectedMidiOutOutput=()=>null;h.practice.syncTrainerRoutingUiState();assert.equal(h.nodes.get('enable-midiout-other').disabled,true);assert.equal(h.nodes.get('trainer-midi-out-summary').textContent,'No MIDI device selected.');
});
test('future/feedback/keyboard and routing changes retain state, storage and command order',()=>{
 const h=harness();h.practice.init();h.effects.length=0;h.change('check-future-preview',false);assert.deepEqual(plain(h.effects),[['bool','futurePreview',false],['keyboard']]);assert.equal(h.state.futurePreviewDepth,1);
 h.effects.length=0;h.change('check-feedback',false);assert.deepEqual(plain(h.effects),[['bool','feedback',false],['clear-feedback'],['debug-ui']]);
 h.effects.length=0;h.change('check-keyboard',true);assert.deepEqual(plain(h.effects),[['bool','keyboard',true],['keyboard'],['position'],['resize']]);
 h.effects.length=0;h.change('enable-instrument',true);h.change('check-low-latency-playback',false);assert.deepEqual(plain(h.effects),[['bool','audioInstrument',true],['boost-ui'],['bool','lowLatencyPlayback',false],['release-latency']]);
 h.nodes.delete('check-future-preview');h.practice.dispose();h.practice.initFuturePreview();assert.equal(h.nodes.get('check-correct-highlight').listeners.length,0);
});
test('practice controls init once and disposal invalidates saved callbacks across reinit without erasing external markers',()=>{
 const h=harness();h.practice.init();const count=h.count(),saved=h.nodes.get('practice-lh').listeners[0].handler;h.practice.init();assert.equal(h.count(),count);
 h.practice.dispose();assert.equal(h.count(),0);assert.equal(h.nodes.get('check-correct-highlight').dataset.boundCorrectHighlight,undefined);h.practice.init();assert.equal(h.count(),count);h.effects.length=0;
 saved({target:h.nodes.get('practice-lh')});assert.equal(h.effects.length,0);h.practice.dispose();h.nodes.get('check-correct-highlight').dataset.boundCorrectHighlight='external';h.practice.initFuturePreview();h.practice.dispose();assert.equal(h.nodes.get('check-correct-highlight').dataset.boundCorrectHighlight,'external');
});
test('staff commit preserves note arrays for invalid/no-refresh inputs and builds one captured frame in order',()=>{
 const h=harness(),notes=h.state.expectedNotes;h.hand.commit(3,null,true);assert.equal(h.state.hands.left,2);assert.equal(h.state.expectedNotes,notes);
 h.hand.commit(null,1,false);assert.equal(h.state.expectedNotes,notes);assert.equal(h.state.ledPreviewTimelineDirty,true);assert.deepEqual(h.effects,[['keyboard']]);
 h.effects.length=0;h.handPorts.captureCurrentFrame=()=>({hasEntries:true,measureIndex:0,buildExpected:()=>h.effects.push(['build']),renderKeyboard:()=>h.effects.push(['frame-render'])});h.hand.commit(2,1,true);assert.deepEqual(h.effects,[['build'],['frame-render']]);
 h.handPorts.captureCurrentFrame=()=>({hasEntries:false,measureIndex:0});h.hand.commit(2,1,true);assert.deepEqual(plain([h.state.expectedNotes,h.state.visualNotesToStart,h.state.outOfRangeCurrentNotes]),[[],[],[]]);
});
test('staff select bindings deduplicate and dispose only owned markers, wrong select type fails clearly',()=>{
 const h=harness();h.nodes.get('assign-lh').value='3staff';h.nodes.get('assign-rh').value='1';h.assign.init();h.assign.init();h.nodes.get('assign-lh').dispatch(event('change'));assert.equal(h.state.hands.left,3);assert.equal(h.nodes.get('assign-rh').listeners.length,1);
 const saved=h.nodes.get('assign-lh').listeners[0].handler;h.assign.dispose();assert.equal(h.nodes.get('assign-lh').listeners.length,0);assert.equal(h.nodes.get('assign-lh').dataset.boundHandAssign,undefined);h.assign.init();h.effects.length=0;saved(event('change'));assert.equal(h.effects.length,0);h.assign.dispose();h.nodes.get('assign-lh').dataset.boundHandAssign='true';h.assign.init();h.assign.dispose();assert.equal(h.nodes.get('assign-lh').dataset.boundHandAssign,'true');
 h.add('assign-rh',Node);assert.throws(()=>h.assign.syncHandAssignmentFromControls(),/Invalid trainer control: assign-rh/);
});
test('persisted apply retains invalid mode, clamped values, forced preferences and original level/zoom/debug sequence',()=>{
 const h=harness(),storage=h.context.localStorage;storage.setItem(h.keys.TRAINER_MODE_STORAGE_KEY,'saved-invalid');storage.setItem(h.keys.TRAINER_MIDIOUT_VOL_STORAGE_KEY,'999');storage.setItem(h.keys.TRAINER_MIDIIN_BOOST_STORAGE_KEY,'25');storage.setItem(h.keys.TRAINER_FEEDBACK_STORAGE_KEY,'false');
 h.preferences.applyPersistedTrainerAndSettingsPreferences();assert.equal(h.state.mode,'saved-invalid');assert.equal(h.nodes.get('mode-realtime').checked,true);assert.equal(h.state.midiOutVolume,100);assert.equal(h.state.midiInBoost,50);assert.equal(h.state.feedbackEnabled,false);assert.equal(storage.getItem(h.keys.TRAINER_INPUT_VELOCITY_STORAGE_KEY),'true');assert.equal(storage.getItem(h.keys.TRAINER_ZOOM_STORAGE_KEY),'100');
 assert.deepEqual(plain(h.effects),[['boost-ui'],['piano',80],['midi-volume',100,{save:false}],['boost',50,{save:false}],['zoom-ui',100],['zoom',100,{save:false}],['fullscreen-ui'],['debug',false,{clearHistory:true,logChange:false,reason:'startup-persisted'}],['metro',25,{save:false}]]);
});
test('reset defaults preserves native MIDI change order, staff defaults and optional device reload command',()=>{
 const h=harness();for(const id of ['midi-in','midi-out','midi-out-channel','midi-lights','midi-lights-channel'])h.nodes.get(id).addEventListener('change',()=>h.effects.push(['change',id,h.nodes.get(id).value]));
 h.state.mode='follow';h.preferences.restoreDefaultPreferences({reloadDevices:false});assert.equal(h.state.mode,'realtime');assert.deepEqual(plain(h.state.modeSettings.follow),{practice:{left:false,right:true},playback:{left:true,right:false}});assert.equal(h.nodes.get('assign-lh').value,'2');assert.equal(h.state.hands.right,1);
 assert.deepEqual(h.effects.filter(x=>x[0]==='change'),[['change','midi-in','none'],['change','midi-out','none'],['change','midi-out-channel','1'],['change','midi-lights','none'],['change','midi-lights-channel','1']]);assert.ok(!h.effects.some(x=>x[0]==='devices'));assert.deepEqual(h.effects.slice(-4),[['led-ui'],['loop'],['keyboard'],['position']]);
 h.effects.length=0;h.preferences.restoreDefaultPreferences();assert.deepEqual(h.effects.at(-1),['devices']);
});
test('settings actions keep clear/click/import/clear ordering, reset confirmation and owned lifecycle',()=>{
 const h=harness();h.settings.init();h.settings.init();assert.equal(h.count(),4);const input=h.nodes.get('input-settings-import'),file={name:'settings.json'};input.value='old';input.addEventListener('click',()=>h.effects.push(['picker',input.value]));h.nodes.get('btn-import-settings').click();assert.deepEqual(h.effects,[['picker','']]);
 input.files=[file];input.value='path';h.change('input-settings-import');assert.deepEqual(h.effects.at(-1),['import',file]);assert.equal(input.value,'');h.settingsPorts.confirm=()=>false;h.nodes.get('btn-reset-preferences').click();assert.ok(!h.effects.some(x=>x[0]==='reset'));h.settingsPorts.confirm=()=>true;h.nodes.get('btn-reset-preferences').click();assert.deepEqual(h.effects.at(-1),['reset']);
 const saved=h.nodes.get('btn-backup-settings').listeners[0].handler;h.settings.dispose();assert.equal(h.count(),1);h.settings.init();h.effects.length=0;saved(event('click'));assert.equal(h.effects.length,0);h.nodes.get('btn-backup-settings').click();assert.deepEqual(h.effects,[['download']]);
});
