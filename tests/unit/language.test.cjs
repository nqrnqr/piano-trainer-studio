const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {normalizeLanguage,translateMessage}=require('../../.cache/test-modules/i18n/messages.js');
const {PREFERENCE_STORAGE_KEYS,RESETTABLE_PREFERENCE_KEYS}=require('../../.cache/test-modules/state/preference-keys.js');
const {createLanguageController}=require('../../.cache/test-modules/i18n/language-controller.js');

test('missing/invalid preferences default to Simplified Chinese; saved English is preserved',()=>{
 for(const value of [null,undefined,'zh','ZH-CN','fr','',{},12])assert.equal(normalizeLanguage(value),'zh-CN');
 assert.equal(normalizeLanguage('zh-CN'),'zh-CN');assert.equal(normalizeLanguage('en'),'en');
});
test('English copy is lossless; unknown third-party messages remain readable',()=>{
 const source='  Update check failed: NetworkError\n';
 assert.equal(translateMessage(source,'en'),source);
 assert.equal(translateMessage('Custom device error <not markup>','zh-CN'),'Custom device error <not markup>');
 assert.equal(translateMessage('toString','zh-CN'),'toString');
});
test('translated messages preserve whitespace, numbers and user-supplied names as plain text',()=>{
 assert.equal(translateMessage(' ▶ Play ','zh-CN'),' ▶ 播放 ');
 assert.equal(translateMessage('Send playback and input to Play & <MIDI>.','zh-CN'),'将播放与输入发送到 Play & <MIDI>。');
 assert.equal(translateMessage('Actions for folder New Folder','zh-CN'),'文件夹操作：New Folder');
 assert.equal(translateMessage('Actions for folder New  Folder','zh-CN'),'文件夹操作：New  Folder');
 assert.equal(translateMessage('Delete score "Reset"?','zh-CN'),'删除曲谱“Reset”？');
 assert.equal(translateMessage('Delete score "$& $\' $$"?','zh-CN'),'删除曲谱“$& $\' $$”？');
 assert.equal(translateMessage('Delete folder "Close"? This will also delete 2 scores inside it.','zh-CN'),'删除文件夹“Close”？其中 2 首曲谱也将被删除。');
 assert.equal(translateMessage('Move 1 selected score to which folder?','zh-CN'),'将所选 1 首曲谱移动到哪个文件夹？');
 assert.equal(translateMessage('Selected Key: MIDI 60 | LED Offset: +2','zh-CN'),'所选琴键：MIDI 60 | LED 偏移：+2');
 assert.equal(translateMessage('Testing MIDI LED note 60 (2/88).','zh-CN'),'正在测试 MIDI LED 音符 60 (2/88)。');
});
test('native confirmations and permission help have Chinese copy, preserving technical terms',()=>{
 for(const text of ['Reset ALL saved Settings and Trainer preferences? This will erase all saved settings and restore defaults.',
  'Reset all LED calibration adjustments?', 'MIDI access appears blocked or unavailable. Allow MIDI/device access in your browser, then refresh. MIDI only works on the device running this browser.',
  'DDP is experimental.\n\nIt may require a local sender or standalone build and may not work directly in browser mode.\n\nSwitch to DDP anyway?']){
  assert.match(translateMessage(text,'zh-CN'),/[\u4e00-\u9fff]/);
 }
});
test('language participates in settings backup/import and reset whitelist',()=>{
 assert.equal(PREFERENCE_STORAGE_KEYS.LANGUAGE_STORAGE_KEY,'pt_language');
 assert.ok(RESETTABLE_PREFERENCE_KEYS.includes('pt_language'));
});
test('storage access failure still allows live language switching and teardown',()=>{
 const select=new EventTarget();select.value='en';
 const doc={documentElement:{lang:'en'},body:{},querySelector:()=>select,querySelectorAll:()=>[]};
 let observers=0,disconnections=0;
 const controller=createLanguageController({document:doc,
  storage:{getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('quota');}},
  createObserver:()=>{observers++;return {observe(){},disconnect(){disconnections++;},takeRecords:()=>[]};}});
 controller.init();controller.init();assert.equal(observers,1);assert.equal(controller.getLanguage(),'zh-CN');
 assert.equal(doc.documentElement.lang,'zh-CN');assert.equal(select.value,'zh-CN');
 select.value='en';select.dispatchEvent(new Event('change'));
 assert.equal(doc.documentElement.lang,'en');assert.equal(controller.translate('▶ Play'),'▶ Play');
 controller.dispose();controller.dispose();assert.equal(disconnections,1);
 select.value='zh-CN';select.dispatchEvent(new Event('change'));controller.setLanguage('zh-CN');
 assert.equal(doc.documentElement.lang,'en');
});
test('all current static application copy has a translation or an explicit term/brand exemption',()=>{
 const html=fs.readFileSync('index.html','utf8').replace(/<script\b[\s\S]*?<\/script>/g,'');
 const decode=value=>value.replaceAll('&amp;','&').replaceAll('&gt;','>').replaceAll('&lt;','<');
 const terms=new Set(['Piano Trainer Studio','Piano Trainer','Realtime','Wait for Me','Follow Me','MusicXML / MXL.','midiweb.cc','musetrainer.github.io/library','WLED','BPM','English','简体中文']);
 const strings=[...html.matchAll(/>([^<>]+)</g)].map(match=>decode(match[1]).trim()).filter(text=>/[A-Za-z]/.test(text));
 const attributes=[...html.matchAll(/(?:aria-label|title|placeholder|data-tooltip)="([^"]+)"/g)].map(match=>decode(match[1])).filter(text=>/[A-Za-z]/.test(text));
 const missing=[...new Set([...strings,...attributes].filter(text=>!terms.has(text)&&translateMessage(text,'zh-CN')===text))];
 assert.deepEqual(missing,[]);
});
