import { createTestReport } from '../src/testReport.ts';

Deno.test('testReport_deno', async () => {
  const testReport = await createTestReport('./test_data/deno/testreport.json');
  console.log(testReport);
});

Deno.test('testReport_jest', async () => {
  const testReport = await createTestReport('./test_data/jest/testreport.json');
  console.log(testReport);
});
