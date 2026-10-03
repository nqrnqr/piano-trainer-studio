import {PianoTrainerDomain} from '../domain/model';
import {LegacyAppState} from '../state/model';
import {PianoTrainerControlDom} from './controls-dom';
// Observational debug UI owns its checkbox, heartbeat and SVG layer. No practice rules.
export namespace PianoTrainerFeedbackDebug {
    export interface Options {
        clearHistory?: boolean;
        logChange?: boolean;
        reason?: string;
    }
    export interface Ports {
        document: Document;
        state: Pick<LegacyAppState, 'debugPersistentAnchors' | 'debugEventFlow' | 'debugMatchLogs' | 'debugAnchorResolution' | 'debugFrameSeq' | 'debugAnchorHistory' | 'debugStickyFrameLimit' | 'isPlaying' | 'expectedNotes'>;
        getSvg(): SVGSVGElement | null;
        ensureGroup(id: string): Element | null;
        readEnabled(): boolean;
        saveEnabled(enabled: boolean): void;
        publishStickyEnabled(enabled: boolean): void;
        setInterval(callback: () => void, delay: number): number;
        clearInterval(id: number): void;
        now(): Date;
        log(...args: unknown[]): void;
        warn(...args: unknown[]): void;
        error(...args: unknown[]): void;
    }
    export function create(ports: Ports) {
        const state = ports.state, dom = PianoTrainerControlDom.create(ports.document), ownedGroups = new Set<Element>();
        let initialized = false, generation = 0, heartbeat: number | null = null, ownedCheckbox: HTMLInputElement | null = null;
        function ensureOwnedGroup() {
            const existing = ports.getSvg()?.querySelector('#pt-debug-group');
            const group = ports.ensureGroup('pt-debug-group');
            if (!existing && group)
                ownedGroups.add(group);
            return group;
        }
        const service = {
            isDebugEnabled() {
                return !!(state.debugPersistentAnchors || state.debugEventFlow || state.debugMatchLogs || state.debugAnchorResolution);
            },
            syncDebugCheckbox() {
                const checkbox = dom.optionalInput('check-debug');
                if (checkbox)
                    checkbox.checked = this.isDebugEnabled();
            },
            debugLogEvent(label: string, payload: Readonly<Record<string, unknown>> = {}) {
                if (!state.debugEventFlow)
                    return;
                try {
                    ports.log(label, payload);
                    ports.warn('[PianoTrainer debug event]', label, payload);
                }
                catch (e) { }
            },
            debugLogAnchorResolution(label: string, payload: Readonly<Record<string, unknown>> = {}) {
                if (!state.debugAnchorResolution)
                    return;
                try {
                    ports.warn('[PianoTrainer anchor]', label, payload);
                }
                catch (e) { }
            },
            getDebugGroup() {
                return ensureOwnedGroup();
            },
            clearSvgDebug() {
                const group = ports.getSvg()?.querySelector('#pt-debug-group');
                if (group)
                    group.replaceChildren();
            },
            pushStickyDebugFrame(frame: PianoTrainerDomain.FeedbackFrameInput | null | undefined) {
                if (!state.debugPersistentAnchors || !frame || !Array.isArray(frame.notes) || frame.notes.length === 0)
                    return;
                const normalizedNotes = frame.notes
                    .filter(n => n && n.anchor && Number.isFinite(n.anchor.x) && Number.isFinite(n.anchor.y))
                    .map(n => ({
                    midi: n.midi,
                    staffId: n.staffId,
                    kind: n.kind || 'expected',
                    hit: !!n.hit,
                    anchor: {
                        x: n.anchor!.x,
                        y: n.anchor!.y
                    }
                }));
                if (normalizedNotes.length === 0)
                    return;
                const entry = {
                    seq: ++state.debugFrameSeq,
                    measureIndex: frame.measureIndex ?? null,
                    timestamp: frame.timestamp ?? null,
                    kind: frame.kind || 'expected',
                    notes: normalizedNotes
                };
                state.debugAnchorHistory.push(entry);
                this.debugLogEvent('STICKY_DEBUG_FRAME_PUSHED', {
                    seq: entry.seq,
                    measureIndex: entry.measureIndex,
                    kind: entry.kind,
                    noteCount: entry.notes.length,
                    notes: entry.notes.map(n => ({ midi: n.midi, staffId: n.staffId, kind: n.kind, hit: n.hit, anchor: n.anchor }))
                });
                const maxFrames = Math.max(1, state.debugStickyFrameLimit || 10);
                if (state.debugAnchorHistory.length > maxFrames) {
                    state.debugAnchorHistory.splice(0, state.debugAnchorHistory.length - maxFrames);
                }
                this.renderStickyDebug();
            },
            renderStickyDebug() {
                this.clearSvgDebug();
                if (!state.debugPersistentAnchors)
                    return;
                const group = this.getDebugGroup();
                if (!group)
                    return;
                const history = state.debugAnchorHistory || [];
                if (history.length === 0)
                    return;
                const total = history.length;
                this.debugLogEvent('STICKY_DEBUG_RENDER', { frameCount: total });
                history.forEach((frame, frameIndex) => {
                    const opacity = 0.95;
                    frame.notes.forEach((note, noteIndex) => {
                        const g = ports.document.createElementNS('http://www.w3.org/2000/svg', 'g');
                        g.setAttribute('data-debug-seq', String(frame.seq));
                        g.setAttribute('data-debug-kind', frame.kind || 'expected');
                        g.setAttribute('opacity', String(opacity));
                        const ring = ports.document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        ring.setAttribute('cx', String(note.anchor.x));
                        ring.setAttribute('cy', String(note.anchor.y));
                        ring.setAttribute('r', note.kind === 'feedback' ? '8' : '6');
                        ring.setAttribute('fill', 'none');
                        ring.setAttribute('stroke', note.kind === 'feedback'
                            ? (note.hit ? 'rgba(46, 204, 113, 0.95)' : 'rgba(231, 76, 60, 0.95)')
                            : 'rgba(255, 140, 0, 0.95)');
                        ring.setAttribute('stroke-width', note.kind === 'feedback' ? '2' : '1.5');
                        g.appendChild(ring);
                        const h = ports.document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        h.setAttribute('x1', String(note.anchor.x - 4));
                        h.setAttribute('y1', String(note.anchor.y));
                        h.setAttribute('x2', String(note.anchor.x + 4));
                        h.setAttribute('y2', String(note.anchor.y));
                        h.setAttribute('stroke', 'rgba(255, 255, 255, 0.85)');
                        h.setAttribute('stroke-width', '1');
                        g.appendChild(h);
                        const v = ports.document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        v.setAttribute('x1', String(note.anchor.x));
                        v.setAttribute('y1', String(note.anchor.y - 4));
                        v.setAttribute('x2', String(note.anchor.x));
                        v.setAttribute('y2', String(note.anchor.y + 4));
                        v.setAttribute('stroke', 'rgba(255, 255, 255, 0.85)');
                        v.setAttribute('stroke-width', '1');
                        g.appendChild(v);
                        const label = ports.document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        label.setAttribute('x', String(note.anchor.x + 7));
                        label.setAttribute('y', String(note.anchor.y - 7 - ((noteIndex % 2) * 9)));
                        label.setAttribute('font-size', '9');
                        label.setAttribute('font-family', 'monospace');
                        label.setAttribute('fill', note.kind === 'feedback'
                            ? (note.hit ? 'rgba(46, 204, 113, 0.95)' : 'rgba(231, 76, 60, 0.95)')
                            : 'rgba(255, 140, 0, 0.95)');
                        label.textContent = `${frame.measureIndex ?? '?'}:${note.staffId ?? '?'}:${note.midi ?? '?'}`;
                        g.appendChild(label);
                        group.appendChild(g);
                    });
                });
            },
            setDebugEnabled(enabled: boolean, options: Options = {}) {
                const next = !!enabled;
                const { clearHistory = !next, logChange = true, reason = 'ui-toggle' } = options;
                state.debugPersistentAnchors = next;
                state.debugEventFlow = next;
                state.debugMatchLogs = next;
                state.debugAnchorResolution = next;
                ports.publishStickyEnabled(next);
                if (!next) {
                    if (clearHistory) {
                        state.debugAnchorHistory = [];
                    }
                    this.clearSvgDebug();
                    if (clearHistory) {
                        this.renderStickyDebug();
                    }
                }
                else {
                    this.renderStickyDebug();
                }
                this.syncDebugCheckbox();
                if (logChange) {
                    ports.error('[PianoTrainer debug TOGGLE]', {
                        enabled: next,
                        reason,
                        stickyFrames: state.debugStickyFrameLimit,
                        stickyHistory: state.debugAnchorHistory.length,
                        ts: ports.now().toISOString()
                    });
                }
            },
            init() {
                if (initialized)
                    return;
                const debugCheckbox = dom.optionalInput('check-debug'), token = generation;
                initialized = true;
                if (debugCheckbox && !debugCheckbox.dataset.ptDebugBound) {
                    dom.onInput(debugCheckbox, 'change', input => {
                        if (token !== generation)
                            return;
                        ports.saveEnabled(input.checked);
                        this.setDebugEnabled(input.checked, { clearHistory: !input.checked, logChange: input.checked, reason: 'checkbox' });
                    });
                    debugCheckbox.dataset.ptDebugBound = '1';
                    ownedCheckbox = debugCheckbox;
                }
                this.setDebugEnabled(ports.readEnabled(), { clearHistory: !ports.readEnabled(), logChange: false, reason: 'startup' });
                heartbeat = ports.setInterval(() => {
                    if (token !== generation)
                        return;
                    try {
                        if (!this.isDebugEnabled())
                            return;
                        if (!state.debugEventFlow && !state.debugMatchLogs)
                            return;
                        ports.error('[PianoTrainer debug HEARTBEAT]', { isPlaying: state.isPlaying, expectedNotes: state.expectedNotes.length,
                            stickyHistory: state.debugAnchorHistory.length, ts: ports.now().toISOString() });
                    }
                    catch (_) { }
                }, 4000);
            },
            dispose() {
                generation++;
                initialized = false;
                dom.dispose();
                if (heartbeat !== null)
                    ports.clearInterval(heartbeat);
                heartbeat = null;
                if (ownedCheckbox?.dataset.ptDebugBound === '1')
                    delete ownedCheckbox.dataset.ptDebugBound;
                ownedCheckbox = null;
                for (const group of ownedGroups)
                    group.remove();
                ownedGroups.clear();
            },
            forcePianoTrainerDebugStatus(tag: string = 'manual') {
                const snapshot = {
                    tag,
                    debugAnchors: state.debugPersistentAnchors,
                    debugEventFlow: state.debugEventFlow,
                    debugMatchLogs: state.debugMatchLogs,
                    debugAnchorResolution: state.debugAnchorResolution,
                    debugStickyFrames: state.debugStickyFrameLimit,
                    stickyHistory: state.debugAnchorHistory.length,
                    expectedNotes: state.expectedNotes.length,
                    isPlaying: state.isPlaying,
                    ts: ports.now().toISOString()
                };
                if (this.isDebugEnabled()) {
                    ports.error('[PianoTrainer debug STATUS]', snapshot);
                }
                return snapshot;
            },
            setDebugStickyFrames(count: string | number) {
                const nextCount = Math.max(1, parseInt(String(count), 10) || 10);
                state.debugStickyFrameLimit = nextCount;
                if (state.debugAnchorHistory.length > nextCount) {
                    state.debugAnchorHistory.splice(0, state.debugAnchorHistory.length - nextCount);
                }
                if (state.debugPersistentAnchors) {
                    this.renderStickyDebug();
                }
                else {
                    this.clearSvgDebug();
                }
                return state.debugStickyFrameLimit;
            },
            clearStickyDebug() {
                state.debugAnchorHistory = [];
                if (state.debugPersistentAnchors) {
                    this.renderStickyDebug();
                }
                else {
                    this.clearSvgDebug();
                }
            },
        };
        return service;
    }
    export type Service = ReturnType<typeof create>;
}
