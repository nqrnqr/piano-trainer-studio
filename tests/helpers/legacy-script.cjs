const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function runScript(context, file) {
    vm.runInContext(read(file), context, { filename: file });
}

// These legacy declarations and their closing braces start at column zero.
// Include only the original body, excluding subsequent startup side effects.
function runFunction(context, file, name) {
    const source = read(file);
    const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'));
    if (start < 0) throw new Error(`Missing ${name} in ${file}`);
    const rest = source.slice(start);
    const end = rest.search(/^}/m);
    if (end < 0) throw new Error(`Missing closing brace for ${name} in ${file}`);
    vm.runInContext(rest.slice(0, end + 1), context, { filename: `${file}#${name}` });
}

module.exports = { root, read, runScript, runFunction };
