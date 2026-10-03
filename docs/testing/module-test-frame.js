// Test entry only. Use the production HTML/vendors and a separate facade bundle.
window.mountModuleTestFrame = async function (frame, options = {}) {
    const html = await (await fetch('/index.html')).text();
    if (!html.includes('js/generated/app.js')) throw Error('Missing production module entry');
    const noLed = new URLSearchParams(location.search).get('led') === 'off';
    const preferences = {pt_firstRunIntroSeen:'true', ...options.preferences};
    const boot = '<script>window.__PT_BOOT_OPTIONS__={ledEnabled:'+ !noLed +'};<'+'/script>';
    const fixtures = ['library-fixture.js', ...(options.fixtures || [])]
        .map(name => '<script src="/docs/testing/'+ name +'"><'+'/script>').join('');
    const seed = '<script>for(const [key,value]of Object.entries('+ JSON.stringify(preferences) +'))localStorage.setItem(key,value);<'+'/script>';
    const ports = '<script>window.__PT_TEST_OPTIONS__='+JSON.stringify(options.ports || {})+';<'+'/script>';
    const appSlot = html.indexOf('    <script>document.write(\'<script src="js/generated/app.js');
    if (appSlot < 0) throw Error('Missing application bundle slot');
    const lateFixtures = (options.lateFixtures || [])
        .map(name => '<script src="/docs/testing/'+ name +'"><'+'/script>').join('');
    frame.srcdoc = (html.slice(0,appSlot)+lateFixtures+html.slice(appSlot))
        .replace('js/generated/app.js','docs/testing/generated/test-app.js')
        .replace('<head>','<head><base href="/">'+boot+fixtures+seed+ports);
};
