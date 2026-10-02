declare function getResolvedStaffAssignmentIdFromEntry(entry: PianoTrainerScoreTraversal.VoiceEntry): number | null;
declare function getMeasureTimingInfo(measureIndex: number | undefined): PianoTrainerTiming.MeasureTimingInfo | null | undefined;
declare function updateScoreDisplay(): void;
declare function renderVirtualKeyboard(): void;
declare function selectLedCalibrationMidi(midi: number): void;
declare function checkWaitModeAdvance(): void;
