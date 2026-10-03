// Only the still-unmigrated classic core supplies these callbacks.
declare function getLegacyTraversalCursor(): PianoTrainerScoreTraversal.Cursor | null | undefined;
declare function getResolvedStaffAssignmentIdFromNote(note: PianoTrainerScoreTraversal.Note): number | null;
declare function isPracticeHandEnabledForStaff(staffId: number | null): boolean;
declare function debugLogEvent(name: string, detail: Readonly<Record<string, unknown>>): void;
