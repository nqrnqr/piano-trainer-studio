import type {createServices} from '../app/services';

type Services=ReturnType<typeof createServices>;
export function createPreferenceChecks(getServices:() => Services) {
    let realtime:Services['AppState']['modeSettings']['realtime']|null=null;
    let inputs:{pressed:Services['AppState']['pressedKeys'];reservations:Services['AppState']['earlyGraceReservations']}|null=null;
    const controllers=() => {const s=getServices();return [s.practiceControls,s.handAssignmentControls,s.settingsActions];};
    return {clear:() => {realtime=null;inputs=null;},commands:Object.freeze({
        init:() => {for(const controller of controllers())controller.init();},
        dispose:() => {for(const controller of controllers())controller.dispose();},
        applySaved:() => getServices().preferenceControls.applyPersistedTrainerAndSettingsPreferences(),
        restoreDefaults:() => getServices().preferenceControls.restoreDefaultPreferences({reloadDevices:false}),
        setFeedback:(value:boolean) => {getServices().AppState.feedbackEnabled=value;},
        captureRealtime:() => {realtime=getServices().AppState.modeSettings.realtime;},
        captureInputs:() => {const state=getServices().AppState;inputs={pressed:state.pressedKeys,reservations:state.earlyGraceReservations};},
        readSnapshot:() => {
            const s=getServices(),state=s.AppState;
            return {mode:state.mode,practice:{...state.practice},playback:{...state.playback},audio:{...state.audioEnabled},midi:{...state.midiOutEnabled},
                lowLatency:state.lowLatencyPlaybackEnabled,fullscreenOnPlay:state.fullscreenOnPlay,
                futurePreview:state.futurePreviewEnabled,futureDepth:state.futurePreviewDepth,previewEvents:state.lastLedPreviewEvents.length,
                correctHighlight:state.correctHighlightEnabled,feedback:state.feedbackEnabled,hands:{...state.hands},
                timelineDirty:state.ledPreviewTimelineDirty,expectedRoles:state.expectedNotes.map(note => s.handRouting.getAssignedHandRoleForStaff(note.staffId)),
                midiOutVolume:state.midiOutVolume,midiInBoost:state.midiInBoost,inputVelocity:state.inputVelocityEnabled,
                liveLowLatency:state.liveLowLatencyMonitoringEnabled,horizontal:s.ScoreDisplay.isHorizontal(),zoom:state.zoom,
                realtimeSame:!!realtime&&realtime===state.modeSettings.realtime,
                pressedSame:!!inputs&&inputs.pressed===state.pressedKeys,reservationsSame:!!inputs&&inputs.reservations===state.earlyGraceReservations};
        }
    })};
}
