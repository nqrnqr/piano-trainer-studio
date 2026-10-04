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
    const api=window.PianoTrainerTest,snapshot=()=>api.readPracticeSnapshot();
    const viewport = document.getElementById('music-area');
    const current = () => {const p=api.practice.readTraversal();return `${p.measure}:${p.timestamp}`;};
    const cursorX = () => {
        const rect = api.readViewportSnapshot().cursorBounds;
        return rect.left + rect.width / 2 - viewport.getBoundingClientRect().left;
    };
    const contentX = () => cursorX() + viewport.scrollLeft;
    const seek = index => api.render.seekMeasure(index);
    const oldLayout = document.getElementById('select-score-layout').value;
    try {
        api.practice.muteOutputs();
        document.getElementById('check-autoscroll').checked = true;
        const xml = await (await fetch('/docs/testing/continuous-score.musicxml')).text();
        await api.loadScore(xml, { fileName: 'Continuous Score Test.musicxml' });
        await api.setLayout('traditional', {save:false});
        const systems = () => api.readViewportSnapshot().systems;
        check(systems() > 1, 'Traditional layout has multiple systems');
        seek(15);
        const before = current();
        await api.setLayout('horizontal', {save:false});
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
        check(Math.abs(cursorX() - viewport.clientWidth * .33) < 3, 'Explicit backward seek converges without stale forward scroll');
        seek(47);
        await settle();
        check(Math.abs(cursorX() - viewport.clientWidth * .33) < 3, 'Trailing space retains cursor region at the last measure');

        document.getElementById('check-autoscroll').checked = false;
        const disabledLeft = viewport.scrollLeft;
        seek(10);
        await wait(180);
        check(viewport.scrollLeft === disabledLeft, 'Auto Scroll off leaves the viewport alone');
        document.getElementById('check-autoscroll').checked = true;
        api.render.follow();
        await settle();
        const iteratorBeforeLookahead = api.render.captureIdentity();
        const paintedX = contentX();
        const paintedLogicalX=Number(document.querySelector('.pt-performance-cursor').dataset.logicalX);
        api.practice.advanceTraversal();
        const aheadPosition = current();
        api.render.render();
        check(api.render.readIdentity(iteratorBeforeLookahead).iteratorSame && current() === aheadPosition, 'Relayout leaves the ahead-of-display iterator intact');
        check(Math.abs(Number(document.querySelector('.pt-performance-cursor').dataset.logicalX)-paintedLogicalX)<3, 'Relayout preserves the logical painted cursor while waiting, including origin recycling');
        const zoomPosition = current();
        api.render.zoom(125);
        check(current() === zoomPosition && systems() === 1, 'Zoom keeps traversal and single-system layout');
        api.render.zoom(100);

        for (const mode of ['wait', 'follow', 'realtime']) {
            api.practice.prepareMode(mode);
            seek(12);
            api.render.follow(true);
            api.practice.startCurrentPlayback();
            if (mode !== 'realtime') {
                const waitingX = contentX();
                const waitingPosition = current();
                const expected = snapshot().expected.map(n => n.midi);
                check(expected.length > 0, `${mode}: waits for expected notes`);
                await wait(150);
                check(Math.abs(contentX() - waitingX) < 3, `${mode}: cursor does not run ahead while waiting`);
                const scoreBefore = JSON.stringify(snapshot().score);
                api.render.setWrongContext(true);
                await api.setLayout('traditional', {save:false});
                const traditionalAnchor = snapshot().expected[0].anchor;
                await api.setLayout('horizontal', {save:false});
                check(current() === waitingPosition && Math.abs(contentX() - waitingX) < 3, `${mode}: switch layouts while waiting preserves current note`);
                check(JSON.stringify(snapshot().score) === scoreBefore && snapshot().wrongContext, `${mode}: switching preserves score and wrong-note state`);
                check(snapshot().expected[0].anchor.x !== traditionalAnchor.x, `${mode}: expected-note feedback anchors refresh for horizontal layout`);
                for (const midi of expected) api.dispatchInput(midi, true, 'ui');
                for (const midi of expected) api.dispatchInput(midi, false, 'ui');
                await wait(700);
                check(contentX() > waitingX, `${mode}: correct notes advance the visible cursor`);
            } else {
                const playingX = contentX();
                await wait(800);
                check(contentX() > playingX, 'realtime: scheduled playback advances horizontal cursor');
            }
            api.pause();
        }
        seek(15);
        await settle();
        document.getElementById('btn-reset').click();
        await settle();
        check(api.practice.readTraversal().measure === 0 && cursorX() >= 0 && cursorX() < viewport.clientWidth, `Reset returns to the first measure with cursor visible (measure=${api.practice.readTraversal().measure}, x=${cursorX()}, width=${viewport.clientWidth})`);
        await api.setLayout('traditional', {save:false});
        check(systems() > 1 && viewport.scrollLeft === 0 && !document.getElementById('canvas-wrapper').style.width, 'Traditional layout and normal container width restored');
        await api.setLayout('horizontal', {save:false});
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
        await api.setLayout('horizontal', {save:false});
        await api.loadScore(new XMLSerializer().serializeToString(doc), {fileName:'Long test.musicxml'});
        check(systems() === 1 && api.horizontal.resources().definitions===30 && api.horizontal.resources().chunks<=7 && api.horizontal.resources().models<=16, '240 measures use 30 fixed definitions with bounded active SVG and template resources');

    } catch (error) {
        results.textContent += `ERROR: ${error.stack}\n`;
    } finally {
        api.pause();
        api.dispose();
        window.requestAnimationFrame = nativeRaf;
        window.cancelAnimationFrame = nativeCancel;
        frames.clear(); await window.__PT_LIBRARY_FIXTURE__.cleanup();
        parent.document.getElementById('run').disabled = false;
    }
    if (!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent)) results.textContent += '\nAll checks passed.\n';
})();
