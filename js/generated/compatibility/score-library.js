"use strict";
// Original library slot. Resource opening remains lazy; v1 database and starter URL are unchanged.
const ScoreLibrary = PianoTrainerScoreLibrary.create({ hasIndexedDB: () => 'indexedDB' in window, getIndexedDB: () => window.indexedDB,
    makeId: () => {
        if (window.crypto?.randomUUID)
            return window.crypto.randomUUID();
        return `ptlib-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    },
    now: () => Date.now(), isoNow: () => new Date().toISOString(), storage: { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) },
    starterUrl: new URL('assets/Starter_Scores.json', document.baseURI).toString(), fetch: (...args) => fetch(...args),
    format: { getScoreFileTypeFromName: name => getScoreFileTypeFromName(name), getScoreDisplayTitle: name => getScoreDisplayTitle(name) } });
const getScoreLibraryFolderLabel = PianoTrainerScoreLibrary.getScoreLibraryFolderLabel;
window.ScoreLibrary = ScoreLibrary;
//# sourceMappingURL=score-library.js.map