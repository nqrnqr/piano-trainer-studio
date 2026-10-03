import type {createServices} from '../app/services';

export function createMidiChecks(getServices: () => ReturnType<typeof createServices>) {
    return Object.freeze({
        initService:() => getServices().midiService.init(),
        disposeService:() => getServices().midiService.dispose(),
        initControls:() => getServices().midiControls.init(),
        disposeControls:() => getServices().midiControls.dispose(),
        populateDevices:() => getServices().midiControls.populateMIDIDevices(),
        populateChannels:(id:'midi-out-channel'|'midi-lights-channel') => getServices().midiControls.populateMidiChannelSelect(id,1),
        noteOn:(note:number,velocity = 100) => getServices().midiOutput.noteOn(note,velocity),
        noteOff:(note:number) => getServices().midiOutput.noteOff(note),
        readChannels:() => ({input:getServices().AppState.midiInChannel,output:getServices().AppState.midiOutChannel})
    });
}
