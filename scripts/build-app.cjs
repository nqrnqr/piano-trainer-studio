// Typecheck first, then publish deterministic browser bundles from memory.
// A failed check/build preserves the last working static output.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const esbuild=require('esbuild');
const root=fs.realpathSync(path.resolve(__dirname,'..'));
const check=process.argv.includes('--check'),watch=process.argv.includes('--watch');
function safe(file){
 const full=path.resolve(root,file);if(!full.startsWith(root+path.sep))throw Error('Outside workspace: '+full);
 let parent=full;while(!fs.existsSync(parent))parent=path.dirname(parent);
 const resolved=fs.realpathSync(parent);if(resolved!==root&&!resolved.startsWith(root+path.sep))throw Error('Resolved outside workspace: '+full);
 if(fs.existsSync(full)&&fs.lstatSync(full).isSymbolicLink())throw Error('Unexpected generated link: '+full);
 return full;
}
function files(directory){if(!fs.existsSync(directory))return [];return fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>{
 if(e.isSymbolicLink())throw Error('Unexpected generated link');const file=path.join(directory,e.name);return e.isDirectory()?files(file):[file];});}
function compile(config){const result=spawnSync(process.execPath,[require.resolve('typescript/bin/tsc'),'-p',config],{cwd:root,stdio:'inherit'});if(result.error)throw result.error;return result.status===0;}
async function build(){
 if(!compile('tsconfig.json')||!compile('tsconfig.test.json'))return false;
 const common={absWorkingDir:root,bundle:true,format:'iife',platform:'browser',target:'es2020',sourcemap:'linked',sourcesContent:true,write:false,logLevel:'warning'};
 const output=await Promise.all([
  esbuild.build({...common,entryPoints:['src/main.ts'],outfile:'js/generated/app.js'}),
  esbuild.build({...common,entryPoints:['src/testing/main.ts'],outfile:'docs/testing/generated/test-app.js'})
 ]);
 const expected=new Map(output.flatMap(result=>result.outputFiles.map(file=>[path.relative(root,file.path),Buffer.from(file.contents)])));
 const directories=['js/generated','docs/testing/generated'];
 for(const directory of directories)safe(directory);
 if(check){
  const actual=new Map(directories.flatMap(directory=>files(safe(directory)).map(file=>[path.relative(root,file),fs.readFileSync(file)])));
  const differences=[...new Set([...expected.keys(),...actual.keys()])].filter(file=>!expected.has(file)||!actual.has(file)||!expected.get(file).equals(actual.get(file)));
  let untracked=[];
  if(fs.existsSync(path.join(root,'.git'))){
   const inventory=spawnSync('git',['ls-files','--others','--exclude-standard','--',...directories],{cwd:root,encoding:'utf8'});
   if(inventory.error)throw inventory.error;
   if(inventory.status!==0)throw Error(inventory.stderr||'Could not inspect generated Git files.');
   untracked=inventory.stdout.trim().split(/\r?\n/).filter(Boolean);
  }
  if(differences.length||untracked.length){console.error('Generated output differs:',...differences,...untracked.map(f=>'untracked: '+f));return false;}
  console.log(`Browser bundles match a clean build (${expected.size} files).`);return true;
 }
 for(const directory of directories){const target=safe(directory);files(target);fs.rmSync(target,{recursive:true,force:true});fs.mkdirSync(target,{recursive:true});}
 for(const [file,content]of expected)fs.writeFileSync(safe(file),content);
 console.log(`Built production and separate test bundles (${expected.size} files).`);return true;
}
build().then(ok=>{
 if(!ok)process.exitCode=1;
 if(!watch)return;
 process.exitCode=0;let timer;
 const rebuild=()=>{clearTimeout(timer);timer=setTimeout(()=>{const result=spawnSync(process.execPath,[__filename],{cwd:root,stdio:'inherit'});if(result.error)console.error(result.error);},200);};
 for(const directory of ['src','types'])fs.watch(path.join(root,directory),{recursive:true},rebuild);
 for(const file of ['tsconfig.json','tsconfig.test.json'])fs.watch(path.join(root,file),rebuild);
 console.log('Watching source and type files; failed checks preserve the last build.');
}).catch(error=>{console.error(error);process.exitCode=1;});
