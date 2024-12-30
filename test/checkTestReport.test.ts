import { assertEquals } from '@std/assert';
import { checkTestReport } from '../src/checkTestReport.ts';
import { createTestReport } from '../src/createTestReport.ts';

Deno.test('checkTestReport', async () => {
  const create = await createTestReport('./test_data/deno_success/testreport.json');
  const check = await checkTestReport('./test_data/deno_success/testreport.json');
  assertEquals(create, true);
  assertEquals(check, true);
});

Deno.test('checkTestReport_no_manifest', async () => {
  const create = await createTestReport('./test_data/vitest/testreport.json');
  const check = await checkTestReport('./test_data/vitest/testreport.json');
  assertEquals(create, true);
  assertEquals(check, false);
});

Deno.test('checkTestReport_failure', async () => {
  const create = await createTestReport('./test_data/invalid_input/testreport.json');
  const check = await checkTestReport('./test_data/invalid_input/testreport.json');
  assertEquals(create, false);
  assertEquals(check, false);
});
