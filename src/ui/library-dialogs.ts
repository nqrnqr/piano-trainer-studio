import type {PianoTrainerDomain} from '../domain/model';
import type {PianoTrainerScoreLibrary} from '../score/score-library';
import type {PianoTrainerLibraryControlsState} from './library-controls-state';
// Existing score-library UI; native DOM and commands are isolated from practice.
export namespace PianoTrainerLibraryDialogs {
    export interface FolderChoiceOptions {
        allowAll?: boolean;
        title?: string;
        folders?: PianoTrainerDomain.LibraryFolder[] | null;
    }
    export interface ActionMenuOptions {
        titleText?: string;
        items?: {
            value: string;
            label: string;
            danger?: boolean;
        }[];
    }
    export interface Ports {
        document: Document;
        library: Pick<PianoTrainerScoreLibrary.Service, 'getAllFolders'>;
        lifetime: PianoTrainerLibraryControlsState.Lifetime;
    }
    export function create(ports: Ports) {
        const document = ports.document;
        const pending = new Set<(value: string | null) => void>();
        async function promptForLibraryFolderChoice({ allowAll = false, title = 'Choose a folder:', folders = null }: FolderChoiceOptions = {}): Promise<string | null> {
            const uiGeneration = ports.lifetime.capture();
            if (!ports.lifetime.current(uiGeneration))
                return '__cancel__';
            const availableFolders = Array.isArray(folders) ? folders : await ports.library.getAllFolders();
            if (!ports.lifetime.current(uiGeneration))
                return '__cancel__';
            const choices: {
                value: string | null;
                label: string;
            }[] = [];
            if (allowAll)
                choices.push({ value: '__all__', label: 'All Scores' });
            choices.push({ value: null, label: 'Unfiled' });
            availableFolders.forEach(folder => {
                choices.push({ value: folder.id, label: folder.name || 'New Folder' });
            });
            return new Promise<string | null>((resolve) => {
                const overlay = document.createElement('div');
                overlay.className = 'scores-folder-picker-overlay';
                const panel = document.createElement('div');
                panel.className = 'scores-folder-picker-panel';
                overlay.appendChild(panel);
                const heading = document.createElement('div');
                heading.className = 'scores-folder-picker-title';
                heading.textContent = title;
                panel.appendChild(heading);
                const list = document.createElement('div');
                list.className = 'scores-folder-picker-list';
                panel.appendChild(list);
                const onKeyDown = (e: KeyboardEvent) => {
                    if (e.key === 'Escape') {
                        finish('__cancel__');
                    }
                };
                const finish = (value: string | null) => {
                    document.removeEventListener('keydown', onKeyDown, true);
                    overlay.remove();
                    pending.delete(finish);
                    resolve(value);
                };
                choices.forEach(choice => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'scores-folder-picker-option';
                    if (choice.value !== null && choice.value !== '__all__') btn.setAttribute('data-i18n-skip', '');
                    btn.textContent = choice.label;
                    btn.addEventListener('click', () => finish(choice.value));
                    list.appendChild(btn);
                });
                const footer = document.createElement('div');
                footer.className = 'scores-folder-picker-footer';
                panel.appendChild(footer);
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'scores-folder-picker-cancel';
                cancelBtn.textContent = 'Cancel';
                cancelBtn.addEventListener('click', () => finish('__cancel__'));
                footer.appendChild(cancelBtn);
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay)
                        finish('__cancel__');
                });
                pending.add(finish);
                document.addEventListener('keydown', onKeyDown, true);
                document.body.appendChild(overlay);
            });
        }
        function buildActionMenu({ titleText = '', items = [] }: ActionMenuOptions = {}): Promise<string | null> {
            if (!ports.lifetime.current(ports.lifetime.capture()))
                return Promise.resolve('__cancel__');
            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                overlay.className = 'scores-action-menu-overlay';
                overlay.addEventListener('click', (e) => e.stopPropagation());
                const panel = document.createElement('div');
                panel.className = 'scores-action-menu-panel';
                panel.addEventListener('click', (e) => e.stopPropagation());
                overlay.appendChild(panel);
                const title = document.createElement('div');
                title.className = 'scores-action-menu-title';
                title.textContent = titleText;
                panel.appendChild(title);
                const actions = document.createElement('div');
                actions.className = 'scores-action-menu-actions';
                panel.appendChild(actions);
                const finish = (value: string | null) => {
                    overlay.remove();
                    pending.delete(finish);
                    document.removeEventListener('keydown', onKeyDown, true);
                    resolve(value);
                };
                const onKeyDown = (e: KeyboardEvent) => {
                    if (e.key === 'Escape')
                        finish('__cancel__');
                };
                items.forEach((item) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `scores-action-menu-button${item.danger ? ' scores-action-menu-button-danger' : ''}`;
                    btn.textContent = item.label;
                    btn.addEventListener('click', () => finish(item.value));
                    actions.appendChild(btn);
                });
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay)
                        finish('__cancel__');
                });
                pending.add(finish);
                document.addEventListener('keydown', onKeyDown, true);
                document.body.appendChild(overlay);
            });
        }
        function dispose() { for (const finish of Array.from(pending))
            finish('__cancel__'); }
        return { promptForLibraryFolderChoice, buildActionMenu, dispose };
    }
    export type Service = ReturnType<typeof create>;
}
