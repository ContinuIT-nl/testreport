import { createTestReport } from './createTestReport.ts';
import { checkTestReport } from './checkTestReport.ts';
import { parseArgs } from '@std/cli/parse-args';

type Command = (source: string) => Promise<boolean>;

export const execute = async (cmdLineArguments: string[]): Promise<number> => {
  // Parse arguments
  const args = parseArgs(cmdLineArguments, {
    alias: {
      c: 'check',
      h: 'help',
    },
  });

  const check = !!args.check;
  const configFile = check ? args.check : args._[0];

  // Show help?
  if (args.help || !configFile) {
    console.log(`
Usage:
  testreport [options] <config-file>

Options:
  -c, --check  Check the test report. If omitted, the test report is created.
  -h, --help   Show help.

Example:
  testreport -c test-report.json
  testreport test-report.json
`);
    return 0;
  }

  // Perform requested action
  try {
    console.log(`Executing ${check ? 'check' : 'create'} test report for ${configFile}`);
    const command: Command = check ? checkTestReport : createTestReport;
    const result = await command(configFile);
    console.log(`${check ? 'Check' : 'Create'} test report ${result ? 'succeeded' : 'failed'}`);
    // Convert success to 0, failure to 1 as exit code
    return result ? 0 : 1;
  } catch (error) {
    console.error((error as Error).message);
    return 1;
  }
};
