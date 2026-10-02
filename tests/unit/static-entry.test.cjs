const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { SourceMap } = require('node:module');
const { test } = require('node:test');
const { root, read } = require('../helpers/legacy-script.cjs');

test('static entry loads exactly one timing implementation before its core consumers', () => {
    const scripts = [...read('index.html').matchAll(/src="(js\/[^"?]+)\?v=/g)].map(match => match[1]);
    assert.deepEqual(scripts.filter(file => /(?:^|\/)(?:trainer-)?timing\.js$/.test(file)), ['js/generated/domain/timing.js']);
    assert.equal(scripts.filter(file => file === 'js/generated/score/measure-timing.js').length, 1,
        'measure traversal cache is distinct from the shared timing algorithm');
    const runtime = scripts.map(read).join('\n');
    for (const method of ['getRemainingMeasureWaitWhole', 'getTraversalBeatsToWait']) {
        assert.equal([...runtime.matchAll(new RegExp(`window\\.PTTiming\\.${method}\\s*=\\s*function`, 'g'))].length, 1,
            `${method} has exactly one runtime implementation regardless of file name`);
    }
    assert.ok(scripts.indexOf('js/generated/domain/timing.js') < scripts.indexOf('js/trainer-core.js'));
    assert.equal(fs.existsSync(path.join(root, 'js/trainer-timing.js')), false);
    assert.notEqual(JSON.parse(read('package.json')).type, 'module');
});

test('served source map embeds the unique TS source and maps both timing calculations', () => {
    const generated = read('js/generated/domain/timing.js');
    const payload = JSON.parse(read('js/generated/domain/timing.js.map'));
    const source = read('src/domain/timing.ts');
    assert.equal(generated.match(/sourceMappingURL=(\S+)/)[1], 'timing.js.map');
    assert.equal(payload.sources.length, 1);
    assert.equal(path.resolve(root, 'js/generated/domain', payload.sources[0]), path.join(root, 'src/domain/timing.ts'));
    assert.equal(payload.sourcesContent[0], source);
    const map = new SourceMap(payload);
    for (const [js, ts] of [
        ['const remainingWhole = measureEnd - currentTimestamp;', 'const remainingWhole = measureEnd - currentTimestamp!;'],
        ['if (nextTimestamp < currentTimestamp)', 'if (nextTimestamp! < currentTimestamp!)'],
        ['return (nextTimestamp - currentTimestamp) * 4;', 'return (nextTimestamp! - currentTimestamp!) * 4;']
    ]) {
        const generatedLine = generated.split('\n').findIndex(line => line.includes(js));
        const originalLine = source.split('\n').findIndex(line => line.includes(ts));
        assert.ok(generatedLine >= 0 && originalLine >= 0, 'timing expressions exist');
        const entry = map.findEntry(generatedLine, 4);
        assert.equal(entry.originalLine, originalLine);
        assert.equal(entry.originalSource, payload.sources[0]);
    }
});
