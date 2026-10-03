// Test-only script in the real app frame, including real FileReader and reload.
(async () => {
    const harness = parent.SettingsBaseline,api=window.PianoTrainerTest,s=api.settings,snapshot=api.preferences.readSnapshot;
    const results = parent.document.getElementById('results');
    const check = (ok, message) => {
        results.textContent += `${ok ? 'PASS' : 'FAIL'} ${message}\n`;
        if (!ok) throw new Error(message);
    };
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    window.alert = text => harness.alerts.push(text);
    const importFile = payload => s.importFile(new File([JSON.stringify(payload)], 'Settings-test.json', { type: 'application/json' }));
    try {
        if (harness.phase === 'initial') {
            check(api.practice.readLed().enabled === (new URLSearchParams(parent.location.search).get('led') !== 'off'), 'settings import/reload runs with the requested default/no-op LED');
            harness.original = s.readBackup();
            check(harness.original.version === 1 && typeof harness.original.settings === 'object', 'backup preserves version 1 and string settings');
            api.preferences.captureInputs();
            importFile({ settings: { unsupported: 'only' } });
            await wait(120);
            check(harness.alerts.includes('Invalid settings backup file.'), 'real FileReader reports an unsupported backup');
            check(JSON.stringify(s.readBackup().settings) === JSON.stringify(harness.original.settings), 'invalid file leaves existing settings unchanged');
            check(snapshot().stateSame && snapshot().pressedSame, 'invalid import retains the shared state and Set');
            harness.phase = 'imported';
            importFile({ version: 1, settings: {
                pt_scoreLayout: 'horizontal', pt_trainerMode: 'wait', pt_savedMidiInChannel: '3',
                pt_trainerPianoVolume: '37', pt_inputVelocityEnabled: 'false',
                pt_liveLowLatencyMonitoringEnabled: 'false'
            } });
        } else if (harness.phase === 'imported') {
            check(harness.alerts.includes('Settings imported. The app will now reload to apply them.'), 'valid file invokes the production success/reload path');
            check(snapshot().mode === 'wait' && document.getElementById('mode-wait').checked, 'reload applies imported practice mode to state and controls');
            check(snapshot().horizontal && document.getElementById('select-score-layout').value === 'horizontal', 'reload restores the horizontal display preference');
            check(api.midi.readChannels().input === 3 && localStorage.getItem('pt_trainerPianoVolume') === '37', 'reload keeps imported channel and volume without reseeding defaults');
            check(snapshot().inputVelocity && snapshot().liveLowLatency, 'reload retains forced monitoring preferences');
            harness.phase = 'restored';
            importFile(harness.original);
        } else if (harness.phase === 'restored') {
            check(JSON.stringify(s.readBackup().settings) === JSON.stringify(harness.original.settings), 'original supported settings are restored after a second real reload');
            api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();harness.phase = 'done';
            results.textContent+='NATIVE_RELOADS '+JSON.stringify({boots:harness.boots,pageHides:harness.pageHides,databases:harness.scope.databases.size})+'\n';
            results.textContent += '\nAll checks passed.\n';
            parent.document.getElementById('run').disabled = false;
        } else if (harness.phase === 'cleanup') {
            api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();harness.phase = 'done';
            results.textContent += 'Original settings restored after failure.\n';
            parent.document.getElementById('run').disabled = false;
        }
    } catch (error) {
        results.textContent += `ERROR: ${error.stack}\n`;
        harness.failed = true;
        if (harness.original && harness.phase !== 'cleanup') {
            s.importBackup(harness.original);
            harness.phase = 'cleanup';
            window.location.reload();
        } else {
            harness.phase = 'done';
            parent.document.getElementById('run').disabled = false;
        }
    }
})();
