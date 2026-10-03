// DOM types and listener ownership shared by native trainer controls.
namespace PianoTrainerControlDom {
    export function create(document: Document) {
        const listeners: {target: EventTarget; event: string; handler: EventListener}[] = [];
        function typed<T extends HTMLElement>(id: string, type: {new(): T}, required: boolean): T | null {
            const element = document.getElementById(id);
            if (element && !(element instanceof type)) throw Error('Invalid trainer control: ' + id);
            if (!element && required) throw Error('Missing required trainer control: ' + id);
            return element;
        }
        function input(id: string) { return typed(id, HTMLInputElement, true)!; }
        function optionalInput(id: string) { return typed(id, HTMLInputElement, false); }
        function button(id: string) { return typed(id, HTMLButtonElement, true)!; }
        function optionalButton(id: string) { return typed(id, HTMLButtonElement, false); }
        function select(id: string) { return typed(id, HTMLSelectElement, true)!; }
        function optionalSelect(id: string) { return typed(id, HTMLSelectElement, false); }
        function element(id: string) { return typed(id, HTMLElement, false); }
        function on(target: EventTarget | null, event: string, handler: EventListener) {
            if (!target) return;
            target.addEventListener(event, handler); listeners.push({target, event, handler});
        }
        function onInput(target: HTMLInputElement | null, event: string, handler: (input: HTMLInputElement) => void) {
            on(target, event, event => {if (event.target instanceof HTMLInputElement) handler(event.target);});
        }
        function dispose() {
            for (const {target,event,handler} of listeners) target.removeEventListener(event,handler);
            listeners.length = 0;
        }
        return {input, optionalInput, button, optionalButton, select, optionalSelect, element, on, onInput, dispose};
    }
}
