// Explicit application ports for the retained JavaScript hardware implementation.
// Untyped hardware internals remain confined to this optional LED boundary.
namespace PianoTrainerLegacyLed {
    export type State = Pick<LegacyAppState, 'feedbackEnabled' | 'hardwareLEDState' | 'helperVersion' |
        'ledCalibrationMode' | 'ledCalibrationSelectedMidi' | 'ledOutputMode' | 'ledReverse' | 'midiLedLowVelocity' |
        'playerPianoType' | 'wledActiveTransport' | 'wledConnectionState' | 'wledDdpDebugEnabled' | 'wledDdpLastError' |
        'wledDdpLastSendAt' | 'wledDdpLastSendOk' | 'wledHelperAvailable' | 'wledHelperStatus' | 'wledIp' | 'wledStatus' | 'wledTransport'>;
    export interface Engine {
        config: {futurePreview: number};
        init(): void;
        renderFromStates(states: Map<number, string>): void;
        renderOutputs(): void;
        getMidiVelocityForState(state: string): number;
    }
    export interface Controller {
        clearLastSignature(): void;
        forceClear(): Promise<unknown>;
        cancelReconnect(): void;
        stopHealthCheck(): void;
    }
    export interface Instance {
        LedEngine: Engine;
        WLEDController: Controller;
        activate(): void;
        dispose(): void;
        initLedCountControl(): void;
        initLedBrightnessControls(): void;
        initLedCalibrationControls(): void;
        initLedOutputControls(): void;
        updateLedKeyMapping(): void;
        positionLedCalibrationPanel(): void;
        legacyUpdateLEDHardware(midi: number, next: string | null, previous: string | null): void;
        legacyWipeHardwareLEDs(): void;
        setLedCount(value: number): void;
        setLedMasterBrightness(value: number): void;
        setLedFuture1BrightnessPct(value: number): void;
        setLedFuture2BrightnessPct(value: number): void;
        resetAllLedCalibration(): void;
        setWledIp(value: string): void;
        setLedOutputMode(value: 'none' | 'midi' | 'wled'): void;
        syncLedBrightnessControls(): void;
        syncLedOutputModeControls(): void;
        syncWledTransportControls(): void;
        syncWledStatus(): void;
        selectLedCalibrationMidi(midi: number): void;
        buildChromaticTestNotes(): number[];
    }
    export interface Ports {
        state: State;
        document: Document;
        storage: Storage;
        console: Pick<Console, 'warn'>;
        fetch: typeof fetch;
        resources: PianoTrainerLegacyLedResources.Resources;
        view: Pick<Window, 'innerHeight' | 'crypto' | 'alert' | 'confirm'>;
        keys: {
            LED_CALIBRATION_STORAGE_KEY: string; LED_COUNT_STORAGE_KEY: string;
            LED_FUTURE1_PCT_STORAGE_KEY: string; LED_FUTURE2_PCT_STORAGE_KEY: string;
            LED_MASTER_BRIGHTNESS_STORAGE_KEY: string; LED_OUTPUT_MODE_STORAGE_KEY: string; LED_REVERSE_STORAGE_KEY: string;
            WLED_DDP_DEBUG_STORAGE_KEY: string; WLED_IP_STORAGE_KEY: string;
            WLED_TRANSPORT_STORAGE_KEY: string; WLED_TRANSPORT_WARNING_ACCEPTED_STORAGE_KEY: string;
        };
        FULL_PIANO_KEY_COUNT: number;
        FULL_PIANO_MIDI_MIN: number;
        getMidiTest(): PianoTrainerMidiControls.LedTest | undefined;
        clearWledPermissionHelp(): void;
        closeToolbarPanel(panel: HTMLElement, immediate: boolean): void;
        getClampedNumber(key: string, min: number, max: number, fallback: number): number;
        getLegacyMidiOutput(id: string): PianoTrainerMidiService.Output | undefined;
        getMidiKeyPosition01(midi: number): number;
        getMidiLightsStatus(baseStatus: number): number;
        getPlayerPlayableRange(): PianoTrainerDomain.PlayerRange;
        getStoredBool(key: string, fallback: boolean): boolean;
        getWledPermissionHelpText(kind?: string): string;
        initUpdateControls(): void;
        isLikelyBrowserAccessIssue(error: unknown): boolean;
        normalizeLedCount(value: unknown): number;
        normalizeLedFuturePct(value: unknown, fallback: number): number;
        normalizeLedMasterBrightness(value: unknown): number;
        rememberOutgoingMidiMessage(status: number, note: number, velocity: number): void;
        renderVirtualKeyboard(): void;
        setStoredBool(key: string, value: boolean): void;
        showWledPermissionHelp(message: unknown): void;
        syncToolbarButtonStates(): void;
        updateConnectionStatuses(): void;
        wipeHardwareLEDs(): void;
    }
    export interface MidiTestPorts {
        state: Pick<State, 'hardwareLEDState' | 'ledOutputMode'>;
        document: Document;
        console: Pick<Console, 'warn'>;
        resources: PianoTrainerLegacyLedResources.Resources;
        LedEngine: Engine;
        buildChromaticTestNotes(): number[];
        getLegacyMidiOutput(id: string): PianoTrainerMidiService.Output | undefined;
        getMidiStatus(baseStatus: number, channel: unknown): number;
        getPlayerPlayableRange(): PianoTrainerDomain.PlayerRange;
        getSelectedMidiLightsChannel(): number;
        optionalLedOutput: Pick<PianoTrainerOptionalLed.Output, 'enabled'>;
        rememberOutgoingMidiMessage(status: number, note: number, velocity: number): void;
        renderVirtualKeyboard(): void;
        wipeHardwareLEDs(): void;
    }
    export interface MidiTestInstance {
        controller: PianoTrainerMidiControls.LedTest;
        init(): void;
        dispose(): void;
    }
}
