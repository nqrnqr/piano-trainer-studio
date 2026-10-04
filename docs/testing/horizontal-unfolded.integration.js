(async () => {
    const results=parent.document.getElementById('results'),api=window.PianoTrainerTest;
    results.textContent='';
    const check=(ok,message)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${message}\n`;if(!ok)throw Error(message);};
    try {
        api.practice.muteOutputs();
        for(const [fixture,expected] of [['simple-repeat',[0,1,0,1,2]],['first-second-ending',[0,1,2,0,1,3,4]],['horizontal-single',[0,0,1]],['horizontal-voices',[0,1,0,1,2]]]) {
            const xml=await(await fetch(`/docs/testing/fixtures/${fixture}.musicxml`)).text();
            await api.loadScore(xml,{fileName:`${fixture}.musicxml`});
            const before=api.readViewportSnapshot(),trace=api.horizontal.trace(),after=api.readViewportSnapshot();
            check(JSON.stringify(trace.measures.map(m=>m.sourceMeasureIndex))===JSON.stringify(expected),`${fixture}: independent vendor path matches handwritten expectation`);
            check(JSON.stringify(before)===JSON.stringify(after),`${fixture}: planning leaves source cursor/paint unchanged`);
            const display=await api.horizontal.prototype(xml);
            check(display.anchors.every(Boolean),`${fixture}: every performed event has a validated structural display anchor`);
            check(display.anchors.every((anchor,index)=>!index||anchor.x>=display.anchors[index-1].x-0.01),`${fixture}: repeated occurrences progress to the right`);
            check(!/<(?:repeat|ending)[\s/>]/.test(display.xml),`${fixture}: consumed navigation removed from display XML`);
            check(api.readViewportSnapshot().scoreRevision===before.scoreRevision,`${fixture}: display does not change source NoteRef revision`);
            api.horizontal.clear();
        }
        const snapshot=()=>api.readPracticeSnapshot(),f=api.playback,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
        const release=()=>{for(const midi of snapshot().pressed)api.dispatchInput(midi,false);};
        const hit=()=>{for(const note of snapshot().expected)if(!note.hit)api.dispatchInput(note.midi,true);release();};
        const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();
        const observedTrace=api.horizontal.trace(),sourceIndex=observedTrace.steps[0].source.sourceMeasureIndex;
        observedTrace.steps[0].source.sourceMeasureIndex=999;
        check(api.horizontal.trace().steps[0].source.sourceMeasureIndex===sourceIndex,'trace observations cannot mutate source addresses');
        for(const mode of ['wait','follow','realtime']) {
            api.pause();f.disposeCoordinator();await api.loadScore(xml,{fileName:'simple-repeat.musicxml'});
            await api.setLayout('horizontal');f.selectMode(mode);f.prepareScenario();f.setNow(10);
            await api.horizontal.ready();document.getElementById('btn-play').click();for(let i=0;i<200&&!f.readClock().countIns;i++)await wait(10);
            if(!f.readClock().countIns)throw Error(`No count-in: ${JSON.stringify({state:snapshot(),resources:api.horizontal.resources(),clock:f.readClock()})}`);
            f.finishCountIn();
            let previousX=-Infinity,previousId=0,visits=[];
            for(let step=0;step<20;step++) {
                const event=api.horizontal.position(),cursor=document.querySelector('.pt-performance-cursor');
                const x=Number(cursor.dataset.logicalX);
                check(x>=previousX&&event.eventId>previousId,`${mode} step ${step}: official event and display move forward`);
                if(visits.at(-1)!==event.measureOccurrenceId)visits.push(event.measureOccurrenceId);
                const identity=api.render.captureIdentity(),before=JSON.stringify(snapshot().expected),id=event.eventId;
                api.render.render();await api.horizontal.ready();
                check(api.horizontal.position().eventId===id&&api.render.readIdentity(identity).iteratorSame&&JSON.stringify(snapshot().expected)===before,`${mode} step ${step}: redraw keeps event, prefetch and pending notes`);
                if(step===8) {
                    const sourcePosition=JSON.stringify(api.practice.readTraversal());
                    api.practice.rebuildTimeline();
                    check(JSON.stringify(api.practice.readTraversal())===sourcePosition,`${mode}: second-pass preview rebuild preserves precise occurrence`);
                    await api.setLayout('traditional');await api.setLayout('horizontal');
                    check(api.horizontal.position().eventId===id&&JSON.stringify(api.practice.readTraversal())===sourcePosition,`${mode}: second-pass layout roundtrip preserves event and prefetch`);
                }
                if(mode!=='realtime') {
                    check(!f.nextTimer(),`${mode} step ${step}: Wait/Follow hold current event before input`);
                    hit();
                }
                previousX=x;previousId=id;f.fireNext();
            }
            check(!snapshot().playing&&JSON.stringify(visits)==='[0,1,2,3,4]',`${mode}: finite repeat ends after all five displayed occurrences`);
        }
        api.pause();f.disposeCoordinator();await api.loadScore(xml,{fileName:'loop-repeat.musicxml'});await api.setLayout('horizontal');
        f.selectMode('realtime');f.prepareScenario();f.setNow(10);
        document.getElementById('check-looper').checked=true;document.getElementById('val-loop-min').value='1';document.getElementById('val-loop-max').value='1';
        document.getElementById('check-autoscroll').checked=true;
        await api.horizontal.ready();document.getElementById('btn-play').click();await wait(0);f.finishCountIn();
        let previousX=-Infinity,maxChunks=0,maxModels=0,maxNotes=0,maxError=0,maxNodes=0,maxTemplateNodes=0,maxInstances=0;
        for(let iteration=0;iteration<100;iteration++) {
            for(let beat=0;beat<4;beat++) {
                await api.horizontal.ready();api.render.follow(true);
                const event=api.horizontal.position(),x=Number(document.querySelector('.pt-performance-cursor').dataset.logicalX);
                check(event.loopIteration===iteration&&x>previousX,`Loop ${iteration+1}.${beat+1}: logical cursor proceeds into the next right-hand copy`);
                previousX=x;const resources=api.horizontal.resources();maxChunks=Math.max(maxChunks,resources.chunks);maxModels=Math.max(maxModels,resources.models);maxNotes=Math.max(maxNotes,resources.mappedNotes);
                maxNodes=Math.max(maxNodes,resources.mountedNodes);maxTemplateNodes=Math.max(maxTemplateNodes,resources.templateNodes);maxInstances=Math.max(maxInstances,resources.instances);
                if(resources.lastRebase)maxError=Math.max(maxError,resources.lastRebase.error);
                if(iteration===50&&beat===3)f.enableLoopCountIn();
                const id=event.eventId;f.fireNext();
                if(snapshot().countIn) {check(api.horizontal.position().eventId===id,`Loop ${iteration+1}: count-in keeps the outgoing official event`);f.finishCountIn();}
            }
            await wait(0);
        }
        check(maxChunks<=7&&maxModels<=16&&maxNotes<=32,'100 Loops: SVG chunks, template models and note mappings stay bounded');
        check(maxInstances<=1&&maxNodes<=1500&&maxTemplateNodes<=600,'100 Loops: display instances and actual SVG descendants stay within the measured fixed window');
        const ids=[...document.querySelectorAll('.pt-horizontal-canvas [id]')].map(node=>node.id);
        if(new Set(ids).size!==ids.length)results.textContent+=`DUPLICATE_IDS ${JSON.stringify(ids.filter((id,index)=>ids.indexOf(id)!==index))}\n`;
        check(new Set(ids).size===ids.length,'mounted chunk copies own unique SVG IDs including their roots');
        check(maxError<=1,'100 Loops: origin rebasing preserves the current screen coordinate within 1 CSS px');
        results.textContent+=`MEASUREMENT ${JSON.stringify({iterations:100,maxChunks,maxModels,maxNotes,maxError,maxNodes,maxTemplateNodes,maxInstances,resources:api.horizontal.resources()})}\n`;
    } catch(error) {results.textContent+=`ERROR: ${error.stack}\n`;}
    finally {api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();parent.document.getElementById('run').disabled=false;}
    if(!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent))results.textContent+='\nAll checks passed.\n';
})();
