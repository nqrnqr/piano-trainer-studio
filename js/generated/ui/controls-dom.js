"use strict";
// DOM types and listener ownership shared by native trainer controls.
var PianoTrainerControlDom;
(function (PianoTrainerControlDom) {
    function create(document) {
        const listeners = [];
        function typed(id, type, required) {
            const element = document.getElementById(id);
            if (element && !(element instanceof type))
                throw Error('Invalid trainer control: ' + id);
            if (!element && required)
                throw Error('Missing required trainer control: ' + id);
            return element;
        }
        function input(id) { return typed(id, HTMLInputElement, true); }
        function optionalInput(id) { return typed(id, HTMLInputElement, false); }
        function button(id) { return typed(id, HTMLButtonElement, true); }
        function optionalButton(id) { return typed(id, HTMLButtonElement, false); }
        function select(id) { return typed(id, HTMLSelectElement, true); }
        function optionalSelect(id) { return typed(id, HTMLSelectElement, false); }
        function element(id) { return typed(id, HTMLElement, false); }
        function on(target, event, handler) {
            if (!target)
                return;
            target.addEventListener(event, handler);
            listeners.push({ target, event, handler });
        }
        function onInput(target, event, handler) {
            on(target, event, event => { if (event.target instanceof HTMLInputElement)
                handler(event.target); });
        }
        function dispose() {
            for (const { target, event, handler } of listeners)
                target.removeEventListener(event, handler);
            listeners.length = 0;
        }
        return { input, optionalInput, button, optionalButton, select, optionalSelect, element, on, onInput, dispose };
    }
    PianoTrainerControlDom.create = create;
})(PianoTrainerControlDom || (PianoTrainerControlDom = {}));
//# sourceMappingURL=controls-dom.js.map