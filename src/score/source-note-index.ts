// Structural identity within a cloned measure. Pitch is a validation value, never a key.
export namespace PianoTrainerSourceNoteIndex {
    export interface IndexedNote {note: PianoTrainerOsmdVendor.Note; staffIndex: number; structureKey: string;}
    export function measure(measure: PianoTrainerOsmdVendor.SourceMeasure): Map<string, IndexedNote> {
        const result = new Map<string, IndexedNote>();
        for (const [containerIndex, container] of (measure.VerticalSourceStaffEntryContainers || []).entries()) {
            for (const [staffIndex, staff] of container.StaffEntries.entries()) {
                for (const [voiceIndex, voice] of (staff?.VoiceEntries || []).entries()) {
                    for (const [noteIndex, note] of voice.Notes.entries()) {
                        const structureKey = `${staffIndex}/${containerIndex}/${voiceIndex}/${noteIndex}`;
                        result.set(structureKey, {note, staffIndex, structureKey});
                    }
                }
            }
        }
        return result;
    }
}
