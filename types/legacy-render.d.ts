// Transitional callbacks supplied by still-unmigrated feedback/core/debug JS.
declare let osmd: PianoTrainerOsmdVendor.Renderer;
declare function describeLogicalNoteForDebug(note: PianoTrainerOsmdVendor.Note, measureIndex: number, staffIndex: number): Readonly<Record<string, unknown>>;
declare function describeGraphicalNoteForDebug(note: PianoTrainerOsmdVendor.GraphicalNote): Readonly<Record<string, unknown>>;
declare function debugLogAnchorResolution(name: string, detail: Readonly<Record<string, unknown>>): void;
declare function clearFeedbackVisualStatePreserveScoring(): void;
interface Window { clearStickyDebug?: () => void; FeedbackDebug?: {
    renderStickyDebug(): void; clearSvgDebug(): void;
    pushStickyDebugFrame?(frame: PianoTrainerDomain.FeedbackFrameInput): void;
}; }
