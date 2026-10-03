"use strict";
// User level/boost edits stay at the DOM/storage boundary; audio/MIDI receive numbers.
var PianoTrainerAudioLevelControls;
(function (PianoTrainerAudioLevelControls) {
    function create(ports) {
        const dom = PianoTrainerControlDom.create(ports.document), state = ports.state;
        let initialized = false, active = true;
        function syncPair(sliderId, inputId, value) {
            const slider = dom.optionalInput(sliderId), input = dom.optionalInput(inputId);
            if (slider)
                slider.value = String(value);
            if (input)
                input.value = String(value);
        }
        function updatePianoVolume(value, { save = true } = {}) {
            if (!active)
                return;
            const level = Math.max(0, Math.min(100, parseInt(String(value), 10) || 0));
            syncPair('slider-piano-vol', 'val-piano-vol', level);
            if (save)
                ports.save('pianoVolume', String(level));
            ports.setPianoVolume(level);
        }
        function updateMidiOutVolume(value, { save = true } = {}) {
            if (!active)
                return;
            const level = Math.max(0, Math.min(100, parseInt(String(value), 10) || 0));
            state.midiOutVolume = level;
            syncPair('slider-midiout-vol', 'val-midiout-vol', level);
            if (save)
                ports.save('midiOutVolume', String(level));
            ports.sendMidiOutExpressionLevel(level);
        }
        function syncMidiInBoostUi() { if (active)
            dom.element('routing-midiin-boost-row')?.classList.toggle('hidden', !state.audioEnabled.instrument); }
        function updateMidiInBoost(value, { save = true } = {}) {
            if (!active)
                return;
            const level = Math.max(50, Math.min(200, parseInt(String(value), 10) || 100));
            state.midiInBoost = level;
            syncPair('slider-midiin-boost', 'val-midiin-boost', level);
            if (save)
                ports.save('midiInBoost', String(level));
            syncMidiInBoostUi();
        }
        function updateMetroVolume(value, { save = true } = {}) {
            if (!active)
                return;
            const level = Math.max(0, Math.min(100, parseInt(String(value), 10) || 0));
            syncPair('slider-metro-vol', 'val-metro-vol', level);
            if (save)
                ports.save('metroVolume', String(level));
            if (level === 0)
                ports.setMetronomeVolumeDecibels(-Infinity);
            else
                ports.setMetronomeVolumeDecibels(20 * Math.log10(level / 100));
        }
        function init() {
            if (initialized)
                return;
            active = true;
            initialized = true;
            for (const [sliderId, inputId, command] of [
                ['slider-piano-vol', 'val-piano-vol', updatePianoVolume], ['slider-midiout-vol', 'val-midiout-vol', updateMidiOutVolume],
                ['slider-midiin-boost', 'val-midiin-boost', updateMidiInBoost], ['slider-metro-vol', 'val-metro-vol', updateMetroVolume]
            ]) {
                dom.onInput(dom.optionalInput(sliderId), 'input', node => command(node.value));
                dom.onInput(dom.optionalInput(inputId), 'change', node => command(node.value));
            }
        }
        function dispose() { active = false; initialized = false; dom.dispose(); }
        return { init, dispose, updatePianoVolume, updateMidiOutVolume, updateMidiInBoost, updateMetroVolume, syncMidiInBoostUi,
            readPianoVolume: () => dom.optionalInput('slider-piano-vol')?.value ?? 80, readMetroVolume: () => dom.optionalInput('slider-metro-vol')?.value ?? 50 };
    }
    PianoTrainerAudioLevelControls.create = create;
})(PianoTrainerAudioLevelControls || (PianoTrainerAudioLevelControls = {}));
//# sourceMappingURL=audio-level-controls.js.map