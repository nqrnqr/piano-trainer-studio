// A deliberately lexical inventory for classic scripts. References may include
// comments or local shadowing; ownership and side effects are reviewed in the MD.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
function sourceFiles(directory) {
    return fs.readdirSync(path.join(root, directory), {withFileTypes:true}).flatMap(entry => {
        const file = `${directory}/${entry.name}`;
        if (file === 'src/testing') return [];
        return entry.isDirectory() ? sourceFiles(file) : file.endsWith('.ts') ? [file] : [];
    });
}
const modules = sourceFiles('src').map(file => {
    const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
    const imports = source.statements.filter(ts.isImportDeclaration).map(node => ({
        source:node.moduleSpecifier.text, typeOnly:node.importClause?.isTypeOnly ?? false,
        bindings:node.importClause?.getText(source) ?? ''
    }));
    const exports = source.statements.filter(node => node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)).flatMap(node => {
        if (node.name) return [node.name.getText(source)];
        return ts.isVariableStatement(node) ? node.declarationList.declarations.map(d => d.name.getText(source)) : [];
    });
    return {file, imports, exports:[...new Set(exports)]};
});
const scripts = [...html.matchAll(/src="(js\/[^"?]+)\?v=/g)].map(match => match[1]);
const consumers = ['index.html', ...scripts, 'docs/testing/score-display.integration.js', 'docs/testing/practice-baseline.integration.js', 'docs/testing/settings-baseline.integration.js', 'docs/testing/traversal-baseline.integration.js', 'docs/testing/midi-baseline.integration.js', 'docs/testing/audio-baseline.integration.js', 'docs/testing/render-baseline.integration.js', 'docs/testing/input-baseline.integration.js', 'docs/testing/metronome-baseline.integration.js', 'docs/testing/playback-baseline.integration.js'];
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
    note: 'Runtime candidates remain lexical, not a call graph; module imports/exports are parsed from the production TS source tree. Application instances stay private to the IIFE. The separate testing source tree is excluded. Init/dispose order and vendor/optional exceptions are documented in GLOBAL_DEPENDENCIES.md.',
    loadOrder: scripts,
    modules,
    symbols
};
fs.mkdirSync(path.join(root, 'docs/refactor'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/refactor/GLOBAL_SYMBOLS.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(`Recorded ${symbols.length} runtime candidates, ${scripts.length} static app slots and ${modules.length} ES source modules.`);
const duplicates = symbols.filter(item => item.definitions.length > 1 && item.definitions.every(definition => definition.kind === 'function'));
console.log('Duplicate function definitions:', duplicates.map(item => item.symbol).join(', '));
