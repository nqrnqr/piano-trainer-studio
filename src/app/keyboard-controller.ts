import {PianoTrainerKeyboardState} from '../domain/keyboard-state';
import {PianoTrainerDomain} from '../domain/model';
import {PianoTrainerOptionalLed} from '../optional/led/legacy-led-adapter';
import {PianoTrainerSustainState} from '../practice/sustain-state';
import {LegacyAppState} from '../state/model';
// Coordinate existing sustain/preview effects with keyboard and optional LED output.
// No renderer/vendor/DOM access; rendering cannot decide whether input was correct.
export namespace PianoTrainerKeyboardController {
    export interface Frame {collectPreview(depth: number): PianoTrainerDomain.PreviewEvent[];}
    export interface Ports {
        state: Pick<LegacyAppState, 'ledCalibrationMode' | 'ledCalibrationSelectedMidi' | 'sustainedVisuals' |
            'visualNotesToStart' | 'futurePreviewEnabled' | 'lastLedPreviewEvents' | 'pressedKeys' |
            'preExpectedHeldNotes' | 'correctHighlightEnabled' | 'heldCorrectNotes' | 'expectedNotes' |
            'isPlaying' | 'hardwareLEDState'>;
        isMidiInRange(midi: number): boolean;
        getHandRole(staff: number | null | undefined): PianoTrainerDomain.HandRole | null;
        sustains: Pick<PianoTrainerSustainState.Service, 'pruneAtTimestamp' | 'markHeldPreview'>;
        led: Pick<PianoTrainerOptionalLed.Output, 'render' | 'updateHardware'>;
        drawKey(midi: number, desired: string | null, calibration?: boolean): void;
    }
    export function create(ports: Ports) {
        const state = ports.state;
        function render(frame: Frame | null = null, currentTimestamp: number | null = null) {
            const desiredStates = new Map<number, string>();
            const previewStateMap = new Map<number, string>();

            if (state.ledCalibrationMode) {
                if (state.ledCalibrationSelectedMidi != null && ports.isMidiInRange(state.ledCalibrationSelectedMidi)) {
                    desiredStates.set(state.ledCalibrationSelectedMidi, 'calibration');
                }

                ports.led.render(desiredStates);

                for (let i = 21; i <= 108; i++) {
                    const desiredClass = state.ledCalibrationSelectedMidi === i ? 'active' : null;
                    ports.drawKey(i, desiredClass, true);
                }

                return;
            }

            ports.sustains.pruneAtTimestamp(currentTimestamp);

            state.sustainedVisuals.forEach(n => {
                if (!ports.isMidiInRange(n.midi)) return;
                const handRole = ports.getHandRole(n.staffId);
                desiredStates.set(n.midi, handRole === 'left' ? 'expected-l' : 'expected-r');
            });
            state.visualNotesToStart.forEach(n => {
                if (!ports.isMidiInRange(n.midi)) return;
                const handRole = ports.getHandRole(n.staffId);
                desiredStates.set(n.midi, handRole === 'left' ? 'expected-l' : 'expected-r');
            });

            const previewDepth = state.futurePreviewEnabled ? 1 : 0;
            let previewEvents = previewDepth > 0 ? (state.lastLedPreviewEvents || []) : [];

            if (frame) {
                previewEvents = frame.collectPreview(previewDepth);
                state.lastLedPreviewEvents = previewEvents;
            }

            (previewEvents || []).forEach(event => {
                event.notes.forEach(note => {
                    const currentState = previewStateMap.get(note.midi) || null;
                    const nextState = PianoTrainerKeyboardState.choose(currentState, note.state);
                    if (nextState && nextState !== currentState) {
                        previewStateMap.set(note.midi, nextState);
                    }
                });
            });

            state.pressedKeys.forEach(midi => {
                const previewState = previewStateMap.get(midi) || null;
                ports.sustains.markHeldPreview(midi, previewState);

                const currentState = desiredStates.get(midi) || null;
                const isCarryHeldIntoExpected =
                    state.preExpectedHeldNotes.has(midi) &&
                    (currentState === 'expected-l' || currentState === 'expected-r');

                if (isCarryHeldIntoExpected) {
                    desiredStates.set(midi, currentState);
                } else if (currentState === 'expected-l' || currentState === 'expected-r') {
                    if (state.correctHighlightEnabled) {
                        desiredStates.set(midi, currentState === 'expected-l' ? 'pressed-l' : 'pressed-r');
                    } else {
                        desiredStates.set(midi, currentState);
                    }
                } else if (previewState === 'future1-l' || previewState === 'future1-r') {
                    desiredStates.set(midi, previewState);
                } else if (state.heldCorrectNotes.has(midi)) {
                    const hasActiveSustainForMidi = state.sustainedVisuals.some(v => v.midi === midi)
                        || state.visualNotesToStart.some(v => v.midi === midi)
                        || state.expectedNotes.some(n => n.midi === midi);

                    if (hasActiveSustainForMidi) {
                        if (state.correctHighlightEnabled) {
                            const staffId = state.heldCorrectNotes.get(midi);
                            desiredStates.set(midi, ports.getHandRole(staffId) === 'left' ? 'pressed-l' : 'pressed-r');
                        } else {
                            desiredStates.delete(midi);
                        }
                    } else {
                        // Ignore keys that remain physically held after their musical/visual
                        // lifespan has ended. They should not stay amber, but they also
                        // should not fall through to wrong/red while still held.
                        desiredStates.delete(midi);
                    }
                } else {
                    desiredStates.set(midi, state.isPlaying ? 'wrong' : 'active');
                }
            });

            const displayStates = previewDepth > 0
                ? PianoTrainerKeyboardState.applyPreview(desiredStates, previewEvents)
                : desiredStates;

            ports.led.render(displayStates, previewDepth);

            for (let i = 21; i <= 108; i++) {
                const desiredClass = displayStates.get(i) || null;

                ports.drawKey(i, desiredClass);

                const hardwareDesiredClass = desiredStates.get(i) || null;
                const currentHardwareClass = state.hardwareLEDState.get(i) || null;
                if (currentHardwareClass !== hardwareDesiredClass) {
                    ports.led.updateHardware(i, hardwareDesiredClass, currentHardwareClass);

                    if (hardwareDesiredClass) {
                        state.hardwareLEDState.set(i, hardwareDesiredClass);
                    } else {
                        state.hardwareLEDState.delete(i);
                    }
                }
            }
        }
        return {render};
    }
}
