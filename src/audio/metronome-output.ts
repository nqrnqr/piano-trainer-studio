// Own the original MembraneSynth without allocating a node during composition.
namespace PianoTrainerMetronomeOutput {
    export interface Ports { tone: Pick<PianoTrainerToneVendor.Api, 'MembraneSynth'>; }
    export function create(ports: Ports) {
        let synth: PianoTrainerToneVendor.MembraneVoice | null = null;
        function init() {
            if (synth) return;
            synth = new ports.tone.MembraneSynth({pitchDecay:0.008,octaves:1.5,
                oscillator:{type:'sine'},envelope:{attack:0.001,decay:0.1,sustain:0,release:0.01}}).toDestination();
        }
        function play(note: string, duration: '64n', time: number, gain: number) {
            synth!.triggerAttackRelease(note, duration, time, gain);
        }
        function setVolumeDecibels(value: number) { synth!.volume.value = value; }
        function dispose() { synth?.dispose(); synth = null; }
        return {init, play, setVolumeDecibels, dispose};
    }
    export type Service = ReturnType<typeof create>;
}
