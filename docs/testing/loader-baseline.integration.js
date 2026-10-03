(async()=>{
 const results=parent.document.getElementById('results');results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const oldAlert=window.alert,alerts=[];window.alert=message=>alerts.push(String(message));
 const api=window.PianoTrainerTest,s=api.score;const snapshot=s.readSnapshot,pitch=s.readFirstPitch;
 try {
  api.pause();s.disposeCoordinator();
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text();
  const file=new File([xml],'Reader.musicxml');const read=await s.readFile(file);
  check(typeof read.rawData==='string'&&read.rawData===xml&&read.fileType==='musicxml','native FileReader preserves MusicXML text');
  await s.selectFile(file);
  check(snapshot().fileName==='Reader.musicxml'&&snapshot().title==='Reader','direct XML selection installs original metadata');
  check(snapshot().measure===0&&pitch()===60,'XML load paints the actual first OSMD event');
  check(document.querySelector('#osmd-container svg')!==null,'XML render creates actual SVG');
  check(snapshot().originalText===xml&&snapshot().transpose.available,'XML keeps original transpose source');
  const selected=new DataTransfer();selected.items.add(new File([xml],'Event.musicxml'));
  const input=document.getElementById('file-input');input.files=selected.files;input.dispatchEvent(new Event('change'));
  const deadline=performance.now()+5000;
  while((snapshot().fileName!=='Event.musicxml'||input.value!=='')&&performance.now()<deadline)await new Promise(resolve=>setTimeout(resolve,20));
  check(snapshot().fileName==='Event.musicxml'&&input.value==='','native file input change loads and clears its selected value');
  const mxlBytes=await(await fetch('/docs/testing/fixtures/loader-packed.mxl')).arrayBuffer();
  const mxlFile=new File([mxlBytes],'Packed.mxl');const mxlRead=await s.readFile(mxlFile);
  check(mxlRead.rawData instanceof ArrayBuffer&&mxlRead.fileType==='mxl','native FileReader keeps MXL binary');
  const beforeConverter=!!window.WebMscore;
  await s.selectFile(mxlFile);
  check(snapshot().dataKind==='arraybuffer'&&snapshot().dataByteLength===mxlBytes.byteLength,'MXL render keeps original compressed bytes');
  check(typeof snapshot().originalText==='string'&&snapshot().originalText===xml,'deflated MXL extracts container-selected XML only for transpose');
  check(!!window.WebMscore===beforeConverter,'valid MXL extraction does not initialize the converter');
  check(snapshot().measure===0&&pitch()===60,'original MXL renders the same first event');
  const source=snapshot().originalText;
  const mode=document.getElementById('transpose-mode');mode.value='semitone';mode.dispatchEvent(new Event('change'));
  const delta=document.getElementById('transpose-semitones');delta.value='2';delta.dispatchEvent(new Event('input'));
  s.updateTempo(75);
  await s.applyTranspose();
  check(pitch()===62&&snapshot().transpose.active,'actual transpose controller reloads a two-semitone score');
  check(snapshot().originalText===source&&snapshot().originalFileName==='Packed.mxl','transpose preserves its original MXL source metadata');
  check(snapshot().speed===.75,'transpose reload preserves existing speed');
  await s.resetTranspose();
  check(pitch()===60&&!snapshot().transpose.active,'transpose reset restores the original pitches');
  check(snapshot().originalText===source&&snapshot().speed===.75,'transpose reset preserves original source and speed');
  s.capture();
  let failure;try {await api.loadScore('<not-a-score/>',{fileName:'invalid.xml'});}catch(error){failure=error;}
  check(!!failure&&alerts.length===1,'invalid XML alerts once and rejects the load promise');
  check(snapshot().dataSameAsCapture&&!snapshot().playing,'failed import preserves old metadata after stopping playback');
  const midiBytes=await(await fetch('/docs/testing/fixtures/loader-convert.mid')).arrayBuffer();
  const workerBaseline=window.__PT_CONVERTER_WORKERS__.snapshot();
  results.textContent+='WORKERS BEFORE MIDI '+JSON.stringify(workerBaseline)+'\n';
  await s.selectFile(new File([midiBytes],'Convert.mid'));
  check(snapshot().dataKind==='string'&&snapshot().fileType==='musicxml','actual MIDI converter dispatch loads exported MusicXML');
  check(snapshot().fileName==='Convert.musicxml'&&snapshot().title==='Convert','converter metadata retains original base title');
  check(snapshot().hasCursor&&document.querySelector('#osmd-container svg')&&snapshot().transpose.available,'converted score renders and enables transpose');
  const resources=performance.getEntriesByType('resource').filter(entry=>/webmscore|libmscore/.test(entry.name));
  // Worker resource timing is separate from this frame's performance list.
  const wasm=await fetch('assets/vendor/webmscore/webmscore.lib.wasm',{method:'HEAD'});
  check(wasm.ok&&wasm.url.endsWith('/assets/vendor/webmscore/webmscore.lib.wasm'),'local WASM relative path responds after actual successful conversion');
  results.textContent+='RESOURCES '+JSON.stringify({wasm:{url:wasm.url,status:wasm.status},frame:resources.map(entry=>({name:entry.name,duration:entry.duration}))})+'\n';
  const workers=window.__PT_CONVERTER_WORKERS__;
  results.textContent+='WORKERS BEFORE DISPOSE '+JSON.stringify(workers.snapshot())+'\n';
  check(workers.snapshot().created===workerBaseline.created+1&&workers.snapshot().live===workerBaseline.live+1,'ordinary conversion preserves the original soft destroy worker lifetime');
  s.disposeConverter();s.disposeConverter();
  check(workers.snapshot().live===workerBaseline.live&&workers.snapshot().terminated===workerBaseline.terminated+1,'explicit converter disposal terminates the owned worker once and preserves existing workers');
  await s.selectFile(new File([midiBytes],'Reload.mid'));
  check(workers.snapshot().created===workerBaseline.created+2&&snapshot().fileName==='Reload.musicxml','converter can start a fresh worker after explicit disposal');
  s.disposeConverter();
  check(workers.snapshot().live===workerBaseline.live&&workers.snapshot().terminated===workerBaseline.terminated+2,'reinitialized converter releases its fresh worker');
  results.textContent+='WORKERS '+JSON.stringify(workers.snapshot())+'\n';
  s.initFileControls();s.initFileControls();s.disposeFileControls();s.disposeFileControls();s.initFileControls();
  check(document.getElementById('file-input') instanceof HTMLInputElement,'file controls dispose and reinitialize their actual input');
  check(api.practice.readLed().enabled===(new URLSearchParams(parent.location.search).get('led')!=='off'),'loader completes with default/no-op LED composition');

 }catch(error){results.textContent+='ERROR '+error.stack+'\n';}
 finally {window.alert=oldAlert;api.pause();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();if(!results.textContent.includes('ERROR'))results.textContent+='DONE\n';parent.document.getElementById('run').disabled=false;}
})();
