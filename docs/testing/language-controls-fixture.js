(() => {
 const dialogs=[],answers=[];let approve=false;
 window.alert=message=>dialogs.push({kind:'alert',message:String(message)});
 window.confirm=message=>{dialogs.push({kind:'confirm',message:String(message)});const result=approve;approve=false;return result;};
 window.prompt=(message,value)=>{dialogs.push({kind:'prompt',message:String(message),value});return answers.shift()??null;};
 const nativeObserver=window.MutationObserver,observers=new Map();let callbacks=0;
 window.MutationObserver=class extends nativeObserver {
  constructor(callback){super((records,observer)=>{callbacks++;callback(records,observer);});}
  observe(target,options){super.observe(target,options);const targets=observers.get(this)||new Set();targets.add(target);observers.set(this,targets);}
  disconnect(){super.disconnect();observers.delete(this);}
 };
 window.LanguageFixture={dialogs,answers,approveNextConfirmation:()=>{approve=true;},observations:()=>({observers:observers.size,callbacks,
  targets:[...observers.values()].flatMap(targets=>[...targets].map(target=>target.id||target.className||target.tagName))})};
 // A device name matching an application label must remain verbatim, including in storage.
 MidiFixture.first.name='Reset';MidiFixture.output.name='Close';
})();
