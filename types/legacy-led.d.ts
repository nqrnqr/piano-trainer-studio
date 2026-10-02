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
declare function renderVirtualKeyboard(): void;
