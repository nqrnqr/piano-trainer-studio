const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const { runScript } = require('../helpers/legacy-script.cjs');

const context = vm.createContext({ window: {} });
runScript(context, process.env.PT_TIMING_SCRIPT || 'js/generated/domain/timing.js');
const timing = context.PianoTrainerTiming;
const measure = { startTimestamp: 4, actualLengthWhole: 1, nominalMeasureLengthWhole: 1 };
const options = {
    currentMeasureIdx: 4, currentTimestamp: 4.75,
    nextMeasureIdx: 5, nextTimestamp: 5,
    fallbackLength: 0.125, getMeasureTimingInfo: () => measure
};

for (const [name, patch, expected] of [
    ['forward quarter note', { nextMeasureIdx: 4, currentTimestamp: 4.25, nextTimestamp: 4.5 }, 1],
    ['adjacent measure', {}, 1],
    ['backward repeat uses remainder, not negative delta', { nextMeasureIdx: 0, nextTimestamp: 0 }, 1],
    ['ending skip uses remainder, not skipped measures', { nextMeasureIdx: 6, nextTimestamp: 6 }, 1],
    ['zero interval stays zero', { nextMeasureIdx: 4, nextTimestamp: 4.75 }, 0],
    ['backward timestamp within a measure uses remainder', { nextMeasureIdx: 4, nextTimestamp: 4.5 }, 1]
]) {
    test(name, () => assert.equal(timing.getTraversalBeatsToWait({ ...options, ...patch }), expected));
}

for (const [name, patch, expected] of [
    ['actual pickup length wins over nominal meter', { currentTimestamp: 4.125, getMeasureTimingInfo: () => ({ ...measure, actualLengthWhole: 0.25 }) }, 0.125],
    ['zero actual length falls back to nominal', { getMeasureTimingInfo: () => ({ ...measure, actualLengthWhole: 0 }) }, 0.25],
    ['negative actual length falls back to nominal', { getMeasureTimingInfo: () => ({ ...measure, actualLengthWhole: -1 }) }, 0.25],
    ['nonfinite actual length falls back to nominal', { getMeasureTimingInfo: () => ({ ...measure, actualLengthWhole: NaN }) }, 0.25],
    ['missing callback uses note length', { getMeasureTimingInfo: undefined }, 0.125],
    ['missing timing uses note length', { getMeasureTimingInfo: () => null }, 0.125],
    ['missing measure start uses note length', { getMeasureTimingInfo: () => ({ actualLengthWhole: 1 }) }, 0.125],
    ['nonfinite start uses note length', { getMeasureTimingInfo: () => ({ ...measure, startTimestamp: Infinity }) }, 0.125],
    ['invalid actual and nominal lengths use note length', { getMeasureTimingInfo: () => ({ ...measure, actualLengthWhole: -1, nominalMeasureLengthWhole: NaN }) }, 0.125],
    ['nonfinite current timestamp uses note length', { currentTimestamp: NaN }, 0.125],
    ['at measure end uses note length', { currentTimestamp: 5 }, 0.125],
    ['beyond measure end uses note length', { currentTimestamp: 5.25 }, 0.125],
    ['epsilon remainder uses note length', { currentTimestamp: 5 - 0.0000005 }, 0.125],
    ['larger remainder is preserved', { currentTimestamp: 4.999 }, 5 - 4.999],
    ['zero fallback becomes a quarter whole-note unit', { getMeasureTimingInfo: undefined, fallbackLength: 0 }, 0.25],
    ['negative fallback becomes a quarter whole-note unit', { getMeasureTimingInfo: undefined, fallbackLength: -1 }, 0.25],
    ['infinite fallback becomes a quarter whole-note unit', { getMeasureTimingInfo: undefined, fallbackLength: Infinity }, 0.25],
    ['NaN fallback becomes a quarter whole-note unit', { getMeasureTimingInfo: undefined, fallbackLength: NaN }, 0.25],
    ['omitted fallback remains one whole note', { getMeasureTimingInfo: undefined, fallbackLength: undefined }, 1]
]) {
    test(name, () => assert.equal(timing.getRemainingMeasureWaitWhole({ ...options, ...patch }), expected));
}

test('legacy omitted-options semantics remain unchanged', () => {
    assert.equal(timing.getRemainingMeasureWaitWhole(), 1);
    assert.ok(Number.isNaN(timing.getTraversalBeatsToWait()));
});

test('callback receives current measure index, including omitted index', () => {
    const indices = [];
    timing.getRemainingMeasureWaitWhole({ ...options, getMeasureTimingInfo: index => { indices.push(index); return measure; } });
    timing.getRemainingMeasureWaitWhole({ getMeasureTimingInfo: index => { indices.push(index); return null; } });
    assert.deepEqual(indices, [4, undefined]);
});

test('timing module does not publish or overwrite a Window namespace', () => {
    const existing = { sentinel: 42 };
    const other = vm.createContext({ window: { PTTiming: existing } });
    runScript(other, process.env.PT_TIMING_SCRIPT || 'js/generated/domain/timing.js');
    assert.equal(other.window.PTTiming, existing);
    assert.equal(existing.sentinel, 42);
    assert.notEqual(other.PianoTrainerTiming, existing);
    assert.equal(other.PianoTrainerTiming.getRemainingMeasureWaitWhole(), 1);
});
