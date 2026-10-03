import {createTestFacade} from './facade';
declare global {interface Window {PianoTrainerTest:ReturnType<typeof createTestFacade>;__PT_TEST_OPTIONS__?:{controlledPlayback?:boolean};}}
window.PianoTrainerTest=createTestFacade(window.__PT_TEST_OPTIONS__);
