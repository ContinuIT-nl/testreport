import { parseTestReportConfig, type TestReportConfig } from './testReportConfig.ts';
import { type LcovFile, lcovParser, type LcovSummary } from './utilities/lcov_parser.ts';
import { createJUnitParser, type TestSuites } from './utilities/junit_parser.ts';
import { readTextFile } from './utilities/miscUtils.ts';

async function loadReportConfig(reportDefinitionFilename: string): Promise<TestReportConfig> {
  const reportConfigText = await readTextFile(reportDefinitionFilename);
  return parseTestReportConfig(reportConfigText);
}

async function loadLcovData(lcovFilenames: string[], failures: Failure[]): Promise<LcovFile[]> {
  const lcovDatas: LcovFile[] = [];
  for (const lcovFilename of lcovFilenames) {
    try {
      const lcovData = await readTextFile(lcovFilename);
      lcovDatas.push(...lcovParser(lcovData));
    } catch (error) {
      failures.push({
        message: (error as Error).message,
        file: lcovFilename,
        type: 'lcov',
      });
    }
  }
  return lcovDatas;
}

async function getJUnitData(reportConfig: TestReportConfig, failures: Failure[]): Promise<TestSuites> {
  // Load all JUnit files and convert and merge them
  const jUnitParser = createJUnitParser();
  const result: TestSuites = { name: '', tests: 0, failures: 0, errors: 0, time: 0, testSuites: [] };

  const junitData: TestSuites[] = [];
  for (const junitFilename of reportConfig.input.junit) {
    try {
      const xmlData = await readTextFile(junitFilename);
      junitData.push(jUnitParser(xmlData));
    } catch (error) {
      failures.push({
        message: (error as Error).message,
        file: junitFilename,
        type: 'junit',
      });
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

type Failure = {
  message: string;
  file: string;
  type: 'junit' | 'lcov' | 'write' | 'coverage' | 'test';
};

export type GetTestReportDataResult = {
  source: string;
  config: TestReportConfig;
  lcovDatas: LcovFile[];
  lcovSummary: LcovSummary;
  jUnitData: TestSuites;
  failures: Failure[];
};

export async function getTestReportData(source: string): Promise<GetTestReportDataResult> {
  const failures: Failure[] = [];
  const config = await loadReportConfig(source);
  const lcovDatas = await loadLcovData(config.input.coverage, failures);
  const lcovSummary = createLcovSummary(lcovDatas);
  const jUnitData = await getJUnitData(config, failures);
  return { source, config, lcovDatas, lcovSummary, jUnitData, failures };
}
