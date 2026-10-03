// Native IndexedDB transaction completion and existing v1 CRUD/starter commands.
namespace PianoTrainerScoreLibrary {
    const SCORE_LIBRARY_DB_NAME = 'pianoTrainerLibrary', SCORE_LIBRARY_DB_VERSION = 1;
    const SCORE_LIBRARY_FOLDER_STORE = 'folders', SCORE_LIBRARY_SCORE_STORE = 'scores';
    export const STARTER_LIBRARY_IMPORT_STORAGE_KEY = 'pt_starterLibraryImported_v1';
    interface Store<T> {
        get(id: IDBValidKey): IDBRequest<T | undefined>;
        getAll(): IDBRequest<T[]>;
        put(value: T): IDBRequest<IDBValidKey>;
        delete(id: IDBValidKey): IDBRequest<undefined>;
    }
    interface StoreMap {
        folders: Store<PianoTrainerDomain.LibraryFolder>;
        scores: Store<PianoTrainerDomain.LibraryScore>;
    }
    type StoreName = keyof StoreMap;
    export interface Ports {
        hasIndexedDB(): boolean;
        getIndexedDB(): IDBFactory;
        makeId(): string;
        now(): number;
        isoNow(): string;
        format: Pick<PianoTrainerMusicXmlIO.Service, 'getScoreDisplayTitle' | 'getScoreFileTypeFromName'>;
        storage: Pick<Storage, 'getItem' | 'setItem'>;
        starterUrl: string;
        fetch: typeof fetch;
    }
    export function create(ports: Ports) {
        let generation = 0, database: IDBDatabase | null = null, rejectOpen: ((error: unknown) => void) | null = null;
        const ownedTransactions = new Set<IDBTransaction>();
        const ownedReadResults = new Set<Promise<unknown>>();
        const aborted = () => new DOMException('Score library disposed.', 'AbortError');
        function assertActive(started: number) {
            if (started !== generation)
                throw aborted();
        }
        const service = {
            dbPromise: null as Promise<IDBDatabase> | null,
            async init(): Promise<IDBDatabase> {
                const started = generation;
                if (!ports.hasIndexedDB()) {
                    throw new Error('IndexedDB is not available in this browser.');
                }
                if (!this.dbPromise) {
                    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
                        rejectOpen = reject;
                        const request = ports.getIndexedDB().open(SCORE_LIBRARY_DB_NAME, SCORE_LIBRARY_DB_VERSION);
                        request.onerror = () => {
                            if (started === generation)
                                rejectOpen = null;
                            reject(request.error || new Error('Could not open the score library database.'));
                        };
                        request.onupgradeneeded = () => {
                            const db = request.result;
                            if (started !== generation) {
                                request.transaction?.abort();
                                return;
                            }
                            if (!db.objectStoreNames.contains(SCORE_LIBRARY_FOLDER_STORE)) {
                                const folderStore = db.createObjectStore(SCORE_LIBRARY_FOLDER_STORE, { keyPath: 'id' });
                                folderStore.createIndex('by_name', 'name', { unique: false });
                            }
                            if (!db.objectStoreNames.contains(SCORE_LIBRARY_SCORE_STORE)) {
                                const scoreStore = db.createObjectStore(SCORE_LIBRARY_SCORE_STORE, { keyPath: 'id' });
                                scoreStore.createIndex('by_folderId', 'folderId', { unique: false });
                                scoreStore.createIndex('by_lastOpenedAt', 'lastOpenedAt', { unique: false });
                                scoreStore.createIndex('by_title', 'title', { unique: false });
                            }
                        };
                        request.onsuccess = () => {
                            if (started !== generation) {
                                request.result.close();
                                reject(aborted());
                                return;
                            }
                            rejectOpen = null;
                            database = request.result;
                            resolve(request.result);
                        };
                    });
                }
                return this.dbPromise;
            },
            async transaction<K extends StoreName, T>(storeNames: K[], mode: IDBTransactionMode, executor: (stores: Pick<StoreMap, K>, tx: IDBTransaction) => T | Promise<T>): Promise<T> {
                const started = generation;
                const db = await this.init();
                assertActive(started);
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(storeNames, mode);
                    ownedTransactions.add(tx);
                    // The v1 keyPath schema and requested store names define native result types here.
                    const stores = Object.fromEntries(storeNames.map(name => [name, tx.objectStore(name)])) as unknown as Pick<StoreMap, K>;
                    let result: T | Promise<T>;
                    tx.oncomplete = () => { ownedTransactions.delete(tx); if (result instanceof Promise)
                        ownedReadResults.delete(result); resolve(result); };
                    tx.onerror = () => reject(tx.error || new Error('Library transaction failed.'));
                    tx.onabort = () => { ownedTransactions.delete(tx); if (result instanceof Promise)
                        ownedReadResults.delete(result); reject(tx.error || new Error('Library transaction was aborted.')); };
                    try {
                        result = executor(stores, tx);
                        if (result instanceof Promise) {
                            // Only explicit disposal observes otherwise orphaned request rejections.
                            // Normal success still waits for transaction completion and assimilates result.
                            if (started !== generation)
                                result.catch(() => { });
                            else
                                ownedReadResults.add(result);
                        }
                    }
                    catch (err) {
                        reject(err);
                        try {
                            tx.abort();
                        }
                        catch (e) { }
                    }
                });
            },
            requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
                return new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error || new Error('Library request failed.'));
                });
            },
            async getAllFolders() {
                return this.transaction([SCORE_LIBRARY_FOLDER_STORE], 'readonly', ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => this.requestToPromise(store.getAll())).then(items => (items || []).sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''))));
            },
            async getAllScores() {
                return this.transaction([SCORE_LIBRARY_SCORE_STORE], 'readonly', ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => this.requestToPromise(store.getAll())).then(items => (items || []).sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''))));
            },
            async getRecentScores(limit = 8) {
                const started = generation;
                const scores = await this.getAllScores();
                assertActive(started);
                return scores
                    .filter(score => !!score.lastOpenedAt)
                    .sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0))
                    .slice(0, limit);
            },
            async createFolder(name: string) {
                const started = generation;
                const trimmed = String(name || '').trim();
                if (!trimmed)
                    throw new Error('Folder name is required.');
                const folder = {
                    id: ports.makeId(),
                    name: trimmed,
                    createdAt: ports.now(),
                    updatedAt: ports.now()
                };
                await this.transaction([SCORE_LIBRARY_FOLDER_STORE], 'readwrite', ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => {
                    store.put(folder);
                });
                assertActive(started);
                return folder;
            },
            async renameFolder(folderId: string, nextName: string) {
                const started = generation;
                const trimmed = String(nextName || '').trim();
                if (!folderId)
                    throw new Error('Folder not found.');
                if (!trimmed)
                    throw new Error('Folder name is required.');
                const folder = await this.transaction([SCORE_LIBRARY_FOLDER_STORE], 'readonly', ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => this.requestToPromise(store.get(folderId)));
                assertActive(started);
                if (!folder)
                    throw new Error('Folder not found.');
                folder.name = trimmed;
                folder.updatedAt = ports.now();
                await this.transaction([SCORE_LIBRARY_FOLDER_STORE], 'readwrite', ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => {
                    store.put(folder);
                });
                assertActive(started);
                return folder;
            },
            async deleteFolder(folderId: string) {
                const started = generation;
                if (!folderId)
                    throw new Error('Folder not found.');
                const scores = await this.getAllScores();
                assertActive(started);
                const inFolder = scores.filter(score => score.folderId === folderId);
                if (inFolder.length > 0)
                    throw new Error('Folder must be empty before deleting.');
                await this.transaction([SCORE_LIBRARY_FOLDER_STORE], 'readwrite', ({ [SCORE_LIBRARY_FOLDER_STORE]: store }) => {
                    store.delete(folderId);
                });
                assertActive(started);
                return true;
            },
            async deleteFolderAndScores(folderId: string) {
                const started = generation;
                const ids = Array.from(new Set([folderId].filter(Boolean)));
                if (!ids.length)
                    throw new Error('Folder not found.');
                await this.deleteFoldersAndScores(ids);
                assertActive(started);
                return true;
            },
            async deleteFoldersAndScores(folderIds: string[]) {
                const started = generation;
                const ids = Array.from(new Set((folderIds || []).filter(Boolean)));
                if (!ids.length)
                    return 0;
                await this.transaction([SCORE_LIBRARY_FOLDER_STORE, SCORE_LIBRARY_SCORE_STORE], 'readwrite', ({ [SCORE_LIBRARY_FOLDER_STORE]: folderStore, [SCORE_LIBRARY_SCORE_STORE]: scoreStore }) => {
                    const getAllScoresRequest = scoreStore.getAll();
                    getAllScoresRequest.onsuccess = () => {
                        const allScores = Array.isArray(getAllScoresRequest.result) ? getAllScoresRequest.result : [];
                        allScores.forEach((score) => {
                            // Nullable folder IDs cannot match the selected string IDs; keep native includes.
                            if (ids.includes(score.folderId!)) {
                                scoreStore.delete(score.id);
                            }
                        });
                        ids.forEach((folderId) => folderStore.delete(folderId));
                    };
                });
                assertActive(started);
                return ids.length;
            },
            async saveScore({ title, folderId = null, fileName, fileType, rawData, lastOpenedAt = null }: PianoTrainerDomain.SaveLibraryScore) {
                const started = generation;
                const now = ports.now();
                const score = {
                    id: ports.makeId(),
                    title: String(title || ports.format.getScoreDisplayTitle(fileName || '') || 'Untitled Score').trim() || 'Untitled Score',
                    folderId: folderId || null,
                    fileName: fileName || 'Untitled Score.xml',
                    fileType: fileType || ports.format.getScoreFileTypeFromName(fileName || ''),
                    rawData,
                    createdAt: now,
                    updatedAt: now,
                    lastOpenedAt
                };
                await this.transaction([SCORE_LIBRARY_SCORE_STORE], 'readwrite', ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
                    store.put(score);
                });
                assertActive(started);
                return score;
            },
            async getScoreById(scoreId: string | null | undefined) {
                if (!scoreId)
                    return null;
                return this.transaction([SCORE_LIBRARY_SCORE_STORE], 'readonly', ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => this.requestToPromise(store.get(scoreId)));
            },
            async renameScore(scoreId: string, nextTitle: string) {
                const started = generation;
                const trimmed = String(nextTitle || '').trim();
                if (!scoreId)
                    throw new Error('Score not found.');
                if (!trimmed)
                    throw new Error('Score name is required.');
                const score = await this.getScoreById(scoreId);
                assertActive(started);
                if (!score)
                    throw new Error('Score not found.');
                score.title = trimmed;
                score.updatedAt = ports.now();
                await this.transaction([SCORE_LIBRARY_SCORE_STORE], 'readwrite', ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
                    store.put(score);
                });
                assertActive(started);
                return score;
            },
            async markScoreOpened(scoreId: string) {
                const started = generation;
                const score = await this.getScoreById(scoreId);
                assertActive(started);
                if (!score)
                    return null;
                score.lastOpenedAt = ports.now();
                score.updatedAt = ports.now();
                await this.transaction([SCORE_LIBRARY_SCORE_STORE], 'readwrite', ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
                    store.put(score);
                });
                assertActive(started);
                return score;
            },
            async moveScoresToFolder(scoreIds: string[], folderId: string | null = null) {
                const started = generation;
                const ids = Array.from(new Set((scoreIds || []).filter(Boolean)));
                if (!ids.length)
                    return 0;
                await this.transaction([SCORE_LIBRARY_SCORE_STORE], 'readwrite', ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
                    ids.forEach((scoreId) => {
                        const request = store.get(scoreId);
                        request.onsuccess = () => {
                            const score = request.result;
                            if (!score)
                                return;
                            score.folderId = folderId || null;
                            score.updatedAt = ports.now();
                            store.put(score);
                        };
                    });
                });
                assertActive(started);
                return ids.length;
            },
            async deleteScores(scoreIds: string[]) {
                const started = generation;
                const ids = Array.from(new Set((scoreIds || []).filter(Boolean)));
                if (!ids.length)
                    return 0;
                await this.transaction([SCORE_LIBRARY_SCORE_STORE], 'readwrite', ({ [SCORE_LIBRARY_SCORE_STORE]: store }) => {
                    ids.forEach((scoreId) => store.delete(scoreId));
                });
                assertActive(started);
                return ids.length;
            },
            async exportBackup(): Promise<PianoTrainerLibraryBackup.Backup> {
                const started = generation;
                const folders = await this.getAllFolders();
                assertActive(started);
                const scores = await this.getAllScores();
                assertActive(started);
                return {
                    version: 1,
                    exportedAt: ports.isoNow(),
                    folders: folders.map(folder => ({ ...folder })),
                    scores: scores.map(score => ({
                        ...score,
                        rawData: PianoTrainerLibraryBackup.serializeScoreRawData(score.rawData)
                    }))
                };
            },
            async importBackup(payload: unknown) {
                const started = generation;
                const { folders, scores } = PianoTrainerLibraryBackup.readArrays(payload);
                const folderIdMap = new Map<string | null | undefined, string>();
                await this.transaction([SCORE_LIBRARY_FOLDER_STORE, SCORE_LIBRARY_SCORE_STORE], 'readwrite', ({ [SCORE_LIBRARY_FOLDER_STORE]: folderStore, [SCORE_LIBRARY_SCORE_STORE]: scoreStore }) => {
                    folders.forEach(folder => {
                        const newId = ports.makeId();
                        folderIdMap.set(folder.id, newId);
                        folderStore.put({
                            id: newId,
                            name: String(folder.name || 'New Folder').trim() || 'New Folder',
                            createdAt: Number(folder.createdAt) || ports.now(),
                            updatedAt: Number(folder.updatedAt) || ports.now()
                        });
                    });
                    scores.forEach(score => {
                        scoreStore.put({
                            id: ports.makeId(),
                            title: String(score.title || ports.format.getScoreDisplayTitle(score.fileName || '') || 'Untitled Score').trim() || 'Untitled Score',
                            folderId: folderIdMap.get(score.folderId) || null,
                            fileName: score.fileName || 'Imported Score.xml',
                            fileType: score.fileType || ports.format.getScoreFileTypeFromName(score.fileName || ''),
                            rawData: PianoTrainerLibraryBackup.deserializeScoreRawData(score.rawData),
                            createdAt: Number(score.createdAt) || ports.now(),
                            updatedAt: ports.now(),
                            lastOpenedAt: Number(score.lastOpenedAt) || null
                        });
                    });
                });
                assertActive(started);
            },
            async importStarterLibraryOnce() {
                const started = generation;
                if (ports.storage.getItem(STARTER_LIBRARY_IMPORT_STORAGE_KEY) === 'true')
                    return false;
                const existingScores = await this.getAllScores();
                assertActive(started);
                if (existingScores.length > 0) {
                    ports.storage.setItem(STARTER_LIBRARY_IMPORT_STORAGE_KEY, 'true');
                    return false;
                }
                const response = await ports.fetch(ports.starterUrl, { cache: 'no-store' });
                assertActive(started);
                if (!response.ok) {
                    throw new Error(`Could not load starter library (${response.status}).`);
                }
                const payload: unknown = await response.json();
                assertActive(started);
                await this.importBackup(payload);
                assertActive(started);
                ports.storage.setItem(STARTER_LIBRARY_IMPORT_STORAGE_KEY, 'true');
                return true;
            },
            dispose() {
                generation++;
                for (const result of ownedReadResults)
                    result.catch(() => { });
                ownedReadResults.clear();
                if (rejectOpen)
                    rejectOpen(aborted());
                rejectOpen = null;
                for (const tx of ownedTransactions) {
                    try {
                        tx.abort();
                    }
                    catch (_) { }
                }
                ownedTransactions.clear();
                database?.close();
                database = null;
                this.dbPromise = null;
            }
        };
        return service;
    }
    export function getScoreLibraryFolderLabel(folderId: string | null | undefined, folders: readonly PianoTrainerDomain.LibraryFolder[] | null | undefined) {
        if (folderId === '__all__')
            return 'All Scores';
        if (folderId == null || folderId === '__unfiled__')
            return 'Unfiled';
        const folder = (folders || []).find(item => item.id === folderId);
        return folder?.name || 'Unknown Folder';
    }
    export type Service = ReturnType<typeof create>;
}
