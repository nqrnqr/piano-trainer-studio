import {createApplication} from './app/bootstrap';
const app = createApplication();
app.init();
function onPageHide(event: PageTransitionEvent) {
    if (event.persisted) {
        app.suspend();
        return;
    }
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    app.dispose();
}
function onPageShow(event: PageTransitionEvent) {
    if (event.persisted) app.resume();
}
window.addEventListener('pagehide', onPageHide);
window.addEventListener('pageshow', onPageShow);
