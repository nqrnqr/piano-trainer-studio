(async()=>{
 const results=parent.document.getElementById('results'),el=id=>document.getElementById(id),fixture=window.ProductionLifecycleFixture,midi=window.MidiFixture;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const until=async(predicate,label)=>{for(let i=0;i<150;i++){if(predicate())return;await wait(30);}throw Error('Timeout: '+label);};
 const key=note=>document.querySelector(`.key[data-midi="${note}"]`);
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 results.textContent='Preparing actual production navigation\n';
 try{
  await until(()=>typeof midi.first.onmidimessage==='function','MIDI init');
  const xml=await(await fetch('/docs/testing/fixtures/simple-repeat.musicxml')).text(),data=new DataTransfer();data.items.add(new File([xml],'navigation.musicxml'));el('file-input').files=data.files;el('file-input').dispatchEvent(new Event('change',{bubbles:true}));
  await until(()=>document.querySelector('#osmd-container svg')&&el('file-input').value==='','score import');
  for(const id of ['check-metronome','check-looper','check-autoscroll'])el(id).checked=false;
  el('btn-play').click();await until(()=>document.querySelector('.key.expected-l,.key.expected-r'),'count-in');
  const wrong=down=>midi.first.onmidimessage({data:new Uint8Array([down?0x90:0x80,61,down?100:0])});wrong(true);wrong(false);
  let baseline={svg:document.querySelector('#osmd-container svg'),key:key(64),score:el('live-score').textContent,listeners:fixture.snapshot().listeners,requests:midi.requests};
  let cycle=0;
  window.ProductionNavigationCheck={async verify(){
   try{
    cycle++;
    const top=parent.__PT_NAVIGATION_EVENTS__.filter(event=>event.type==='pageshow').at(-1),own=fixture.events.filter(event=>event.type==='pageshow').at(-1);
    check(top?.persisted&&top.trusted&&own?.persisted&&own.trusted,`navigation ${cycle}: actual trusted parent/production pageshow hit bfcache`);
    await until(()=>typeof midi.first.onmidimessage==='function','MIDI reconnect');
    check(document.querySelector('#osmd-container svg')===baseline.svg&&key(64)===baseline.key&&el('live-score').textContent===baseline.score,`navigation ${cycle}: existing DOM and non-default score survived`);
    check(el('btn-play').textContent.includes('Play')&&midi.requests===baseline.requests+1&&fixture.snapshot().listeners===baseline.listeners,`navigation ${cycle}: paused, one reconnect, no duplicate handlers`);
    baseline.key.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));await until(()=>baseline.key.classList.contains('active'),'key down');baseline.key.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));check(!baseline.key.classList.contains('active'),`navigation ${cycle}: virtual key down/up works`);
    midi.first.onmidimessage({data:new Uint8Array([0x90,70,100])});check(key(70).classList.contains('active'),`navigation ${cycle}: MIDI input works`);midi.first.onmidimessage({data:new Uint8Array([0x80,70,0])});
    el('btn-play').click();await until(()=>el('btn-play').textContent.includes('Pause'),'Play');el('btn-reset').click();check(el('btn-play').textContent.includes('Play')&&el('live-score').textContent.includes('100'),`navigation ${cycle}: Play/Reset works`);
    const layout=el('select-score-layout');layout.value=cycle%2?'horizontal':'traditional';layout.dispatchEvent(new Event('change',{bubbles:true}));check(localStorage.getItem('pt_scoreLayout')===layout.value,`navigation ${cycle}: layout control works`);
    baseline={svg:document.querySelector('#osmd-container svg'),key:key(64),score:el('live-score').textContent,listeners:fixture.snapshot().listeners,requests:midi.requests};
    results.textContent+='NAVIGATION '+JSON.stringify({cycle,parent:top,production:own,resources:fixture.snapshot()})+'\nNAVIGATION VERIFIED\n';
   }catch(error){results.textContent+='ERROR '+error.stack+'\n';}
  },async cleanup(){window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false}));const databases=await window.__PT_LIBRARY_FIXTURE__.cleanup();return {databases,resources:fixture.snapshot()};}};
  parent.document.getElementById('check-navigation').disabled=false;
  results.textContent+='NAVIGATION READY\n';
 }catch(error){results.textContent+='ERROR '+error.stack+'\n';window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false}));await window.__PT_LIBRARY_FIXTURE__.cleanup();}
})();
