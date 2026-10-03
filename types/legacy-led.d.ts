interface Window {
    __PT_BOOT_OPTIONS__?: {ledEnabled?: boolean};
    PianoTrainerLegacyLed: {create(ports: PianoTrainerLegacyLed.Ports): PianoTrainerLegacyLed.Instance};
    PianoTrainerLegacyMidiLedTest: {create(ports: PianoTrainerLegacyLed.MidiTestPorts): PianoTrainerLegacyLed.MidiTestInstance};
}
