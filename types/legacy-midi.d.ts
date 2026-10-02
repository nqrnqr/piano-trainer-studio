declare function normalizeLiveVelocity(value: unknown): {midi: number; gain: number};
declare function triggerVirtualKey(note: number, down: boolean, source: PianoTrainerDomain.InputSource, velocity?: number): void;
declare function syncTrainerRoutingUiState(): void;
declare function initLegacyMidiLedTest(): void;
