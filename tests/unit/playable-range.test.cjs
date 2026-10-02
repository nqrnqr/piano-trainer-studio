const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const { runScript } = require('../helpers/legacy-script.cjs');
const { stateHarness } = require('../helpers/state-harness.cjs');

// Domain math executes with no Window, DOM, storage or AppState at all.
const pure = vm.createContext({});
runScript(pure, 'js/generated/domain/playable-range.js');

for (const [keys, min, max] of [[88, 21, 108], [76, 27, 102], [73, 28, 100], [61, 34, 94], [49, 40, 88], [37, 46, 82], [32, 49, 80], [25, 52, 76]]) {
    test(`${keys}-key range preserves asymmetric trim, bounds and normalized positions`, () => {
        const range = pure.derivePlayerRangeFromKeyboardSize(keys);
        assert.equal(range.minMidi, min);
        assert.equal(range.maxMidi, max);
        assert.equal(range.keyCount, keys);
        assert.equal(range.trimmedLowKeys + range.trimmedHighKeys, 88 - keys);
        assert.equal(pure.isMidiInPlayableRange(min, range), true);
        assert.equal(pure.isMidiInPlayableRange(max, range), true);
        assert.equal(pure.isMidiInPlayableRange(min - 1, range), false);
        assert.equal(pure.isMidiInPlayableRange(max + 1, range), false);
        assert.equal(pure.getPlayableRangePosition01(min, range), 0);
        assert.equal(pure.getPlayableRangePosition01(max, range), 1);
    });
}

test('range normalization keeps legacy coercion and unsupported sizes default to 88', () => {
    assert.equal(pure.normalizePlayerPianoType('49'), 49);
    for (const invalid of [undefined, null, '', 'bad', NaN, Infinity, 0, 24, 50, 87, 89]) assert.equal(pure.normalizePlayerPianoType(invalid), 88);
    const range = pure.derivePlayerRangeFromKeyboardSize(88);
    assert.equal(pure.isMidiInPlayableRange('21', range), true);
    assert.equal(pure.isMidiInPlayableRange('bad', range), false);
    assert.equal(pure.getPlayableRangePosition01(20, range) < 0, true); // No new clamping.
});

test('shared cache works with LED off, reuses identity and refreshes on keyboard change', () => {
    const h = stateHarness();
    h.state.ledOutputMode = 'none';
    const range = h.context.getPlayerPlayableRange();
    assert.equal(h.context.getPlayerPlayableRange(), range);
    assert.equal(h.context.isMidiInPlayerRange(21), true);
    h.state.playerPianoType = 25;
    const smaller = h.context.getPlayerPlayableRange();
    assert.notEqual(smaller, range);
    assert.equal(h.context.getPlayerPlayableRange(), smaller);
    assert.equal(h.context.isMidiInPlayerRange(21), false);
    assert.equal(h.context.getMidiKeyPosition01(52), 0);
    assert.equal(h.context.getMidiKeyPosition01(76), 1);
});

test('out-of-range score-note forwarding retains note coercion and no state mutation', () => {
    const h = stateHarness();
    h.state.outOfRangeCurrentNotes = [{ midi: 15, staffId: 1, mIdx: 0 }];
    const before = h.state.outOfRangeCurrentNotes;
    assert.equal(h.context.isCurrentOutOfRangeScoreNote('15'), true);
    assert.equal(h.context.isCurrentOutOfRangeScoreNote(60), false);
    assert.equal(h.state.outOfRangeCurrentNotes, before);
});
