import { createTestReport } from './createTestReport.ts';
import { checkTestReport } from './checkTestReport.ts';
import * as process from 'node:process';

type GetArguments = () => string[];
type Exit = (code: number) => void;

const getArguments: GetArguments = () => process.argv.slice(2);
const exit: Exit = (code: number) => process.exit(code);

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
