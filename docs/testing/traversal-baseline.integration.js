(async () => {
    const results = parent.document.getElementById('results');
    results.textContent = '';
    const check = (ok, message) => {
        results.textContent += `${ok ? 'PASS' : 'FAIL'} ${message}\n`;
        if (!ok) throw new Error(message);
    };
    const noLed = new URLSearchParams(location.search).get('led') === 'off';
    const stop = () => {
        pausePlaybackFromToolbar();
        for (const midi of [...AppState.pressedKeys]) triggerVirtualKey(midi, false, 'ui');
    };
    const originalOutput = LedEngine.renderOutputs;
    let outputFrames = 0;
    LedEngine.renderOutputs = function () { outputFrames++; return originalOutput.call(this); };
    const oldLayout = document.getElementById('select-score-layout').value;
    try {
        hideToolbarPanels();
        document.getElementById('help-modal')?.classList.add('hidden');
        AppState.ledOutputMode = 'none';
        for (const key of Object.keys(AppState.audioEnabled)) AppState.audioEnabled[key] = false;
        for (const key of Object.keys(AppState.midiOutEnabled)) AppState.midiOutEnabled[key] = false;
        document.getElementById('check-metronome').checked = false;
        document.getElementById('check-looper').checked = false;
        check(optionalLedOutput.enabled === !noLed, `adapter selection: ${noLed ? 'no-op' : 'legacy'}`);
        showMidiPermissionHelp(getMidiPermissionHelpText());
        check(!document.getElementById('midi-permission-help').classList.contains('hidden'), 'MIDI permission help remains available');
        clearMidiPermissionHelp();
        check(document.getElementById('app-version-display').textContent.includes(APP_VERSION), 'update UI initializes independently');
        check(document.getElementById('fs-led-setup').classList.contains('hidden') === noLed, 'LED settings visibility follows explicit adapter configuration');

        const fixture = await (await fetch('/docs/testing/fixtures/early-grace.musicxml')).text();
        for (const layout of ['traditional','horizontal']) {
            for (const mode of ['wait','follow','realtime']) {
                stop();
                await loadScoreIntoApp(fixture, {fileName:'early-grace.musicxml'});
                ScoreDisplay.setMode(layout,{save:false});
                clearVisuals();
                AppState.mode = mode;
                syncActiveHandStateFromMode();
                AppState.practice.left=false;
                AppState.practice.right=true;
                AppState.ledPreviewTimelineDirty=true;
                AppState.score.correct=AppState.score.wrong=0;
                const cursor = osmd.cursor;
                cursor.reset(); cursor.Iterator.moveToNext(); cursor.update();
                const entries = cursor.Iterator.CurrentVoiceEntries;
                const timestamp = cursor.Iterator.currentTimeStamp.RealValue;
                AppState.currentExpectedContext={measureIndex:0,timestamp,signature:makeLedPreviewEntrySignature(entries)};
                AppState.isPlaying=true;
                // This is the accompaniment-only interval: the scheduler owns the
                // pending timer while input is accepted. Advance the real iterator
                // explicitly so this test compares input semantics without jitter.
                AppState.isAudioBusy=true;
                const timeline = ensureLedPreviewTimelineBuilt();
                const label = `${mode}/${layout}`;
                check(timeline.length === 4 && cursor.Iterator.currentTimeStamp.RealValue === timestamp,
                    `${label}: shared timeline builds and restores the current playback position`);
                triggerVirtualKey(62,true,'ui');
                const reservation = AppState.earlyGraceReservations.get(62);
                check(mode === 'wait' ? !reservation : reservation?.timestamp === 0.75,
                    `${label}: early input reservation matches legacy mode semantics`);
                if (mode === 'follow') {
                    triggerVirtualKey(62,false,'ui');
                    check(AppState.earlyGraceReservations.get(62)?.allowTapCarry === true,
                        `${label}: early tap survives release across accompaniment events`);
                }
                while (cursor.Iterator.currentTimeStamp.RealValue < 0.75) cursor.Iterator.moveToNext();
                buildExpectedNotesFromEntries(cursor.Iterator.CurrentVoiceEntries,0,0.75);
                check(AppState.expectedNotes.length === 1 && AppState.expectedNotes[0].midi === 62,
                    `${label}: target event uses the same practiced-hand note source`);
                if (mode !== 'wait') {
                    check(AppState.expectedNotes[0].hit && AppState.score.correct === 1,
                        `${label}: reserved ${mode === 'follow' ? 'released tap' : 'held key'} grades at the target`);
                }
                stop();
            }
        }
        setPlayerPianoType(25,{save:false});
        check(!isMidiInPlayerRange(21) && document.querySelector('.key[data-midi="21"]').classList.contains('out-of-range'),
            'range and keyboard filtering still work with the selected adapter');
        await new Promise(resolve=>setTimeout(resolve,100));
        check(noLed ? outputFrames === 0 : outputFrames > 0,
            noLed ? 'no-op runs no LED output frames' : 'legacy LED output loop remains active');
        if (noLed) {
            check(localStorage.getItem('pt_ledOutputMode') === 'wled' && localStorage.getItem('pt_wledIp') === '127.0.0.1:9' && localStorage.getItem('pt_wledTransport') === 'ddp',
                'no-op preserves existing WLED mode, address and transport preferences');
            check(WLEDController.healthCheckTimer === null && WLEDController.reconnectTimer === null,
                'no-op owns no hardware discovery or reconnect timer');
            check(performance.getEntriesByType('resource').every(entry=>!entry.name.includes(':4818/') && !/\/json(?:\/|\?|$)/.test(entry.name)),
                'no-op startup and practice perform no WLED/helper discovery requests');
        }
        results.textContent += '\nAll checks passed.\n';
    } catch (error) {
        results.textContent += `ERROR: ${error.stack}\n`;
    } finally {
        stop();
        LedEngine.renderOutputs=originalOutput;
        setPlayerPianoType(getStoredNumber(PLAYER_PIANO_STORAGE_KEY,88),{save:false});
        ScoreDisplay.setMode(oldLayout,{save:false});
        parent.document.getElementById('run').disabled=false;
        parent.restoreTraversalTestPreferences();
    }
})();
