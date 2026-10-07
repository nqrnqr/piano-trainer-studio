import {DEFAULT_LANGUAGE, normalizeLanguage, translateMessage} from './messages';
import type {Language} from './messages';
import {LANGUAGE_STORAGE_KEY} from '../state/preference-keys';

// Observe controls only: rendered scores and keyboard frames never enter this path.
const rootsSelector = '#static-menu, #scores-panel, #options-overlay, #help-overlay, '
    + '#more-popup, #audio-popup, #display-popup, #transpose-popup, #tempo-popup, '
    + '#practice-popup, #looper-popup, .score-overlay-controls, #led-calibration-panel, '
    + '.scores-folder-picker-overlay, .scores-action-menu-overlay';
const skipSelector = 'script, style, svg, [data-i18n-skip], .scores-item-title, .scores-item-meta, .scores-action-menu-title';
const attributes = ['title', 'aria-label', 'placeholder', 'data-tooltip'] as const;
type Copy = {source: string; rendered: string};
// A service can be recreated on the same DOM. Weak ownership keeps the original
// copy available without retaining documents or detached library rows.
const sourceCopies = new WeakMap<Document, {texts: WeakMap<Node, Copy>; attributes: WeakMap<Element, Map<string, Copy>>}>();
export interface LanguagePorts {
    document: Document;
    storage: Pick<Storage, 'getItem' | 'setItem'>;
    createObserver(callback: MutationCallback): MutationObserver;
}
export function createLanguageController(ports: LanguagePorts) {
    const {document} = ports;
    let language: Language = DEFAULT_LANGUAGE, initialized = false, disposed = false;
    let bodyObserver: MutationObserver | null = null, select: HTMLSelectElement | null = null;
    const observers = new Map<Element, MutationObserver>();
    let copies = sourceCopies.get(document);
    if (!copies) {copies = {texts: new WeakMap(), attributes: new WeakMap()}; sourceCopies.set(document, copies);}
    const textCopies = copies.texts, attributeCopies = copies.attributes;
    function translate(source: unknown) { return translateMessage(String(source ?? ''), language); }
    function skip(node: Node) {
        const element = node.nodeType === 1 ? node as Element : node.parentElement;
        return !element || !!element.closest(skipSelector);
    }
    function applyText(node: Node) {
        if (skip(node)) return;
        const value = node.nodeValue || '', previous = textCopies.get(node);
        const source = previous && value === previous.rendered ? previous.source : value;
        const rendered = translate(source);
        textCopies.set(node, {source, rendered});
        if (rendered !== value) node.nodeValue = rendered;
    }
    function applyAttributes(element: Element) {
        if (skip(element)) return;
        let copies = attributeCopies.get(element);
        if (!copies) {copies = new Map(); attributeCopies.set(element, copies);}
        for (const name of attributes) {
            const value = element.getAttribute(name);
            if (value === null) {copies.delete(name); continue;}
            const previous = copies.get(name);
            const source = previous && value === previous.rendered ? previous.source : value;
            const rendered = translate(source);
            copies.set(name, {source, rendered});
            if (rendered !== value) element.setAttribute(name, rendered);
        }
    }
    function applyTree(node: Node) {
        if (node.nodeType === 3) {applyText(node); return;}
        if (node.nodeType !== 1 || skip(node)) return;
        applyAttributes(node as Element);
        for (const child of node.childNodes) applyTree(child);
    }
    function onMutations(records: MutationRecord[]) {
        if (disposed) return;
        for (const record of records) {
            if (record.type === 'characterData') applyText(record.target);
            else if (record.type === 'attributes') applyAttributes(record.target as Element);
            else for (const node of record.addedNodes) applyTree(node);
        }
    }
    function registerRoot(root: Element) {
        if (observers.has(root)) return;
        applyTree(root);
        const observer = ports.createObserver(onMutations);
        observer.observe(root, {subtree: true, childList: true, characterData: true,
            attributes: true, attributeFilter: [...attributes]});
        observers.set(root, observer);
    }
    function discoverRoots() {
        for (const [root, observer] of observers) {
            if (!root.isConnected) {observer.disconnect(); observers.delete(root);}
        }
        for (const root of document.querySelectorAll(rootsSelector)) registerRoot(root);
    }
    function setLanguage(value: unknown, {save = true} = {}) {
        if (disposed) return;
        language = normalizeLanguage(value);
        if (save) {try {ports.storage.setItem(LANGUAGE_STORAGE_KEY, language);} catch (_) {}}
        document.documentElement.lang = language;
        if (select) select.value = language;
        discoverRoots();
        for (const [root, observer] of observers) {
            onMutations(observer.takeRecords());
            applyTree(root);
        }
    }
    function readSavedLanguage() {
        try {return normalizeLanguage(ports.storage.getItem(LANGUAGE_STORAGE_KEY));} catch (_) {return DEFAULT_LANGUAGE;}
    }
    function onChange() {if (select) setLanguage(select.value);}
    function init() {
        if (initialized || disposed) return;
        initialized = true;
        select = document.querySelector<HTMLSelectElement>('#select-language');
        select?.addEventListener('change', onChange);
        setLanguage(readSavedLanguage(), {save: false});
        bodyObserver = ports.createObserver(() => {if (!disposed) discoverRoots();});
        // Watch direct additions/removals for library dialogs, excluding score mutations.
        bodyObserver.observe(document.body, {childList: true});
    }
    function restoreSavedLanguage() {setLanguage(readSavedLanguage(), {save: false});}
    function dispose() {
        if (disposed) return;
        disposed = true;
        select?.removeEventListener('change', onChange); select = null;
        bodyObserver?.disconnect(); bodyObserver = null;
        for (const observer of observers.values()) observer.disconnect();
        observers.clear();
    }
    return {init, dispose, translate, setLanguage, restoreSavedLanguage, getLanguage: () => language};
}
