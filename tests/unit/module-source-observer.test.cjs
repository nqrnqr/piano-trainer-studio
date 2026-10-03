const assert=require('node:assert/strict'),vm=require('node:vm');
const {SourceMap}=require('node:module'),{test}=require('node:test');
const {read}=require('../helpers/legacy-script.cjs');
function observer(payload) {
 const context=vm.createContext({window:{}});
 vm.runInContext(read('docs/testing/module-source-observer.js'),context);
 return context.window.createModuleSourceObserver(payload);
}
test('resource attribution resolves actual test bundle positions against Node SourceMap',()=>{
 const payload=JSON.parse(read('docs/testing/generated/test-app.js.map')),
  generated=read('docs/testing/generated/test-app.js').split('\n'),reference=new SourceMap(payload),actual=observer(payload);
 let compared=0;const uiFrames=[];
 for(let line=0;line<generated.length;line+=3)for(const column of [2,generated[line].length-1]){
  const expected=reference.findEntry(line,column);
  if(!expected.originalSource||expected.generatedLine!==line)continue;
  const mapped=actual.positionAt(line,column);
  assert.ok(mapped,`mapped position ${line}:${column}`);
  assert.equal(mapped.source,expected.originalSource);
  assert.equal(mapped.originalLine,expected.originalLine);
  assert.equal(mapped.originalColumn,expected.originalColumn);compared++;
  if(mapped.source.endsWith('/ui/controls-dom.ts')||mapped.source.endsWith('/ui/toolbar.ts'))
   uiFrames.push({source:mapped.source,frame:`    at method (http://localhost/docs/testing/generated/test-app.js?v=1.2.4:${line+1}:${column+1})`});
 }
 assert.ok(compared>3000,'compare thousands of mapped positions across actual modules');
 const binder=uiFrames.find(x=>x.source.endsWith('/ui/controls-dom.ts')),toolbar=uiFrames.find(x=>x.source.endsWith('/ui/toolbar.ts'));
 assert.ok(binder&&toolbar);
 assert.equal(actual.nearestUi(binder.frame+'\n'+toolbar.frame,['toolbar']),'toolbar');
 assert.equal(actual.nearestUi(toolbar.frame,['display-controls']),undefined,'nearest unrelated UI does not inherit a later caller');
 assert.equal(actual.includesSource(toolbar.frame,'/ui/toolbar.ts'),true);
 assert.equal(actual.includesSource('at unrelated.js:1:1','/ui/toolbar.ts'),false);
});
test('unmapped segments and malformed mappings do not silently attribute native resources',()=>{
 const actual=observer({sources:['../src/ui/toolbar.ts'],mappings:'AAAA,C;AACA'});
 assert.equal(actual.positionAt(0,0).source,'../src/ui/toolbar.ts');
 assert.equal(actual.positionAt(0,1),null);
 assert.equal(actual.positionAt(2,0),null);
 assert.equal(actual.positionAt(1,0).originalLine,1);
 for(const mappings of ['!','g','AA','ACAA'])assert.throws(()=>observer({sources:['one'],mappings}),/Invalid source map/);
});
