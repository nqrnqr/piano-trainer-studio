const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {root}=require('../helpers/legacy-script.cjs');

test('unit module preparation works in a fresh checkout and replaces its stale output',t=>{
 // Keep the native bundler's parent-directory reads inside the project sandbox.
 const tempRoot=fs.realpathSync(path.join(root,'.cache'));
 const fixture=fs.mkdtempSync(path.join(tempRoot,'pt-module-build-'));
 t.after(()=>{
  const resolved=fs.realpathSync(fixture);
  if(!resolved.startsWith(tempRoot+path.sep))throw Error('Unexpected fixture cleanup path');
  fs.rmSync(resolved,{recursive:true,force:true});
 });
 fs.mkdirSync(path.join(fixture,'scripts'));fs.mkdirSync(path.join(fixture,'src'));
 const script=path.join(fixture,'scripts/build-test-modules.cjs');
 fs.copyFileSync(path.join(root,'scripts/build-test-modules.cjs'),script);
 const source=path.join(fixture,'src/fixture.ts');
 fs.writeFileSync(source,'export const note = {midi:60, down:true};\n');
 const run=()=>execFileSync(process.execPath,[script],{cwd:fixture,env:{...process.env,NODE_PATH:path.join(root,'node_modules')}});
 assert.equal(fs.existsSync(path.join(fixture,'.cache')),false);
 run();
 const output=path.join(fixture,'.cache/test-modules/fixture.js');
 const observed=execFileSync(process.execPath,['-e',`process.stdout.write(JSON.stringify(require(${JSON.stringify(output)}).note))`],{encoding:'utf8'});
 assert.deepEqual(JSON.parse(observed),{midi:60,down:true});
 const stale=path.join(fixture,'.cache/test-modules/stale.js');fs.writeFileSync(stale,'stale');
 fs.writeFileSync(source,'export const note = {midi:62, down:false};\n');run();
 assert.equal(fs.existsSync(stale),false);
 const rebuilt=execFileSync(process.execPath,['-e',`process.stdout.write(JSON.stringify(require(${JSON.stringify(output)}).note))`],{encoding:'utf8'});
 assert.deepEqual(JSON.parse(rebuilt),{midi:62,down:false});
});
