const vm=require('node:vm');
const {harness:base,Node,Input,Button,event}=require('./native-controls-harness.cjs');
const {runScript}=require('./legacy-script.cjs');
const {storage}=require('./state-harness.cjs');
class Select extends Node {constructor(id){super(id);this.value='';this.selectedOptions=[];}}
function harness(){
 const h=base();h.context.HTMLSelectElement=Select;h.context.Event=class{constructor(type){this.type=type;}};
 Node.prototype.dispatchEvent=function(e){this.dispatch(e);return true;};Node.prototype.click=function(){this.dispatch(event('click'));};
 for(const id of ['mode-realtime','mode-wait','mode-follow','check-keyboard','check-feedback','check-future-preview','check-correct-highlight','practice-lh','practice-rh','enable-staff-lh','enable-staff-rh','enable-hand-staves','enable-other','enable-instrument','enable-virtual-keyboard','enable-midiout-hand-staves','enable-midiout-other','enable-midiout-instrument','enable-midiout-virtual-keyboard','check-autoscroll','check-fullscreen-on-play','check-low-latency-playback','input-settings-import'])h.add(id,Input);
 for(const id of ['assign-lh','assign-rh','midi-in','midi-out','midi-out-channel','midi-lights','midi-lights-channel'])h.add(id,Select);
 for(const id of ['virtual-keyboard-container','trainer-midi-out-summary','trainer-midiout-card','trainer-midi-out-summary-hint','practice-playback-row','practice-wait-note-row','practice-wait-note'])h.add(id);
 for(const id of ['btn-backup-settings','btn-import-settings','btn-reset-preferences'])h.add(id,Button);
 for(const node of h.nodes.values())node.label=new Node();
 const radios=['mode-realtime','mode-wait','mode-follow'].map(id=>h.nodes.get(id));radios.forEach(node=>node.value=node.id.slice(5));
 h.document.querySelectorAll=()=>radios;h.document.querySelector=()=>h.nodes.get('practice-playback-row');
 Object.assign(h.state,{mode:'realtime',hands:{left:2,right:1},practice:{left:true,right:true},playback:{left:true,right:true},
 modeSettings:{realtime:{practice:{left:true,right:true},playback:{left:true,right:true}},wait:{practice:{left:true,right:true},playback:{left:false,right:false}},follow:{practice:{left:false,right:true},playback:{left:true,right:false}}},
 audioEnabled:{hands:true,other:false,instrument:false,virtual:true},midiOutEnabled:{hands:false,other:false,instrument:false,virtual:false},
 feedbackEnabled:true,futurePreviewEnabled:true,futurePreviewDepth:1,correctHighlightEnabled:true,lastLedPreviewEvents:[],fullscreenOnPlay:false,lowLatencyPlaybackEnabled:false,
 expectedNotes:[{midi:60}],visualNotesToStart:[{midi:60}],outOfRangeCurrentNotes:[{midi:20}],ledPreviewTimelineDirty:false});
 for(const file of ['domain/hand-routing','app/hand-assignment-controller','ui/hand-assignment-controls','ui/practice-controls','ui/preference-controls','ui/settings-actions','state/preference-keys'])runScript(h.context,`js/generated/${file}.js`);
 h.context.localStorage=storage();h.context.sessionStorage=storage();
 runScript(h.context,'js/generated/domain/preference-values.js');runScript(h.context,'js/generated/state/preferences.js');
 const startupPreferences=h.api('PianoTrainerPreferences').create({state:h.state,storage:h.context.localStorage,session:h.context.sessionStorage,keys:h.api('PREFERENCE_STORAGE_KEYS'),resettableKeys:h.api('RESETTABLE_PREFERENCE_KEYS')});
 Object.assign(h.context,startupPreferences);
 const keys=vm.runInContext('PREFERENCE_STORAGE_KEYS',h.context),routing=h.api('PianoTrainerHandRouting').create(h.state);
 const trace=name=>(...args)=>h.effects.push([name,...args]);
 const practicePorts={document:h.document,state:h.state,routing,getSelectedMidiOutOutput:()=>null,
 syncTempoMetronomeDependentUi:trace('tempo-ui'),applyToneLatencyProfileForMode:trace('latency'),
 saveBool:trace('bool'),saveMode:trace('mode'),pause:trace('pause'),clearScheduledMetronomeEvents:trace('clear-metronome'),
 stopWaitModeMetronome:trace('stop-wait'),silencePlaybackOutputsImmediately:trace('silence'),clearTransientPlaybackState:trace('transient'),
 readPianoVolume:()=>h.nodes.get('val-piano-vol').value||80,readMetroVolume:()=>h.nodes.get('val-metro-vol').value||50,
 updatePianoVolume:trace('piano'),updateMetroVolume:trace('metro'),renderKeyboard:trace('keyboard'),clearSvgFeedback:trace('clear-feedback'),
 renderFeedbackOverlay:trace('overlay'),syncSettingsDebugVisibility:trace('debug-ui'),positionCalibrationPanel:trace('position'),
 dispatchResize:trace('resize'),releaseLowLatencyPlayback:trace('release-latency'),syncMidiInBoostUi:trace('boost-ui')};
 const practice=h.api('PianoTrainerPracticeControls').create(practicePorts);
 const handPorts={state:h.state,renderKeyboard:trace('keyboard'),captureCurrentFrame:()=>null};
 const hand=h.api('PianoTrainerHandAssignment').create(handPorts);
 const assign=h.api('PianoTrainerHandAssignmentControls').create({document:h.document,commit:hand.commit});
 const preferencePorts={document:h.document,state:h.state,storage:h.context.localStorage,keys,
 getStoredBool:h.context.getStoredBool,getClampedNumber:h.context.getClampedNumber,setStoredBool:h.context.setStoredBool,clearSavedPreferences:h.context.clearSavedPreferences,
 syncActiveHandStateFromMode:routing.syncActiveHandStateFromMode,syncMidiInBoostUi:trace('boost-ui'),updatePianoVolume:trace('piano'),
 updateMidiOutVolume:trace('midi-volume'),updateMidiInBoost:trace('boost'),syncZoomControls:trace('zoom-ui'),applyZoom:trace('zoom'),syncFullscreenUi:trace('fullscreen-ui'),
 setDebugEnabled:trace('debug'),updateMetroVolume:trace('metro'),syncTempoMetronomeDependentUi:trace('tempo-ui'),setPlayerPianoType:trace('piano-type'),
 getDefaultStaffAssignment:()=>({left:2,right:1}),syncHandAssignmentFromControls:assign.syncHandAssignmentFromControls,applyModeSettings:practice.applyModeSettings,
 setScoreLayout:trace('layout'),resetLedPreferences:trace('led-reset'),syncLedPreferenceControls:trace('led-ui'),positionCalibrationPanel:trace('position'),
 renderLooper:trace('loop'),renderVirtualKeyboard:trace('keyboard'),populateMIDIDevices:trace('devices')};
 const preferences=h.api('PianoTrainerPreferenceControls').create(preferencePorts);
 const settingsPorts={document:h.document,downloadSettingsBackup:trace('download'),handleSettingsBackupImportFile:trace('import'),confirm:()=>true,restoreDefaultPreferences:trace('reset')};
 const settings=h.api('PianoTrainerSettingsActions').create(settingsPorts);
 return {...h,keys,routing,practice,practicePorts,hand,handPorts,assign,preferences,preferencePorts,settings,settingsPorts,radios,
 change:(id,checked)=>{const node=h.nodes.get(id);if(checked!==undefined)node.checked=checked;node.dispatch(event('change'));},
 count:()=>[...h.nodes.values()].reduce((n,node)=>n+node.listeners.length,0)};
}
module.exports={harness,Select,event,Node,Input,Button};
