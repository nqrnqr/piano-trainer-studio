const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function sourceFiles(directory) {
    return fs.readdirSync(path.join(root, directory), {withFileTypes:true}).flatMap(entry => {
        const file = `${directory}/${entry.name}`;
        return entry.isDirectory() ? sourceFiles(file) : file.endsWith('.ts') ? [file] : [];
    });
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const legacyFiles = [...html.matchAll(/src="(js\/[^"?]+)\?v=/g)]
    .map(match => match[1]).filter(file => !file.startsWith('js/generated/'));
const files = [...sourceFiles('src'), ...legacyFiles];
const writes = [];
for (const file of files) {
    const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true);
    const record = (node, target, operation) => {
        if (!/^AppState(?:\.|\[)/.test(target)) return;
        writes.push({ file, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1, target, operation });
    };
    function visit(node) {
        if (ts.isBinaryExpression(node) && node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && node.operatorToken.kind <= ts.SyntaxKind.LastAssignment) record(node, node.left.getText(source), node.operatorToken.getText(source));
        if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) {
            if (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken) record(node, node.operand.getText(source), 'increment/decrement');
        }
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
            if (['set', 'delete', 'clear', 'add', 'push', 'pop', 'shift', 'unshift', 'splice', 'sort'].includes(node.expression.name.text)) record(node, node.expression.expression.getText(source), node.expression.name.text);
        }
        ts.forEachChild(node, visit);
    }
    visit(source);
}
const header = `# AppState 直接写入位置\n\n由 \`node scripts/inventory-state-writes.cjs\` 重建。扫描赋值、增减及容器变更调用。\n这不是完整调用图；对象通过局部别名或函数返回值修改的补充所有权说明见 STATE_OWNERSHIP.md。\n默认字段初始化在 src/state/app-state.ts，运行中追加的 5 字段保持 optional。\n\n| 位置 | 目标 | 操作 |\n| --- | --- | --- |\n`;
fs.writeFileSync(path.join(root, 'docs/refactor/STATE_WRITES.md'), header + writes.map(w => `| ${w.file}:${w.line} | ${w.target.replaceAll('|', '\\|')} | ${w.operation} |`).join('\n') + '\n');
console.log(`Recorded ${writes.length} direct state writes.`);
