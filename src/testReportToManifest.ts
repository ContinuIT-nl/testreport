import { percentage, percentageNoZero } from './utilities/miscUtils.ts';
import { getTestReportData, type GetTestReportDataResult } from './testReportData.ts';

const convertTestresultsToManifest = (data: GetTestReportDataResult) => {
  const { source, config, jUnitData, lcovDatas, lcovSummary, failures } = data;

  const test_total = jUnitData.tests;
  const test_skipped = jUnitData.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const test_failed = jUnitData.failures + jUnitData.errors;
  const test_passed = jUnitData.tests - test_failed - test_skipped;
  const test_status = test_total === 0 ? 'no tests' : test_failed ? 'failed' : test_skipped ? 'skipped' : 'passed';

  const coverage_lines = lcovSummary.linesFound ? (lcovSummary.linesHit / lcovSummary.linesFound) * 100 : undefined;
  const coverage_branches = lcovSummary.branchesFound
    ? (lcovSummary.branchesHit / lcovSummary.branchesFound) * 100
    : undefined;
  const coverages = [coverage_lines, coverage_branches].filter((c) => c !== undefined);
  const coverage_percentage = coverages.length !== 0 ? `${Math.min(...coverages).toFixed(1)}%` : 'N/A';
  const coverage = coverages.length !== 0 ? Math.min(...coverages) : 0;

  const levels = config.coverageBadge?.levels ?? [{ threshold: 0, color: '#555' }];
  // todo: add test for following 2 lines
  const coverage_color = levels.find((level) => level.threshold <= coverage)?.color ?? '#555';

  const limits = config.limits ?? {
    test_percentage_failed: 0,
    test_percentage_disabled: 0,
    coverage_percentage_minimal: 0,
  };

  if (coverage < limits.coverage_percentage_minimal) {
    failures.push({
      type: 'coverage',
      message: `Coverage is below the minimal threshold of ${limits.coverage_percentage_minimal}%`,
      file: '',
    });
  }

  if (test_failed > limits.test_percentage_failed * 0.01 * test_total) {
    failures.push({
      type: 'junit',
      message: `Test failed is above the limit of ${limits.test_percentage_failed}%`,
      file: '',
    });
  }

  if (test_skipped > limits.test_percentage_disabled * 0.01 * test_total) {
    failures.push({
      type: 'test',
      message: `Test skipped is above the limit of ${limits.test_percentage_disabled}%`,
      file: '',
    });
  }

  return {
    // Source
    source,
    failures,

    // Test results
    testsuites_total: jUnitData.testSuites.length,
    test_total,
    test_passed,
    test_failed,
    test_skipped,
    test_status,
    test_percentage: percentage(test_passed, test_total),

    // Test results details
    test_details: jUnitData.testSuites.map((suite) =>
      suite.testCases.map((test) => ({ suite: suite.name, test: test.name, state: test.state }))
    ).flat(),

    // Code coverage
    coverage_lines_total: lcovSummary.linesFound,
    coverage_lines_hit: lcovSummary.linesHit,
    coverage_lines_percentage: percentageNoZero(lcovSummary.linesHit, lcovSummary.linesFound),
    coverage_branches_total: lcovSummary.branchesFound,
    coverage_branches_hit: lcovSummary.branchesHit,
    coverage_branches_percentage: percentageNoZero(lcovSummary.branchesHit, lcovSummary.branchesFound),
    coverage_percentage,
    coverage_color,
    // Code coverage details
    coverage_details: lcovDatas.map((file) => ({
      name: file.filename,
      lines_total: file.linesFound,
      lines_hit: file.linesHit,
      lines_percentage: percentageNoZero(file.linesHit, file.linesFound),
      branches_total: file.branchesFound,
      branches_hit: file.branchesHit,
      branches_percentage: percentageNoZero(file.branchesHit, file.branchesFound),
    })),
  };
};

export type Manifest = ReturnType<typeof convertTestresultsToManifest>;

export const getConfigAndManifest = async (source: string) => {
  const data = await getTestReportData(source);
  const config = data.config;
  const manifest = convertTestresultsToManifest(data);
  return { config, manifest };
};
