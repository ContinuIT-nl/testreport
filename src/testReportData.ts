import { type TestReportConfig, testReportConfigSchema } from './testReportConfig.ts';
import { type LcovFile, lcovParser, type LcovSummary } from './utilities/lcov_parser.ts';
import { createJUnitParser, type TestSuites } from './utilities/junit_parser.ts';
import { readTextFile } from './utilities/miscUtils.ts';

async function loadReportConfig(reportDefinitionFilename: string): Promise<TestReportConfig> {
  const reportConfigText = await readTextFile(reportDefinitionFilename);
  return testReportConfigSchema.parse(JSON.parse(reportConfigText));
}

async function loadLcovData(lcovFilenames: string[]): Promise<LcovFile[]> {
  const lcovDatas: LcovFile[] = [];
  for (const lcovFilename of lcovFilenames) {
    try {
      const lcovData = await readTextFile(lcovFilename);
      lcovDatas.push(...lcovParser(lcovData));
    } catch (error) {
      console.error((error as Error).message);
    }
  }
  return lcovDatas;
}

async function getJUnitData(reportConfig: TestReportConfig): Promise<TestSuites> {
  // Load all JUnit files and convert and merge them
  const jUnitParser = createJUnitParser();
  const result: TestSuites = { name: '', tests: 0, failures: 0, errors: 0, time: 0, testSuites: [] };

  const junitData: TestSuites[] = [];
  for (const junitFilename of reportConfig.input.junit) {
    try {
      const xmlData = await readTextFile(junitFilename);
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

export type GetTestReportDataResult = {
  source: string;
  config: TestReportConfig;
  lcovDatas: LcovFile[];
  lcovSummary: LcovSummary;
  jUnitData: TestSuites;
};

export async function getTestReportData(source: string): Promise<GetTestReportDataResult> {
  const config = await loadReportConfig(source);
  const lcovDatas = await loadLcovData(config.input.coverage);
  const lcovSummary = createLcovSummary(lcovDatas);
  const jUnitData = await getJUnitData(config);
  return { source, config, lcovDatas, lcovSummary, jUnitData };
}
