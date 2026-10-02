// Compile to a fresh directory first. Never overwrite the checked-in runtime
// after a failed typecheck, and compare the full emitted tree in --check mode.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = fs.realpathSync(path.resolve(__dirname, '..'));
const cache = path.join(root, '.cache');
const generated = path.join(root, 'js/generated');
const check = process.argv.includes('--check');

function assertManagedPath(target) {
    const absolute = path.resolve(target);
    if (!absolute.startsWith(root + path.sep)) throw new Error(`Path outside workspace: ${absolute}`);
    let existing = absolute;
    while (!fs.existsSync(existing)) existing = path.dirname(existing);
    const resolved = fs.realpathSync(existing);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error(`Resolved path outside workspace: ${resolved}`);
    if (fs.existsSync(absolute) && fs.lstatSync(absolute).isSymbolicLink()) throw new Error(`Refusing symlink: ${absolute}`);
    return absolute;
}

function files(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        if (entry.isSymbolicLink()) throw new Error(`Unexpected generated symlink: ${entry.name}`);
        const full = path.join(directory, entry.name);
        return entry.isDirectory() ? files(full) : [full];
    }).sort();
}

assertManagedPath(cache);
fs.mkdirSync(cache, { recursive: true });
// Same depth as js/generated keeps relative source-map paths identical.
const temporary = fs.mkdtempSync(path.join(cache, 'legacy-build-'));
try {
    const compile = spawnSync(process.execPath, [
        require.resolve('typescript/bin/tsc'), '-p', 'tsconfig.legacy.json', '--outDir', temporary
    ], { cwd: root, stdio: 'inherit' });
    if (compile.error) throw compile.error;
    if (compile.status !== 0) {
        process.exitCode = compile.status || 1;
    } else if (check) {
        assertManagedPath(generated);
        const expected = new Map(files(temporary).map(file => [path.relative(temporary, file), fs.readFileSync(file)]));
        const actual = new Map(files(generated).map(file => [path.relative(generated, file), fs.readFileSync(file)]));
        const differences = [...new Set([...expected.keys(), ...actual.keys()])].filter(file =>
            !expected.has(file) || !actual.has(file) || !expected.get(file).equals(actual.get(file))
        );
        let untracked = [];
        // Static release ZIPs may have no Git metadata. In a checkout, also
        // catch valid new emitted files that were never added to the delivery.
        if (fs.existsSync(path.join(root, '.git'))) {
            const inventory = spawnSync('git', ['ls-files', '--others', '--exclude-standard', '--', 'js/generated'], { cwd: root, encoding: 'utf8' });
            if (inventory.error) throw inventory.error;
            if (inventory.status !== 0) throw new Error(inventory.stderr || 'Could not inspect generated Git files.');
            untracked = inventory.stdout.trim().split(/\r?\n/).filter(Boolean);
        }
        if (differences.length || untracked.length) {
            console.error('Generated output differs (missing, changed or extra files):');
            for (const file of differences) console.error(`  ${file}`);
            for (const file of untracked) console.error(`  untracked: ${file}`);
            console.error('Run npm run build and commit the generated output.');
            process.exitCode = 1;
        } else {
            console.log(`Generated output matches a clean build (${expected.size} files).`);
        }
    } else {
        // This directory is exclusively compiler-owned. Validate the resolved
        // target before recursive deletion, including Windows junctions.
        assertManagedPath(generated);
        files(generated); // Reject unexpected links before deleting the tree.
        fs.rmSync(generated, { recursive: true, force: true });
        fs.cpSync(temporary, generated, { recursive: true });
        console.log(`Built ${files(generated).length} files in js/generated.`);
    }
} finally {
    assertManagedPath(temporary);
    fs.rmSync(temporary, { recursive: true, force: true });
}
