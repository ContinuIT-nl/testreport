import { assert } from '@std/assert';
import { createTestReport } from '../src/createTestReport.ts';

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

Deno.test('testReport_vitest', async () => {
  const testReport = await createTestReport('./test_data/vitest/testreport.json');
  console.log(testReport);
});

Deno.test('testReport_no_tests', async () => {
  const testReport = await createTestReport('./test_data/no_tests/testreport.json');
  console.log(testReport);
});

Deno.test('testReport_tests_invalid_input', async () => {
  const testReport = await createTestReport('./test_data/no_tests/testreport_invalid_input.json');
  console.log(testReport);
});

Deno.test('testReport_tests_invalid_output', async () => {
  try {
    const testReport = await createTestReport('./test_data/no_tests/testreport_invalid_output.json');
    console.log(testReport);
  } catch (e) {
    assert(e instanceof Error);
    assert(e.message.includes('Error writing file'));
  }
});
