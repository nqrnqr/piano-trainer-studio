"use strict";
// Native toolbar/menu state. Ordinary transitions retain the baseline callback order.
var PianoTrainerToolbar;
(function (PianoTrainerToolbar) {
    const panelIds = ['scores-panel', 'options-overlay', 'tempo-popup', 'practice-popup', 'looper-popup',
        'more-popup', 'audio-popup', 'display-popup', 'transpose-popup', 'help-overlay'];
    function create(ports) {
        const { document, window } = ports;
        const panels = new Map();
        const panelButtons = new Map();
        const listeners = [];
        const frames = new Set(), timers = new Set();
        const transitions = new Set();
        let initialized = false, active = true, generation = 0, firstRunQuickStartActive = false;
        function element(id, required = false) {
            const node = document.getElementById(id);
            if (node && !(node instanceof HTMLElement))
                throw Error('Invalid toolbar control: ' + id);
            if (!node && required)
                throw Error('Missing required toolbar control: ' + id);
            return node;
        }
        function getPanel(id) { return panels.get(id) ?? null; }
        function bind(target, event, handler) {
            target.addEventListener(event, handler);
            listeners.push({ target, event, handler });
        }
        function syncToolbarButtonStates() {
            if (!active)
                return;
            panelButtons.forEach((button, panel) => {
                const isOpen = !panel.classList.contains('hidden') && panel.classList.contains('is-open');
                button.classList.toggle('is-open', isOpen);
                button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        }
        function markFirstRunIntroSeen() {
            if (!active)
                return;
            try {
                ports.storage.setItem('pt_firstRunIntroSeen', 'true');
            }
            catch (_) { }
        }
        function closeToolbarPanel(panel, immediate = false) {
            if (!active || !panel || panel.classList.contains('hidden'))
                return;
            if (panel === getPanel('help-overlay') && firstRunQuickStartActive) {
                markFirstRunIntroSeen();
                firstRunQuickStartActive = false;
            }
            panel.classList.remove('is-open');
            if (immediate) {
                panel.classList.remove('is-closing');
                panel.classList.add('hidden');
                syncToolbarButtonStates();
                return;
            }
            panel.classList.add('is-closing');
            const token = generation;
            const transition = { panel, handler: finalizeClose };
            function finalizeClose(event) {
                if (!active || token !== generation || (event && event.target !== panel))
                    return;
                panel.classList.remove('is-closing');
                panel.classList.add('hidden');
                panel.removeEventListener('transitionend', finalizeClose);
                transitions.delete(transition);
                syncToolbarButtonStates();
            }
            panel.addEventListener('transitionend', finalizeClose);
            transitions.add(transition);
            const id = window.setTimeout(() => {
                timers.delete(id);
                if (active && token === generation && panel.classList.contains('is-closing'))
                    finalizeClose();
            }, 220);
            timers.add(id);
        }
        function showToolbarPanel(panel) {
            if (!active || !panel)
                return;
            panels.forEach(other => { if (other !== panel)
                closeToolbarPanel(other, true); });
            if (!panel.classList.contains('hidden') && panel.classList.contains('is-open'))
                return;
            panel.classList.remove('hidden', 'is-closing');
            const token = generation;
            const id = window.requestAnimationFrame(() => {
                frames.delete(id);
                if (!active || token !== generation)
                    return;
                panel.classList.add('is-open');
                syncToolbarButtonStates();
            });
            frames.add(id);
        }
        function hideToolbarPanels(immediate = false) {
            if (active)
                panels.forEach(panel => closeToolbarPanel(panel, immediate));
        }
        function toggleToolbarPanel(panel) {
            if (!active || !panel)
                return;
            const shouldShow = panel.classList.contains('hidden') || !panel.classList.contains('is-open');
            if (shouldShow)
                showToolbarPanel(panel);
            else
                closeToolbarPanel(panel);
        }
        function launchFromMore(targetPanel) {
            closeToolbarPanel(getPanel('more-popup'), true);
            if (targetPanel)
                showToolbarPanel(targetPanel);
        }
        function isAnyToolbarPanelOpen() {
            return [...panels.values()].some(panel => panel && !panel.classList.contains('hidden'));
        }
        function positionScoresPanel() {
            if (!active)
                return;
            const panel = element('scores-panel');
            if (!panel)
                return;
            const nav = element('static-menu');
            let topPx = 58;
            if (nav)
                topPx = Math.round(nav.getBoundingClientRect().bottom + 10);
            panel.style.top = `${topPx}px`;
            panel.style.bottom = '12px';
        }
        function showFirstRunIntro() {
            const help = getPanel('help-overlay');
            if (!active || !help)
                return;
            firstRunQuickStartActive = true;
            hideToolbarPanels(true);
            showToolbarPanel(help);
            const body = help.querySelector('.info-panel-body');
            if (body)
                body.scrollTop = 0;
        }
        function closeFirstRunIntro() { closeToolbarPanel(getPanel('help-overlay')); }
        function maybeShowFirstRunIntro() {
            if (!active || !getPanel('help-overlay'))
                return false;
            try {
                if (ports.storage.getItem('pt_firstRunIntroSeen') === 'true')
                    return false;
            }
            catch (_) { }
            showFirstRunIntro();
            return true;
        }
        function init() {
            if (initialized)
                return;
            active = true;
            for (const id of panelIds)
                panels.set(id, element(id));
            for (const [panelId, buttonId] of [['scores-panel', 'btn-scores'], ['options-overlay', 'btn-options'],
                ['tempo-popup', 'btn-tempo'], ['practice-popup', 'btn-practice'], ['looper-popup', 'btn-looper'],
                ['more-popup', 'btn-more']]) {
                const panel = getPanel(panelId), button = element(buttonId);
                if (panel && button)
                    panelButtons.set(panel, button);
            }
            const scores = getPanel('scores-panel'), scoresButton = element('btn-scores');
            if (scores && scoresButton)
                bind(scoresButton, 'click', async (event) => {
                    event.stopPropagation();
                    const token = generation;
                    const shouldShow = scores.classList.contains('hidden') || !scores.classList.contains('is-open');
                    if (shouldShow) {
                        ports.state.scoreLibraryView = 'folders';
                        try {
                            await ports.refreshScoresDrawer();
                        }
                        catch (_) { }
                    }
                    if (active && token === generation)
                        toggleToolbarPanel(scores);
                });
            bind(element('btn-options', true), 'click', event => {
                event.stopPropagation();
                toggleToolbarPanel(getPanel('options-overlay'));
            });
            for (const id of ['btn-help-close', 'btn-help-got-it']) {
                const button = element(id), help = getPanel('help-overlay');
                if (button && help)
                    bind(button, 'click', () => closeToolbarPanel(help));
            }
            for (const [buttonId, panelId] of [['btn-tempo', 'tempo-popup'], ['btn-practice', 'practice-popup'],
                ['btn-looper', 'looper-popup'], ['btn-more', 'more-popup']]) {
                const button = element(buttonId), panel = getPanel(panelId);
                if (button && panel)
                    bind(button, 'click', event => { event.stopPropagation(); toggleToolbarPanel(panel); });
            }
            for (const [buttonId, panelId] of [['btn-more-tempo', 'tempo-popup'], ['btn-more-loop', 'looper-popup'],
                ['btn-more-audio', 'audio-popup'], ['btn-more-display', 'display-popup'],
                ['btn-more-transpose', 'transpose-popup'], ['btn-more-help', 'help-overlay']]) {
                const button = element(buttonId), panel = getPanel(panelId);
                if (button && panel)
                    bind(button, 'click', event => { event.stopPropagation(); launchFromMore(panel); });
            }
            bind(document, 'click', event => {
                if (!(event.target instanceof Element))
                    return;
                const target = event.target;
                const exclusions = ['#scores-panel', '#options-overlay', '#tempo-popup', '#transpose-popup',
                    '#practice-popup', '#looper-popup', '#more-popup', '#audio-popup', '#display-popup',
                    '#help-overlay', '#led-calibration-panel', '.scores-action-menu-overlay', '.scores-folder-picker-overlay'];
                if (exclusions.some(selector => target.closest(selector)))
                    return;
                if (isAnyToolbarPanelOpen()) {
                    hideToolbarPanels();
                    event.stopPropagation();
                }
            });
            initialized = true;
        }
        function dispose() {
            if (!active)
                return;
            active = false;
            generation++;
            initialized = false;
            for (const { target, event, handler } of listeners)
                target.removeEventListener(event, handler);
            listeners.length = 0;
            for (const id of frames)
                window.cancelAnimationFrame(id);
            frames.clear();
            for (const id of timers)
                window.clearTimeout(id);
            timers.clear();
            for (const { panel, handler } of transitions)
                panel.removeEventListener('transitionend', handler);
            transitions.clear();
            panelButtons.clear();
        }
        return { init, dispose, syncToolbarButtonStates, showToolbarPanel, closeToolbarPanel,
            hideToolbarPanels, toggleToolbarPanel, isAnyToolbarPanelOpen, positionScoresPanel,
            maybeShowFirstRunIntro, showFirstRunIntro, closeFirstRunIntro, markFirstRunIntroSeen };
    }
    PianoTrainerToolbar.create = create;
})(PianoTrainerToolbar || (PianoTrainerToolbar = {}));
//# sourceMappingURL=toolbar.js.map