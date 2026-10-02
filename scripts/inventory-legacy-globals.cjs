// A deliberately lexical inventory for classic scripts. References may include
// comments or local shadowing; ownership and side effects are reviewed in the MD.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const scripts = [...html.matchAll(/src="(js\/[^"?]+)\?v=/g)].map(match => match[1]);
const consumers = ['index.html', ...scripts, 'docs/testing/score-display.integration.js', 'docs/testing/practice-baseline.integration.js', 'docs/testing/settings-baseline.integration.js', 'docs/testing/traversal-baseline.integration.js', 'docs/testing/midi-baseline.integration.js'];
const sources = new Map(consumers.map(file => [file, read(file)]));
const definitions = [];
for (const file of ['index.html', ...scripts]) {
    const source = sources.get(file);
    for (const match of source.matchAll(/^(?:(async function|function|class|const|let|var)\s+([A-Za-z_$][\w$]*)|\s*(window\.[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*=(?!=))/gm)) {
        definitions.push({ symbol: match[2] || match[3], kind: match[1] || 'window assignment', file, line: source.slice(0, match.index).split('\n').length });
    }
}
const symbols = [...new Set(definitions.map(item => item.symbol))].sort().map(symbol => {
    const token = symbol.replace(/^window\./, '').split('.').at(-1);
    const pattern = new RegExp(`\\b${token}\\b`);
    return {
        symbol,
        definitions: definitions.filter(item => item.symbol === symbol),
        referenceFiles: consumers.filter(file => pattern.test(sources.get(file)))
    };
});
const inventory = {
    note: 'Lexical candidates, not an AST or call graph. Column-zero declarations and window assignments only; property definitions, destructuring, dynamic lookups, comments and shadowed references need review. Side effects are documented by file in GLOBAL_DEPENDENCIES.md. Generated scripts are runtime paths; consult PROGRESS.md for their TS sources.',
    loadOrder: scripts,
    symbols
};
fs.mkdirSync(path.join(root, 'docs/refactor'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/refactor/GLOBAL_SYMBOLS.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(`Recorded ${symbols.length} symbol candidates in ${scripts.length} classic scripts.`);
const duplicates = symbols.filter(item => item.definitions.length > 1 && item.definitions.every(definition => definition.kind === 'function'));
console.log('Duplicate function definitions:', duplicates.map(item => item.symbol).join(', '));
