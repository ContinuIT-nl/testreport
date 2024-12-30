import { exportOutput } from './utilities/miscUtils.ts';
import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { createCoverageBadge, createTestBadge } from './testReportToBadges.ts';
import { getConfigAndManifest } from './testReportToManifest.ts';

export async function createTestReport(source: string): Promise<boolean> {
  const { config, manifest } = await getConfigAndManifest(source);
  await exportOutput(config.markdown?.output, () => convertTestresultsToMarkdown(config, manifest));
  await exportOutput(config.manifest?.output, () => JSON.stringify(manifest, null, 2));
  await exportOutput(config.testBadge?.output, () => createTestBadge(config.testBadge!, manifest));
  await exportOutput(config.coverageBadge?.output, () => createCoverageBadge(config.coverageBadge!, manifest));
  if (manifest.failures.length > 0) {
    console.error('Creating test report failed:');
    console.error(manifest.failures.join('\n'));
    return false;
  }
  return true;
}
