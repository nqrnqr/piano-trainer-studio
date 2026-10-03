import {LegacyAppState} from '../state/model';
import {PianoTrainerControlDom} from './controls-dom';
// Tempo edits preview before change; existing Wait metronome rebuild timing is retained.
export namespace PianoTrainerTempoControls {
    export interface Ports {
        document: Document;
        state: Pick<LegacyAppState,'baseBpm'|'speedPercent'|'mode'|'isPlaying'|'countInActive'|
            'accentedDownbeatEnabled'|'visualPulseEnabled'|'metronomeMidiOutEnabled'>;
        hasMidiOutput(): boolean;
        setBpm(value: number): void;
        getCurrentMeasureIndex(): number | undefined;
        getWaitMeasureIndex(): number;
        rebuildWaitModeMetronome(index: number): void;
        saveBool(key: 'accentedDownbeat'|'visualPulse'|'metronomeMidiOut',value: boolean): void;
        clearTempoVisualPulse(): void;
        clearScheduledMetronomeEvents(): void;
        stopWaitModeMetronome(): void;
    }
    export function create(ports: Ports) {
        const dom=PianoTrainerControlDom.create(ports.document),state=ports.state;
        let active=true,editingInitialized=false,preferencesInitialized=false,metronomeInitialized=false;
        function syncTempoMetronomeDependentUi() {
            if (!active) return;
            const enabled=!!dom.optionalInput('check-metronome')?.checked,hasMidi=ports.hasMidiOutput(),midiMode=!!dom.optionalInput('check-metronome-midiout')?.checked;
            const label=dom.element('tempo-metro-volume-label'),hint=dom.element('tempo-midiout-metronome-hint');
            const controls=['slider-metro-vol','val-metro-vol','check-accented-downbeat','check-visual-pulse','check-metronome-midiout'].map(id=>dom.optionalInput(id));
            if (label) {label.textContent=midiMode?'Level':'Volume'; label.setAttribute('aria-disabled',enabled?'false':'true');}
            for (const control of controls) {
                if (!control) continue;
                control.disabled=!enabled; control.closest('label')?.classList.toggle('is-disabled',!enabled);
            }
            if (hint) {
                hint.textContent=hasMidi?'Uses GM percussion on the selected MIDI Out device.':
                    'Select a MIDI Out device to hear metronome clicks on Channel 10. Some keyboards require a drum (Ch 10) or multi-timbral mode to avoid piano sounds.';
                hint.classList.toggle('is-disabled',!enabled||!hasMidi);
            }
        }
        function syncTempoPreviewFromPercent(value: string | number) {
            if (!active) return;
            const base=state.baseBpm||120,percent=Math.max(10,Math.min(200,parseInt(String(value),10)||100)),bpm=Math.round(base*(percent/100));
            dom.input('slider-speed').value=String(percent); dom.input('val-speed').value=String(percent); dom.input('val-bpm').value=String(bpm);
        }
        function updateTempo(source: 'percent'|'bpm',value: string | number) {
            if (!active) return;
            const base=state.baseBpm||120;
            // The committed input used parseInt without a radix in the baseline.
            let percent: number, bpm: number;
            if (source==='percent') {
                percent=Math.max(10,Math.min(200,parseInt(String(value))||100)); bpm=Math.round(base*(percent/100));
            } else {
                bpm=Math.max(1,parseInt(String(value))||base); percent=Math.round((bpm/base)*100);
            }
            dom.input('slider-speed').value=String(percent); dom.input('val-speed').value=String(percent); dom.input('val-bpm').value=String(bpm);
            state.speedPercent=percent/100; ports.setBpm(bpm);
            if (state.isPlaying&&!state.countInActive&&state.mode==='wait') ports.rebuildWaitModeMetronome(ports.getCurrentMeasureIndex()??ports.getWaitMeasureIndex());
        }
        function initEditing() {
            if (editingInitialized) return;
            active=true; editingInitialized=true;
            const slider=dom.input('slider-speed'),input=dom.input('val-speed'),bpm=dom.input('val-bpm');
            dom.onInput(slider,'input',node=>syncTempoPreviewFromPercent(node.value)); dom.onInput(slider,'change',node=>updateTempo('percent',node.value));
            dom.onInput(input,'change',node=>updateTempo('percent',node.value)); dom.onInput(bpm,'change',node=>updateTempo('bpm',node.value));
        }
        function initMetronomePreferences() {
            if (preferencesInitialized) return;
            active=true; preferencesInitialized=true;
            dom.onInput(dom.optionalInput('check-accented-downbeat'),'change',node=>{state.accentedDownbeatEnabled=node.checked;ports.saveBool('accentedDownbeat',state.accentedDownbeatEnabled);});
            dom.onInput(dom.optionalInput('check-visual-pulse'),'change',node=>{
                state.visualPulseEnabled=node.checked; ports.saveBool('visualPulse',state.visualPulseEnabled);
                if (!state.visualPulseEnabled) ports.clearTempoVisualPulse();
            });
            dom.onInput(dom.optionalInput('check-metronome-midiout'),'change',node=>{
                state.metronomeMidiOutEnabled=node.checked; ports.saveBool('metronomeMidiOut',state.metronomeMidiOutEnabled); syncTempoMetronomeDependentUi();
            });
        }
        function initMetronomeToggle() {
            if (metronomeInitialized) return;
            active=true; metronomeInitialized=true;
            dom.onInput(dom.optionalInput('check-metronome'),'change',node=>{
                syncTempoMetronomeDependentUi();
                if (!node.checked) {ports.clearScheduledMetronomeEvents();ports.stopWaitModeMetronome();ports.clearTempoVisualPulse();return;}
                if (state.isPlaying&&!state.countInActive&&state.mode==='wait') ports.rebuildWaitModeMetronome(ports.getCurrentMeasureIndex()??ports.getWaitMeasureIndex());
            });
            syncTempoMetronomeDependentUi();
        }
        function init() {initEditing();initMetronomePreferences();initMetronomeToggle();}
        function dispose() {active=false;editingInitialized=false;preferencesInitialized=false;metronomeInitialized=false;dom.dispose();}
        return {init,initEditing,initMetronomePreferences,initMetronomeToggle,dispose,syncTempoMetronomeDependentUi,syncTempoPreviewFromPercent,updateTempo};
    }
    export type Service=ReturnType<typeof create>;
}
