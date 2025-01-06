import * as process from 'node:process';
import { execute } from './execute.ts';

execute(process.argv.slice(2)).then((exitCode) => {
  process.exit(exitCode);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
