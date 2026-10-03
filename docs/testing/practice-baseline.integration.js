// P0 characterization: real bundled OSMD and the unchanged production engine.
(async () => {
    const results = parent.document.getElementById('results');
    results.textContent = '';
    const check = (ok, message) => {
        results.textContent += `${ok ? 'PASS' : 'FAIL'} ${message}\n`;
        if (!ok) throw new Error(message);
    };
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const api = window.PianoTrainerTest;
    const position = () => api.readViewportSnapshot().cursorLeft;
    const load = async name => {
        const response = await fetch(`/docs/testing/fixtures/${name}.musicxml`);
        if (!response.ok) throw new Error(`Fixture ${name}: HTTP ${response.status}`);
        await api.loadScore(await response.text(), { fileName: `${name}.musicxml` });
    };
    const stop = () => api.practice.stop();
    try {
        api.practice.muteOutputs();

        for (const layout of ['traditional', 'horizontal']) {
            for (const mode of ['wait', 'follow', 'realtime']) {
                stop();
                await load('simple-repeat');
                api.setLayout(layout, { save: false });
                api.beginScenario(mode);
                const label = `${mode}/${layout}`;
                const painted = position();
                const context = { ...api.readPracticeSnapshot().context };
                const expected = api.readPracticeSnapshot().expected.map(note => note.midi);
                check(expected.length === 2, `${label}: piano chord builds both staff expectations`);
                check(api.practice.readTraversal().timestamp > context.timestamp,
                    `${label}: live iterator prefetches while displayed event stays current`);
                if (mode !== 'realtime') {
                    api.dispatchInput(90, true, 'ui');
                    api.dispatchInput(90, false, 'ui');
                    await wait(30);
                    check(api.readPracticeSnapshot().score.wrong === 1 && position() === painted,
                        `${label}: wrong input counts once and holds display`);
                    api.dispatchInput(expected[0], true, 'ui');
                    await wait(30);
                    check(api.readPracticeSnapshot().score.correct === 1 && api.readPracticeSnapshot().expected.some(note => !note.hit) && position() === painted,
                        `${label}: partial chord holds display`);
                    api.dispatchInput(expected[0], true, 'ui');
                    check(api.readPracticeSnapshot().score.correct === 1 && api.readPracticeSnapshot().score.wrong === 1,
                        `${label}: already-hit repeat is suppressed from duplicate grading`);
                    api.dispatchInput(expected[1], true, 'ui');
                    check(api.readPracticeSnapshot().score.correct === 2, `${label}: completing chord grades both notes`);
                    for (const midi of expected) api.dispatchInput(midi, false, 'ui');
                    await wait(mode === 'wait' ? 80 : 650);
                    check(position() !== painted && api.readPracticeSnapshot().context.timestamp > context.timestamp,
                        `${label}: completing chord advances displayed event`);
                    check(expected.every(midi => !api.readPracticeSnapshot().pressed.includes(midi)), `${label}: release clears held input`);
                } else {
                    await wait(650);
                    check(position() !== painted && api.readPracticeSnapshot().context.timestamp > context.timestamp,
                        `${label}: tempo advances without input`);
                    check(api.readPracticeSnapshot().score.wrong === 2, `${label}: missed chord grades both notes`);
                }
                stop();
                const stoppedContext = JSON.stringify(api.readPracticeSnapshot().context);
                await wait(550);
                check(!api.readPracticeSnapshot().playing && JSON.stringify(api.readPracticeSnapshot().context) === stoppedContext,
                    `${label}: pause suppresses pending advancement`);
            }
        }

        for (const [fixture, expectedMeasures] of [
            ['simple-repeat', [0, 1, 0, 1, 2]],
            ['first-second-ending', [0, 1, 2, 0, 1, 3, 4]]
        ]) {
            await load(fixture);
            api.practice.resetTraversal();
            const measures = [], events = [];
            let steps = 0, jumps = 0;
            while (!api.practice.readTraversal().end && steps++ < 100) {
                const index = api.practice.readTraversal().measure;
                const timestamp = api.practice.readTraversal().timestamp;
                if (measures.at(-1) !== index) measures.push(index);
                api.practice.advanceTraversal();
                if (api.practice.readTraversal().end) break;
                const nextIndex = api.practice.readTraversal().measure;
                const nextTimestamp = api.practice.readTraversal().timestamp;
                const beats = api.practice.traversalBeats(index,timestamp,nextIndex,nextTimestamp);
                events.push({ measure: index, timestampWhole: timestamp, nextMeasure: nextIndex, nextTimestampWhole: nextTimestamp, beats });
                if (nextTimestamp < timestamp || nextIndex > index + 1) {
                    jumps++;
                    check(beats === 1, `${fixture}: structural jump ${index + 1} → ${nextIndex + 1} waits one remaining quarter beat`);
                }
            }
            check(steps < 100 && JSON.stringify(measures) === JSON.stringify(expectedMeasures),
                `${fixture}: actual repeat-sign traversal is ${measures.map(index => index + 1).join(' → ')}`);
            check(jumps === (fixture === 'simple-repeat' ? 1 : 2), `${fixture}: repeat and ending skip are exercised`);
            results.textContent += `SNAPSHOT ${fixture} ${JSON.stringify(events)}\n`;
        }

    } catch (error) {
        results.textContent += `ERROR: ${error.stack}\n`;
    } finally {
        stop();
        api.dispose(); await window.__PT_LIBRARY_FIXTURE__.cleanup();
        parent.document.getElementById('run').disabled = false;
    }
    if (!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent)) results.textContent += '\nAll checks passed.\n';
})();
