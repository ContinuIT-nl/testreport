import { assertEquals } from '@std/assert';
import { execute } from '../src/execute.ts';
import { getConfigAndManifest } from '../src/testReportToManifest.ts';
import { createTestReport } from '../src/createTestReport.ts';
import { exportOutput } from '../src/utilities/miscUtils.ts';

Deno.test('execute help ', async () => {
  const result = await execute(['--help']);
  assertEquals(result, 0);
});

Deno.test('execute create', async () => {
  const result = await execute(['test_results/testreport.json']);
  assertEquals(result, 0);
});

Deno.test('execute create invalidConfig', async () => {
  const result = await execute(['invalid/testreport.json']);
  assertEquals(result, 1);
});

Deno.test('execute check', async () => {
  const result = await execute(['--check', 'test_results/testreport.json']);
  assertEquals(result, 0);
});

Deno.test('execute check unequal', async () => {
  const source = 'test_results/testreport.json';
  const { config, manifest } = await getConfigAndManifest(source);
  // Sneaky: mutate state on disk
  await createTestReport(source);
  manifest.test_total++;
  await exportOutput(config.manifest?.output, () => JSON.stringify(manifest, null, 2));
  // The comparison should fail, returning 1
  const result = await execute(['--check', source]);
  assertEquals(result, 1);
});
