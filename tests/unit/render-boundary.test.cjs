const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {runScript}=require('../helpers/legacy-script.cjs');
const plain=value=>JSON.parse(JSON.stringify(value));
function adapterHarness() {
    const realm=vm.createContext({});runScript(realm,'js/generated/score/osmd-adapter.js');
    class Iterator {
        constructor(measure=0,time=0) {this.CurrentMeasureIndex=measure;this.currentTimeStamp={RealValue:time};this.repeatStack=[1,2];this.CurrentVoiceEntries=[];}
        moveToNext(){this.CurrentMeasureIndex++;this.currentTimeStamp={RealValue:this.currentTimeStamp.RealValue+1};this.repeatStack.push(3);}
    }
    const painted=[],logs=[];let cursorSequence=0;
    const cursor=iterator=>({id:++cursorSequence,iterator,get Iterator(){return this.iterator;},reset(){},
        update(){painted.push([this.id,this.Iterator.CurrentMeasureIndex,this.Iterator.currentTimeStamp.RealValue,this.Iterator.repeatStack.slice(),this.Iterator instanceof Iterator]);}});
    const renderer={Sheet:{id:'first'},cursor:cursor(new Iterator()),GraphicSheet:{MeasureList:[]},
        EngravingRules:{SheetMaximumWidth:32767,NewSystemAtXMLNewSystemAttribute:true,NewSystemAtXMLNewPageAttribute:true,NewPageAtXMLNewPageAttribute:false},
        FollowCursor:true,IsReadyToRender:()=>true,setOptions(){},render(){}};
    const api=vm.runInContext('PianoTrainerOsmdAdapter',realm);
    const adapter=api.create({getRenderer:()=>renderer,describeNote:note=>({pitch:note.halfTone}),describeGraphicalNote:note=>({pitch:note.sourceNote?.halfTone}),
        debugLog:(...args)=>logs.push(args),reportError:(...args)=>logs.push(args)});
    return {adapter,renderer,Iterator,cursor,painted,logs};
}

test('painted snapshot preserves prototype and repeat arrays while prefetched traversal retains its own identity',()=>{
    const h=adapterHarness(),live=h.renderer.cursor.Iterator;
    h.adapter.afterRender(false);h.renderer.cursor.update();
    live.moveToNext();const next=h.cursor(live);h.renderer.cursor=next;
    h.adapter.afterRender(true);
    assert.deepEqual(h.painted,[[1,0,0,[1,2],true],[2,0,0,[1,2],true]]);
    assert.equal(next.Iterator,live);assert.deepEqual(live.repeatStack,[1,2,3]);
    assert.deepEqual(plain(h.adapter.readPositions()),{scoreRevision:1,traversal:{measureIndex:1,timestampWhole:1},painted:{measureIndex:0,timestampWhole:0}});
});

test('temporary cursor restoration uses finally on update errors, and new sheet never paints an old snapshot',()=>{
    const h=adapterHarness();h.adapter.afterRender(false);h.renderer.cursor.update();
    const live=new h.Iterator(7,9);
    h.renderer.cursor=h.cursor(live);h.renderer.cursor.update=()=>{throw Error('paint failed');};
    assert.throws(()=>h.adapter.afterRender(true),/paint failed/);assert.equal(h.renderer.cursor.Iterator,live);
    h.renderer.Sheet={id:'next'};h.renderer.cursor=h.cursor(live);
    h.adapter.afterRender(true);assert.equal(h.painted.length,1);
    assert.equal(h.adapter.readPositions().painted,null);
    h.renderer.cursor.update();assert.deepEqual(h.painted.at(-1),[3,7,9,[1,2],true]);
});

test('NoteRef maps exact object identity, keeps same-pitch voices separate, survives relayout and invalidates on sheet/dispose',()=>{
    const h=adapterHarness(),first={halfTone:48},second={halfTone:48};
    const a=h.adapter.noteRef(first),b=h.adapter.noteRef(second);
    assert.notDeepEqual(plain(a),plain(b));assert.equal(h.adapter.noteRef(first),a);assert.ok(Object.isFrozen(a));
    h.adapter.afterRender(false);assert.equal(h.adapter.resolveNote(a),first);
    h.renderer.Sheet={id:'another'};assert.equal(h.adapter.resolveNote(a),null);
    const newRef=h.adapter.noteRef(first);assert.notEqual(newRef.scoreRevision,a.scoreRevision);
    assert.equal(h.adapter.resolveNote(newRef),first);
    h.adapter.dispose();assert.equal(h.adapter.resolveNote(newRef),null);
});

