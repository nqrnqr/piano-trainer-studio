import type {createServices} from '../app/services';

// Observe the retained hardware factory through its explicit typed boundary.
export function createLedChecks(getServices:() => ReturnType<typeof createServices>) {
    return Object.freeze({
        init:() => {
            const output=getServices().optionalLedOutput;
            output.initControls();output.initOutput();output.start();
        },
        initControls:() => getServices().optionalLedOutput.initControls(),
        dispose:() => getServices().optionalLedOutput.dispose(),
        selectKey:(midi:number) => getServices().legacyLed.selectLedCalibrationMidi(midi),
        readOffset:(midi:number) => getServices().legacyLed.getLedCalibrationOffsetForMidi(midi),
        importCalibration:(file:File) => getServices().legacyLed.handleLedCalibrationImportFile(file),
        setCalibration:(enabled:boolean) => {getServices().AppState.ledCalibrationMode=enabled;},
        setTarget:(mode:'none'|'wled',ip:string) => {
            const state=getServices().AppState;state.ledOutputMode=mode;state.wledIp=ip;
        },
        ensureSolidMode:() => getServices().legacyLed.WLEDController.ensureSolidMode(),
        readSnapshot:() => {
            const services=getServices(),controller=services.legacyLed.WLEDController;
            return {enabled:services.optionalLedOutput.enabled,calibration:services.AppState.ledCalibrationMode,
                frameLength:services.legacyLed.LedEngine.frame.length,status:services.AppState.wledStatus,
                reconnectStopped:controller.reconnectTimer===null,healthCheckStopped:controller.healthCheckTimer===null,
                sourceMeasures:services.osmdAdapter.getSourceMeasureCount()};
        },
        readResources:() => {
            const services=getServices();
            return {led:services.legacyLedResources.snapshot(),midi:services.legacyMidiLedTestResources.snapshot()};
        }
    });
}
