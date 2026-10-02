// Unchanged optional legacy LED test; not a core MIDI service.
const MidiLedTestController = {
    isRunning: false,
    cancelRequested: false,
    activeNotes: new Set(),
    waitToken: 0,
    currentOutput: null,

    getSelectedOutput() {
        const lightsOutId = document.getElementById('midi-lights')?.value || 'none';
        if (AppState.ledOutputMode !== 'midi' || lightsOutId === 'none') return null;
        const output = getLegacyMidiOutput(lightsOutId);
        return output && output.state !== 'disconnected' ? output : null;
    },

    setStatus(text) {
        const status = document.getElementById('midi-led-test-status');
        if (status) status.textContent = text;
    },

    updateButton() {
        const btn = document.getElementById('btn-test-midi-led');
        if (btn) btn.textContent = this.isRunning ? 'Stop Test' : 'Test LED Strip';
    },

    syncControls() {
        const btn = document.getElementById('btn-test-midi-led');
        const modeIsMidi = AppState.ledOutputMode === 'midi';
        const hasOutput = !!this.getSelectedOutput();
        if (btn) btn.disabled = !modeIsMidi || (!hasOutput && !this.isRunning);
        if (!this.isRunning) {
            this.setStatus(modeIsMidi
                ? (hasOutput ? 'Run a chromatic sweep across the player key range.' : 'Select an LED MIDI device first.')
                : 'MIDI LED idle.');
        }
        this.updateButton();
    },

    sendNoteOn(output, note) {
        const velocity = typeof LedEngine?.getMidiVelocityForState === 'function'
            ? LedEngine.getMidiVelocityForState('active')
            : 127;
        const status = getMidiStatus(0x90, getSelectedMidiLightsChannel());
        rememberOutgoingMidiMessage(status, note, velocity);
        output.send([status, note, velocity]);
        this.activeNotes.add(note);
    },

    sendNoteOff(output, note) {
        const status = getMidiStatus(0x80, getSelectedMidiLightsChannel());
        rememberOutgoingMidiMessage(status, note, 0);
        output.send([status, note, 0]);
        this.activeNotes.delete(note);
    },

    async wait(ms) {
        const token = ++this.waitToken;
        return new Promise(resolve => {
            setTimeout(() => resolve(token === this.waitToken), ms);
        });
    },

    async stop({ statusText = 'MIDI LED test stopped.' } = {}) {
        this.cancelRequested = true;
        this.waitToken += 1;
        const output = this.currentOutput || this.getSelectedOutput();
        if (output) {
            for (const note of [...this.activeNotes]) {
                try {
                    this.sendNoteOff(output, note);
                } catch (err) {
                    console.warn('MIDI LED test note-off error', err);
                }
            }
            try {
                output.send([getMidiStatus(0xB0, getSelectedMidiLightsChannel()), 123, 0]);
            } catch (err) {
                console.warn('MIDI LED test all-notes-off error', err);
            }
        }
        this.activeNotes.clear();
        this.currentOutput = null;
        this.isRunning = false;
        this.updateButton();
        AppState.hardwareLEDState.clear();
        if (typeof renderVirtualKeyboard === 'function') renderVirtualKeyboard();
        this.setStatus(statusText);
    },

    async run() {
        if (this.isRunning) {
            await this.stop({ statusText: 'MIDI LED test stopped.' });
            return;
        }

        const output = this.getSelectedOutput();
        if (!output) {
            this.setStatus('Select an LED MIDI device first.');
            this.syncControls();
            return;
        }

        const notes = typeof buildChromaticTestNotes === 'function'
            ? buildChromaticTestNotes()
            : (() => {
                const fallback = [];
                const range = typeof getPlayerPlayableRange === 'function'
                    ? getPlayerPlayableRange()
                    : { minMidi: 21, maxMidi: 108 };
                for (let note = range.minMidi; note <= range.maxMidi; note++) fallback.push(note);
                for (let note = range.maxMidi - 1; note > range.minMidi; note--) fallback.push(note);
                return fallback;
            })();

        if (!notes.length) {
            this.setStatus('No playable keys available for MIDI LED test.');
            return;
        }

        this.cancelRequested = false;
        this.currentOutput = output;
        this.isRunning = true;
        this.updateButton();
        this.setStatus('Running MIDI LED strip test…');
        wipeHardwareLEDs();

        const stepMs = 75;
        const holdMs = 55;

        try {
            for (let i = 0; i < notes.length; i++) {
                if (this.cancelRequested) break;
                const note = notes[i];
                this.sendNoteOn(output, note);
                this.setStatus(`Testing MIDI LED note ${note} (${i + 1}/${notes.length}).`);
                const keepGoing = await this.wait(holdMs);
                if (!keepGoing || this.cancelRequested) break;
                this.sendNoteOff(output, note);
                if (stepMs > holdMs) {
                    const continueAfterGap = await this.wait(stepMs - holdMs);
                    if (!continueAfterGap || this.cancelRequested) break;
                }
            }

            await this.stop({ statusText: this.cancelRequested ? 'MIDI LED test stopped.' : 'MIDI LED test complete.' });
        } catch (err) {
            console.warn('MIDI LED test error', err);
            await this.stop({ statusText: 'MIDI LED test failed.' });
        }
    }
};

window.MidiLedTestController = MidiLedTestController;

function initLegacyMidiLedTest() {
    const midiLedTestBtn = document.getElementById('btn-test-midi-led');
    if (optionalLedOutput.enabled && midiLedTestBtn && !midiLedTestBtn.dataset.boundMidiLedTest) {
        midiLedTestBtn.dataset.boundMidiLedTest = 'true';
        midiLedTestBtn.addEventListener('click', async () => {
            await MidiLedTestController.run();
        });
    }
    if (optionalLedOutput.enabled) MidiLedTestController.syncControls();
}
