const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {runScript} = require('../helpers/legacy-script.cjs');

function load() {
    const context = vm.createContext({});
    runScript(context,'js/generated/optional/led/legacy-led-adapter.js');
    return vm.runInContext('PianoTrainerOptionalLed',context);
}
test('no-op permits complete output lifecycle without browser frames or hardware ports', async () => {
    const output = load().createNoop();
    assert.equal(output.enabled,false);
    output.initControls(); output.initOutput(); output.refreshMapping(); output.invalidate(); output.positionCalibrationPanel();
    output.render(new Map([[60,'expected-r']]),1); output.renderOutputs();
    output.updateHardware(60,'expected-r',null); output.wipeHardware();
    await output.clearOutputs(); output.start(); output.start(); output.dispose(); output.dispose();
});
test('legacy adapter preserves per-frame output/calibration behavior and releases its own frame', () => {
    const api = load(), frames = new Map(), output = [];
    let seq = 0, calibrating = false, cleanup = 0;
    const adapter = api.createLegacy({
        requestFrame: cb=>{frames.set(++seq,cb);return seq;}, cancelFrame:id=>frames.delete(id),
        isCalibrating:()=>calibrating, renderOutputs:()=>output.push('output'),renderKeyboard:()=>output.push('keyboard'),
        stopHardwareResources:()=>cleanup++
    });
    adapter.start(); adapter.start();
    assert.equal(frames.size,1);
    const frame = () => {const [id,cb] = frames.entries().next().value;frames.delete(id);cb(0);};
    frame(); calibrating=true; frame();
    assert.deepEqual(output,['output','keyboard']);
    assert.equal(frames.size,1);
    adapter.dispose();
    assert.equal(frames.size,0);
    assert.equal(cleanup,1);
    adapter.start(); frame(); adapter.dispose();
    assert.equal(frames.size,0);
    assert.deepEqual(output,['output','keyboard','keyboard']);
});
