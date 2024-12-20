import { percentage } from './utilities/miscUtils.ts';
import type { GetTestReportDataResult } from './testReportData.ts';

export const convertTestresultsToManifest = (data: GetTestReportDataResult) => {
  const { reportDefinitionFilename, jUnitData, lcovSummary } = data;
  const skipped = jUnitData.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const success = jUnitData.tests - jUnitData.failures - jUnitData.errors - skipped;
  const result = {
    source: reportDefinitionFilename,
    codeCoverageLinesPercentage: percentage(data.lcovSummary.linesHit, data.lcovSummary.linesFound),
    codeCoverageBranchesPercentage: percentage(lcovSummary.branchesHit, lcovSummary.branchesFound),
    tests: jUnitData.tests.toLocaleString(),
    testsPassed: success.toLocaleString(),
    testsFailed: (jUnitData.failures + jUnitData.errors).toLocaleString(),
    testsSkipped: skipped.toLocaleString(),
    testPercentage: percentage(success, jUnitData.tests),
    testHash: 'TODO', // todo: implement this
  };
  // todo: the idea is that the hash can be calculated when the report is formed and that when the report is formed again the hash is the same.
  // The hash should not depend for the time of the report generation and timing related results in the report.
  return JSON.stringify(result, null, 2);
};
