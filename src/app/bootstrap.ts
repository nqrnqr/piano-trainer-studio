import {createServices} from './services';
export function createApplication() {
    const services = createServices();
    return {init: services.init, suspend: services.suspend, resume: services.resume, dispose: services.dispose,
        loadScore: services.scoreLoader.loadScoreIntoApp, dispatchInput: services.practiceInput.handle};
}
