import { equal } from '@std/assert';
import { readTextFile } from './utilities/miscUtils.ts';
import { getConfigAndManifest } from './testReportToManifest.ts';

export async function checkTestReport(source: string) {
  const { config, manifest: manifestComputed } = await getConfigAndManifest(source);
  const manifestFromFile = JSON.parse(await readTextFile(config.output.manifest));
  const passed = equal(manifestComputed, manifestFromFile);
  return passed;
}
