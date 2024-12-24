import { assertEquals } from '@std/assert';
import { execute } from '../src/execute.ts';

Deno.test('execute help ', async () => {
  const result = await execute(['--help']);
  assertEquals(result, 0);
});

Deno.test('execute create', async () => {
  const result = await execute(['test_results/testReport.json']);
  assertEquals(result, 0);
});

Deno.test('execute create invalidConfig', async () => {
  const result = await execute(['invalid/testReport.json']);
  assertEquals(result, 1);
});

Deno.test('execute check', async () => {
  const result = await execute(['--check', 'test_results/testReport.json']);
  assertEquals(result, 0);
});
