// Hand routing rules use domain state only; renderer and controls stay outside.
namespace PianoTrainerHandRouting {
    export type State = Pick<LegacyAppState, 'mode' | 'hands' | 'modeSettings' | 'practice' | 'playback'>;
    export function defaultAssignment(stavesCount: number) {
        return {left: (stavesCount || 2) > 1 ? 2 : null, right: 1};
    }
    export function parseAssignment(value: string | number | null | undefined) {
        if (value === '' || value === '-' || value == null) return null;
        const parsed = Number.parseInt(String(value), 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    export function formatAssignment(value: string | number | null | undefined) {
        const parsed = parseAssignment(value);
        return parsed == null ? '' : String(parsed);
    }
    export function create(state: State) {
        function getAssignedHandRoleForStaff(staffId: number | null): PianoTrainerDomain.HandRole | null {
            const sid = Number(staffId);
            if (!Number.isFinite(sid)) return null;
            if (sid === Number(state.hands.right)) return 'right';
            if (sid === Number(state.hands.left)) return 'left';
            return null;
        }
        function normalizeFollowModeSettings() {
            const follow = state.modeSettings.follow;
            const left = !!follow.practice.left, right = !!follow.practice.right;
            const useLeft = left && !right, useRight = !useLeft;
            follow.practice.left = useLeft;
            follow.practice.right = useRight;
            follow.playback.left = !useLeft;
            follow.playback.right = useLeft;
        }
        function getCurrentModeSettings() {
            const modeKey = state.mode === 'wait' ? 'wait' : (state.mode === 'follow' ? 'follow' : 'realtime');
            if (!state.modeSettings[modeKey]) {
                state.modeSettings[modeKey] = {practice: {left: true, right: true}, playback: {left: true, right: true}};
            }
            if (modeKey === 'follow') normalizeFollowModeSettings();
            return state.modeSettings[modeKey];
        }
        function syncActiveHandStateFromMode() {
            const settings = getCurrentModeSettings();
            state.practice.left = !!settings.practice.left;
            state.practice.right = !!settings.practice.right;
            state.playback.left = !!settings.playback.left;
            state.playback.right = !!settings.playback.right;
        }
        function setFollowPracticeHand(hand: PianoTrainerDomain.HandRole) {
            const follow = state.modeSettings.follow, useLeft = hand === 'left';
            follow.practice.left = useLeft;
            follow.practice.right = !useLeft;
            follow.playback.left = !useLeft;
            follow.playback.right = useLeft;
            if (state.mode === 'follow') syncActiveHandStateFromMode();
        }
        return {getAssignedHandRoleForStaff, getCurrentModeSettings, syncActiveHandStateFromMode, setFollowPracticeHand};
    }
    export type Service = ReturnType<typeof create>;
}
