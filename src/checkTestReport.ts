import { getTestReportData } from './testReportData.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { equal } from '@std/assert';
import { readTextFile } from './utilities/miscUtils.ts';

export async function checkTestReport(reportDefinitionFilename: string) {
  const data = await getTestReportData(reportDefinitionFilename);
  const manifestComputed = convertTestresultsToManifest(data);
  const manifestFromFile = JSON.parse(await readTextFile(data.reportConfig.output.manifest));
  if (!equal(manifestComputed, manifestFromFile)) {
    console.error('Manifest does not match computed manifest');
    console.log(manifestComputed);
    console.log(manifestFromFile);
  }
}
