import type {PianoTrainerLegacyLed} from '../src/optional/led/legacy-led-contract';
declare global {interface Window {
 __PT_APP_MANIFEST__?: {version?:unknown;releaseUrl?:unknown;downloadUrl?:unknown};
 __PT_ASSET_VERSION__?: string;
 __PT_BOOT_OPTIONS__?: {ledEnabled?:boolean};
 PianoTrainerLegacyLed: {create(ports:PianoTrainerLegacyLed.Ports):PianoTrainerLegacyLed.Instance};
 PianoTrainerLegacyMidiLedTest: {create(ports:PianoTrainerLegacyLed.MidiTestPorts):PianoTrainerLegacyLed.MidiTestInstance};
}}
