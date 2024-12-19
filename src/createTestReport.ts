import { createJUnitParser, type TestSuites } from './utilities/junit_parser.ts';
import { createLcovSummary, type LcovFile, lcovParser, type LcovSummary } from './utilities/lcov_parser.ts';
import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { type TestReportConfig, testReportConfigSchema } from './testReportConfig.ts';
import { createBadgeSvg } from './utilities/createBadgeSvg.ts';
import { readFile } from './utilities/dependencies.ts';
import { exportOutput } from './utilities/miscUtils.ts';

async function getJUnitData(reportConfig: TestReportConfig): Promise<TestSuites> {
  // Load all JUnit files and convert and merge them
  const jUnitParser = createJUnitParser();
  const result: TestSuites = { name: '', tests: 0, failures: 0, errors: 0, time: 0, testSuites: [] };

  const junitData: TestSuites[] = [];
  for (const junitFilename of reportConfig.test_results.junit) {
    try {
      const junitBytes = await readFile(junitFilename);
      const xmlData = new TextDecoder().decode(junitBytes);
      junitData.push(jUnitParser(xmlData));
    } catch (_error) {
      // Notify error by adding a test suite with 1 test and 1 error
      result.tests++;
      result.errors++;
    }
  }
  // Combine all JUnit data
  return junitData.reduce((acc, data) => {
    acc.tests += data.tests;
    acc.failures += data.failures;
    acc.errors += data.errors;
    acc.time += data.time;
    acc.testSuites.push(...data.testSuites);
    return acc;
  }, result);
}

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

async function loadReportConfig(reportDefinitionFilename: string): Promise<TestReportConfig> {
  const reportConfigBytes = await readFile(reportDefinitionFilename);
  const reportConfigText = new TextDecoder().decode(reportConfigBytes);
  return testReportConfigSchema.parse(JSON.parse(reportConfigText));
}

async function loadLcovData(lcovFilenames: string[]): Promise<LcovFile[]> {
  const lcovDatas: LcovFile[] = [];
  for (const lcovFilename of lcovFilenames) {
    try {
      const lcovBytes = await readFile(lcovFilename);
      const lcovData = new TextDecoder().decode(lcovBytes);
      lcovDatas.push(...lcovParser(lcovData));
    } catch (error) {
      console.error(`Error reading LCOV file ${lcovFilename}: ${error}`);
    }
  }
  return lcovDatas;
}

export async function createTestReport(reportDefinitionFilename: string) {
  // Get the config file and validate it's content
  const reportConfig = await loadReportConfig(reportDefinitionFilename);

  // Load all LCOV and JUnit files
  const lcovDatas = await loadLcovData(reportConfig.test_results.coverage);
  const lcovSummary = createLcovSummary(lcovDatas);
  const jUnitData = await getJUnitData(reportConfig);

  // Create the outputs
  await exportOutput(
    reportConfig.output.markdown,
    () => convertTestresultsToMarkdown(reportDefinitionFilename, jUnitData, lcovDatas, lcovSummary),
  );
  await exportOutput(
    reportConfig.output.manifest,
    () => convertTestresultsToManifest(reportDefinitionFilename, jUnitData, lcovDatas, lcovSummary),
  );
  await exportOutput(reportConfig.output.testBadge, () => createTestBadge(jUnitData, reportConfig));
  await exportOutput(reportConfig.output.coverageBadge, () => createCoverageBadge(lcovSummary, reportConfig));
}
