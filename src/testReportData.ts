import { readFile } from './utilities/dependencies.ts';
import { type TestReportConfig, testReportConfigSchema } from './testReportConfig.ts';
import { type LcovFile, lcovParser, type LcovSummary } from './utilities/lcov_parser.ts';
import { createJUnitParser, type TestSuites } from './utilities/junit_parser.ts';

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

function createLcovSummary(lcov: LcovFile[]): LcovSummary {
  return lcov.reduce(
    (acc, file) => {
      acc.functionsHit += file.functionsHit;
      acc.functionsFound += file.functionsFound;
      acc.branchesFound += file.branchesFound;
      acc.branchesHit += file.branchesHit;
      acc.linesFound += file.linesFound;
      acc.linesHit += file.linesHit;
      return acc;
    },
    {
      functionsHit: 0,
      functionsFound: 0,
      branchesFound: 0,
      branchesHit: 0,
      linesFound: 0,
      linesHit: 0,
    } satisfies LcovSummary,
  );
}

export async function getTestReportData(reportDefinitionFilename: string) {
  const reportConfig = await loadReportConfig(reportDefinitionFilename);
  const lcovDatas = await loadLcovData(reportConfig.test_results.coverage);
  const lcovSummary = createLcovSummary(lcovDatas);
  const jUnitData = await getJUnitData(reportConfig);
  return {
    reportDefinitionFilename,
    reportConfig,
    lcovDatas,
    lcovSummary,
    jUnitData,
  };
}
