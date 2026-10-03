// Original converter slot; browser resources are lazy and explicitly owned.
const webmscoreAdapter=PianoTrainerWebmscoreAdapter.create({document,getVendor:()=>window.WebMscore});
const conversionFileReader=PianoTrainerScoreFileReader.create({createReader:()=>new FileReader(),
    format:{getScoreFileTypeFromName:name=>getScoreFileTypeFromName(name),getScoreDisplayTitle:name=>getScoreDisplayTitle(name)}});
const scoreConversion=PianoTrainerScoreConversion.create({ensureWebMscoreLoaded:()=>webmscoreAdapter.ensureWebMscoreLoaded(),
    readArrayBuffer:file=>conversionFileReader.readArrayBuffer(file),getLoader:()=>window.loadScoreIntoApp,reportError:(message,error)=>console.error(message,error)});
window.MidiImport={...scoreConversion,dispose:()=>{scoreConversion.dispose();conversionFileReader.dispose();webmscoreAdapter.dispose();}};
