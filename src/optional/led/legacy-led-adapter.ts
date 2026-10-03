// The core depends on this output port. Hardware and LED UI stay in legacy JS.
namespace PianoTrainerOptionalLed {
    export interface Output {
        readonly enabled: boolean;
        initControls(): void;
        initOutput(): void;
        refreshMapping(): void;
        invalidate(): void;
        positionCalibrationPanel(): void;
        render(states: Map<number, string>, previewDepth?: number): void;
        renderOutputs(): void;
        updateHardware(midi: number, next: string | null, previous: string | null): void;
        wipeHardware(): void;
        clearOutputs(): Promise<void>;
        start(): void;
        dispose(): void;
    }
    export interface LegacyPorts {
        initControls(): void;
        initOutput(): void;
        refreshMapping(): void;
        invalidate(): void;
        positionCalibrationPanel(): void;
        render(states: Map<number, string>, previewDepth?: number): void;
        renderOutputs(): void;
        updateHardware(midi: number, next: string | null, previous: string | null): void;
        wipeHardware(): void;
        clearOutputs(): Promise<void>;
        isCalibrating(): boolean;
        renderKeyboard(): void;
        requestFrame(callback: FrameRequestCallback): number;
        cancelFrame(id: number): void;
        stopHardwareResources(): void;
    }

    export function createNoop(): Output {
        const noop = () => {};
        return { enabled:false, initControls:noop, initOutput:noop, refreshMapping:noop, invalidate:noop,
            positionCalibrationPanel:noop, render:noop, renderOutputs:noop,
            updateHardware:noop, wipeHardware:noop, clearOutputs:async () => {},
            start:noop, dispose:noop };
    }

    export function createLegacy(ports: LegacyPorts): Output {
        let rafId: number | null = null;
        let running = false;
        let active = true;
        let generation = 0;
        function tick(token: number) {
            if (!running || token !== generation) return;
            if (ports.isCalibrating()) ports.renderKeyboard();
            else ports.renderOutputs();
            rafId = ports.requestFrame(() => tick(token));
        }
        return {
            enabled:true,
            initControls: () => { active = true; ports.initControls(); },
            initOutput: () => { active = true; ports.initOutput(); },
            refreshMapping: () => ports.refreshMapping(),
            invalidate: () => ports.invalidate(),
            positionCalibrationPanel: () => ports.positionCalibrationPanel(),
            render: (states, depth) => ports.render(states, depth),
            renderOutputs: () => ports.renderOutputs(),
            updateHardware: (midi, next, previous) => ports.updateHardware(midi, next, previous),
            wipeHardware: () => ports.wipeHardware(),
            clearOutputs: () => ports.clearOutputs(),
            start() {
                if (running) return;
                active = true;
                running = true;
                const token = generation;
                rafId = ports.requestFrame(() => tick(token));
            },
            dispose() {
                if (!active) return;
                active = false;
                generation += 1;
                running = false;
                if (rafId !== null) ports.cancelFrame(rafId);
                rafId = null;
                ports.stopHardwareResources();
            }
        };
    }
}
