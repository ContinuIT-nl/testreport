import { checkTestReport } from '../src/checkTestReport.ts';

Deno.test('checkTestReport', () => {
  checkTestReport('test/testReport.yaml');
});
