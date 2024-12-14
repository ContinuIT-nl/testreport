import { createJUnitParser, type TestSuites } from './junit_parser.ts';
import { createLcovSummary, type LcovFile, lcovParser, type LcovSummary } from './lcov_parser.ts';
import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { type TestReportConfig, testReportConfigSchema } from './testReportConfig.ts';
import { createBadgeSvg } from './createBadgeSvg.ts';

async function getJUnitData(reportConfig: TestReportConfig): Promise<TestSuites> {
  // Load all JUnit files and convert and merge them
  const jUnitParser = createJUnitParser();

  const junitData: TestSuites[] = [];
  for (const junitFilename of reportConfig.test_results.junit) {
    const junitBytes = await Deno.readFile(junitFilename);
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

function createTestBadge(jUnitData: TestSuites): string {
  const disabled = jUnitData.testSuites.reduce((acc, suite) => acc + suite.disabled, 0);
  const errors = jUnitData.errors + jUnitData.failures;
  const passed = jUnitData.tests - disabled - errors;
  const status = 
    passed === jUnitData.tests ? `${passed}/${jUnitData.tests} passed` :
    errors ? `${errors}/${jUnitData.tests} failed` :
    `${disabled}/${jUnitData.tests} disabled`;
  const color = passed === jUnitData.tests ? '#3C1' : errors ? '#900' : '#FF0';
  return createBadgeSvg({
    label: 'tests',
    message: status,
    labelColor: '#555',
    messageColor: color,
    rounded: true
  });
}

function createCoverageBadge(lcovSummary: LcovSummary): string {
  const coveragePercentage = (lcovSummary.linesHit / lcovSummary.linesFound) * 100; // todo: add branches
  return createBadgeSvg({
    label: 'coverage',
    message: `${coveragePercentage}%`,
    labelColor: '#555',
    messageColor: coveragePercentage >= 80 ? '#3C1' : '#900', // todo: parameterize thresholds
    rounded: true
  });
}

export async function createTestReport(reportDefinitionFilename: string) {
  // Get the config file and validate it's content
  const reportConfigText = await Deno.readTextFile(reportDefinitionFilename);
  const reportConfig = testReportConfigSchema.parse(JSON.parse(reportConfigText));

  // Load all LCOV files and convert and merge them
  const lcovDatas: LcovFile[] = [];
  for (const lcovFilename of reportConfig.test_results.coverage) {
    const lcovBytes = await Deno.readFile(lcovFilename);
    const lcovData = new TextDecoder().decode(lcovBytes);
    lcovDatas.push(...lcovParser(lcovData));
  }

  const jUnitData = await getJUnitData(reportConfig);

  // Create LCOV file summary
  const lcovSummary = createLcovSummary(lcovDatas);

  // Run the performance test
  if (reportConfig.output.markdown) {
    const markdown = convertTestresultsToMarkdown(reportDefinitionFilename, jUnitData, lcovDatas, lcovSummary);
    await Deno.writeTextFile(reportConfig.output.markdown, markdown);
  }

  // Output the manifest file
  if (reportConfig.output.manifest) {
    const manifest = convertTestresultsToManifest(reportDefinitionFilename, jUnitData, lcovDatas, lcovSummary);
    await Deno.writeTextFile(reportConfig.output.manifest, manifest);
  }

  // Output the badges
  if (reportConfig.output.testBadge) {
    const testBadge = createTestBadge(jUnitData);
    await Deno.writeTextFile(reportConfig.output.testBadge, testBadge);
  }

  if (reportConfig.output.coverageBadge) {
    const coverageBadge = createCoverageBadge(lcovSummary);
    await Deno.writeTextFile(reportConfig.output.coverageBadge, coverageBadge);
  }
}
