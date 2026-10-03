import {createApplication} from './app/bootstrap';
const app = createApplication();
app.init();
window.addEventListener('pagehide', () => app.dispose(), {once: true});