test('repeated afterRender owns one update hook; replacement cursor detaches its predecessor and dispose preserves external owners',()=>{
    const h=adapterHarness(),first=h.renderer.cursor,original=first.update;
    h.adapter.afterRender(false);const wrapper=first.update;h.adapter.afterRender(false);
    assert.equal(first.update,wrapper);first.update();assert.equal(h.painted.length,1);
    h.renderer.cursor=h.cursor(first.Iterator);h.adapter.afterRender(false);
    assert.equal(first.update,original);h.adapter.dispose();
    h.adapter.afterRender(false);const external=()=>{};h.renderer.cursor.update=external;h.adapter.dispose();
    assert.equal(h.renderer.cursor.update,external);
});

test('system index groups actual identities, includes both staves and graphic borders, invalidates only with layout/sheet changes',()=>{
    const h=adapterHarness();
    const shape=(x,y,top,bottom)=>({AbsolutePosition:{x,y},Size:{width:90,height:bottom-top},BorderTop:top,BorderBottom:bottom,BorderLeft:0,BorderRight:90});
    const first={PositionAndShape:shape(5,20,-9,14),StaffLines:[{PositionAndShape:shape(5,20,-10,6)},{PositionAndShape:shape(5,30,-1,8)}]};
    const second={PositionAndShape:shape(5,20,-9,14),StaffLines:[{PositionAndShape:shape(5,20,0,4)}]};
    const measure=sys=>({ParentStaffLine:{ParentMusicSystem:sys}});
    h.renderer.GraphicSheet={MeasureList:[[measure(first),measure(first)],[measure(first)],[measure(second)]],MusicPages:[{MusicSystems:[first],PositionAndShape:shape(0,0,0,0)},{MusicSystems:[second],PositionAndShape:shape(0,10,0,0)}]};
    const bounds=h.adapter.getSystemBounds();assert.equal(bounds.length,2);
    assert.equal(bounds[0].top,100);assert.equal(bounds[0].bottom,380);assert.equal(bounds[0].lastMeasureIndex,1);
    assert.equal(bounds[1].systemId,1);assert.equal(bounds[1].pageIndex,1);assert.equal(bounds[1].top,10);
    bounds[0].top=-100;assert.equal(h.adapter.getSystemForMeasure(0).top,100);
    const revision=bounds[0].layoutRevision;h.adapter.updateCursor();assert.equal(h.adapter.getSystemBounds()[0].layoutRevision,revision);
    h.adapter.render();assert.ok(h.adapter.getSystemBounds()[0].layoutRevision>revision);
    h.renderer.Sheet={id:'new'};assert.ok(h.adapter.getSystemBounds()[0].layoutRevision>revision+1);
});

test('painted trace index stays on the displayed event through prefetch and reflow',()=>{
    const h=adapterHarness();h.adapter.afterRender(false);h.adapter.updateCursor();h.adapter.advance();
    assert.equal(h.adapter.readPaintedPosition().traceStepIndex,0);assert.equal(h.adapter.getTraceStepIndex(),1);
    h.adapter.afterRender(true);assert.equal(h.adapter.readPaintedPosition().traceStepIndex,0);
    h.adapter.updateCursor();assert.equal(h.adapter.readPaintedPosition().traceStepIndex,1);
});

test('graphical lookup keeps exact source object over same pitch/time candidates, missing staff rows and diagnostic order',()=>{
    const h=adapterHarness(),first={halfTone:48},target={halfTone:48};
    const wrong={sourceNote:first},right={sourceNote:target};
    h.renderer.GraphicSheet.MeasureList=[[{staffEntries:[{graphicalVoiceEntries:[{notes:[wrong,right]}]}]}]];
    assert.equal(h.adapter.getGraphicalNote(target,0,0),right);
    assert.equal(h.logs[0][0],'GRAPHICAL_NOTE_MATCH');
    assert.equal(h.logs[0][1].nearby.length,2);
    assert.equal(h.adapter.getGraphicalNote({halfTone:49},0,0),null);
    assert.equal(h.logs.at(-1)[0],'GRAPHICAL_NOTE_MISS');
    assert.equal(h.adapter.getGraphicalNote(target,99,0),null);
    assert.equal(h.logs.at(-1)[0],'Error finding graphical note:');
});

