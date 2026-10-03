import type {PianoTrainerDomain} from '../domain/model';
import {PianoTrainerWebmscoreAdapter} from './webmscore-adapter';
// Existing conversion dispatch/export order. Ordinary finally keeps vendor soft destroy.
export namespace PianoTrainerScoreConversion {
    const FORMATS: Readonly<Record<string,string>>=Object.freeze({'.mid':'midi','.midi':'midi','.mscz':'mscz','.mscx':'mscx',
        '.gp':'gp','.gp3':'gp3','.gp4':'gp4','.gp5':'gp5','.gpx':'gpx','.gtp':'gtp','.ptb':'ptb'});
    export interface Ports {
        ensureWebMscoreLoaded(): Promise<PianoTrainerWebmscoreVendor.Engine>; readArrayBuffer(file: File): Promise<ArrayBuffer>;
        getLoader(): ((rawData: PianoTrainerDomain.ScoreRawData, options: PianoTrainerDomain.ScoreLoadOptions)=>Promise<void>) | undefined;
        reportError(message: string, error: unknown): void;
    }
    interface OwnedScore {score:PianoTrainerWebmscoreVendor.Score;softDestroyed:boolean;hardDestroyed:boolean;}
    export function create(ports: Ports) {
        let generation=0;
        const owned=new Set<OwnedScore>();
        function assertActive(started: number) {if(started!==generation)throw new DOMException('Score conversion disposed.','AbortError');}
        // The sole capturing group is mandatory whenever this regex matches.
        function getFileExtension(fileName='') {const match=String(fileName||'').trim().toLowerCase().match(/(\.[^.]+)$/);return match?match[1]!:'';}
        function getBaseTitle(fileName='') {const base=String(fileName||'').trim();return base?base.replace(/\.[^.]+$/i,'').trim()||'Imported Score':'Imported Score';}
        function getWebMscoreFormat(fileName='') {return FORMATS[getFileExtension(fileName)]||null;}
        function isConverterImportFileName(fileName='') {return !!getWebMscoreFormat(fileName);}
        function track(score:PianoTrainerWebmscoreVendor.Score) {const resource={score,softDestroyed:false,hardDestroyed:false};owned.add(resource);return resource;}
        function destroy(resource:OwnedScore,hard=false) {
            if(hard?resource.hardDestroyed:resource.softDestroyed||resource.hardDestroyed)return;
            if(hard)resource.hardDestroyed=true;else resource.softDestroyed=true;
            if(typeof resource.score.destroy==='function'){try{if(hard)resource.score.destroy(false);else resource.score.destroy();}catch(_){}}
        }
        async function exportMusicXmlText(score:PianoTrainerWebmscoreVendor.Score|null) {
            const method=!score?null:typeof score.saveXml==='function'?'saveXml':typeof score.saveMusicXml==='function'?'saveMusicXml':
                typeof score.saveMxml==='function'?'saveMxml':typeof score.saveMusicXML==='function'?'saveMusicXML':null;
            if(!method)throw new Error('webmscore loaded, but this build does not expose a MusicXML export function.');
            return PianoTrainerWebmscoreAdapter.uint8ArrayToString(await score![method]!());
        }
        async function convertFileToScore(file:File|null|undefined):Promise<PianoTrainerDomain.ScoreFile> {
            const started=generation;
            if(!file)throw new Error('No file selected.');
            const format=getWebMscoreFormat(file.name||'');if(!format)throw new Error('That file type is not supported for conversion.');
            const vendor=await ports.ensureWebMscoreLoaded();assertActive(started);
            const bytes=new Uint8Array(await ports.readArrayBuffer(file));assertActive(started);
            let resource:OwnedScore|null=null;
            try {
                const score=await vendor.load(format,bytes);resource=score?track(score):null;
                if(started!==generation){if(resource)destroy(resource,true);assertActive(started);}
                const rawData=await exportMusicXmlText(score);assertActive(started);
                return {rawData,fileName:`${getBaseTitle(file.name||'')}.musicxml`,fileType:'musicxml',title:getBaseTitle(file.name||'')};
            }catch(error){
                if(started!==generation)throw new DOMException('Score conversion disposed.','AbortError');
                ports.reportError('Converted score import failed',error);
                throw new Error(`Could not convert "${file.name||'that file'}". `+'Some MIDI, MuseScore, or Guitar Pro files may need cleanup in MuseScore before importing.');
            }finally{if(resource)destroy(resource);}
        }
        async function normalizeScoreToMusicXml(rawData:unknown,{fileName='Untitled Score',fileType=''}:PianoTrainerDomain.ScoreLoadOptions={}) {
            const started=generation,resolvedType=String(fileType||getFileExtension(fileName||'')||'').toLowerCase().replace(/^\./,'');
            if(resolvedType==='xml'||resolvedType==='musicxml')return PianoTrainerWebmscoreAdapter.uint8ArrayToString(rawData);
            if(resolvedType!=='mxl')throw new Error('Only MusicXML text and compressed MXL are supported for transpose normalization.');
            const vendor=await ports.ensureWebMscoreLoaded();assertActive(started);
            const bytes=rawData instanceof Blob?new Uint8Array(await rawData.arrayBuffer()):PianoTrainerWebmscoreAdapter.bytesForNormalization(rawData);assertActive(started);
            if(!bytes)throw new Error('Could not normalize this score for transpose.');
            let resource:OwnedScore|null=null;
            try {
                const score=await vendor.load('mxl',bytes);resource=score?track(score):null;
                if(started!==generation){if(resource)destroy(resource,true);assertActive(started);}
                const xml=await exportMusicXmlText(score);assertActive(started);return xml;
            }finally{if(resource)destroy(resource);}
        }
        async function convertAndLoadScoreFile(file:File|null|undefined) {
            const started=generation,converted=await convertFileToScore(file);assertActive(started);
            const load=ports.getLoader();if(typeof load!=='function')throw new Error('loadScoreIntoApp() is not available.');
            await load(converted.rawData,converted);assertActive(started);return converted;
        }
        function dispose() {generation++;for(const resource of owned)destroy(resource,true);owned.clear();}
        return {getWebMscoreFormat,isConverterImportFileName,ensureWebMscoreLoaded:ports.ensureWebMscoreLoaded,convertFileToScore,
            convertAndLoadScoreFile,convertAndLoadMidiFile:convertAndLoadScoreFile,normalizeScoreToMusicXml,
            supportedExtensions:Object.freeze(Object.keys(FORMATS)),dispose};
    }
    export type Service=ReturnType<typeof create>;
}
