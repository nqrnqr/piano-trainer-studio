import {createTestFacade} from './facade';
import type {ServicePorts} from '../app/services';
import type {LibraryFixturePorts} from './library-checks';
declare global {interface Window {
    PianoTrainerTest:ReturnType<typeof createTestFacade>;
    __PT_TEST_OPTIONS__?:{controlledPlayback?:boolean; nativePlayback?:boolean};
    AudioFixture?:{tone:NonNullable<ServicePorts['audioTone']>};
    MetronomeFixture?:{tone:NonNullable<ServicePorts['metronomeTone']>};
    __PT_LIBRARY_FIXTURE__?:LibraryFixturePorts;
}}
window.PianoTrainerTest=createTestFacade(window.__PT_TEST_OPTIONS__,{
    ...(window.AudioFixture ? {audioTone:window.AudioFixture.tone} : {}),
    ...(window.MetronomeFixture ? {metronomeTone:window.MetronomeFixture.tone} : {})
},window.__PT_LIBRARY_FIXTURE__);
