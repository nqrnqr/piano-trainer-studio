import {PianoTrainerHandRouting} from '../domain/hand-routing';
import {PianoTrainerDomain} from '../domain/model';
import {LegacyAppState} from '../state/model';
import {PREFERENCE_STORAGE_KEYS} from '../state/preference-keys';
import {PianoTrainerControlDom} from './controls-dom';
// Persisted preference orchestration retains command and native change-event order.
export namespace PianoTrainerPreferenceControls {
    export type State = Pick<LegacyAppState, 'mode' | 'modeSettings' | 'practice' | 'playback' |
        'audioEnabled' | 'midiOutEnabled' | 'midiOutVolume' | 'midiInBoost' | 'inputVelocityEnabled' |
        'liveLowLatencyMonitoringEnabled' | 'visualPulseEnabled' | 'accentedDownbeatEnabled' |
        'loopCountInEnabled' | 'metronomeMidiOutEnabled' | 'feedbackEnabled' | 'futurePreviewEnabled' |
        'futurePreviewDepth' | 'correctHighlightEnabled' | 'fullscreenOnPlay'>;
    export interface Ports {
        document: Document;
        state: State;
        storage: Pick<Storage, 'getItem' | 'setItem'>;
        keys: Pick<typeof PREFERENCE_STORAGE_KEYS,
            'TRAINER_MODE_STORAGE_KEY' | 'TRAINER_FEEDBACK_STORAGE_KEY' | 'TRAINER_FUTURE_PREVIEW_STORAGE_KEY'
            | 'TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY' | 'TRAINER_AUDIO_HANDS_STORAGE_KEY' | 'TRAINER_AUDIO_OTHER_STORAGE_KEY'
            | 'TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY' | 'TRAINER_AUDIO_VIRTUAL_STORAGE_KEY' | 'TRAINER_MIDIOUT_HANDS_STORAGE_KEY'
            | 'TRAINER_MIDIOUT_OTHER_STORAGE_KEY' | 'TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY' | 'TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY'
            | 'TRAINER_MIDIOUT_VOL_STORAGE_KEY' | 'TRAINER_MIDIIN_BOOST_STORAGE_KEY' | 'TRAINER_INPUT_VELOCITY_STORAGE_KEY'
            | 'TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY' | 'VISUAL_PULSE_STORAGE_KEY' | 'ACCENTED_DOWNBEAT_STORAGE_KEY'
            | 'LOOP_COUNT_IN_STORAGE_KEY' | 'METRONOME_MIDIOUT_STORAGE_KEY' | 'TRAINER_PIANO_VOL_STORAGE_KEY'
            | 'TRAINER_ZOOM_STORAGE_KEY' | 'TRAINER_AUTOSCROLL_STORAGE_KEY' | 'TRAINER_KEYBOARD_STORAGE_KEY'
            | 'TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY' | 'SETTINGS_DEBUG_STORAGE_KEY' | 'METRONOME_VOL_STORAGE_KEY'>;
        getStoredBool(key: string, fallback: boolean): boolean;
        getClampedNumber(key: string, min: number, max: number, fallback: number): number;
        setStoredBool(key: string, value: boolean): void;
        clearSavedPreferences(): void;
        syncActiveHandStateFromMode(): void;
        syncMidiInBoostUi(): void;
        updatePianoVolume(value: number): void;
        updateMidiOutVolume(value: number, options?: {save?: boolean}): void;
        updateMidiInBoost(value: number, options?: {save?: boolean}): void;
        syncZoomControls(value: number): void;
        applyZoom(value: number, options?: {save?: boolean}): void;
        syncFullscreenUi(): void;
        setDebugEnabled(value: boolean, options: {clearHistory: boolean; logChange: boolean; reason: string}): void;
        updateMetroVolume(value: number, options?: {save?: boolean}): void;
        syncTempoMetronomeDependentUi(): void;
        setPlayerPianoType(value: number): void;
        getDefaultStaffAssignment(): {left: number | null; right: number};
        syncHandAssignmentFromControls(): void;
        applyModeSettings(): void;
        setScoreLayout(value: PianoTrainerDomain.ScoreLayout): void;
        resetLedPreferences(): void;
        syncLedPreferenceControls(): void;
        positionCalibrationPanel(): void;
        renderLooper(): void;
        renderVirtualKeyboard(): void;
        populateMIDIDevices(): void;
    }
    export function create(ports: Ports) {
        const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
        function applyPersistedTrainerAndSettingsPreferences() {
            state.mode = ports.storage.getItem(ports.keys.TRAINER_MODE_STORAGE_KEY) || 'realtime';
            state.feedbackEnabled = ports.getStoredBool(ports.keys.TRAINER_FEEDBACK_STORAGE_KEY, true);
            state.futurePreviewEnabled = ports.getStoredBool(ports.keys.TRAINER_FUTURE_PREVIEW_STORAGE_KEY, true);
            state.futurePreviewDepth = 1;
            state.correctHighlightEnabled = ports.getStoredBool(ports.keys.TRAINER_CORRECT_HIGHLIGHT_STORAGE_KEY, true);
            ports.syncActiveHandStateFromMode();
            state.audioEnabled.hands = ports.getStoredBool(ports.keys.TRAINER_AUDIO_HANDS_STORAGE_KEY, true);
            state.audioEnabled.other = ports.getStoredBool(ports.keys.TRAINER_AUDIO_OTHER_STORAGE_KEY, false);
            state.audioEnabled.instrument = ports.getStoredBool(ports.keys.TRAINER_AUDIO_INSTRUMENT_STORAGE_KEY, false);
            state.audioEnabled.virtual = ports.getStoredBool(ports.keys.TRAINER_AUDIO_VIRTUAL_STORAGE_KEY, true);
            state.midiOutEnabled.hands = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_HANDS_STORAGE_KEY, false);
            state.midiOutEnabled.other = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_OTHER_STORAGE_KEY, false);
            state.midiOutEnabled.instrument = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_INSTRUMENT_STORAGE_KEY, false);
            state.midiOutEnabled.virtual = ports.getStoredBool(ports.keys.TRAINER_MIDIOUT_VIRTUAL_STORAGE_KEY, false);
            state.midiOutVolume = ports.getClampedNumber(ports.keys.TRAINER_MIDIOUT_VOL_STORAGE_KEY, 0, 100, 65);
            state.midiInBoost = ports.getClampedNumber(ports.keys.TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100);
            state.inputVelocityEnabled = true;
            state.liveLowLatencyMonitoringEnabled = true;
            ports.setStoredBool(ports.keys.TRAINER_INPUT_VELOCITY_STORAGE_KEY, true);
            ports.setStoredBool(ports.keys.TRAINER_LIVE_LOW_LATENCY_STORAGE_KEY, true);
            state.visualPulseEnabled = ports.getStoredBool(ports.keys.VISUAL_PULSE_STORAGE_KEY, true);
            state.accentedDownbeatEnabled = ports.getStoredBool(ports.keys.ACCENTED_DOWNBEAT_STORAGE_KEY, true);
            state.loopCountInEnabled = ports.getStoredBool(ports.keys.LOOP_COUNT_IN_STORAGE_KEY, true);
            state.metronomeMidiOutEnabled = ports.getStoredBool(ports.keys.METRONOME_MIDIOUT_STORAGE_KEY, false);

            const realtimeRadio = dom.optionalInput('mode-realtime');
            const waitRadio = dom.optionalInput('mode-wait');
            const followRadio = dom.optionalInput('mode-follow');
            if (state.mode === 'wait') {
                if (waitRadio) waitRadio.checked = true;
            } else if (state.mode === 'follow') {
                if (followRadio) followRadio.checked = true;
            } else {
                if (realtimeRadio) realtimeRadio.checked = true;
            }

            const feedbackCheckbox = dom.optionalInput('check-feedback');
            if (feedbackCheckbox) feedbackCheckbox.checked = state.feedbackEnabled;

            const futurePreviewCheckbox = dom.optionalInput('check-future-preview');
            if (futurePreviewCheckbox) futurePreviewCheckbox.checked = state.futurePreviewEnabled;

            const correctHighlightCheckbox = dom.optionalInput('check-correct-highlight');
            if (correctHighlightCheckbox) correctHighlightCheckbox.checked = state.correctHighlightEnabled;

            const practiceLeftCheckbox = dom.optionalInput('practice-lh');
            if (practiceLeftCheckbox) practiceLeftCheckbox.checked = state.practice.left;

            const practiceRightCheckbox = dom.optionalInput('practice-rh');
            if (practiceRightCheckbox) practiceRightCheckbox.checked = state.practice.right;

            const playbackLeftCheckbox = dom.optionalInput('enable-staff-lh');
            if (playbackLeftCheckbox) playbackLeftCheckbox.checked = state.playback.left;

            const playbackRightCheckbox = dom.optionalInput('enable-staff-rh');
            if (playbackRightCheckbox) playbackRightCheckbox.checked = state.playback.right;

            const audioHandsCheckbox = dom.optionalInput('enable-hand-staves');
            if (audioHandsCheckbox) audioHandsCheckbox.checked = state.audioEnabled.hands;

            const audioOtherCheckbox = dom.optionalInput('enable-other');
            if (audioOtherCheckbox) audioOtherCheckbox.checked = state.audioEnabled.other;

            const audioInstrumentCheckbox = dom.optionalInput('enable-instrument');
            if (audioInstrumentCheckbox) audioInstrumentCheckbox.checked = state.audioEnabled.instrument;
            ports.syncMidiInBoostUi();

            const audioVirtualCheckbox = dom.optionalInput('enable-virtual-keyboard');
            if (audioVirtualCheckbox) audioVirtualCheckbox.checked = state.audioEnabled.virtual;

            const midiOutHandsCheckbox = dom.optionalInput('enable-midiout-hand-staves');
            if (midiOutHandsCheckbox) midiOutHandsCheckbox.checked = state.midiOutEnabled.hands;

            const midiOutOtherCheckbox = dom.optionalInput('enable-midiout-other');
            if (midiOutOtherCheckbox) midiOutOtherCheckbox.checked = state.midiOutEnabled.other;

            const midiOutInstrumentCheckbox = dom.optionalInput('enable-midiout-instrument');
            if (midiOutInstrumentCheckbox) midiOutInstrumentCheckbox.checked = state.midiOutEnabled.instrument;

            const midiOutVirtualCheckbox = dom.optionalInput('enable-midiout-virtual-keyboard');
            if (midiOutVirtualCheckbox) midiOutVirtualCheckbox.checked = state.midiOutEnabled.virtual;


            const pianoVolume = ports.getClampedNumber(ports.keys.TRAINER_PIANO_VOL_STORAGE_KEY, 0, 100, 80);
            ports.updatePianoVolume(pianoVolume);

            const midiOutVolume = ports.getClampedNumber(ports.keys.TRAINER_MIDIOUT_VOL_STORAGE_KEY, 0, 100, 65);
            ports.updateMidiOutVolume(midiOutVolume, { save: false });

            const midiInBoost = ports.getClampedNumber(ports.keys.TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100);
            ports.updateMidiInBoost(midiInBoost, { save: false });

            const zoomPercent = ports.getClampedNumber(ports.keys.TRAINER_ZOOM_STORAGE_KEY, 50, 150, 100);
            if (ports.storage.getItem(ports.keys.TRAINER_ZOOM_STORAGE_KEY) === null || ports.storage.getItem(ports.keys.TRAINER_ZOOM_STORAGE_KEY) === '') {
                ports.storage.setItem(ports.keys.TRAINER_ZOOM_STORAGE_KEY, String(zoomPercent));
            }
            ports.syncZoomControls(zoomPercent);
            ports.applyZoom(zoomPercent, { save: false });

            const autoScrollCheckbox = dom.optionalInput('check-autoscroll');
            if (autoScrollCheckbox) autoScrollCheckbox.checked = ports.getStoredBool(ports.keys.TRAINER_AUTOSCROLL_STORAGE_KEY, true);

            const keyboardCheckbox = dom.optionalInput('check-keyboard');
            const keyboardVisible = ports.getStoredBool(ports.keys.TRAINER_KEYBOARD_STORAGE_KEY, true);
            if (keyboardCheckbox) keyboardCheckbox.checked = keyboardVisible;
            const keyboardContainer = dom.element('virtual-keyboard-container');
            if (keyboardContainer) keyboardContainer.classList.toggle('hidden', !keyboardVisible);

            state.fullscreenOnPlay = ports.getStoredBool(ports.keys.TRAINER_FULLSCREEN_ON_PLAY_STORAGE_KEY, false);
            const fullscreenOnPlayCheckbox = dom.optionalInput('check-fullscreen-on-play');
            if (fullscreenOnPlayCheckbox) fullscreenOnPlayCheckbox.checked = state.fullscreenOnPlay;
            ports.syncFullscreenUi();

            const debugEnabled = ports.getStoredBool(ports.keys.SETTINGS_DEBUG_STORAGE_KEY, false);
            ports.setDebugEnabled(debugEnabled, { clearHistory: !debugEnabled, logChange: false, reason: 'startup-persisted' });

            const visualPulseCheckbox = dom.optionalInput('check-visual-pulse');
            if (visualPulseCheckbox) visualPulseCheckbox.checked = state.visualPulseEnabled;

            const accentedDownbeatCheckbox = dom.optionalInput('check-accented-downbeat');
            if (accentedDownbeatCheckbox) accentedDownbeatCheckbox.checked = state.accentedDownbeatEnabled;

            const loopCountInCheckbox = dom.optionalInput('check-loop-countin');
            if (loopCountInCheckbox) loopCountInCheckbox.checked = state.loopCountInEnabled;

            const metronomeMidiOutCheckbox = dom.optionalInput('check-metronome-midiout');
            if (metronomeMidiOutCheckbox) metronomeMidiOutCheckbox.checked = state.metronomeMidiOutEnabled;

            const metronomeVolume = ports.getClampedNumber(ports.keys.METRONOME_VOL_STORAGE_KEY, 0, 100, 25);
            ports.updateMetroVolume(metronomeVolume, { save: false });
        }
        function restoreDefaultPreferences({reloadDevices = true} = {}) {
            ports.clearSavedPreferences();

            state.mode = 'realtime';
            const realtimeRadio = dom.optionalInput('mode-realtime');
            const waitRadio = dom.optionalInput('mode-wait');
            if (realtimeRadio) realtimeRadio.checked = true;
            if (waitRadio) waitRadio.checked = false;

            state.feedbackEnabled = true;
            const feedbackCheckbox = dom.optionalInput('check-feedback');
            if (feedbackCheckbox) feedbackCheckbox.checked = true;

            state.futurePreviewEnabled = true;
            const futurePreviewCheckbox = dom.optionalInput('check-future-preview');
            if (futurePreviewCheckbox) futurePreviewCheckbox.checked = true;

            state.correctHighlightEnabled = true;
            const correctHighlightCheckbox = dom.optionalInput('check-correct-highlight');
            if (correctHighlightCheckbox) correctHighlightCheckbox.checked = true;

            state.futurePreviewDepth = 1;

            state.modeSettings.realtime = { practice: { left: true, right: true }, playback: { left: true, right: true } };
            state.modeSettings.wait = { practice: { left: true, right: true }, playback: { left: false, right: false } };
            state.modeSettings.follow = { practice: { left: false, right: true }, playback: { left: true, right: false } };
            ports.syncActiveHandStateFromMode();
            const practiceLeftCheckbox = dom.optionalInput('practice-lh');
            if (practiceLeftCheckbox) practiceLeftCheckbox.checked = true;
            const practiceRightCheckbox = dom.optionalInput('practice-rh');
            if (practiceRightCheckbox) practiceRightCheckbox.checked = true;

            state.audioEnabled.hands = true;
            state.audioEnabled.other = false;
            state.audioEnabled.instrument = false;
            state.audioEnabled.virtual = true;
            const playbackLeftCheckbox = dom.optionalInput('enable-staff-lh');
            if (playbackLeftCheckbox) playbackLeftCheckbox.checked = state.playback.left;
            const playbackRightCheckbox = dom.optionalInput('enable-staff-rh');
            if (playbackRightCheckbox) playbackRightCheckbox.checked = state.playback.right;
            const audioHandsCheckbox = dom.optionalInput('enable-hand-staves');
            if (audioHandsCheckbox) audioHandsCheckbox.checked = true;
            const audioOtherCheckbox = dom.optionalInput('enable-other');
            if (audioOtherCheckbox) audioOtherCheckbox.checked = false;
            const audioInstrumentCheckbox = dom.optionalInput('enable-instrument');
            if (audioInstrumentCheckbox) audioInstrumentCheckbox.checked = false;
            const audioVirtualCheckbox = dom.optionalInput('enable-virtual-keyboard');
            if (audioVirtualCheckbox) audioVirtualCheckbox.checked = true;
            ports.updateMidiInBoost(ports.getClampedNumber(ports.keys.TRAINER_MIDIIN_BOOST_STORAGE_KEY, 50, 200, 100));
            ports.syncMidiInBoostUi();

            state.midiOutEnabled.hands = false;
            state.midiOutEnabled.other = false;
            state.midiOutEnabled.instrument = false;
            state.midiOutEnabled.virtual = false;
            const midiOutHandsCheckbox = dom.optionalInput('enable-midiout-hand-staves');
            if (midiOutHandsCheckbox) midiOutHandsCheckbox.checked = false;
            const midiOutOtherCheckbox = dom.optionalInput('enable-midiout-other');
            if (midiOutOtherCheckbox) midiOutOtherCheckbox.checked = false;
            const midiOutInstrumentCheckbox = dom.optionalInput('enable-midiout-instrument');
            if (midiOutInstrumentCheckbox) midiOutInstrumentCheckbox.checked = false;
            const midiOutVirtualCheckbox = dom.optionalInput('enable-midiout-virtual-keyboard');
            if (midiOutVirtualCheckbox) midiOutVirtualCheckbox.checked = false;

            ports.updatePianoVolume(80);
            ports.setScoreLayout('traditional');
            ports.applyZoom(100);

            const autoScrollCheckbox = dom.optionalInput('check-autoscroll');
            if (autoScrollCheckbox) autoScrollCheckbox.checked = true;

            const keyboardCheckbox = dom.optionalInput('check-keyboard');
            if (keyboardCheckbox) keyboardCheckbox.checked = true;
            const keyboardContainer = dom.element('virtual-keyboard-container');
            if (keyboardContainer) keyboardContainer.classList.remove('hidden');

            state.visualPulseEnabled = true;
            const visualPulseCheckbox = dom.optionalInput('check-visual-pulse');
            if (visualPulseCheckbox) visualPulseCheckbox.checked = true;

            state.accentedDownbeatEnabled = true;
            const accentedDownbeatCheckbox = dom.optionalInput('check-accented-downbeat');
            if (accentedDownbeatCheckbox) accentedDownbeatCheckbox.checked = true;

            state.loopCountInEnabled = true;
            const loopCountInCheckbox = dom.optionalInput('check-loop-countin');
            if (loopCountInCheckbox) loopCountInCheckbox.checked = true;

            state.metronomeMidiOutEnabled = false;
            const metronomeMidiOutCheckbox = dom.optionalInput('check-metronome-midiout');
            if (metronomeMidiOutCheckbox) metronomeMidiOutCheckbox.checked = false;

            ports.updateMetroVolume(25, { save: true });
            ports.syncTempoMetronomeDependentUi();

            ports.setDebugEnabled(false, { clearHistory: true, logChange: false, reason: 'reset-defaults' });

            ports.setPlayerPianoType(88);
            ports.resetLedPreferences();

            const midiInSelect = dom.optionalSelect('midi-in');
            if (midiInSelect) {
                midiInSelect.value = 'none';
                midiInSelect.dispatchEvent(new Event('change'));
            }

            const midiOutSelect = dom.optionalSelect('midi-out');
            if (midiOutSelect) {
                midiOutSelect.value = 'none';
                midiOutSelect.dispatchEvent(new Event('change'));
            }
            const midiOutChannelSelect = dom.optionalSelect('midi-out-channel');
            if (midiOutChannelSelect) {
                midiOutChannelSelect.value = '1';
                midiOutChannelSelect.dispatchEvent(new Event('change'));
            }

            const midiLightsSelect = dom.optionalSelect('midi-lights');
            if (midiLightsSelect) {
                midiLightsSelect.value = 'none';
                midiLightsSelect.dispatchEvent(new Event('change'));
            }
            const midiLightsChannelSelect = dom.optionalSelect('midi-lights-channel');
            if (midiLightsChannelSelect) {
                midiLightsChannelSelect.value = '1';
                midiLightsChannelSelect.dispatchEvent(new Event('change'));
            }

            const defaults = ports.getDefaultStaffAssignment();
            const assignLeft = dom.optionalSelect('assign-lh');
            if (assignLeft) assignLeft.value = PianoTrainerHandRouting.formatAssignment(defaults.left);
            const assignRight = dom.optionalSelect('assign-rh');
            if (assignRight) assignRight.value = PianoTrainerHandRouting.formatAssignment(defaults.right);
            ports.syncHandAssignmentFromControls();

            ports.applyModeSettings();
            ports.syncLedPreferenceControls();
            ports.renderLooper();
            ports.renderVirtualKeyboard();
            ports.positionCalibrationPanel();

            if (reloadDevices) {
                ports.populateMIDIDevices();
            }
        }
        return {applyPersistedTrainerAndSettingsPreferences, restoreDefaultPreferences};
    }
}
