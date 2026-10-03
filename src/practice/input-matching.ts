import type {PianoTrainerDomain} from '../domain/model';
import type {LegacyAppState} from '../state/model';
// Preserve the P5 input contract and side-effect order; all external effects use ports.
export namespace PianoTrainerInputMatching {
    export interface Ports {
        state: Pick<LegacyAppState, 'expectedNotes' | 'debugMatchLogs' | 'sustainedVisuals' | 'visualNotesToStart'>;
        getCursorX(): number | null;
        debugLog(name: string, detail: Readonly<Record<string, unknown>>): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        function findExpectedMatchForMidi(midi: number) {
            const candidates = state.expectedNotes.filter(n => n.midi === midi && !n.hit);
            if (state.debugMatchLogs) {
                ports.debugLog('MATCH_CANDIDATES', {
                    midi,
                    count: candidates.length,
                    candidates: candidates.map(n => ({
                        midi: n.midi,
                        staffId: n.staffId,
                        mIdx: n.mIdx,
                        hit: n.hit,
                        anchor: n.anchor ? { x: n.anchor.x, y: n.anchor.y } : null
                    }))
                });
            }
            if (candidates.length === 0) return null;
            // filter produces a dense nonempty array; sorting preserves its length.
            const first = candidates[0]!;
            if (candidates.length === 1) {
                if (state.debugMatchLogs) {
                    ports.debugLog('MATCH_CHOSEN', {
                        midi,
                        reason: 'single-candidate',
                        chosen: {
                            staffId: first.staffId,
                            mIdx: first.mIdx,
                            anchor: first.anchor ? { x: first.anchor.x, y: first.anchor.y } : null
                        }
                    });
                }
                return first;
            }

            const cursorX = ports.getCursorX();
            if (cursorX == null) {
                if (state.debugMatchLogs) {
                    ports.debugLog('MATCH_CHOSEN', {
                        midi,
                        reason: 'no-cursor-x',
                        chosen: {
                            staffId: first.staffId,
                            mIdx: first.mIdx,
                            anchor: first.anchor ? { x: first.anchor.x, y: first.anchor.y } : null
                        }
                    });
                }
                return first;
            }

            const chosen = candidates
                .slice()
                .sort((a, b) => {
                    const ax = a.anchor?.x ?? cursorX;
                    const bx = b.anchor?.x ?? cursorX;
                    return Math.abs(ax - cursorX) - Math.abs(bx - cursorX);
                })[0]!;

            if (state.debugMatchLogs) {
                ports.debugLog('MATCH_CHOSEN', {
                    midi,
                    reason: 'closest-to-cursor-x',
                    cursorX,
                    chosen: {
                        staffId: chosen.staffId,
                        mIdx: chosen.mIdx,
                        anchor: chosen.anchor ? { x: chosen.anchor.x, y: chosen.anchor.y } : null
                    }
                });
            }

            return chosen;
        }

        function findSatisfiedOrSustainedMatchForMidi(midi: number): PianoTrainerDomain.SatisfiedMatch | null {
            const alreadyHit = state.expectedNotes.find(n => n.midi === midi && n.hit);
            if (alreadyHit) {
                return { midi, staffId: alreadyHit.staffId, mIdx: alreadyHit.mIdx, source: 'already-hit' };
            }

            const sustained = state.sustainedVisuals.find(n => n.midi === midi)
                || state.visualNotesToStart.find(n => n.midi === midi);
            if (sustained) {
                return { midi, staffId: sustained.staffId, mIdx: sustained.mIdx ?? null, source: 'sustained-visual' };
            }

            return null;
        }
        return {findExpectedMatchForMidi, findSatisfiedOrSustainedMatchForMidi};
    }
    export type Service = ReturnType<typeof create>;
}
