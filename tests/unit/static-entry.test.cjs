const assert=require('node:assert/strict');
const path=require('node:path'),fs=require('node:fs');
const {SourceMap}=require('node:module');
const {test}=require('node:test');
const {root,read}=require('../helpers/legacy-script.cjs');

test('static entry loads one private production bundle after the optional hardware factories',()=>{
 const html=read('index.html'),scripts=[...html.matchAll(/src="(js\/[^"?]+)\?v=/g)].map(m=>m[1]);
 assert.deepEqual(scripts,['js/led.js','js/optional/midi-led-test.js','js/generated/app.js']);
 assert.deepEqual(fs.readdirSync(path.join(root,'js/generated')).sort(),['app.js','app.js.map']);
 const app=read('js/generated/app.js');
 for(const method of ['getRemainingMeasureWaitWhole','getTraversalBeatsToWait','playbackLoop','checkWaitModeAdvance','startPlaybackFromToolbar',
  'loadScoreIntoApp','extractMusicXmlFromMxl','readScoreFile','handleDirectScoreFileSelection','applyZoom','updateTempo','syncLooper','requestAppFullscreen','showToolbarPanel']){
  assert.equal([...app.matchAll(new RegExp(`function ${method}\\(`,'g'))].length,1,`${method} has one runtime implementation`);
 }
 for(const property of ['AppState','osmd','PTTiming','ScoreLibrary','ToolbarUI','IntroUI','ScoresUI','FeedbackDebug','MidiImport',
  'TransposeEngine','TransposeUI','syncTrainerRoutingUiState','loadScoreIntoApp','openScoreFilePicker']){
  assert.equal(new RegExp(`window\\.${property}\\s*=`).test(app),false,`${property} is private to the module graph`);
 }
 assert.equal(app.includes('PianoTrainerTest'),false,'production bundle contains no test facade');
 assert.equal(html.includes('test-app.js'),false,'production HTML does not load a test entry');
 assert.equal(app.includes('stopHealthChecks'),false,'optional cleanup uses its actual singular controller method');
 assert.notEqual(JSON.parse(read('package.json')).type,'module','native Node launchers keep CommonJS');
 assert.equal(JSON.parse(read('tsconfig.json')).compilerOptions.module,'ESNext');
 assert.equal(fs.existsSync(path.join(root,'tsconfig.legacy.json')),false);
 assert.equal(fs.existsSync(path.join(root,'src/compatibility')),false);
 for(const file of ['js/trainer-core.js','js/trainer-timing.js','js/feedback-engine.js','js/midi-import.js','js/score-library.js',
  'js/scores-ui.js','js/toolbar-ui.js','js/feedback-debug.js','types/legacy-state.d.ts','types/legacy-render.d.ts','types/legacy-timing.d.ts',
  'types/legacy-toolbar-ui.d.ts','types/legacy-score-data.d.ts','types/legacy-connection.d.ts','types/legacy-led.d.ts']){
  assert.equal(fs.existsSync(path.join(root,file)),false,`${file} was superseded by explicit modules`);
 }
});

test('the production source map embeds its modules and maps the preserved timing expressions',()=>{
 const generated=read('js/generated/app.js'),payload=JSON.parse(read('js/generated/app.js.map')),source=read('src/domain/timing.ts');
 assert.equal(generated.match(/sourceMappingURL=(\S+)/)[1],'app.js.map');
 const index=payload.sources.findIndex(file=>path.resolve(root,'js/generated',file)===path.join(root,'src/domain/timing.ts'));
 assert.ok(index>=0,'timing source is in the actual served bundle');
 assert.equal(payload.sourcesContent[index],source);
 for(const entry of payload.sources){assert.equal(entry.includes('/compatibility/'),false);assert.equal(entry.includes('/testing/'),false);}
 const map=new SourceMap(payload);
 for(const [js,ts]of [
  ['const remainingWhole = measureEnd - currentTimestamp;','const remainingWhole = measureEnd - currentTimestamp!;'],
  ['if (nextTimestamp < currentTimestamp)','if (nextTimestamp! < currentTimestamp!)'],
  ['return (nextTimestamp - currentTimestamp) * 4;','return (nextTimestamp! - currentTimestamp!) * 4;']]){
  const lines=generated.split('\n'),generatedLine=lines.findIndex(line=>line.includes(js)),originalLine=source.split('\n').findIndex(line=>line.includes(ts));
  assert.ok(generatedLine>=0&&originalLine>=0,'the original expression remains');
  const mapped=map.findEntry(generatedLine,lines[generatedLine].indexOf(js));
  assert.equal(mapped.originalLine,originalLine);assert.equal(mapped.originalSource,payload.sources[index]);
 }
});
