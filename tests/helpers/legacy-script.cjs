const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const modules = new WeakMap();
function loadModule(context, file) {
    let cache = modules.get(context);
    if (!cache) { cache = new Map(); modules.set(context, cache); }
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = {exports: {}};
    cache.set(absolute, module);
    const requireModule = name => {
        if (!name.startsWith('.')) throw new Error(`Unexpected unit module dependency: ${name}`);
        const dependency = path.resolve(path.dirname(absolute), name);
        return loadModule(context, dependency.endsWith('.js') ? dependency : dependency + '.js');
    };
    const execute = vm.compileFunction(fs.readFileSync(absolute, 'utf8'), ['require', 'module', 'exports'], {
        parsingContext: context, filename: path.relative(root, absolute)
    });
    execute(requireModule, module, module.exports);
    return module.exports;
}
function runScript(context, file) {
    if (!file.startsWith('js/generated/')) return vm.runInContext(read(file), context, {filename: file});
    let modulePath = file.slice('js/generated/'.length);
    if (['domain/practice.js', 'domain/score.js', 'domain/library.js'].includes(modulePath)) modulePath = 'domain/model.js';
    const exports = loadModule(context, path.join(root, '.cache/test-modules', modulePath));
    Object.assign(context, exports);
    return exports;
}

module.exports = { root, read, runScript, loadModule };
