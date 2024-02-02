import * as esbuild from 'esbuild';

const result = await esbuild.build({
  entryPoints: ['./src/index.jsx'],
  bundle: true,
  outdir: './build/static',
  loader: {
    '.png': 'dataurl',
    '.woff': 'dataurl',
    '.woff2': 'dataurl',
    '.eot': 'dataurl',
    '.ttf': 'dataurl',
    '.svg': 'dataurl',
  }
});

console.log(result);
