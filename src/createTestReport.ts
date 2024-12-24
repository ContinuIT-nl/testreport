import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { createCoverageBadge, createTestBadge } from './testReportToBadges.ts';
import { getTestReportData } from './testReportData.ts';
import { exportOutput } from './utilities/miscUtils.ts';

export async function createTestReport(reportDefinitionFilename: string) {
  const data = await getTestReportData(reportDefinitionFilename);
  const manifest = convertTestresultsToManifest(data);
  await exportOutput(data.config.output.markdown, () => convertTestresultsToMarkdown(manifest));
  await exportOutput(data.config.output.manifest, () => JSON.stringify(manifest, null, 2));
  await exportOutput(data.config.output.testBadge, () => createTestBadge(data.config, manifest));
  await exportOutput(data.config.output.coverageBadge, () => createCoverageBadge(data.config, manifest));
}
