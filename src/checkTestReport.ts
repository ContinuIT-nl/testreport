import { getTestReportData } from './testReportData.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { equal } from '@std/assert';
import { readTextFile } from './utilities/miscUtils.ts';

export async function checkTestReport(reportDefinitionFilename: string) {
  const data = await getTestReportData(reportDefinitionFilename);
  const manifestComputed = convertTestresultsToManifest(data);
  const manifestFromFile = JSON.parse(await readTextFile(data.config.output.manifest));
  const passed = equal(manifestComputed, manifestFromFile);
  return passed;
}
