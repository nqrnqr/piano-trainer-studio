import type {createServices} from '../app/services';
import type {PianoTrainerDomain as Domain} from '../domain/model';
import {PianoTrainerScoreLibrary} from '../score/score-library';

export interface LibraryFixturePorts {
    scoped(scope:string):Pick<IDBFactory,'open'>;
    storage():Pick<Storage,'getItem'|'setItem'>;
}
export function createLibraryChecks(getServices:() => ReturnType<typeof createServices>,fixture?:LibraryFixturePorts) {
    const owned=new Set<PianoTrainerScoreLibrary.Service>(),connections=new WeakMap<IDBDatabase,number>();
    let nextConnection=0;
    const copy=async <T>(value:Promise<T>):Promise<T> => structuredClone(await value);
    function repository(getRepository:() => PianoTrainerScoreLibrary.Service) {
        return Object.freeze({
            init:async () => {
                const db=await getRepository().init();
                if(!connections.has(db))connections.set(db,++nextConnection);
                const tx=db.transaction(['folders','scores'],'readonly');
                return {connectionId:connections.get(db),version:db.version,name:db.name,
                    stores:Object.fromEntries(['folders','scores'].map(name => {
                        const store=tx.objectStore(name);
                        return [name,{keyPath:store.keyPath,indexes:[...store.indexNames].map(name => ({name,unique:store.index(name).unique}))}];
                    }))};
            },
            getAllFolders:() => copy(getRepository().getAllFolders()),
            getAllScores:() => copy(getRepository().getAllScores()),
            getRecentScores:() => copy(getRepository().getRecentScores()),
            createFolder:(name:string) => copy(getRepository().createFolder(name)),
            renameFolder:(id:string,name:string) => getRepository().renameFolder(id,name),
            deleteFolder:(id:string) => getRepository().deleteFolder(id),
            saveScore:(score:Domain.SaveLibraryScore) => copy(getRepository().saveScore(score)),
            getScoreById:(id:string) => copy(getRepository().getScoreById(id)),
            renameScore:(id:string,name:string) => getRepository().renameScore(id,name),
            markScoreOpened:(id:string) => copy(getRepository().markScoreOpened(id)),
            moveScoresToFolder:(ids:string[],folder:string|null) => getRepository().moveScoresToFolder(ids,folder),
            deleteFoldersAndScores:(ids:string[]) => getRepository().deleteFoldersAndScores(ids),
            deleteScores:(ids:string[]) => getRepository().deleteScores(ids),
            exportBackup:() => copy(getRepository().exportBackup()),
            importBackup:(payload:unknown) => getRepository().importBackup(payload),
            importStarterLibraryOnce:() => getRepository().importStarterLibraryOnce(),
            dispose:() => getRepository().dispose(),
            abortTransaction:() => getRepository().transaction(['scores'],'readwrite',(_,tx) => {tx.abort();return 'never';}),
            disposeDuringRead:() => {
                const service=getRepository();
                return service.transaction(['scores'],'readonly',stores => {
                    const pending=service.requestToPromise(stores.scores.getAll());service.dispose();return pending;
                });
            }
        });
    }
    const commands=Object.freeze({
        main:repository(() => getServices().ScoreLibrary),
        create:(scope:string,options:{starterStatus?:number}={}) => {
            if(!fixture)throw Error('Missing isolated library fixture');
            const starterStatus=options.starterStatus;
            const storage=fixture.storage(),service=PianoTrainerScoreLibrary.create({
                hasIndexedDB:() => true,getIndexedDB:() => fixture.scoped(scope),makeId:() => crypto.randomUUID(),
                now:() => Date.now(),isoNow:() => new Date().toISOString(),storage,
                starterUrl:new URL('assets/Starter_Scores.json',document.baseURI).toString(),
                fetch:starterStatus===undefined ? (...args) => fetch(...args) : async () => new Response(null,{status:starterStatus}),
                format:getServices().scoreFormat
            });
            owned.add(service);return {service:repository(() => service),storage};
        },
        refresh:() => getServices().scoresDrawer.refreshScoresDrawer(),
        selectAllScores:() => {const state=getServices().AppState;state.scoreLibraryView='scores';state.scoreLibrarySelectedFolderId='__all__';}
    });
    return {commands,clear:() => {for(const service of owned)service.dispose();owned.clear();}};
}
