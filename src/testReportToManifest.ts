import { percentage } from './utilities/miscUtils.ts';
import type { GetTestReportDataResult } from './testReportData.ts';

export const convertTestresultsToManifest = (data: GetTestReportDataResult) => {
  const { reportDefinitionFilename, jUnitData, lcovSummary } = data;
  const skipped = jUnitData.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const success = jUnitData.tests - jUnitData.failures - jUnitData.errors - skipped;
  return {
    source: reportDefinitionFilename,
    // todo: so same as when creating badge
    codeCoverageLinesPercentage: percentage(lcovSummary.linesHit, lcovSummary.linesFound),
    codeCoverageBranchesPercentage: percentage(lcovSummary.branchesHit, lcovSummary.branchesFound),
    tests: jUnitData.tests.toLocaleString(),
    testsPassed: success.toLocaleString(),
    testsFailed: (jUnitData.failures + jUnitData.errors).toLocaleString(),
    testsSkipped: skipped.toLocaleString(),
    testPercentage: percentage(success, jUnitData.tests),
    // todo: add array of tests etc  etc
  };
};
