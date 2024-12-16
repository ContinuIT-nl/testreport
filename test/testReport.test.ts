import { createTestReport } from '../src/testReport.ts';

Deno.test('testReport_deno_success', async () => {
  const testReport = await createTestReport('./test_data/deno_success/testreport.json');
  console.log(testReport);
});

Deno.test('testReport_deno_failed', async () => {
  const testReport = await createTestReport('./test_data/deno_failed/testreport.json');
  console.log(testReport);
});

Deno.test('testReport_deno_disabled', async () => {
  const testReport = await createTestReport('./test_data/deno_disabled/testreport.json');
  console.log(testReport);
});

Deno.test('testReport_jest', async () => {
  const testReport = await createTestReport('./test_data/jest/testreport.json');
  console.log(testReport);
});
