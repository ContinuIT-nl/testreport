import { build, stop } from 'npm:esbuild@0.20.2';
import { denoPlugins } from 'jsr:@luca/esbuild-deno-loader@^0.11.1';
import { toJsonSchema } from 'jsr:@valibot/to-json-schema@0.2.1';
import { testReportConfigSchema } from './src/testReportConfig.ts';

await Deno.mkdir('npm', { recursive: true });

const result = await build({
  plugins: [...denoPlugins()],
  entryPoints: ['./src/mod.ts'],
  outfile: './npm/bundle.mjs',
  bundle: true,
  format: 'esm',
  minify: true,
  sourcemap: true,
});

console.log('build result', result.outputFiles);

await stop();

// copy over README.md and LICENSE
await Deno.copyFile('README.md', 'npm/README.md');
await Deno.copyFile('LICENSE', 'npm/LICENSE');

// Read in deno.json and generate a package.json
const denoJsonText = await Deno.readTextFile('deno.json');
const denoJson = JSON.parse(denoJsonText);
const packageJson = {
  name: denoJson.name,
  version: denoJson.version,
  description: denoJson.description,
  keywords: denoJson.keywords,
  author: denoJson.author,
  license: denoJson.license,
  type: 'commonjs',
  homepage: denoJson.homepage,
  repository: denoJson.repository,
  bin: {
    testreport: './bundle.mjs',
  },
  main: './bundle.mjs',
  files: [
    'README.md',
    'LICENSE',
    'bundle.mjs',
    'bundle.mjs.map',
    'test_results/test_badge.svg',
    'test_results/coverage_badge.svg',
  ],
};
await Deno.writeTextFile('npm/package.json', JSON.stringify(packageJson, null, 2));

await Deno.mkdir('npm/test_results', { recursive: true });
await Deno.copyFile('./test_results/test_badge.svg', 'npm/test_results/test_badge.svg');
await Deno.copyFile('./test_results/coverage_badge.svg', 'npm/test_results/coverage_badge.svg');

// Also build the JSON Schema
const schema = toJsonSchema(testReportConfigSchema);
await Deno.writeTextFile('configSchema/testReportConfigSchema.json', JSON.stringify(schema, null, 2));

console.log('build complete');
