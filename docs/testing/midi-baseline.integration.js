(async () => {
    const results=parent.document.getElementById('results');results.textContent='';
    const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw new Error(label);};
    const select=(id,value)=>{const element=document.getElementById(id);element.value=value;element.dispatchEvent(new Event('change'));};
    const originalInput=triggerVirtualKey,received=[];
    triggerVirtualKey=function(...args){received.push(args);return originalInput.apply(this,args);};
    const f=window.MidiFixture;
    const emit=(port,data)=>port.onmidimessage({data:Uint8Array.from(data)});
    try {
        await setupMIDI();await setupMIDI();
        check(f.requests===1,'startup and repeated setup share one access request');
        check(document.getElementById('midi-in').value===f.first.id&&typeof f.first.onmidimessage==='function',
            'stored device selection binds actual input through DOM controls');
        check(document.getElementById('midi-in-connection-status').textContent.includes('Connected'),
            'device connection UI observes the service');
        hideToolbarPanels();document.getElementById('help-modal')?.classList.add('hidden');
        for(const key of Object.keys(AppState.audioEnabled))AppState.audioEnabled[key]=false;
        for(const key of Object.keys(AppState.midiOutEnabled))AppState.midiOutEnabled[key]=false;
        document.getElementById('check-metronome').checked=false;
        const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();
        await loadScoreIntoApp(xml,{fileName:'simple-repeat.musicxml'});
        clearVisuals();AppState.mode='wait';syncActiveHandStateFromMode();
        AppState.practice.left=false;AppState.practice.right=true;AppState.score.correct=AppState.score.wrong=0;
        osmd.cursor.reset();osmd.cursor.update();
        const entries=osmd.cursor.Iterator.CurrentVoiceEntries;
        buildExpectedNotesFromEntries(entries,0,0);
        AppState.currentExpectedContext={measureIndex:0,timestamp:0,signature:makeLedPreviewEntrySignature(entries)};
        AppState.isPlaying=true;AppState.isAudioBusy=true;
        received.length=0;
        emit(f.first,[0x90,60,81]);emit(f.first,[0x80,60,32]);emit(f.first,[0x90,61,0]);
        check(JSON.stringify(received)===JSON.stringify([[60,true,'midi',81],[60,false,'midi',32],[61,false,'midi',0]]),
            'raw press, release velocity and zero-velocity Note On reach the common input bridge');
        check(AppState.score.correct===1&&AppState.expectedNotes[0].hit,'raw MIDI grades the real OSMD practice expectation');
        received.length=0;emit(f.first,[0x9F,60,90]);emit(f.first,[0x8F,60,0]);
        check(received.length===2,'Any input accepts channel 16');
        select('midi-in-channel','2');received.length=0;
        for(const data of [[0x90,61,90],[0x91,62,91],[0x81,62,0],[0xB1,64,127],[0xC1,4],[0xF8]])emit(f.first,data);
        check(received.length===2&&received[0][0]===62&&AppState.midiInChannel===2,
            'specified channel and non-note filtering preserve the UI preference');

        select('midi-out-channel','3');f.sent.length=0;
        for(const velocity of [0,65.5,NaN,999])sendMidiOutNoteOn(60,velocity);
        sendMidiOutNoteOff(60);
        check(JSON.stringify(f.sent)===JSON.stringify([[0x92,60,1],[0x92,60,65.5],[0x92,60,100],[0x92,60,127],[0x82,60,0]]),
            'one output implementation preserves effective core velocity and channel behavior');
        document.getElementById('midi-out-channel').value='7';f.sent.length=0;sendMidiOutNoteOn(61,90);
        check(f.sent[0][0]===0x92,'output reads committed state when DOM channel is stale');
        document.getElementById('midi-out-channel').value='3';
        select('midi-in-channel','3');received.length=0;sendMidiOutNoteOn(64,100);
        emit(f.first,[0x92,64,100]);emit(f.first,[0x92,64,101]);emit(f.first,[0x82,64,0]);
        check(received.length===2&&received[0][3]===101,'exact outgoing echo is suppressed while another velocity passes');
        await new Promise(resolve=>setTimeout(resolve,140));received.length=0;emit(f.first,[0x92,64,100]);emit(f.first,[0x82,64,0]);
        check(received.length===2,'echo is accepted after the 120ms window');

        select('midi-in',f.second.id);
        check(f.first.onmidimessage===null&&typeof f.second.onmidimessage==='function','device switching detaches previous callback');
        select('midi-in','none');check(f.second.onmidimessage===null,'None releases input callback');
        select('midi-in',f.first.id);f.access.inputs.delete(f.first.id);f.access.onstatechange();
        check(f.first.onmidimessage===null&&document.getElementById('midi-in').value==='none','hot unplug releases listener and refreshes device selection');
        const reconnected={...f.first,onmidimessage:null};f.access.inputs.set(reconnected.id,reconnected);f.access.onstatechange();
        received.length=0;emit(reconnected,[0x82,62,0]);
        check(document.getElementById('midi-in').value===reconnected.id&&received.length===1,
            'reconnected saved device binds the new port object once');

        midiControls.init();midiControls.init();f.sent.length=0;select('midi-out-channel','4');
        check(f.sent.length===1&&f.sent[0][0]===0xB3,'repeated UI init registers one expression callback');
        midiControls.dispose();f.sent.length=0;select('midi-out-channel','5');
        check(f.sent.length===0&&AppState.midiOutChannel===4,'UI dispose removes its listeners');
        midiControls.init();select('midi-out-channel','5');
        check(f.sent.length===1&&f.sent[0][0]===0xB4,'UI reinit restores exactly one callback');
        midiService.dispose();check(reconnected.onmidimessage===null&&f.access.onstatechange===null,'service dispose releases input and connection listeners');
        await setupMIDI();check(f.requests===2&&typeof reconnected.onmidimessage==='function','service reinit requests access and restores saved selection');
        if(!optionalLedOutput.enabled) {
            document.getElementById('midi-lights')?.remove();document.getElementById('midi-lights-channel')?.remove();
            populateMIDIDevices();
            received.length=0;emit(reconnected,[0x82,62,0]);f.sent.length=0;sendMidiOutNoteOff(60);
            check(received.length===1&&f.sent.length===1&&f.sent[0][0]===0x84,
                'MIDI input/output controls work with optional LED device DOM absent');
        }
        results.textContent+='\nAll checks passed.\n';
    } catch(error) {results.textContent+=`ERROR: ${error.stack}\n`;
    } finally {
        pausePlaybackFromToolbar();
        for(const note of [...AppState.pressedKeys])originalInput(note,false,'midi');
        triggerVirtualKey=originalInput;
        parent.restoreMidiTestPreferences();parent.document.getElementById('run').disabled=false;
    }
})();
