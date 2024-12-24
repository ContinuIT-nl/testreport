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

  // Show help?
  if (args.help || args._?.length !== 1) {
    console.log(`
Usage:
  test-report [options] <config-file>

Options:
  -c, --check  Check the test report. If omitted, the test report is created.
  -h, --help   Show help.
`);
    return 0;
  }

  // Perform requested action
  try {
    const configFile = `${args._[0]}`;
    const command: Command = args.check ? checkTestReport : createTestReport;
    // Convert success to 0, failure to 1 as exit code
    return await command(configFile) ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
};
