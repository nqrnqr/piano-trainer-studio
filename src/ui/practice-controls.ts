import type {PianoTrainerHandRouting} from '../domain/hand-routing';
import type {LegacyAppState} from '../state/model';
import {PianoTrainerControlDom} from './controls-dom';
// Native practice controls issue commands and retain the existing mode UI rules.
export namespace PianoTrainerPracticeControls {
    export type State = Pick<LegacyAppState, 'mode' | 'practice' | 'playback' | 'isPlaying' | 'countInActive' |
        'feedbackEnabled' | 'futurePreviewEnabled' | 'futurePreviewDepth' | 'correctHighlightEnabled' |
        'lastLedPreviewEvents' | 'fullscreenOnPlay' | 'lowLatencyPlaybackEnabled' | 'audioEnabled' | 'midiOutEnabled'>;
    export type BoolKey = 'keyboard' | 'feedback' | 'futurePreview' | 'correctHighlight' | 'autoScroll' |
        'fullscreenOnPlay' | 'lowLatencyPlayback' | 'audioHands' | 'audioOther' | 'audioInstrument' |
        'audioVirtual' | 'midiOutHands' | 'midiOutOther' | 'midiOutInstrument' | 'midiOutVirtual';
    export interface Ports {
        document: Document;
        state: State;
        routing: PianoTrainerHandRouting.Service;
        getSelectedMidiOutOutput(): unknown;
        syncTempoMetronomeDependentUi(): void;
        applyToneLatencyProfileForMode(): void;
        saveBool(key: BoolKey, value: boolean): void;
        saveMode(value: string): void;
        pause(): void;
        clearScheduledMetronomeEvents(): void;
        stopWaitModeMetronome(): void;
        silencePlaybackOutputsImmediately(): void;
        clearTransientPlaybackState(options: {clearVisualState: boolean}): void;
        readPianoVolume(): string | number;
        readMetroVolume(): string | number;
        updatePianoVolume(value: string | number): void;
        updateMetroVolume(value: string | number): void;
        renderKeyboard(): void;
        clearSvgFeedback(): void;
        renderFeedbackOverlay(): void;
        syncSettingsDebugVisibility(): void;
        positionCalibrationPanel(): void;
        dispatchResize(): void;
        releaseLowLatencyPlayback(): void;
        syncMidiInBoostUi(): void;
    }
    export function create(ports: Ports) {
        const state = ports.state, dom = PianoTrainerControlDom.create(ports.document);
        let futureInitialized = false, modeInitialized = false, routingInitialized = false, generation = 0;
        let ownedHighlight: HTMLInputElement | null = null;
        function onInput(target: HTMLInputElement | null, handler: (input: HTMLInputElement) => void) {
            const token = generation;
            dom.onInput(target, 'change', input => {if (token === generation) handler(input);});
        }
        function syncTrainerRoutingUiState() {
            const hasMidiOut = !!ports.getSelectedMidiOutOutput();
            const summary = dom.element('trainer-midi-out-summary');
            const midiOutCard = dom.element('trainer-midiout-card');
            const summaryHint = dom.element('trainer-midi-out-summary-hint');
            if (summary) {
                if (hasMidiOut) {
                    const outName = dom.optionalSelect('midi-out')?.selectedOptions?.[0]?.textContent?.replace(/\s*\(Disconnected\)\s*$/, '') || 'MIDI Out';
                    summary.textContent = `Send playback and input to ${outName}.`;
                    summary.classList.remove('is-disabled');
                    summaryHint?.classList.add('hidden');
                } else {
                    summary.textContent = 'No MIDI device selected.';
                    summary.classList.add('is-disabled');
                    summaryHint?.classList.remove('hidden');
                }
            }
            midiOutCard?.classList.toggle('is-disabled', !hasMidiOut);
            const midiOutVolumeSlider = dom.optionalInput('slider-midiout-vol');
            const midiOutVolumeInput = dom.optionalInput('val-midiout-vol');
            if (midiOutVolumeSlider) midiOutVolumeSlider.disabled = !hasMidiOut;
            if (midiOutVolumeInput) midiOutVolumeInput.disabled = !hasMidiOut;
            ['enable-midiout-hand-staves', 'enable-midiout-other', 'enable-midiout-instrument', 'enable-midiout-virtual-keyboard'].forEach((id) => {
                const input = dom.optionalInput(id);
                if (!input) return;
                const shouldDisable = !hasMidiOut;
                input.disabled = shouldDisable;
                input.closest('label')?.classList.toggle('is-disabled', shouldDisable);
            });
            ports.syncTempoMetronomeDependentUi();
        }
        function applyModeSettings() {
            ports.applyToneLatencyProfileForMode();
            const isWait = state.mode === 'wait';
            const isFollow = state.mode === 'follow';

            ports.routing.syncActiveHandStateFromMode();

            const practiceLeftToggle = dom.optionalInput('practice-lh');
            const practiceRightToggle = dom.optionalInput('practice-rh');
            const playbackLeftToggle = dom.optionalInput('enable-staff-lh');
            const playbackRightToggle = dom.optionalInput('enable-staff-rh');
            const audioHandsToggle = dom.optionalInput('enable-hand-staves');
            const otherAudioToggle = dom.optionalInput('enable-other');
            const midiOutHandsToggle = dom.optionalInput('enable-midiout-hand-staves');
            const midiOutOtherToggle = dom.optionalInput('enable-midiout-other');
            const playbackRow = ports.document.querySelector('.practice-playback-row');
            const waitNoteRow = dom.element('practice-wait-note-row');
            const waitNote = dom.element('practice-wait-note');
            const lowLatencyPlaybackCheckbox = dom.optionalInput('check-low-latency-playback');

            if (practiceLeftToggle) practiceLeftToggle.checked = state.practice.left;
            if (practiceRightToggle) practiceRightToggle.checked = state.practice.right;
            if (playbackLeftToggle) playbackLeftToggle.checked = state.playback.left;
            if (playbackRightToggle) playbackRightToggle.checked = state.playback.right;
            if (lowLatencyPlaybackCheckbox) lowLatencyPlaybackCheckbox.checked = !!state.lowLatencyPlaybackEnabled;

            // Keep Audio/Routing hand-staff preferences untouched when switching modes.
            // Wait mode blocks score playback behaviorally, but it must not rewrite or visually
            // uncheck the user's saved routing choices in More -> Audio/Routing.

            if (practiceLeftToggle) {
                practiceLeftToggle.disabled = false;
                practiceLeftToggle.closest('label')?.classList.toggle('is-disabled', false);
            }
            if (practiceRightToggle) {
                practiceRightToggle.disabled = false;
                practiceRightToggle.closest('label')?.classList.toggle('is-disabled', false);
            }
            const playbackDisabled = isWait || isFollow;

            if (playbackLeftToggle) {
                playbackLeftToggle.disabled = playbackDisabled;
                playbackLeftToggle.closest('label')?.classList.toggle('is-disabled', playbackDisabled);
            }
            if (playbackRightToggle) {
                playbackRightToggle.disabled = playbackDisabled;
                playbackRightToggle.closest('label')?.classList.toggle('is-disabled', playbackDisabled);
            }
            playbackRow?.classList.toggle('is-disabled', playbackDisabled);
            if (audioHandsToggle) {
                audioHandsToggle.disabled = false;
                audioHandsToggle.closest('label')?.classList.toggle('is-disabled', false);
            }
            if (otherAudioToggle) otherAudioToggle.disabled = isWait;
            if (midiOutHandsToggle) {
                const disableMidiOutHands = !ports.getSelectedMidiOutOutput();
                midiOutHandsToggle.disabled = disableMidiOutHands;
                midiOutHandsToggle.closest('label')?.classList.toggle('is-disabled', disableMidiOutHands);
            }
            if (midiOutOtherToggle) midiOutOtherToggle.disabled = isWait || !ports.getSelectedMidiOutOutput();

            let modeNote = '';
            if (isWait) modeNote = 'Audio playback is unavailable in Wait mode.';
            else if (isFollow) modeNote = 'Playback is automatically set to the opposite hand in Follow Me.';
            waitNoteRow?.classList.toggle('is-hidden', !modeNote);
            waitNoteRow?.classList.toggle('is-disabled-context', playbackDisabled && !!modeNote);
            if (waitNote) {
                waitNote.textContent = modeNote;
                waitNote.classList.toggle('is-disabled', !modeNote);
            }
            syncTrainerRoutingUiState();
        }
        function syncLowLatencyPlaybackPreferenceUi() {
            const checkbox = dom.optionalInput('check-low-latency-playback');
            if (checkbox) checkbox.checked = !!state.lowLatencyPlaybackEnabled;
        }
        function initFuturePreview() {
            if (futureInitialized) return;
            const checkbox = dom.optionalInput('check-future-preview');
            if (!checkbox) return;
            futureInitialized = true;
            const select = dom.optionalSelect('select-future-depth');
            if (select?.parentNode) select.parentNode.removeChild(select);
            state.futurePreviewDepth = 1;
            checkbox.checked = state.futurePreviewEnabled;
            onInput(checkbox, input => {
                state.futurePreviewEnabled = input.checked;
                state.futurePreviewDepth = 1;
                ports.saveBool('futurePreview', state.futurePreviewEnabled);
                state.lastLedPreviewEvents = [];
                ports.renderKeyboard();
            });
            const highlight = dom.optionalInput('check-correct-highlight');
            if (highlight) {
                highlight.checked = state.correctHighlightEnabled;
                if (!highlight.dataset.boundCorrectHighlight) {
                    highlight.dataset.boundCorrectHighlight = 'true'; ownedHighlight = highlight;
                    onInput(highlight, input => {
                        state.correctHighlightEnabled = input.checked;
                        ports.saveBool('correctHighlight', state.correctHighlightEnabled);
                        ports.renderKeyboard();
                    });
                }
            }
        }
        function initModeAndFeedback() {
            if (modeInitialized) return;
            modeInitialized = true;
            onInput(dom.input('check-keyboard'), input => {
                const container = dom.element('virtual-keyboard-container');
                if (!container) throw Error('Missing required trainer control: virtual-keyboard-container');
                ports.saveBool('keyboard', input.checked);
                if (input.checked) {container.classList.remove('hidden'); ports.renderKeyboard();}
                else container.classList.add('hidden');
                ports.positionCalibrationPanel(); ports.dispatchResize();
            });
            onInput(dom.input('check-feedback'), input => {
                state.feedbackEnabled = input.checked;
                ports.saveBool('feedback', state.feedbackEnabled);
                if (!input.checked) ports.clearSvgFeedback(); else ports.renderFeedbackOverlay();
                ports.syncSettingsDebugVisibility();
            });
            for (const radio of ports.document.querySelectorAll('input[name="practice-mode"]')) {
                if (!(radio instanceof HTMLInputElement)) throw Error('Invalid trainer control: practice-mode');
                onInput(radio, input => {
                    if (!input.checked) return;
                    const nextMode = input.value;
                    if (state.isPlaying || state.countInActive) ports.pause();
                    state.mode = nextMode; ports.saveMode(state.mode);
                    ports.clearScheduledMetronomeEvents(); ports.stopWaitModeMetronome();
                    ports.silencePlaybackOutputsImmediately(); ports.clearTransientPlaybackState({clearVisualState: true});
                    applyModeSettings(); ports.applyToneLatencyProfileForMode();
                    ports.updatePianoVolume(ports.readPianoVolume()); ports.updateMetroVolume(ports.readMetroVolume());
                });
            }
        }
        function initRouting() {
            if (routingInitialized) return;
            routingInitialized = true;
            onInput(dom.optionalInput('check-autoscroll'), input => ports.saveBool('autoScroll', input.checked));
            onInput(dom.optionalInput('check-fullscreen-on-play'), input => {
                state.fullscreenOnPlay = input.checked; ports.saveBool('fullscreenOnPlay', state.fullscreenOnPlay);
            });
            const latency = dom.optionalInput('check-low-latency-playback');
            if (latency) {
                syncLowLatencyPlaybackPreferenceUi();
                onInput(latency, input => {
                    state.lowLatencyPlaybackEnabled = input.checked; ports.saveBool('lowLatencyPlayback', state.lowLatencyPlaybackEnabled);
                    if (!state.lowLatencyPlaybackEnabled) ports.releaseLowLatencyPlayback();
                });
            }
            for (const side of ['left', 'right'] as const) {
                onInput(dom.input(side === 'left' ? 'practice-lh' : 'practice-rh'), input => {
                    if (state.mode === 'follow') {
                        if (!input.checked) {input.checked = true; return;}
                        ports.routing.setFollowPracticeHand(side); applyModeSettings(); return;
                    }
                    const settings = ports.routing.getCurrentModeSettings();
                    settings.practice[side] = input.checked; ports.routing.syncActiveHandStateFromMode();
                });
            }
            for (const side of ['left', 'right'] as const) {
                onInput(dom.optionalInput(side === 'left' ? 'enable-staff-lh' : 'enable-staff-rh'), input => {
                    if (state.mode === 'follow' || state.mode === 'wait') {input.checked = state.playback[side]; return;}
                    const settings = ports.routing.getCurrentModeSettings();
                    settings.playback[side] = input.checked; ports.routing.syncActiveHandStateFromMode();
                });
            }
            const audioControls = [
                ['enable-hand-staves', 'hands', 'audioHands'], ['enable-other', 'other', 'audioOther'],
                ['enable-instrument', 'instrument', 'audioInstrument'], ['enable-virtual-keyboard', 'virtual', 'audioVirtual']
            ] as const;
            for (const [id, field, key] of audioControls) onInput(dom.optionalInput(id), input => {
                state.audioEnabled[field] = input.checked; ports.saveBool(key, state.audioEnabled[field]);
                if (field === 'instrument') ports.syncMidiInBoostUi();
            });
            const midiControls = [
                ['enable-midiout-hand-staves', 'hands', 'midiOutHands'], ['enable-midiout-other', 'other', 'midiOutOther'],
                ['enable-midiout-instrument', 'instrument', 'midiOutInstrument'], ['enable-midiout-virtual-keyboard', 'virtual', 'midiOutVirtual']
            ] as const;
            for (const [id, field, key] of midiControls) onInput(dom.optionalInput(id), input => {
                state.midiOutEnabled[field] = input.checked; ports.saveBool(key, state.midiOutEnabled[field]);
            });
        }
        function init() {initFuturePreview(); initModeAndFeedback(); initRouting();}
        function dispose() {
            generation++; dom.dispose(); futureInitialized = false; modeInitialized = false; routingInitialized = false;
            if (ownedHighlight?.dataset.boundCorrectHighlight === 'true') delete ownedHighlight.dataset.boundCorrectHighlight;
            ownedHighlight = null;
        }
        return {init, initFuturePreview, initModeAndFeedback, initRouting, dispose,
            applyModeSettings, syncTrainerRoutingUiState, syncLowLatencyPlaybackPreferenceUi};
    }
}