test('renderer preserves render → invalidate → display → feedback → loop → debug and never invokes them when unready',()=>{
    const realm=vm.createContext({});runScript(realm,'js/generated/render/score-renderer.js');
    const api=vm.runInContext('PianoTrainerScoreRenderer',realm),events=[];let ready=false;
    const renderer=api.create({score:{isReady:()=>ready,render:()=>events.push('render')},invalidateGeometry:()=>events.push('invalidate'),afterRender:()=>events.push('display'),
        renderFeedback:()=>events.push('feedback'),renderLoop:()=>events.push('loop'),renderDebug:()=>events.push('debug')});
    renderer.renderScoreAndRefreshGeometry();assert.deepEqual(events,[]);
    ready=true;renderer.renderScoreAndRefreshGeometry();assert.deepEqual(events,['render','invalidate','display','feedback','loop','debug']);
});

test('viewport retargets one frame sequence, honors reduced motion and cancels owned listeners/frames on disposal',()=>{
    const realm=vm.createContext({});runScript(realm,'js/generated/render/score-viewport.js');
    class Element {
        constructor(){this.style={};this.listeners=new Map();this.classList={toggle(){},add(){},remove(){}};}
        addEventListener(name,fn){if(!this.listeners.has(name))this.listeners.set(name,new Set());this.listeners.get(name).add(fn);}
        removeEventListener(name,fn){this.listeners.get(name)?.delete(fn);}
    }
    realm.HTMLSelectElement=Element;
    const area=new Element(),wrapper=new Element(),layout=new Element(),autoScroll=new Element();
    Object.assign(area,{scrollLeft:0,scrollTop:0,clientWidth:1000,clientLeft:0,scrollWidth:5000,getBoundingClientRect:()=>({left:0,top:0,height:500})});
    autoScroll.checked=true;
    let contentX=1200,reducedMotion=false,id=0;const frames=new Map();
    const cursor=new Element();cursor.getBoundingClientRect=()=>({left:contentX-area.scrollLeft-5,width:10});
    const api=vm.runInContext('PianoTrainerScoreViewport',realm);
    const viewport=api.create({elements:{area,wrapper,layout,autoScroll},score:{getDefaults:()=>({maximumWidth:32767,options:{}}),setLayout(){},isReady:()=>false,afterRender(){},getCursorElement:()=>cursor},
        state:{expectedNotes:[],realtimeWrongPressInCurrentContext:false},storage:{getItem:()=>null,setItem(){}},storageKey:'pt_scoreLayout',getSvg:()=>null,getAnchor(){},clearFeedbackPreserveScoring(){},renderScoreAndRefreshGeometry(){},
        requestFrame:fn=>{frames.set(++id,fn);return id;},cancelFrame:id=>frames.delete(id),prefersReducedMotion:()=>reducedMotion});
    viewport.init();viewport.init();assert.equal(layout.listeners.get('change').size,1);
    viewport.setMode('horizontal',{save:false});viewport.follow();viewport.follow();assert.equal(frames.size,1);
    const advance=time=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(time));};
    advance(16);assert.ok(area.scrollLeft>0&&area.scrollLeft<870);
    contentX=600;advance(32);for(let i=0;i<90;i++)advance(48+i*16);assert.ok(Math.abs(area.scrollLeft-270)<1);
    reducedMotion=true;contentX=2000;viewport.follow();assert.equal(area.scrollLeft,1670);assert.equal(frames.size,0);
    autoScroll.checked=false;contentX=3000;viewport.follow();assert.equal(area.scrollLeft,1670);
    autoScroll.checked=true;reducedMotion=false;viewport.follow();assert.equal(frames.size,1);
    viewport.dispose();assert.equal(frames.size,0);assert.equal(layout.listeners.get('change').size,0);
    viewport.init();assert.equal(layout.listeners.get('change').size,1);
});
