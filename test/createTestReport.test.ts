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
  // Test does not output manifest so no check can be done
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
  // Test if input files cannot be read by passing an invalid path
  await createTestReport('./test_data/invalid_input/testreport.json');
});

Deno.test('testreport_tests_invalid_output', async () => {
  // Test if output files cannot be written by passing an invalid path
  // Also: we do not specify coverageBadge, to validate that code path
  try {
    await createTestReport('./test_data/invalid_output/testreport.json');
  } catch (e) {
    assert(e instanceof Error);
    assert(e.message.includes('Error writing file'));
  }
});
