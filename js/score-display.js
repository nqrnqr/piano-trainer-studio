// Display-only layout and viewport following. Playback owns the OSMD iterator.
const ScoreDisplay = (() => {
    const storageKey = TRAINER_SCORE_LAYOUT_STORAGE_KEY;
    let mode = 'traditional';
    let defaults;
    let frame = null;
    let targetLeft = 0;
    let previousTime = 0;
    let displayedIterator = null;
    let displayedSheet = null;
    let changingLayout = false;
    const area = () => document.getElementById('music-area');
    const isHorizontal = () => mode === 'horizontal';
    const follows = () => document.getElementById('check-autoscroll')?.checked !== false;

    function cancel() {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        previousTime = 0;
    }

    function animate(time) {
        frame = null;
        if (!isHorizontal() || !follows()) return;
        const viewport = area();
        targetLeft = getTargetLeft(viewport);
        const delta = targetLeft - viewport.scrollLeft;
        const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
        previousTime = time;
        if (Math.abs(delta) < 1) {
            viewport.scrollLeft = targetLeft;
            previousTime = 0;
            return;
        }
        // Retarget the same animation on every note, without queuing scrollTo animations.
        const step = Math.max(1, Math.abs(delta) * (1 - Math.exp(-elapsed / 90)));
        viewport.scrollLeft += Math.sign(delta) * Math.min(Math.abs(delta), step);
        frame = requestAnimationFrame(animate);
    }

    function getTargetLeft(viewport) {
        const cursor = osmd.cursor?.cursorElement;
        if (!cursor || cursor.style.display === 'none') return viewport.scrollLeft;
        const bounds = viewport.getBoundingClientRect();
        const rect = cursor.getBoundingClientRect();
        const contentX = viewport.scrollLeft + rect.left + rect.width / 2 - bounds.left - viewport.clientLeft;
        return Math.max(0, Math.min(
            contentX - viewport.clientWidth * 0.33,
            viewport.scrollWidth - viewport.clientWidth
        ));
    }

    function follow({ immediate = false } = {}) {
        if (!isHorizontal() || !follows()) { cancel(); return; }
        const viewport = area();
        targetLeft = getTargetLeft(viewport);
        if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            cancel();
            viewport.scrollLeft = targetLeft;
        } else if (frame === null) {
            frame = requestAnimationFrame(animate);
        }
    }

    function afterRender() {
        if (isHorizontal() || changingLayout) {
            for (const expected of AppState.expectedNotes) {
                if (expected.logicalNote) {
                    expected.anchor = GeometryEngine.getNoteAnchor(expected.logicalNote, expected.mIdx, expected.staffId - 1);
                }
            }
        }
        const cursor = osmd.cursor;
        if (cursor) {
            // Playback traverses one event ahead before it paints the next cursor.
            // Preserve the last painted position during relayout, especially while Wait is blocked.
            if ((isHorizontal() || changingLayout) && displayedIterator && displayedSheet === osmd.Sheet) {
                const playbackIterator = cursor.Iterator;
                cursor.iterator = displayedIterator;
                try { cursor.update(); } finally { cursor.iterator = playbackIterator; }
            }
            const update = cursor.update.bind(cursor);
            cursor.update = () => {
                const iterator = cursor.Iterator;
                displayedIterator = Object.assign(Object.create(Object.getPrototypeOf(iterator)), iterator);
                for (const key of Object.keys(displayedIterator)) {
                    if (Array.isArray(displayedIterator[key])) displayedIterator[key] = displayedIterator[key].slice();
                }
                displayedSheet = osmd.Sheet;
                return update();
            };
        }
        if (!isHorizontal()) return;
        // SVG can exceed the viewport; let the paper and overlays span its full width.
        const svg = document.querySelector('#osmd-container svg');
        const width = svg?.getBoundingClientRect().width || 0;
        document.getElementById('canvas-wrapper').style.width = `${Math.max(area().clientWidth, width)}px`;
        osmd.cursor?.cursorElement?.classList.add('horizontal-score-cursor');
        follow({ immediate: true });
    }

    function setMode(value, { save = true } = {}) {
        const next = value === 'horizontal' ? 'horizontal' : 'traditional';
        document.getElementById('select-score-layout').value = next;
        if (save) {
            try { localStorage.setItem(storageKey, next); } catch (_) { /* Storage may be unavailable. */ }
        }
        if (next === mode) return;
        cancel();
        mode = next;
        area().classList.toggle('score-horizontal', isHorizontal());
        document.getElementById('canvas-wrapper').style.width = '';
        osmd.cursor?.cursorElement?.classList.remove('horizontal-score-cursor');
        osmd.setOptions(isHorizontal() ? {
            renderSingleHorizontalStaffline: true,
            newSystemFromXML: false,
            newSystemFromNewPageInXML: false,
            newPageFromXML: false,
            followCursor: false
        } : defaults.options);
        // OSMD's default 32767px engraving width can wrap long scores even in single-line mode.
        osmd.EngravingRules.SheetMaximumWidth = isHorizontal() ? 10000000 : defaults.maximumWidth;
        area().scrollLeft = 0;
        area().scrollTop = 0;
        if (osmd.IsReadyToRender()) {
            const wrongPress = AppState.realtimeWrongPressInCurrentContext;
            clearFeedbackVisualStatePreserveScoring();
            AppState.realtimeWrongPressInCurrentContext = wrongPress;
            changingLayout = true;
            try { renderScoreAndRefreshGeometry(); } finally { changingLayout = false; }
            handleAutoScroll();
        }
    }

    function init() {
        const rules = osmd.EngravingRules;
        defaults = {
            maximumWidth: rules.SheetMaximumWidth,
            options: {
                renderSingleHorizontalStaffline: false,
                newSystemFromXML: rules.NewSystemAtXMLNewSystemAttribute,
                newSystemFromNewPageInXML: rules.NewSystemAtXMLNewPageAttribute,
                newPageFromXML: rules.NewPageAtXMLNewPageAttribute,
                followCursor: osmd.FollowCursor
            }
        };
        let saved;
        try { saved = localStorage.getItem(storageKey); } catch (_) { /* Use traditional layout. */ }
        setMode(saved, { save: false });
        document.getElementById('select-score-layout').addEventListener('change', event => setMode(event.target.value));
        document.getElementById('check-autoscroll').addEventListener('change', () => {
            if (follows()) follow(); else cancel();
        });
        area().addEventListener('wheel', cancel, { passive: true });
        area().addEventListener('touchstart', cancel, { passive: true });
    }

    return { init, setMode, isHorizontal, follow, afterRender, cancel };
})();
