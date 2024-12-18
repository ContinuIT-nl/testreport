import { createTestReport } from './createTestReport.ts';
import { exit, getArguments } from './utilities/dependencies.ts';
import { checkTestReport } from './checkTestReport.ts';

if (import.meta.main) {
  const args = getArguments();
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
    exit(1);
  }
}
