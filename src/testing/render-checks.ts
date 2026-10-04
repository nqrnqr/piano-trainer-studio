import type {createServices} from '../app/services';

type Services = ReturnType<typeof createServices>;
// Captured identities stay private. Tests receive tokens and primitive observations.
export function createRenderChecks(getServices: () => Services) {
    const captures = new Map<number, {
        notes: Services['AppState']['expectedNotes'];
        refs: Services['AppState']['expectedNotes'][number]['noteRef'][];
        live: NonNullable<ReturnType<Services['osmdAdapter']['getTraversalCursor']>>['Iterator'];
    }>();
    let nextCapture = 0;
    const commands = Object.freeze({
        seekMeasure:(index:number,follow = true) => {
            const services = getServices(), adapter = services.osmdAdapter;
            adapter.reset(); let steps = 0;
            while (!adapter.isEndReached() && adapter.getCurrentMeasureIndex() < index && steps++ < 100000) adapter.advance();
            if (steps >= 100000) throw Error('Fixture traversal did not terminate');
            adapter.showCursor(); adapter.updateCursor();
            services.performancePosition.navigate('seek');
            if (follow) services.ScoreDisplay.autoScroll();
        },
        updateCursor:() => {const services = getServices();services.osmdAdapter.updateCursor();services.performancePosition.present();},
        follow:(immediate = false) => getServices().ScoreDisplay.follow({immediate}),
        render:() => getServices().scoreRenderer.renderScoreAndRefreshGeometry(),
        zoom:(value:number) => getServices().displayControls.applyZoom(value,{save:false}),
        disposeViewport:() => getServices().ScoreDisplay.dispose(),
        initViewport:() => getServices().ScoreDisplay.init(),
        setWrongContext:(value:boolean) => {getServices().AppState.realtimeWrongPressInCurrentContext = value;},
        seedScore:(correct:number,wrong:number,hitFirst = true) => {
            const state = getServices().AppState;
            state.score.correct = correct; state.score.wrong = wrong;
            if (hitFirst && state.expectedNotes[0]) state.expectedNotes[0].hit = true;
        },
        renderLoop:(min?:number,max?:number) => {
            const services = getServices();
            if (min !== undefined) services.AppState.looper.min = min;
            if (max !== undefined) services.AppState.looper.max = max;
            services.loopOverlay.render();
        },
        captureIdentity:() => {
            const services = getServices(), notes = services.AppState.expectedNotes.slice();
            const cursor = services.osmdAdapter.getTraversalCursor();
            if (!cursor) throw Error('No loaded traversal cursor');
            const token = ++nextCapture;
            captures.set(token,{notes,refs:notes.map(note => note.noteRef),live:cursor.Iterator});
            return token;
        },
        readIdentity:(token:number) => {
            const captured = captures.get(token); if (!captured) throw Error('Unknown render observation');
            const services = getServices(), adapter = services.osmdAdapter;
            return {
                iteratorSame:adapter.getTraversalCursor()?.Iterator === captured.live,
                expectationsSame:captured.notes.every((note,index) => services.AppState.expectedNotes[index] === note),
                refsSame:captured.notes.every((note,index) => note.noteRef === captured.refs[index]),
                sourcesMatch:captured.notes.every(note => (adapter.resolveNote(note.noteRef)?.halfTone ?? NaN) + 12 === note.midi),
                refsFrozen:captured.notes.every(note => Object.isFrozen(note.noteRef) && !('logicalNote' in note)),
                oldRefValid:captured.refs[0] ? adapter.resolveNote(captured.refs[0]) !== null : false,
                revisionChanged:services.AppState.expectedNotes[0]?.noteRef.scoreRevision !== captured.refs[0]?.scoreRevision
            };
        }
    });
    return {commands,clear:() => captures.clear()};
}
