import * as process from 'node:process';
import { execute } from './execute.ts';

if (import.meta.main) {
  process.exit(await execute(process.argv.slice(2)));
}
