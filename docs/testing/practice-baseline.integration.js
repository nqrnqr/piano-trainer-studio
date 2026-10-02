// P0 characterization: real bundled OSMD and the unchanged production engine.
(async () => {
    const results = parent.document.getElementById('results');
    results.textContent = '';
    const check = (ok, message) => {
        results.textContent += `${ok ? 'PASS' : 'FAIL'} ${message}\n`;
        if (!ok) throw new Error(message);
    };
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const position = () => osmd.cursor.cursorElement.style.left;
    const load = async name => {
        const response = await fetch(`/docs/testing/fixtures/${name}.musicxml`);
        if (!response.ok) throw new Error(`Fixture ${name}: HTTP ${response.status}`);
        await loadScoreIntoApp(await response.text(), { fileName: `${name}.musicxml` });
    };
    const stop = () => {
        pausePlaybackFromToolbar();
        for (const midi of [...AppState.pressedKeys]) triggerVirtualKey(midi, false, 'ui');
    };
    const oldLayout = document.getElementById('select-score-layout').value;
    try {
        hideToolbarPanels();
        document.getElementById('help-modal')?.classList.add('hidden');
        AppState.ledOutputMode = 'none';
        for (const key of Object.keys(AppState.audioEnabled)) AppState.audioEnabled[key] = false;
        for (const key of Object.keys(AppState.midiOutEnabled)) AppState.midiOutEnabled[key] = false;
        document.getElementById('check-metronome').checked = false;
        document.getElementById('check-looper').checked = false;
        document.getElementById('check-autoscroll').checked = false;

        for (const layout of ['traditional', 'horizontal']) {
            for (const mode of ['wait', 'follow', 'realtime']) {
                stop();
                await load('simple-repeat');
                ScoreDisplay.setMode(layout, { save: false });
                clearVisuals();
                AppState.mode = mode;
                syncActiveHandStateFromMode();
                AppState.practice.left = AppState.practice.right = true;
                AppState.score.correct = AppState.score.wrong = 0;
                osmd.cursor.reset();
                osmd.cursor.show();
                osmd.cursor.update();
                AppState.isPlaying = true;
                AppState.anchorTime = Tone.now();
                playbackLoop();
                const label = `${mode}/${layout}`;
                const painted = position();
                const context = { ...AppState.currentExpectedContext };
                const expected = AppState.expectedNotes.map(note => note.midi);
                check(expected.length === 2, `${label}: piano chord builds both staff expectations`);
                check(osmd.cursor.Iterator.currentTimeStamp.RealValue > context.timestamp,
                    `${label}: live iterator prefetches while displayed event stays current`);
                if (mode !== 'realtime') {
                    triggerVirtualKey(90, true, 'ui');
                    triggerVirtualKey(90, false, 'ui');
                    await wait(30);
                    check(AppState.score.wrong === 1 && position() === painted,
                        `${label}: wrong input counts once and holds display`);
                    triggerVirtualKey(expected[0], true, 'ui');
                    await wait(30);
                    check(AppState.score.correct === 1 && AppState.expectedNotes.some(note => !note.hit) && position() === painted,
                        `${label}: partial chord holds display`);
                    triggerVirtualKey(expected[0], true, 'ui');
                    check(AppState.score.correct === 1 && AppState.score.wrong === 1,
                        `${label}: already-hit repeat is suppressed from duplicate grading`);
                    triggerVirtualKey(expected[1], true, 'ui');
                    check(AppState.score.correct === 2, `${label}: completing chord grades both notes`);
                    for (const midi of expected) triggerVirtualKey(midi, false, 'ui');
                    await wait(mode === 'wait' ? 80 : 650);
                    check(position() !== painted && AppState.currentExpectedContext.timestamp > context.timestamp,
                        `${label}: completing chord advances displayed event`);
                    check(expected.every(midi => !AppState.pressedKeys.has(midi)), `${label}: release clears held input`);
                } else {
                    await wait(650);
                    check(position() !== painted && AppState.currentExpectedContext.timestamp > context.timestamp,
                        `${label}: tempo advances without input`);
                    check(AppState.score.wrong === 2, `${label}: missed chord grades both notes`);
                }
                stop();
                const stoppedContext = JSON.stringify(AppState.currentExpectedContext);
                await wait(550);
                check(!AppState.isPlaying && JSON.stringify(AppState.currentExpectedContext) === stoppedContext,
                    `${label}: pause suppresses pending advancement`);
            }
        }

        for (const [fixture, expectedMeasures] of [
            ['simple-repeat', [0, 1, 0, 1, 2]],
            ['first-second-ending', [0, 1, 2, 0, 1, 3, 4]]
        ]) {
            await load(fixture);
            const cursor = osmd.cursor;
            cursor.reset();
            const measures = [];
            const events = [];
            let steps = 0;
            let jumps = 0;
            while (!cursor.Iterator.EndReached && steps++ < 100) {
                const index = cursor.Iterator.CurrentMeasureIndex;
                const timestamp = cursor.Iterator.currentTimeStamp.RealValue;
                if (measures.at(-1) !== index) measures.push(index);
                cursor.Iterator.moveToNext();
                if (cursor.Iterator.EndReached) break;
                const nextIndex = cursor.Iterator.CurrentMeasureIndex;
                const nextTimestamp = cursor.Iterator.currentTimeStamp.RealValue;
                const beats = window.PTTiming.getTraversalBeatsToWait({
                    currentMeasureIdx: index, currentTimestamp: timestamp,
                    nextMeasureIdx: nextIndex, nextTimestamp,
                    fallbackLength: 0.25, getMeasureTimingInfo
                });
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
        results.textContent += '\nAll checks passed.\n';
    } catch (error) {
        results.textContent += `ERROR: ${error.stack}\n`;
    } finally {
        stop();
        ScoreDisplay.setMode(oldLayout, { save: false });
        parent.document.getElementById('run').disabled = false;
    }
})();
