import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: [`admin/components/RenderJSON.tsx`],
  platform: 'node',
  loader: {'.node': 'file'},
  outfile: `dist/RenderJSON.js`,
});
