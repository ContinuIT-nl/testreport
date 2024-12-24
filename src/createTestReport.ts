import { exportOutput } from './utilities/miscUtils.ts';
import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { createCoverageBadge, createTestBadge } from './testReportToBadges.ts';
import { getConfigAndManifest } from './testReportToManifest.ts';

export async function createTestReport(source: string): Promise<boolean> {
  const { config, manifest } = await getConfigAndManifest(source);
  await exportOutput(config.output.markdown, () => convertTestresultsToMarkdown(manifest));
  await exportOutput(config.output.manifest, () => JSON.stringify(manifest, null, 2));
  await exportOutput(config.output.testBadge, () => createTestBadge(config, manifest));
  await exportOutput(config.output.coverageBadge, () => createCoverageBadge(config, manifest));
  return true;
}
