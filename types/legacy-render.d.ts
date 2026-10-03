// Transitional callbacks supplied by still-unmigrated feedback/core/debug JS.
declare let osmd: PianoTrainerOsmdVendor.Renderer;
interface Window { clearStickyDebug?: () => void; FeedbackDebug?: {
    renderStickyDebug(): void; clearSvgDebug(): void;
    pushStickyDebugFrame?(frame: PianoTrainerDomain.FeedbackFrameInput): void;
}; }
