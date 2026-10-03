import type {PianoTrainerDomain} from '../domain/model';
import {derivePlayerRangeFromKeyboardSize, getPlayableRangePosition01, isMidiInPlayableRange} from '../domain/playable-range';
import type {LegacyAppState} from './model';
// Per-application range cache; pure range calculations remain in domain.
export namespace PianoTrainerPlayerRange {
    export function create(AppState: Pick<LegacyAppState, 'playerRange' | 'playerPianoType' | 'outOfRangeCurrentNotes'>) {
        // Shared cache / legacy forwarding for keyboard, grading and preview consumers.
        function getPlayerPlayableRange(): PianoTrainerDomain.PlayerRange {
            if (!AppState.playerRange || AppState.playerRange.keyCount !== AppState.playerPianoType) {
                AppState.playerRange = derivePlayerRangeFromKeyboardSize(AppState.playerPianoType);
            }
            return AppState.playerRange;
        }
        function isCurrentOutOfRangeScoreNote(midi: unknown): boolean {
            return AppState.outOfRangeCurrentNotes.some(note => Number(note.midi) === Number(midi));
        }
        function isMidiInPlayerRange(midi: unknown): boolean {
            return isMidiInPlayableRange(midi, getPlayerPlayableRange());
        }
        function getMidiKeyPosition01(midi: unknown): number {
            return getPlayableRangePosition01(midi, getPlayerPlayableRange());
        }
        return { getPlayerPlayableRange, isCurrentOutOfRangeScoreNote, isMidiInPlayerRange, getMidiKeyPosition01 };
    }
}
