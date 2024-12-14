import { createTestReport } from './testReport.ts';


function checkTestReport(_configFile: string) {
  console.log('Checking test report');
}

if (import.meta.main) {
  const args = Deno.args;
  console.log(args);
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
    Deno.exit(1);
  }
}
