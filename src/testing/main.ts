import {createTestFacade} from './facade';
declare global {interface Window {PianoTrainerTest:ReturnType<typeof createTestFacade>;}}
window.PianoTrainerTest=createTestFacade();
