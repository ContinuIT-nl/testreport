import { assertEquals } from '@std/assert';
import { checkTestReport } from '../src/checkTestReport.ts';
import { createTestReport } from '../src/createTestReport.ts';

Deno.test('checkTestReport', async () => {
  const create = await createTestReport('./test_data/deno_success/testreport.json');
  const check = await checkTestReport('./test_data/deno_success/testreport.json');
  assertEquals(create, true);
  assertEquals(check, true);
});
