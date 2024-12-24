import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { createCoverageBadge, createTestBadge } from './testReportToBadges.ts';
import { getTestReportData } from './testReportData.ts';
import { exportOutput } from './utilities/miscUtils.ts';

export async function createTestReport(reportDefinitionFilename: string) {
  const data = await getTestReportData(reportDefinitionFilename);
  const manifest = convertTestresultsToManifest(data);
  await exportOutput(data.reportConfig.output.markdown, () => convertTestresultsToMarkdown(data));
  await exportOutput(data.reportConfig.output.manifest, () => JSON.stringify(manifest, null, 2));
  await exportOutput(data.reportConfig.output.testBadge, () => createTestBadge(data.reportConfig, manifest));
  await exportOutput(data.reportConfig.output.coverageBadge, () => createCoverageBadge(data.reportConfig, manifest));
}
