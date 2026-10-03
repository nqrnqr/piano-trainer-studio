// Coordinate a committed staff assignment without reading vendor objects or DOM.
namespace PianoTrainerHandAssignment {
    export interface Frame {
        hasEntries: boolean;
        measureIndex: number | null;
        buildExpected(): void;
        renderKeyboard(): void;
    }
    export interface Ports {
        state: Pick<LegacyAppState, 'hands' | 'ledPreviewTimelineDirty' | 'lastLedPreviewEvents' |
            'expectedNotes' | 'visualNotesToStart' | 'outOfRangeCurrentNotes'>;
        captureCurrentFrame(): Frame | null;
        renderKeyboard(): void;
    }
    export function create(ports: Ports) {
        function commit(left: number | null, right: number | null, refreshCurrentFrame: boolean) {
            if (right == null) return;
            const state = ports.state;
            state.hands.left = left;
            state.hands.right = right;
            state.ledPreviewTimelineDirty = true;
            state.lastLedPreviewEvents = [];
            const frame = refreshCurrentFrame ? ports.captureCurrentFrame() : null;
            if (!frame) {ports.renderKeyboard(); return;}
            if (frame.hasEntries && frame.measureIndex != null) {
                frame.buildExpected();
                frame.renderKeyboard();
            } else {
                state.expectedNotes = [];
                state.visualNotesToStart = [];
                state.outOfRangeCurrentNotes = [];
                ports.renderKeyboard();
            }
        }
        return {commit};
    }
}
