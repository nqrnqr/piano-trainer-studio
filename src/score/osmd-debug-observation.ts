
// Vendor observations for diagnostics only; no matching or anchor-placement rules.
export namespace PianoTrainerOsmdDebugObservation {
    export function describeLogicalNoteForDebug(note: PianoTrainerOsmdVendor.Note | null | undefined,
        measureIndex: number | null = null, staffIndex: number | null = null) {
        const voice = note?.ParentVoiceEntry;
        return {
            measureIndex, staffIndex,
            staffId: note?.ParentStaff?.id ?? null,
            midi: note?.halfTone != null ? note.halfTone + 12 : null,
            halfTone: note?.halfTone ?? null,
            length: note?.Length?.RealValue ?? null,
            timestamp: voice?.Timestamp?.RealValue ?? null,
            isRest: !!(note?.isRest && note.isRest()),
            hasTie: !!note?.NoteTie
        };
    }
    export function describeGraphicalNoteForDebug(gn: PianoTrainerOsmdVendor.GraphicalNote | null | undefined) {
        const src = gn?.sourceNote, shape = gn?.PositionAndShape;
        return {
            midi: src?.halfTone != null ? src.halfTone + 12 : null,
            halfTone: src?.halfTone ?? null,
            staffId: src?.ParentStaff?.id ?? null,
            timestamp: src?.ParentVoiceEntry?.Timestamp?.RealValue ?? null,
            length: src?.Length?.RealValue ?? null,
            absX: shape?.AbsolutePosition?.x ?? null,
            absY: shape?.AbsolutePosition?.y ?? null,
            width: shape?.Size?.width ?? null,
            height: shape?.Size?.height ?? null
        };
    }
}
