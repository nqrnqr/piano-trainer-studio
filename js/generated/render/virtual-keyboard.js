"use strict";
// Native key presentation consumes classes; matching and traversal stay outside.
var PianoTrainerVirtualKeyboardView;
(function (PianoTrainerVirtualKeyboardView) {
    const classes = ['expected-l', 'expected-r', 'pressed-l', 'pressed-r', 'wrong', 'active', 'future1-l', 'future1-r'];
    function create(ports) {
        function drawKey(midi, desiredClass, calibration = false) {
            const node = ports.document.querySelector(`.key[data-midi="${midi}"]`);
            if (!node)
                return;
            if (!(node instanceof HTMLElement))
                throw Error('Invalid virtual keyboard key: ' + midi);
            node.classList.toggle('out-of-range', !ports.isMidiInRange(midi));
            if (calibration) {
                classes.forEach(value => node.classList.remove(value));
                if (desiredClass)
                    node.classList.add(desiredClass);
            }
            else {
                // Preserve the original first recognized class and its replacement.
                const current = [...node.classList].find(value => classes.includes(value));
                if (current !== desiredClass) {
                    if (current)
                        node.classList.remove(current);
                    if (desiredClass)
                        node.classList.add(desiredClass);
                }
            }
            node.style.filter = '';
            node.style.boxShadow = '';
            node.style.transform = '';
        }
        return { drawKey };
    }
    PianoTrainerVirtualKeyboardView.create = create;
})(PianoTrainerVirtualKeyboardView || (PianoTrainerVirtualKeyboardView = {}));
//# sourceMappingURL=virtual-keyboard.js.map