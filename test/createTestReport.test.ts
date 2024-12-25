import { assert } from '@std/assert';
import { createTestReport } from '../src/createTestReport.ts';

Deno.test('testreport_deno_success', async () => {
  await createTestReport('./test_data/deno_success/testreport.json');
});

Deno.test('testreport_deno_failed', async () => {
  await createTestReport('./test_data/deno_failed/testreport.json');
});

Deno.test('testreport_deno_disabled', async () => {
  await createTestReport('./test_data/deno_disabled/testreport.json');
});

Deno.test('testreport_jest', async () => {
  await createTestReport('./test_data/jest/testreport.json');
});

Deno.test('testreport_vitest', async () => {
  await createTestReport('./test_data/vitest/testreport.json');
});

Deno.test('testreport_no_tests', async () => {
  await createTestReport('./test_data/no_tests/testreport.json');
});

Deno.test('testreport_tests_invalid_definition', async () => {
  try {
    await createTestReport('./test_data/invalid_definition/testreport.json');
  } catch (e) {
    assert(e instanceof Error);
    assert(e.message.includes('Error reading file'));
  }
});

Deno.test('testreport_tests_invalid_input', async () => {
  await createTestReport('./test_data/invalid_input/testreport.json');
});

Deno.test('testreport_tests_invalid_output', async () => {
  try {
    await createTestReport('./test_data/invalid_output/testreport.json');
  } catch (e) {
    assert(e instanceof Error);
    assert(e.message.includes('Error writing file'));
  }
});
