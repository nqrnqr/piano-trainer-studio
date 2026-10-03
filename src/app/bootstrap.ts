import {createServices} from './services';
export function createApplication() {
    const services = createServices();
    return {init: services.init, dispose: services.dispose,
        loadScore: services.scoreLoader.loadScoreIntoApp, dispatchInput: services.practiceInput.handle};
}
