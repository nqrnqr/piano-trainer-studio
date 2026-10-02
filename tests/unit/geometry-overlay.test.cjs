const test=require('node:test');
const assert=require('node:assert/strict');
const {geometryHarness,boxNode,root}=require('../helpers/geometry-harness.cjs');
const plain=value=>JSON.parse(JSON.stringify(value));
const pointNear=(actual,expected)=>{assert.ok(Math.abs(actual.x-expected.x)<1e-9);assert.ok(Math.abs(actual.y-expected.y)<1e-9);};
test('SVG selection rejects right, vertical and diagonal dots without preferring annotation or oversized ornament glyphs',()=>{
    const h=geometryHarness(),note=boxNode(95,96.5,10,7);
    const nodes=[boxNode(106,98,4,4),boxNode(98,104,4,4),boxNode(104,103,4,4),boxNode(80,80,40,20),boxNode(95,96.5,10,7,'text'),note];
    const anchor=h.geometry.getSvgNoteheadAnchor({getSVGGElement:()=>root(nodes)},{x:100,y:100});
    assert.deepEqual(plain(anchor),{x:100,y:100});
    assert.equal(h.logs.filter(([name])=>name==='SVG_NOTEHEAD_REJECT_DOTLIKE').length,3);
});
test('same-stem shifted notehead cluster keeps Y precedence before broader X-neighborhood choice',()=>{
    const h=geometryHarness();
    const upper=boxNode(95,98.5,10,7),lower=boxNode(103,103.5,10,7);
    const anchor=h.geometry.getSvgNoteheadAnchor({getSVGGElement:()=>root([upper,lower],{x:85,y:85,width:30,height:30})},{x:100,y:107});
    assert.deepEqual(plain(anchor),{x:108,y:107});
    assert.ok(h.logs.some(([name])=>name==='SVG_NOTEHEAD_CHORD_CLUSTER_TIEBREAK'));
});
test('fallback search ignores fingering/technical/lyrics, stops cycles and retains original direct-notehead precedence',()=>{
    const h=geometryHarness(),shape={AbsolutePosition:{x:5,y:6},Size:{width:1,height:0.7}};
    const graph={PositionAndShape:{AbsolutePosition:{x:5,y:6},Size:{width:4,height:5}},
        fingering:{PositionAndShape:{AbsolutePosition:{x:5,y:6},Size:{width:1,height:0.7}}},glyph:{PositionAndShape:shape}};
    graph.cycle=graph;
    assert.equal(h.geometry.getNoteheadShape(graph),shape);
    const direct={AbsolutePosition:{x:9,y:9},Size:{width:1,height:0.7}};
    graph.Notehead={PositionAndShape:direct};assert.equal(h.geometry.getNoteheadShape(graph),direct);
});
test('note/measure cache preserves identities until render invalidation, then recomputes fresh anchors and boxes',()=>{
    const h=geometryHarness(),note={halfTone:48};
    let center=100;
    h.graphicalNotes.set(note,{Notehead:{PositionAndShape:{AbsolutePosition:{x:9.5,y:9.65},Size:{width:1,height:0.7}}},
        getSVGGElement:()=>root([boxNode(center-5,96.5,10,7)])});
    const first=h.geometry.getNoteAnchor(note,0,0),box=h.geometry.getMeasureBox(0);
    center=110;h.moveBoxes();assert.equal(h.geometry.getNoteAnchor(note,0,0),first);assert.equal(h.geometry.getMeasureBox(0),box);
    h.geometry.invalidate();assert.deepEqual(h.cleared,['all']);
    assert.equal(h.geometry.getNoteAnchor(note,0,0).x,110);assert.equal(h.geometry.getMeasureBox(0).x,10);
});
test('SVG conversion and wrong-note fallback preserve viewBox scale, staff/pitch rules and explicit anchors',()=>{
    const h=geometryHarness();
    pointNear(h.geometry.clientPointToSvg(155,75),{x:120,y:70});
    assert.ok(Math.abs(h.geometry.getCursorSvgX()-120)<1e-9);
    pointNear(h.geometry.resolveFeedbackAnchor(60,null),{x:120,y:150});
    pointNear(h.geometry.resolveFeedbackAnchor(48,null),{x:120,y:225});
    pointNear(h.geometry.resolveFeedbackAnchor(60,null,null,77),{x:120,y:77});
    assert.deepEqual(plain(h.geometry.resolveFeedbackAnchor(60,null,null,{x:12,y:13})),{x:12,y:13});
    h.svg.getBoundingClientRect=()=>({left:0,top:0,width:0,height:10});
    assert.equal(h.geometry.clientPointToSvg(5,5),null);
});
test('feedback overlay keeps correct/released/held ordering and context filtering without changing stored state',()=>{
    const h=geometryHarness(),marker=(x,contextKey,isCorrect=false)=>({anchor:{x,y:1},contextKey,isCorrect});
    const state={feedbackEnabled:true,correctFeedbackHistory:[marker(1,'old',true)],
        releasedIncorrectFeedback:[marker(2,'current'),marker(3,'old')],
        activeHeldIncorrectFeedback:new Map([[60,marker(4,'current')],[61,marker(5,'old')]])};
    const overlay=h.api.feedback.create({state,document:h.document,getSvg:()=>h.svg,ensureGroup:h.group,getCurrentContextKey:()=> 'current'});
    overlay.render();assert.deepEqual(h.drawn.map(node=>node.attrs.cx),['1','3','4']);
    assert.equal(h.drawn[0].attrs.fill,'rgba(46, 204, 113, 0.55)');assert.equal(h.drawn[1].attrs.r,'4.5');
    assert.equal(state.releasedIncorrectFeedback.length,2);assert.equal(state.activeHeldIncorrectFeedback.size,2);
    h.drawn.length=0;state.feedbackEnabled=false;overlay.render();assert.deepEqual(h.drawn,[]);assert.deepEqual(h.cleared,['pt-feedback-group']);
});
test('loop overlay shades outside inclusive range and draws the exact left/right boundary widths',()=>{
    const h=geometryHarness(),bounds={min:2,max:3};let enabled=true;
    const overlay=h.api.loop.create({bounds,document:h.document,getSvg:()=>h.svg,ensureGroup:h.group,enabled:()=>enabled,
        measureCount:()=>4,measureBox:(index,staff)=>h.geometry.getMeasureBox(index,staff)});
    overlay.render();
    assert.deepEqual(h.drawn.map(({attrs})=>[attrs.x,attrs.width,attrs.fill]),[['0','20','rgba(128, 128, 128, 0.35)'],['10','6','#3498db'],['34','6','#3498db'],['30','20','rgba(128, 128, 128, 0.35)']]);
    h.drawn.length=0;enabled=false;overlay.render();assert.deepEqual(h.drawn,[]);assert.deepEqual(h.cleared,['pt-looper-group']);
});
