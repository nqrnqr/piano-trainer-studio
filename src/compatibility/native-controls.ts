// No-resource composition; core calls each init at its original binding position.
const displayControls=PianoTrainerDisplayControls.create({document,window,state:AppState,
    saveZoom:value=>localStorage.setItem(TRAINER_ZOOM_STORAGE_KEY,value),hideToolbarPanels,
    reportWarning:(message,error)=>console.warn(message,error),pause:()=>pausePlaybackFromToolbar(),
    play:()=>startPlaybackFromToolbar(),reset:()=>resetPlaybackFromToolbar(),
    isReadyToRender:()=>osmdAdapter.isReady(),setZoom:value=>osmdAdapter.setZoom(value),
    clearFeedbackVisualStatePreserveScoring:()=>clearFeedbackVisualStatePreserveScoring(),
    renderScoreAndRefreshGeometry:()=>renderScoreAndRefreshGeometry(),positionCalibrationPanel:()=>optionalLedOutput.positionCalibrationPanel()});
const tempoControls=PianoTrainerTempoControls.create({document,state:AppState,hasMidiOutput:()=>!!getSelectedMidiOutOutput(),
    setBpm:value=>playbackTransport.setBpm(value),getCurrentMeasureIndex:()=>osmdAdapter.getCurrentMeasureIndexIfAvailable(),
    getWaitMeasureIndex:()=>trainerMetronome.getWaitMeasureIndex(),rebuildWaitModeMetronome:index=>rebuildWaitModeMetronome(index),
    saveBool:(key,value)=>setStoredBool(({accentedDownbeat:ACCENTED_DOWNBEAT_STORAGE_KEY,visualPulse:VISUAL_PULSE_STORAGE_KEY,
        metronomeMidiOut:METRONOME_MIDIOUT_STORAGE_KEY})[key],value),
    clearTempoVisualPulse:()=>clearTempoVisualPulse(),clearScheduledMetronomeEvents:()=>clearScheduledMetronomeEvents(),stopWaitModeMetronome:()=>stopWaitModeMetronome()});
const audioLevelControls=PianoTrainerAudioLevelControls.create({document,state:AppState,
    save:(key,value)=>localStorage.setItem(({pianoVolume:TRAINER_PIANO_VOL_STORAGE_KEY,midiOutVolume:TRAINER_MIDIOUT_VOL_STORAGE_KEY,
        midiInBoost:TRAINER_MIDIIN_BOOST_STORAGE_KEY,metroVolume:METRONOME_VOL_STORAGE_KEY})[key],value),
    setPianoVolume:value=>audioOutput.setPianoVolume(value),sendMidiOutExpressionLevel:value=>sendMidiOutExpressionLevel(value),
    setMetronomeVolumeDecibels:value=>metronomeOutput.setVolumeDecibels(value)});
const loopControls=PianoTrainerLoopControls.create({document,window,state:AppState,renderLooper:()=>renderLooper(),
    enforceLooperBounds:()=>enforceLooperBounds(),saveLoopCountIn:value=>setStoredBool(LOOP_COUNT_IN_STORAGE_KEY,value)});
const isFullscreenActive=displayControls.isFullscreenActive;
const syncFullscreenUi=displayControls.syncFullscreenUi;
const requestAppFullscreen=displayControls.requestAppFullscreen;
const exitAppFullscreen=displayControls.exitAppFullscreen;
const updatePlayPauseButton=displayControls.updatePlayPauseButton;
const preserveMusicAreaScroll=displayControls.preserveMusicAreaScroll;
const syncZoomControls=displayControls.syncZoomControls;
const applyZoom=displayControls.applyZoom;
const syncTempoMetronomeDependentUi=tempoControls.syncTempoMetronomeDependentUi;
const updateTempo=tempoControls.updateTempo;
const updatePianoVolume=audioLevelControls.updatePianoVolume;
const updateMidiOutVolume=audioLevelControls.updateMidiOutVolume;
const updateMidiInBoost=audioLevelControls.updateMidiInBoost;
const updateMetroVolume=audioLevelControls.updateMetroVolume;
const syncMidiInBoostUi=audioLevelControls.syncMidiInBoostUi;
const syncLooperDependentUi=loopControls.syncLooperDependentUi;
