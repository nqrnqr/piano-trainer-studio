(async()=>{
 const results=parent.document.getElementById('results'),api=window.PianoTrainerTest;results.textContent='';
 const check=(ok,label)=>{results.textContent+=`${ok?'PASS':'FAIL'} ${label}\n`;if(!ok)throw Error(label);};
 const parse=xml=>new DOMParser().parseFromString(xml,'application/xml'),indices=n=>Array.from({length:n},(_,i)=>i);
 const score=(measures)=>`<?xml version="1.0"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list><part id="P1">${measures.map((body,index)=>`<measure number="${index+1}">${index===0?'<attributes><divisions>1</divisions><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>':''}${body}</measure>`).join('')}</part></score-partwise>`;
 const note=(step='C',links='',extra='')=>`<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>whole</type>${extra}${links}</note>`;
 const navigation=(words,sound,mark='')=>`<direction><direction-type>${mark||`<words>${words}</words>`}</direction-type><sound ${sound}/></direction>`;
 try{
  api.practice.muteOutputs();
  const tied=score([note('C','<tie type="start"/><notations><tied type="start"/></notations>'),note('C','<tie type="stop"/><notations><tied type="stop"/></notations>'),note('D')]);
  check(parse(api.horizontal.convert(tied,[0,1,2])).querySelectorAll('tie,tied').length===4,'adjacent cross-measure tie endpoints remain intact');
  check(parse(api.horizontal.convert(tied,[0,2,1])).querySelectorAll('tie,tied').length===0,'an intervening attack removes an invalid tie rather than matching a later same pitch');
  const chord=score([note('C','<tie type="start"/><notations><tied type="start"/></notations>')+'<note><chord/><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>whole</type><tie type="start"/></note>',note('C','<tie type="stop"/>')+'<note><chord/><pitch><step>E</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>whole</type><tie type="stop"/></note>']);
  check(parse(api.horizontal.convert(chord,[0,1])).querySelectorAll('tie').length===4,'all chord pitches retain independent tie endpoints');
  const gap=score([note('C','<tie type="start"/>'),'<forward><duration>1</duration></forward>'+note('C','<tie type="stop"/>')]);
  check(parse(api.horizontal.convert(gap,[0,1])).querySelectorAll('tie').length===0,'forward time gaps break a tie');
  const measures=indices(16).map(i=>{
   const slur=i===0?'<slur type="start" number="1"/>':i===12?'<slur type="stop" number="1"/>':'';
   const tie=i===7?'<tie type="start"/>':i===8?'<tie type="stop"/>':'';
   const direction=i===1?'<direction><direction-type><wedge type="crescendo" number="1"/></direction-type></direction>':i===11?'<direction><direction-type><wedge type="stop" number="1"/></direction-type></direction>':'';
   const pedal=i===2?'<direction><direction-type><pedal type="start" line="yes"/></direction-type></direction>':i===10?'<direction><direction-type><pedal type="stop" line="yes"/></direction-type></direction>':'';
   return direction+pedal+note(i===7||i===8?'C':['C','D','E','F'][i%4],tie+(slur?`<notations>${slur}</notations>`:''));
  });
  const long=score(measures),excerpt=api.horizontal.excerpt(long,indices(16),8,16),doc=parse(excerpt.xml);
  check(excerpt.indices[0]===0&&doc.querySelectorAll('slur').length===2,'second block carries both endpoints of a 13-measure slur');
  check(doc.querySelectorAll('wedge').length===2&&doc.querySelectorAll('pedal').length===2,'cross-block crescendo and pedal retain their starts and stops');
  await api.loadScore(long,{fileName:'cross-chunk-connections.musicxml'});await api.setLayout('horizontal');
  const bounds=api.horizontal.measureBounds();check(bounds.length===16&&api.horizontal.resources().chunks===2,'long connections render as two fixed main chunks');
  const svgs=[...document.querySelectorAll('.pt-horizontal-canvas > svg')];
  check(svgs.every(svg=>svg.querySelectorAll('path').length>0)&&svgs.every(svg=>svg.viewBox.baseVal.width>0),'real OSMD engraves both cropped connection contexts');
  const firstSlur=svgs[0].querySelector('[id*="slur"]');results.textContent+=`NOTATION ${JSON.stringify({chunks:svgs.length,paths:svgs.map(svg=>svg.querySelectorAll('path').length),firstSlur:!!firstSlur,resources:api.horizontal.resources()})}\n`;
  const probes=[
   ['repeat-times-3',score(['<barline location="left"><repeat direction="forward"/></barline>'+note('C'),note('D')+'<barline location="right"><repeat direction="backward" times="3"/></barline>',note('E')]),[0,1,0,1,0,1,2]],
   ['multiple-repeat-sections',score(['<barline location="left"><repeat direction="forward"/></barline>'+note('C'),note('D')+'<barline location="right"><repeat direction="backward"/></barline>','<barline location="left"><repeat direction="forward"/></barline>'+note('E'),note('F')+'<barline location="right"><repeat direction="backward"/></barline>']),[0,1,0,1,2,3,2,3]],
   ['D.C. al Fine',score([note('C'),note('D')+navigation('Fine','fine="yes"'),note('E')+navigation('D.C. al Fine','dacapo="yes"')]),[0,1,2,0,1]],
   ['D.S. al Fine',score([note('C'),navigation('','segno="S"','<segno/>')+note('D'),note('E')+navigation('Fine','fine="yes"'),note('F')+navigation('D.S. al Fine','dalsegno="S"')]),[0,1,2,3,1,2]],
   ['D.C. al Coda',score([note('C'),note('D')+navigation('To Coda','tocoda="C"'),note('E')+navigation('D.C. al Coda','dacapo="yes"'),navigation('','coda="C"','<coda/>')+note('F')]),[0,1,2,0,1,3]],
   ['Fine alone',score([note('C'),note('D')+navigation('Fine','fine="yes"'),note('E')]),[0,1,2]],
   ['nested repeats',score(['<barline location="left"><repeat direction="forward"/></barline>'+note('C'),'<barline location="left"><repeat direction="forward"/></barline>'+note('D'),note('E')+'<barline location="right"><repeat direction="backward"/></barline>',note('F')+'<barline location="right"><repeat direction="backward"/></barline>']),[0,1,2,1,2,3,0,1,2,1,2,3]]
  ];
  for(const [name,xml,expected]of probes){await api.loadScore(xml,{fileName:name+'.musicxml'});const path=api.horizontal.trace().measures.map(m=>m.sourceMeasureIndex),matches=JSON.stringify(path)===JSON.stringify(expected);
   results.textContent+=`NAVIGATION ${JSON.stringify({name,expected,actual:path,matches})}\n`;
   if(name!=='repeat-times-3')check(matches,name+': matches handwritten path');
   const prototype=await api.horizontal.prototype(xml);check(prototype.anchors.every(Boolean)&&prototype.anchors.every((p,i)=>!i||p.x>=prototype.anchors[i-1].x-.01),name+': derived display follows every vendor step to the right');api.horizontal.clear();}
 }catch(error){results.textContent+=`ERROR ${error.stack}\n`;}
 finally{api.horizontal.clear();api.dispose();await window.__PT_LIBRARY_FIXTURE__.cleanup();parent.document.getElementById('run').disabled=false;}
 if(!/(?:^|\n)(?:FAIL|ERROR)/.test(results.textContent))results.textContent+='DONE\n';
})();
