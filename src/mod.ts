import { createTestReport } from './createTestReport.ts';
import { checkTestReport } from './checkTestReport.ts';
import * as process from 'node:process';

if (import.meta.main) {
  const args = process.argv.slice(2);
  console.log(args.join(', '));
  const check = args.includes('--check');
  const configFile = args[0];
  try {
    if (check) {
      await checkTestReport(configFile);
    } else {
      await createTestReport(configFile);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
