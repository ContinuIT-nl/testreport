import type { TestCaseState, TestSuites } from './utilities/junit_parser.ts';
import type { LcovFile, LcovSummary } from './utilities/lcov_parser.ts';
import type { GetTestReportDataResult } from './testReportData.ts';
import { buildMarkdownTable, markdownTitle } from './utilities/markdownUtils.ts';
import { percentage } from './utilities/miscUtils.ts';
import { basename } from '@std/path';

const testState = (state: TestCaseState) => state === 'PASSED' ? '✅' : state === 'FAILED' ? '❌' : '⚠️';

function getTestResultSummary(jUnitResults: TestSuites) {
  const skipped = jUnitResults.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const success = jUnitResults.tests - jUnitResults.failures - jUnitResults.errors - skipped;

  // Testresult summary
  return buildMarkdownTable(
    [
      '☑ Tests',
      `${testState('PASSED')} Success`,
      `${testState('FAILED')} Failures/Errors`,
      `${testState('SKIPPED')} Skipped`,
    ],
    ['right', 'right', 'right', 'right'],
    [[
      jUnitResults.tests.toLocaleString(),
      success.toLocaleString(),
      (jUnitResults.failures + jUnitResults.errors).toLocaleString(),
      skipped.toLocaleString(),
    ], ['', percentage(skipped, jUnitResults.tests), '', '']],
  );
}

function getCodeCoverageSummary(lcovSummary: LcovSummary) {
  return buildMarkdownTable(
    ['☰ Lines', 'ᛘ Branches'],
    ['right', 'right'],
    [[
      percentage(lcovSummary.linesHit, lcovSummary.linesFound),
      percentage(lcovSummary.branchesHit, lcovSummary.branchesFound),
    ]],
  );
}

function getTestDetails(jUnitResults: TestSuites) {
  const testDetailRows: string[][] = [];

  for (const testSuite of jUnitResults.testSuites) {
    for (const testCase of testSuite.testCases) {
      testDetailRows.push([
        `\`${basename(testSuite.name)}\``,
        testCase.name,
        testState(testCase.state),
      ]);
    }
  }

  return buildMarkdownTable(
    ['✓✓ Test Suite', '☑ Test', 'State'],
    ['default', 'default', 'default'],
    testDetailRows,
  );
}

function getCodeCoverageDetails(lcovResults: LcovFile[]) {
  return buildMarkdownTable(
    ['🗎 File', '☰ Lines', 'ᛘ Branches'],
    ['left', 'right', 'right'],
    lcovResults.map((file) => [
      `\`${file.filename}\``,
      percentage(file.linesHit, file.linesFound),
      percentage(file.branchesHit, file.branchesFound),
    ]),
  );
}

const testResulsHeaderLine = (data: GetTestReportDataResult) => [
  `Results from \`${
    basename(data.reportDefinitionFilename)
  }\` contains ${data.jUnitData.testSuites.length} testsuites with ${data.jUnitData.tests} tests:`,
  '',
];

export const convertTestresultsToMarkdown = (data: GetTestReportDataResult) =>
  [
    markdownTitle('Test Results', 1),
    testResulsHeaderLine(data),
    markdownTitle('Summary', 2),
    markdownTitle('Test Results', 3),
    getTestResultSummary(data.jUnitData),
    markdownTitle('Code Coverage', 3),
    getCodeCoverageSummary(data.lcovSummary),
    markdownTitle('Detailed Test Results', 2),
    getTestDetails(data.jUnitData),
    markdownTitle('Detailed Code Coverage', 2),
    getCodeCoverageDetails(data.lcovDatas),
  ].flat().join('\n');
