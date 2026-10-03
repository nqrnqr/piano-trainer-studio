interface Window {
    __PT_BOOT_OPTIONS__?: {ledEnabled?: boolean};
    MidiLedTestController?: PianoTrainerMidiControls.LedTest;
}
declare const LedEngine: {
    config: {futurePreview: number};
    init(): void;
    renderFromStates(states: Map<number, string>): void;
    renderOutputs(): void;
};
declare const WLEDController: {
    clearLastSignature(): void;
    forceClear(): Promise<void>;
    cancelReconnect(): void;
    stopHealthChecks(): void;
};
declare function initLedCountControl(): void;
declare function initLedBrightnessControls(): void;
declare function initLedCalibrationControls(): void;
declare function initLedOutputControls(): void;
declare function updateLedKeyMapping(): void;
declare function positionLedCalibrationPanel(): void;
declare function legacyUpdateLEDHardware(midi: number, next: string | null, previous: string | null): void;
declare function legacyWipeHardwareLEDs(): void;
declare function renderVirtualKeyboard(entries?: PianoTrainerScoreTraversal.VoiceEntry[], measureIndex?: number | null, timestamp?: number | null): void;
declare function setLedCount(value: number): void;
declare function setLedMasterBrightness(value: number): void;
declare function setLedFuture1BrightnessPct(value: number): void;
declare function setLedFuture2BrightnessPct(value: number): void;
declare function resetAllLedCalibration(): void;
declare function setWledIp(value: string): void;
declare function setLedOutputMode(value: 'none' | 'midi' | 'wled'): void;
declare function syncLedBrightnessControls(): void;
declare function syncLedOutputModeControls(): void;
