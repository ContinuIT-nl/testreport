import { percentage, percentageNoZero } from './utilities/miscUtils.ts';
import type { GetTestReportDataResult } from './testReportData.ts';

export const convertTestresultsToManifest = (data: GetTestReportDataResult) => {
  const { jUnitData, lcovSummary } = data;

  const test_total = jUnitData.tests;
  const test_skipped = jUnitData.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const test_failed = jUnitData.failures + jUnitData.errors;
  const test_passed = jUnitData.tests - test_failed - test_skipped;
  const test_status = test_failed ? 'failed' : test_skipped ? 'skipped' : 'passed';

  const coverage_lines = lcovSummary.linesFound ? (lcovSummary.linesHit / lcovSummary.linesFound) * 100 : undefined;
  const coverage_branches = lcovSummary.branchesFound
    ? (lcovSummary.branchesHit / lcovSummary.branchesFound) * 100
    : undefined;
  const coverages = [coverage_lines, coverage_branches].filter((c) => c !== undefined);
  const coverage_percentage = coverages.length !== 0 ? `${Math.min(...coverages).toFixed(1)}%` : 'N/A';

  return {
    // Test results
    test_total,
    test_passed,
    test_failed,
    test_skipped,
    test_status,
    test_percentage: percentage(test_passed, test_total),

    // Test results details todo: better here
    test_details: jUnitData.testSuites.map((suite) => 
      suite.testCases.map((test) => 
        [suite.name, test.name, test.state])).flat(),

    // Code coverage
    coverage_lines_total: lcovSummary.linesFound,
    coverage_lines_hit: lcovSummary.linesHit,
    coverage_lines_percentage: percentageNoZero(lcovSummary.linesHit, lcovSummary.linesFound),
    coverage_branches_total: lcovSummary.branchesFound,
    coverage_branches_hit: lcovSummary.branchesHit,
    coverage_branches_percentage: percentageNoZero(lcovSummary.branchesHit, lcovSummary.branchesFound),
    coverage_percentage,

    // Code coverage details
    coverage_details: data.lcovDatas.map((file) => ({
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
