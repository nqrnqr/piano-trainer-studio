// Browser integration checks against the actual app and bundled OSMD, not mocks.
(async () => {
    const results = parent.document.getElementById('results');
    results.textContent = '';
    const check = (ok, text) => {
        results.textContent += `${ok ? 'PASS' : 'FAIL'} ${text}\n`;
        if (!ok) throw new Error(text);
    };
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    // Drive animation frames deterministically: background browser tabs may suspend native rAF.
    const nativeRaf = window.requestAnimationFrame;
    const nativeCancel = window.cancelAnimationFrame;
    const frames = new Map();
    let frameId = 1000000;
    let frameTime = performance.now();
    window.requestAnimationFrame = callback => { frames.set(++frameId, callback); return frameId; };
    window.cancelAnimationFrame = id => { frames.delete(id); nativeCancel(id); };
    const paint = (count = 1) => {
        for (let i=0; i<count; i++) {
            frameTime += 16.67;
            const pending = [...frames.values()];
            frames.clear();
            for (const callback of pending) callback(frameTime);
        }
    };
    const settle = async () => {
        paint(90);
        await wait(20);
        paint(90);
    };
    const viewport = document.getElementById('music-area');
    const current = () => `${osmd.cursor.Iterator.CurrentMeasureIndex}:${osmd.cursor.Iterator.currentTimeStamp.RealValue}`;
    const cursorX = () => {
        const rect = osmd.cursor.cursorElement.getBoundingClientRect();
        return rect.left + rect.width / 2 - viewport.getBoundingClientRect().left;
    };
    const contentX = () => cursorX() + viewport.scrollLeft;
    const seek = index => {
        osmd.cursor.reset();
        while (!osmd.cursor.Iterator.EndReached && osmd.cursor.Iterator.CurrentMeasureIndex < index) osmd.cursor.Iterator.moveToNext();
        osmd.cursor.show();
        osmd.cursor.update();
        handleAutoScroll();
    };
    const oldLayout = document.getElementById('select-score-layout').value;
    try {
        hideToolbarPanels();
        document.querySelector('#help-modal')?.classList.add('hidden');
        AppState.ledOutputMode = 'none';
        for (const key of Object.keys(AppState.audioEnabled)) AppState.audioEnabled[key] = false;
        for (const key of Object.keys(AppState.midiOutEnabled)) AppState.midiOutEnabled[key] = false;
        document.getElementById('check-metronome').checked = false;
        document.getElementById('check-autoscroll').checked = true;
        const xml = await (await fetch('/docs/testing/continuous-score.musicxml')).text();
        await loadScoreIntoApp(xml, { fileName: 'Continuous Score Test.musicxml' });
        ScoreDisplay.setMode('traditional', {save:false});
        const systems = () => osmd.GraphicSheet.MusicPages.reduce((n,p) => n + p.MusicSystems.length, 0);
        check(systems() > 1, 'Traditional layout has multiple systems');
        seek(15);
        const before = current();
        ScoreDisplay.setMode('horizontal', {save:false});
        check(systems() === 1, '48 measures and both piano staves stay in one system (including XML line break)');
        check(current() === before, 'Layout switch preserves playback iterator');
        check(Math.abs(cursorX() - viewport.clientWidth * .33) < 3, 'Cursor anchored at 33% of viewport');

        const start = viewport.scrollLeft;
        seek(22);
        check(viewport.scrollLeft === start, 'New position schedules animation without a sudden jump');
        paint(2);
        const midway = viewport.scrollLeft;
        await settle();
        check(midway > start && midway < viewport.scrollLeft, 'Scroll advances across multiple frames');
        check(Math.abs(cursorX() - viewport.clientWidth * .33) < 3, 'Scroll converges on stable cursor region');
        seek(3);
        await settle();
        check(Math.abs(cursorX() - viewport.clientWidth * .33) < 3, 'Backward repeat/seek converges without stale forward scroll');
        seek(47);
        await settle();
        check(Math.abs(cursorX() - viewport.clientWidth * .33) < 3, 'Trailing space retains cursor region at the last measure');

        document.getElementById('check-autoscroll').checked = false;
        const disabledLeft = viewport.scrollLeft;
        seek(10);
        await wait(180);
        check(viewport.scrollLeft === disabledLeft, 'Auto Scroll off leaves the viewport alone');
        document.getElementById('check-autoscroll').checked = true;
        handleAutoScroll();
        await settle();
        const iteratorBeforeLookahead = osmd.cursor.Iterator;
        const paintedX = contentX();
        osmd.cursor.Iterator.moveToNext();
        const aheadPosition = current();
        renderScoreAndRefreshGeometry();
        check(osmd.cursor.Iterator === iteratorBeforeLookahead && current() === aheadPosition, 'Relayout leaves the ahead-of-display iterator intact');
        check(Math.abs(contentX() - paintedX) < 3, 'Relayout preserves the painted cursor while waiting');
        const zoomPosition = current();
        applyZoom(125, {save:false});
        check(current() === zoomPosition && systems() === 1, 'Zoom keeps traversal and single-system layout');
        applyZoom(100, {save:false});

        for (const mode of ['wait', 'follow', 'realtime']) {
            pausePlaybackFromToolbar();
            clearVisuals();
            AppState.mode = mode;
            syncActiveHandStateFromMode();
            seek(12);
            ScoreDisplay.follow({immediate:true});
            AppState.isPlaying = true;
            AppState.anchorTime = Tone.now();
            playbackLoop();
            if (mode !== 'realtime') {
                const waitingX = contentX();
                const waitingPosition = current();
                const expected = AppState.expectedNotes.map(n => n.midi);
                check(expected.length > 0, `${mode}: waits for expected notes`);
                await wait(150);
                check(Math.abs(contentX() - waitingX) < 3, `${mode}: cursor does not run ahead while waiting`);
                const scoreBefore = JSON.stringify(AppState.score);
                AppState.realtimeWrongPressInCurrentContext = true;
                ScoreDisplay.setMode('traditional', {save:false});
                const traditionalAnchor = AppState.expectedNotes[0].anchor;
                ScoreDisplay.setMode('horizontal', {save:false});
                check(current() === waitingPosition && Math.abs(contentX() - waitingX) < 3, `${mode}: switch layouts while waiting preserves current note`);
                check(JSON.stringify(AppState.score) === scoreBefore && AppState.realtimeWrongPressInCurrentContext, `${mode}: switching preserves score and wrong-note state`);
                check(AppState.expectedNotes[0].anchor.x !== traditionalAnchor.x, `${mode}: expected-note feedback anchors refresh for horizontal layout`);
                for (const midi of expected) triggerVirtualKey(midi, true, 'ui');
                for (const midi of expected) triggerVirtualKey(midi, false, 'ui');
                await wait(700);
                check(contentX() > waitingX, `${mode}: correct notes advance the visible cursor`);
            } else {
                const playingX = contentX();
                await wait(800);
                check(contentX() > playingX, 'realtime: scheduled playback advances horizontal cursor');
            }
            pausePlaybackFromToolbar();
        }
        seek(15);
        await settle();
        document.getElementById('btn-reset').click();
        await settle();
        check(osmd.cursor.Iterator.CurrentMeasureIndex === 0 && cursorX() >= 0 && cursorX() < viewport.clientWidth, `Reset returns to the first measure with cursor visible (measure=${osmd.cursor.Iterator.CurrentMeasureIndex}, x=${cursorX()}, width=${viewport.clientWidth})`);
        ScoreDisplay.setMode('traditional', {save:false});
        check(systems() > 1 && viewport.scrollLeft === 0 && !document.getElementById('canvas-wrapper').style.width, 'Traditional layout and normal container width restored');
        ScoreDisplay.setMode('horizontal', {save:false});
        const frame = parent.document.querySelector('iframe');
        frame.style.width = '390px';
        await wait(650);
        seek(20);
        await settle();
        check(systems() === 1 && Math.abs(cursorX() - viewport.clientWidth * .33) < 3, '390px mobile viewport retains single system and cursor anchor');
        frame.style.width = '100%';
        await wait(650);
        // Exceed the vendor default width to catch silent wrapping on long scores.
        const doc = new DOMParser().parseFromString(xml, 'application/xml');
        const part = doc.querySelector('part');
        const measure = part.lastElementChild;
        for (let i=49; i<=240; i++) {
            const copy = measure.cloneNode(true);
            copy.setAttribute('number', i);
            part.append(copy);
        }
        ScoreDisplay.setMode('horizontal', {save:false});
        await loadScoreIntoApp(new XMLSerializer().serializeToString(doc), {fileName:'Long test.musicxml'});
        check(systems() === 1 && document.querySelector('#osmd-container svg').getBoundingClientRect().width > 32767, '240-measure SVG exceeds 32767px without wrapping or clipping');
        results.textContent += '\nAll checks passed.\n';
    } catch (error) {
        results.textContent += `ERROR: ${error.stack}\n`;
    } finally {
        pausePlaybackFromToolbar();
        ScoreDisplay.setMode(oldLayout, {save:false});
        window.requestAnimationFrame = nativeRaf;
        window.cancelAnimationFrame = nativeCancel;
        for (const callback of frames.values()) nativeRaf(callback);
        parent.document.getElementById('run').disabled = false;
    }
})();
