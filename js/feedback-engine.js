// Transitional loop navigation; migrated with the playback coordinator in P7.
function renderLooper() {
    GeometryEngine.renderLooper();
}

function enforceLooperBounds() {
    if (!document.getElementById('check-looper').checked || !osmd.cursor) return;
    
    const minLoop = AppState.looper.min;
    const maxLoop = AppState.looper.max;
    const current = osmd.cursor.Iterator.CurrentMeasureIndex + 1;
    
    if (current < minLoop || current > maxLoop) {
        osmd.cursor.reset();
        while (!osmd.cursor.Iterator.EndReached && osmd.cursor.Iterator.CurrentMeasureIndex < minLoop - 1) {
            osmd.cursor.Iterator.moveToNext();
        }
        osmd.cursor.update();
        handleAutoScroll();
    }
}
