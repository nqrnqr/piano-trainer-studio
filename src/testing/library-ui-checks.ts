import type {createServices} from '../app/services';
import type {PianoTrainerLibraryDialogs} from '../ui/library-dialogs';
import type {PianoTrainerDomain} from '../domain/model';

type Services=ReturnType<typeof createServices>;
export function createLibraryUiChecks(getServices:() => Services) {
    let repository:Services['ScoreLibrary']|null=null,originalFolders:Services['ScoreLibrary']['getAllFolders']|null=null;
    let finishFolders:((folders:PianoTrainerDomain.LibraryFolder[]) => void)|null=null;
    function restoreFolders() {
        if(repository&&originalFolders)repository.getAllFolders=originalFolders;
        repository=null;originalFolders=null;
    }
    const commands=Object.freeze({
        init:() => {const s=getServices();s.libraryUiLifetime.init();s.scoresDrawer.init();},
        dispose:() => {const s=getServices();s.libraryUiLifetime.dispose();s.libraryDialogs.dispose();s.libraryRows.dispose();s.scoresDrawer.dispose();},
        refresh:() => getServices().scoresDrawer.refreshScoresDrawer(),
        close:() => getServices().scoresDrawer.closeScoresDrawer(),
        chooseFolder:(options:PianoTrainerLibraryDialogs.FolderChoiceOptions) => getServices().libraryDialogs.promptForLibraryFolderChoice(options),
        readSnapshot:() => {const state=getServices().AppState;return {view:state.scoreLibraryView,folderId:state.scoreLibrarySelectedFolderId,
            manage:state.scoreLibraryManageMode,folderManage:state.scoreLibraryFolderManageMode,selectedScoreIds:[...state.scoreLibrarySelectedScoreIds]};},
        holdFolders:() => {
            if(originalFolders)throw Error('Folder query already held');
            repository=getServices().ScoreLibrary;originalFolders=repository.getAllFolders;
            repository.getAllFolders=() => new Promise(resolve => {finishFolders=resolve;});
        },
        finishFolders:() => {if(!finishFolders)throw Error('No pending folder query');finishFolders([]);finishFolders=null;},
        restoreFolders
    });
    return {commands,clear:() => {restoreFolders();finishFolders?.([]);finishFolders=null;}};
}
