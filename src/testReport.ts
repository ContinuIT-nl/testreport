import { createJUnitParser, type TestSuites } from './junit_parser.ts';
import { createLcovSummary, type LcovFile, lcovParser } from './lcov_parser.ts';
import { convertTestresultsToMarkdown } from './testReportToMarkdown.ts';
import { convertTestresultsToManifest } from './testReportToManifest.ts';
import { z } from 'npm:zod';

const reportDefinitionSchema = z.object({
  test_results: z.object({
    junit: z.array(z.string()),
    coverage: z.array(z.string()),
  }),
  output: z.object({
    markdown: z.string(),
    manifest: z.string(),
  }),
});

type ReportDefinition = z.infer<typeof reportDefinitionSchema>;

export async function createTestReport(reportDefinitionFilename: string) {
  // Get the definition file and validate it's content
  const definitionText = await Deno.readTextFile(reportDefinitionFilename);
  const definition = reportDefinitionSchema.parse(JSON.parse(definitionText));

  // Load all JUnit files and convert and merge them
  const jUnitParser = createJUnitParser();
  const junitData: TestSuites[] = [];
  for (const junitFilename of definition.test_results.junit) {
    const junitBytes = await Deno.readFile(junitFilename);
    const xmlData = new TextDecoder().decode(junitBytes);
    junitData.push(jUnitParser(xmlData));
  }

  // Combine all JUnit data
  const combinedJUnitData: TestSuites = junitData.reduce((acc, data) => {
    acc.tests += data.tests;
    acc.failures += data.failures;
    acc.errors += data.errors;
    acc.time += data.time;
    acc.testSuites.push(...data.testSuites);
    return acc;
  }, { name: '', tests: 0, failures: 0, errors: 0, time: 0, testSuites: [] });

  // Load all LCOV files and convert and merge them
  const lcovDatas: LcovFile[] = [];
  for (const lcovFilename of definition.test_results.coverage) {
    const lcovBytes = await Deno.readFile(lcovFilename);
    const lcovData = new TextDecoder().decode(lcovBytes);
    lcovDatas.push(...lcovParser(lcovData));
  }

  // Create LCOV file summary
  const lcovSummary = createLcovSummary(lcovDatas);
  // Run the performance test
  if (definition.output.markdown) {
    const markdown = convertTestresultsToMarkdown(reportDefinitionFilename, combinedJUnitData, lcovDatas, lcovSummary);
    await Deno.writeTextFile(definition.output.markdown, markdown);
  }

  // Output the manifest file
  if (definition.output.manifest) {
    const manifest = convertTestresultsToManifest(reportDefinitionFilename, combinedJUnitData, lcovDatas, lcovSummary);
    await Deno.writeTextFile(definition.output.manifest, manifest);
  }
}
