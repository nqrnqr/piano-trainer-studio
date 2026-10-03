"use strict";
// Hand routing rules use domain state only; renderer and controls stay outside.
var PianoTrainerHandRouting;
(function (PianoTrainerHandRouting) {
    function defaultAssignment(stavesCount) {
        return { left: (stavesCount || 2) > 1 ? 2 : null, right: 1 };
    }
    PianoTrainerHandRouting.defaultAssignment = defaultAssignment;
    function parseAssignment(value) {
        if (value === '' || value === '-' || value == null)
            return null;
        const parsed = Number.parseInt(String(value), 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    PianoTrainerHandRouting.parseAssignment = parseAssignment;
    function formatAssignment(value) {
        const parsed = parseAssignment(value);
        return parsed == null ? '' : String(parsed);
    }
    PianoTrainerHandRouting.formatAssignment = formatAssignment;
    function create(state) {
        function getAssignedHandRoleForStaff(staffId) {
            const sid = Number(staffId);
            if (!Number.isFinite(sid))
                return null;
            if (sid === Number(state.hands.right))
                return 'right';
            if (sid === Number(state.hands.left))
                return 'left';
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
                state.modeSettings[modeKey] = { practice: { left: true, right: true }, playback: { left: true, right: true } };
            }
            if (modeKey === 'follow')
                normalizeFollowModeSettings();
            return state.modeSettings[modeKey];
        }
        function syncActiveHandStateFromMode() {
            const settings = getCurrentModeSettings();
            state.practice.left = !!settings.practice.left;
            state.practice.right = !!settings.practice.right;
            state.playback.left = !!settings.playback.left;
            state.playback.right = !!settings.playback.right;
        }
        function setFollowPracticeHand(hand) {
            const follow = state.modeSettings.follow, useLeft = hand === 'left';
            follow.practice.left = useLeft;
            follow.practice.right = !useLeft;
            follow.playback.left = !useLeft;
            follow.playback.right = useLeft;
            if (state.mode === 'follow')
                syncActiveHandStateFromMode();
        }
        function isPracticeHandEnabledForStaff(staffId) {
            const role = getAssignedHandRoleForStaff(staffId);
            return (role === 'right' && state.practice.right) || (role === 'left' && state.practice.left);
        }
        return { getAssignedHandRoleForStaff, getCurrentModeSettings, syncActiveHandStateFromMode, setFollowPracticeHand, isPracticeHandEnabledForStaff };
    }
    PianoTrainerHandRouting.create = create;
})(PianoTrainerHandRouting || (PianoTrainerHandRouting = {}));
//# sourceMappingURL=hand-routing.js.map