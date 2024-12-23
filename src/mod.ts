import { createTestReport } from './createTestReport.ts';
import { checkTestReport } from './checkTestReport.ts';
import { parseArgs } from '@std/cli/parse-args';
import * as process from 'node:process';

if (import.meta.main) {
  // Parse arguments
  const args = parseArgs(process.argv.slice(2), {
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
    process.exit(1);
  }

  // And execute
  try {
    const configFile = `${args._[0]}`;
    const check = !!args.check;
    const result = await (check ? checkTestReport : createTestReport)(configFile) ?? false;
    // todo: createTestReport should return a boolean if all is successful
    process.exit(result ? 0 : 1);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
