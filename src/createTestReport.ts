import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import type { TestReportConfig } from './testReportConfig.ts';
import { createBadgeSvg } from './utilities/createBadgeSvg.ts';
import { exportOutput } from './utilities/miscUtils.ts';
import type { LcovSummary } from './utilities/lcov_parser.ts';
import type { TestSuites } from './utilities/junit_parser.ts';
import { getTestReportData } from './testReportData.ts';

function createTestBadge(jUnitData: TestSuites, reportConfig: TestReportConfig): string {
  // Collect data
  const total = jUnitData.tests;
  const disabled = jUnitData.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const errors = jUnitData.errors + jUnitData.failures;
  const passed = total - disabled - errors;

  const status = total === 0
    ? 'no tests'
    : passed === total
    ? `${passed}/${total} passed`
    : errors
    ? `${errors}/${total} failed`
    : `${disabled}/${total} disabled`;

  const color = total === 0
    ? reportConfig.constants.test_message_color_failed
    : passed === total
    ? reportConfig.constants.test_message_color_ok
    : errors
    ? reportConfig.constants.test_message_color_failed
    : reportConfig.constants.test_message_color_disabled;

  return createBadgeSvg({
    label: reportConfig.constants.test_label,
    message: status,
    labelColor: reportConfig.constants.test_label_color,
    messageColor: color,
    rounded: reportConfig.constants.test_rounded,
  });
}

function createCoverageBadge(lcovSummary: LcovSummary, reportConfig: TestReportConfig): string {
  const coverageByLines = lcovSummary.linesFound ? (lcovSummary.linesHit / lcovSummary.linesFound) * 100 : undefined;
  const coverageByBranches = lcovSummary.branchesFound
    ? (lcovSummary.branchesHit / lcovSummary.branchesFound) * 100
    : undefined;
  const coverages = [coverageByLines, coverageByBranches].filter((c) => c !== undefined);
  const coveragePercentage = coverages.length === 0 ? undefined : Math.min(...coverages);
  const coveragePercentageText = coveragePercentage !== undefined ? `${coveragePercentage.toFixed(1)}%` : 'N/A';

  return createBadgeSvg({
    label: reportConfig.constants.coverage_label,
    message: coveragePercentageText,
    labelColor: reportConfig.constants.coverage_label_color,
    messageColor: coveragePercentage !== undefined && coveragePercentage >= reportConfig.constants.coverage_threshold
      ? reportConfig.constants.coverage_message_color_ok
      : reportConfig.constants.coverage_message_color_failed,
    rounded: reportConfig.constants.coverage_rounded,
  });
}

export async function createTestReport(reportDefinitionFilename: string) {
  const data = await getTestReportData(reportDefinitionFilename);
  const manifest = convertTestresultsToManifest(data);
  await exportOutput(data.reportConfig.output.markdown, () => convertTestresultsToMarkdown(data));
  await exportOutput(data.reportConfig.output.manifest, () => JSON.stringify(manifest, null, 2));
  await exportOutput(data.reportConfig.output.testBadge, () => createTestBadge(data.jUnitData, data.reportConfig));
  await exportOutput(
    data.reportConfig.output.coverageBadge,
    () => createCoverageBadge(data.lcovSummary, data.reportConfig),
  );
}
