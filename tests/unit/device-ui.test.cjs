const test = require('node:test');
const assert = require('node:assert/strict');
const {stateHarness} = require('../helpers/state-harness.cjs');
const {runScript} = require('../helpers/legacy-script.cjs');

function harness() {
    const h = stateHarness();
    class Button { disabled=false; dataset={}; textContent=''; addEventListener() {} }
    class Select { constructor(value) {this.value=value;} }
    const button=new Button();
    const classes=()=>({values:new Set(),add(...values){for(const v of values)this.values.add(v);},
        remove(...values){for(const v of values)this.values.delete(v);},toggle(v,on){on?this.values.add(v):this.values.delete(v);}});
    const indicator=()=>{const label={textContent:''},dot={classList:classes()};return {
        classList:classes(),querySelector:selector=>selector === '.status-dot'?dot:label,label,dot};};
    const elements=new Map([['btn-check-updates',button],['app-version-display',{textContent:''}],['update-status',{textContent:''}],
        ['midi-in',new Select('input')],['midi-out',new Select('output')],['midi-lights',new Select('none')],
        ['midi-in-connection-status',indicator()],['midi-out-connection-status',indicator()],['led-connection-status',indicator()]]);
    Object.assign(h.context,{HTMLButtonElement:Button,HTMLSelectElement:Select,URL,URLSearchParams,
        document:{getElementById:id=>elements.get(id)},syncMidiOutChannelVisibility(){},syncWledStatus(){},
        getLegacyMidiPort:(direction,id)=>id==='input'?{state:'connected'}:id==='output'?{state:'disconnected'}:undefined});
    const replaced=[];
    h.context.window.location={hostname:'127.0.0.1',protocol:'http:',href:'http://127.0.0.1:8081/index.html?led=off#score',
        replace:url=>replaced.push(url),reload:()=>replaced.push('reload')};
    h.context.window.history={replaceState(){}};
    for(const file of ['permission-help','connection-status','update-controls']) runScript(h.context,`js/generated/ui/${file}.js`);
    h.state.updateManifestUrl='/manifest.json';
    return {...h,elements,button,replaced};
}
test('MIDI connection indicators and access failure messages work without any LED implementation',()=>{
    const h=harness();
    h.evaluate('updateConnectionStatuses()');
    assert.equal(h.elements.get('midi-in-connection-status').label.textContent,'Connected');
    assert.equal(h.elements.get('midi-out-connection-status').label.textContent,'Disconnected');
    assert.equal(h.elements.get('led-connection-status').label.textContent,'None');
    assert.equal(h.evaluate('isLikelyBrowserAccessIssue(new Error("Failed to fetch"))'),true);
    assert.equal(h.evaluate('isLikelyBrowserAccessIssue("mixed content")'),true);
    assert.equal(h.evaluate('isLikelyBrowserAccessIssue(null)'),false);
    assert.match(h.evaluate('getMidiPermissionHelpText()'),/MIDI\/device access/);
});
test('manual local update checks preserve external JSON coercion, availability and button state',async()=>{
    const h=harness();
    h.context.fetch=async()=>({ok:true,json:async()=>({version:'v99.2.0',downloadUrl:123})});
    await h.evaluate('checkForUpdates({manual:true})');
    assert.equal(h.state.updateInfo.remoteVersion,'v99.2.0');
    assert.equal(h.state.updateInfo.downloadUrl,'123');
    assert.equal(h.state.updateInfo.updateAvailable,true);
    assert.equal(h.button.textContent,'Download Latest');
    assert.equal(h.button.disabled,false);
    assert.equal(h.replaced.length,0);
    h.context.fetch=async()=>({ok:true,json:async()=>42});
    await h.evaluate('checkForUpdates({manual:true})');
    assert.equal(h.state.updateStatus,'Update manifest is missing a version value.');
    h.context.fetch=async()=>{throw new Error('network unavailable');};
    await h.evaluate('checkForUpdates({manual:true})');
    assert.equal(h.state.updateInfo,null);
    assert.equal(h.state.updateStatus,'Update check failed: network unavailable');
    assert.equal(h.button.disabled,false);
});
test('remote automatic update keeps URL settings while adding cache version; local runtime does not reload',async()=>{
    const h=harness();
    h.context.window.location.hostname='example.test';
    h.context.fetch=async()=>({ok:true,json:async()=>({version:'99.0.0'})});
    await h.evaluate('checkForUpdates()');
    const url=new URL(h.replaced[0]);
    assert.equal(url.searchParams.get('led'),'off');
    assert.equal(url.searchParams.get('appv'),'99.0.0');
    assert.equal(url.hash,'#score');
    assert.equal(h.localStorage.getItem('pt_assetVersionOverride'),'99.0.0');
    assert.equal(h.evaluate('compareSemverLoose("v1.2.4", "1.2.4")'),0);
});
