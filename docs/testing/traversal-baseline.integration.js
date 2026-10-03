(async () => {
    const results = parent.document.getElementById('results');
    results.textContent = '';
    const check = (ok, message) => {
        results.textContent += `${ok ? 'PASS' : 'FAIL'} ${message}\n`;
        if (!ok) throw new Error(message);
    };
    const noLed = new URLSearchParams(parent.location.search).get('led') === 'off';
    const api=window.PianoTrainerTest,snapshot=()=>api.readPracticeSnapshot();
    const stop=()=>api.practice.stop();
    try {
        api.practice.muteOutputs();
        check(api.practice.readLed().enabled === !noLed, `adapter selection: ${noLed ? 'no-op' : 'legacy'}`);
        api.practice.showMidiHelp();
        check(!document.getElementById('midi-permission-help').classList.contains('hidden'), 'MIDI permission help remains available');
        api.practice.clearMidiHelp();
        check(document.getElementById('app-version-display').textContent.includes(api.practice.readLed().version), 'update UI initializes independently');
        check(document.getElementById('fs-led-setup').classList.contains('hidden') === noLed, 'LED settings visibility follows explicit adapter configuration');

        const fixture = await (await fetch('/docs/testing/fixtures/early-grace.musicxml')).text();
        for (const layout of ['traditional','horizontal']) {
            for (const mode of ['wait','follow','realtime']) {
                stop();
                await api.loadScore(fixture, {fileName:'early-grace.musicxml'});
                api.setLayout(layout);
                api.practice.prepare(mode,{left:false,right:true},true);
                api.practice.selectEvent(0,0.25,false);
                const timestamp=api.practice.readTraversal().timestamp;
                const timeline=api.practice.rebuildTimeline();
                const label = `${mode}/${layout}`;
                check(timeline.length === 4 && api.practice.readTraversal().timestamp === timestamp,
                    `${label}: shared timeline builds and restores the current playback position`);
                api.dispatchInput(62,true,'ui');
                const reservation = snapshot().reservations.find(n=>n.midi===62);
                check(mode === 'wait' ? !reservation : reservation?.timestamp === 0.75,
                    `${label}: early input reservation matches legacy mode semantics`);
                if (mode === 'follow') {
                    api.dispatchInput(62,false,'ui');
                    check(snapshot().reservations.find(n=>n.midi===62)?.allowTapCarry === true,
                        `${label}: early tap survives release across accompaniment events`);
                }
                while(api.practice.readTraversal().timestamp<0.75)api.practice.advanceTraversal();
                api.practice.buildCurrentExpectations();
                check(snapshot().expected.length === 1 && snapshot().expected[0].midi === 62,
                    `${label}: target event uses the same practiced-hand note source`);
                if (mode !== 'wait') {
                    check(snapshot().expected[0].hit && snapshot().score.correct === 1,
                        `${label}: reserved ${mode === 'follow' ? 'released tap' : 'held key'} grades at the target`);
                }
                stop();
            }
        }
        api.practice.setPlayerKeyCount(25);
        check(!api.practice.isMidiInRange(21) && document.querySelector('.key[data-midi="21"]').classList.contains('out-of-range'),
            'range and keyboard filtering still work with the selected adapter');
        await new Promise(resolve=>setTimeout(resolve,100));
        check(noLed ? api.practice.readLed().outputFrames === 0 : api.practice.readLed().outputFrames > 0,
            noLed ? 'no-op runs no LED output frames' : 'legacy LED output loop remains active');
        if (noLed) {
            check(localStorage.getItem('pt_ledOutputMode') === 'wled' && localStorage.getItem('pt_wledIp') === '127.0.0.1:9' && localStorage.getItem('pt_wledTransport') === 'ddp',
                'no-op preserves existing WLED mode, address and transport preferences');
            check(api.practice.readLed().resources.timers === 0 && api.practice.readLed().resources.intervals === 0,
                'no-op owns no hardware discovery or reconnect timer');
            check(performance.getEntriesByType('resource').every(entry=>!entry.name.includes(':4818/') && !/\/json(?:\/|\?|$)/.test(entry.name)),
                'no-op startup and practice perform no WLED/helper discovery requests');
        }

    } catch (error) {
        results.textContent += `ERROR: ${error.stack}\n`;
    } finally {
        stop();
        api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();
        parent.document.getElementById('run').disabled=false;

    }
    if (!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent)) results.textContent += '\nAll checks passed.\n';
})();
