import { createTestReport } from './testReport.ts';

if (import.meta.main) {
  try {
    await createTestReport('./test_results/testreport.json');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}
