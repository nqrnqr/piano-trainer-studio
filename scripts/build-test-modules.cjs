// Unit tests run the actual module exports in their own VM/native port fixtures.
// This CommonJS output is development-only and never part of the static app.
const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
const root=fs.realpathSync(path.resolve(__dirname,'..'));
function files(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>{
 if(e.isSymbolicLink())throw Error('Unexpected source link');const file=path.join(directory,e.name);return e.isDirectory()?files(file):file.endsWith('.ts')?[file]:[];});}
const target=path.resolve(root,'.cache/test-modules');
const parent=fs.realpathSync(path.dirname(target));if(!target.startsWith(root+path.sep)||parent!==path.join(root,'.cache'))throw Error('Invalid unit output path');
if(fs.existsSync(target)&&fs.lstatSync(target).isSymbolicLink())throw Error('Unexpected unit output link');
fs.rmSync(target,{recursive:true,force:true});
esbuild.buildSync({absWorkingDir:root,entryPoints:files(path.join(root,'src')),outbase:'src',outdir:target,
 format:'cjs',platform:'node',target:'node22',bundle:false,logLevel:'warning'});
