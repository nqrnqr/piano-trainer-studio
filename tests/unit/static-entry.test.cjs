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
    assert.equal(scripts.filter(file => file === 'js/generated/practice/playback-coordinator.js').length, 1);
    assert.equal(scripts.includes('js/feedback-engine.js'), false);
    assert.equal(fs.existsSync(path.join(root, 'js/feedback-engine.js')), false);
    for (const name of ['playbackLoop', 'checkWaitModeAdvance', 'startPlaybackFromToolbar']) {
        assert.equal([...runtime.matchAll(new RegExp(`function ${name}\\(`, 'g'))].length, 1, `${name} has one runtime implementation`);
    }
    for (const file of ['score/musicxml-io', 'score/score-loader', 'ui/score-file-reader', 'ui/score-file-controls', 'compatibility/score-data']) {
        assert.equal(scripts.filter(script => script === `js/generated/${file}.js`).length, 1);
    }
    for (const name of ['loadScoreIntoApp', 'extractMusicXmlFromMxl', 'readScoreFile', 'handleDirectScoreFileSelection']) {
        assert.equal([...runtime.matchAll(new RegExp(`function ${name}\\(`, 'g'))].length, 1, `${name} has one runtime implementation`);
    }
    for (const file of ['score/transpose-engine','score/transpose-controller','ui/transpose-controls','compatibility/transpose',
        'score/webmscore-adapter','score/score-conversion','compatibility/score-conversion']) {
        assert.equal(scripts.filter(script=>script===`js/generated/${file}.js`).length,1);
    }
    for (const file of ['js/midi-import.js','js/transpose/transpose-engine.js','js/transpose/transpose-ui.js']) {
        assert.equal(scripts.includes(file),false);assert.equal(fs.existsSync(path.join(root,file)),false);
    }
    for (const name of ['domain/library','score/library-backup','score/score-library','compatibility/score-library']) {
        assert.equal(scripts.filter(file=>file===`js/generated/${name}.js`).length,1);
    }
    assert.equal(scripts.includes('js/score-library.js'),false);
    assert.equal(fs.existsSync(path.join(root,'js/score-library.js')),false);
    for (const name of ['domain/library-view','ui/library-controls-state','ui/library-dialogs','ui/library-actions',
        'ui/library-list','ui/scores-drawer','compatibility/scores-ui']) {
        assert.equal(scripts.filter(file=>file===`js/generated/${name}.js`).length,1);
    }
    assert.equal(scripts.includes('js/scores-ui.js'),false);
    assert.equal(fs.existsSync(path.join(root,'js/scores-ui.js')),false);
    for (const name of ['ui/toolbar','compatibility/toolbar','ui/controls-dom','ui/display-controls','ui/tempo-controls',
        'ui/audio-level-controls','ui/loop-controls','compatibility/native-controls']) {
        assert.equal(scripts.filter(file=>file===`js/generated/${name}.js`).length,1);
    }
    assert.equal(scripts.includes('js/toolbar-ui.js'),false);
    assert.equal(fs.existsSync(path.join(root,'js/toolbar-ui.js')),false);
    assert.equal(fs.existsSync(path.join(root,'types/legacy-playback.d.ts')),false);
    for (const name of ['domain/hand-routing','compatibility/hand-routing','app/hand-assignment-controller',
        'ui/hand-assignment-controls','ui/practice-controls','ui/preference-controls','ui/settings-actions','compatibility/preference-controls']) {
        assert.equal(scripts.filter(file=>file===`js/generated/${name}.js`).length,1);
    }
    for (const name of ['domain/keyboard-state','render/virtual-keyboard','app/keyboard-controller','ui/virtual-keyboard-controls',
        'app/score-seek-controller','ui/score-seek-controls','ui/score-status','app/score-ui-controller','compatibility/keyboard-and-score-controls']) {
        assert.equal(scripts.filter(file=>file===`js/generated/${name}.js`).length,1);
    }
    for (const name of ['applyZoom','updateTempo','syncLooper','requestAppFullscreen','showToolbarPanel']) {
        assert.equal([...runtime.matchAll(new RegExp(`function ${name}\\(`,'g'))].length,1,`${name} has one runtime implementation`);
    }
    for (const name of ['ui/settings-controls','compatibility/settings-files','score/osmd-debug-observation','ui/feedback-debug','compatibility/feedback-debug']) {
        assert.equal(scripts.filter(file=>file===`js/generated/${name}.js`).length,1);
    }
    assert.equal(scripts.includes('js/feedback-debug.js'),false);
    assert.equal(fs.existsSync(path.join(root,'js/feedback-debug.js')),false);
    assert.equal(fs.existsSync(path.join(root,'types/legacy-traversal.d.ts')),false);
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
