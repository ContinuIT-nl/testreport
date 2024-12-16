import { createJUnitParser, type TestSuites } from './junit_parser.ts';
import { createLcovSummary, type LcovFile, lcovParser, type LcovSummary } from './lcov_parser.ts';
import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { type TestReportConfig, testReportConfigSchema } from './testReportConfig.ts';
import { createBadgeSvg } from './createBadgeSvg.ts';
import { readFile, writeFile } from './dependencies.ts';

async function getJUnitData(reportConfig: TestReportConfig): Promise<TestSuites> {
  // Load all JUnit files and convert and merge them
  const jUnitParser = createJUnitParser();

  const junitData: TestSuites[] = [];
  for (const junitFilename of reportConfig.test_results.junit) {
    const junitBytes = await readFile(junitFilename);
    const xmlData = new TextDecoder().decode(junitBytes);
    junitData.push(jUnitParser(xmlData));
  }
  // Combine all JUnit data
  return junitData.reduce((acc, data) => {
    acc.tests += data.tests;
    acc.failures += data.failures;
    acc.errors += data.errors;
    acc.time += data.time;
    acc.testSuites.push(...data.testSuites);
    return acc;
  }, { name: '', tests: 0, failures: 0, errors: 0, time: 0, testSuites: [] });
}

// todo: handle totoal === 0
function createTestBadge(jUnitData: TestSuites, reportConfig: TestReportConfig): string {
  const total = jUnitData.tests;
  const disabled = jUnitData.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const errors = jUnitData.errors + jUnitData.failures;
  const passed = total - disabled - errors;
  const status = 
    passed === total ? `${passed}/${total} passed` :
    errors ? `${errors}/${total} failed` :
    `${disabled}/${total} disabled`;
  const color = passed === total ? '#3C1' : errors ? '#900' : '#880';
  return createBadgeSvg({
    label: reportConfig.constants.test_label,
    message: status,
    labelColor: reportConfig.constants.test_label_color,
    messageColor: color,
    rounded: reportConfig.constants.test_rounded
  });
}

function createCoverageBadge(lcovSummary: LcovSummary, reportConfig: TestReportConfig): string {
  const coveragePercentage = (lcovSummary.linesHit / lcovSummary.linesFound) * 100; // todo: add branches
  return createBadgeSvg({
    label: reportConfig.constants.coverage_label,
    message: `${coveragePercentage.toFixed(1)}%`,
    labelColor: reportConfig.constants.coverage_label_color,
    messageColor: coveragePercentage >= 80 ? '#3C1' : '#900', // todo: parameterize thresholds, colors
    rounded: reportConfig.constants.coverage_rounded
  });
}

export async function createTestReport(reportDefinitionFilename: string) {
  // Get the config file and validate it's content
  const reportConfigBytes = await readFile(reportDefinitionFilename);
  const reportConfigText = new TextDecoder().decode(reportConfigBytes);
  const reportConfig = testReportConfigSchema.parse(JSON.parse(reportConfigText));

  // Load all LCOV files and convert and merge them
  const lcovDatas: LcovFile[] = [];
  for (const lcovFilename of reportConfig.test_results.coverage) {
    try {
      const lcovBytes = await readFile(lcovFilename);
      const lcovData = new TextDecoder().decode(lcovBytes);
      lcovDatas.push(...lcovParser(lcovData));
    } catch (error) {
      console.error(`Error reading LCOV file ${lcovFilename}: ${error}`);
    }
  }

  const jUnitData = await getJUnitData(reportConfig);

  // Create LCOV file summary
  const lcovSummary = createLcovSummary(lcovDatas);

  const utf8Encoder = new TextEncoder();

  // Run the performance test
  if (reportConfig.output.markdown) {
    const markdown = convertTestresultsToMarkdown(reportDefinitionFilename, jUnitData, lcovDatas, lcovSummary);
    const markdownBytes = utf8Encoder.encode(markdown);
    await writeFile(reportConfig.output.markdown, markdownBytes);
  }

  // Output the manifest file
  if (reportConfig.output.manifest) {
    const manifest = convertTestresultsToManifest(reportDefinitionFilename, jUnitData, lcovDatas, lcovSummary);
    const manifestBytes = utf8Encoder.encode(manifest);
    await writeFile(reportConfig.output.manifest, manifestBytes);
  }

  // Output the badges
  if (reportConfig.output.testBadge) {
    const testBadge = createTestBadge(jUnitData, reportConfig);
    const testBadgeBytes = utf8Encoder.encode(testBadge);
    await writeFile(reportConfig.output.testBadge, testBadgeBytes);
  }

  if (reportConfig.output.coverageBadge) {
    const coverageBadge = createCoverageBadge(lcovSummary, reportConfig);
    const coverageBadgeBytes = utf8Encoder.encode(coverageBadge);
    await writeFile(reportConfig.output.coverageBadge, coverageBadgeBytes);
  }
}
