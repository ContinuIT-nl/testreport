import { equal } from '@std/assert';
import { readTextFile } from './utilities/miscUtils.ts';
import { getConfigAndManifest } from './testReportToManifest.ts';

export async function checkTestReport(source: string): Promise<boolean> {
  const { config, manifest: manifestComputed } = await getConfigAndManifest(source);
  if (!config.manifest?.output) {
    console.error('No manifest output specified. Unable to check test report.');
    return false;
  }
  if (manifestComputed.failures.length > 0) {
    console.error('Test report contains failures. Unable to check test report:');
    console.error(manifestComputed.failures.map((failure) => failure.message).join('\n'));
    return false;
  }
  const manifestFromFile = JSON.parse(await readTextFile(config.manifest?.output));
  const passed = equal(manifestComputed, manifestFromFile);
  return passed;
}
