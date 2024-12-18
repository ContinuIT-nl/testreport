import { createTestReport } from './testReport.ts';
import { exit, getArguments } from './dependencies.ts';

function checkTestReport(_configFile: string) {
  console.log('Checking test report'); // todo: implement this.
}

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
