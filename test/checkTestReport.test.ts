import { checkTestReport } from '../src/checkTestReport.ts';
import { createTestReport } from '../src/createTestReport.ts';

Deno.test('checkTestReport', async () => {
  await createTestReport('./test_data/deno_success/testreport.json');
  await checkTestReport('./test_data/deno_success/testReport.json');
});
