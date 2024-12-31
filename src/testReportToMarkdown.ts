import { encodeBase64 } from '@std/encoding/base64';
import type { TestCaseState } from './utilities/junit_parser.ts';
import type { Manifest } from './testReportToManifest.ts';
import {
  buildMarkdownTable,
  markdownCollapsibleEnd,
  markdownCollapsibleTitle,
  markdownTitle,
} from './utilities/markdownUtils.ts';
import { percentage, percentageNoZero } from './utilities/miscUtils.ts';
import { createCoverageBadge, createTestBadge } from './testReportToBadges.ts';
import type { TestReportConfig } from './testReportConfig.ts';

const testState = (state: TestCaseState) => state === 'PASSED' ? '✅' : state === 'FAILED' ? '❌' : '⚠️';

const getTestResultSummary = (manifest: Manifest) =>
  buildMarkdownTable(
    [
      '☑ Tests',
      `${testState('PASSED')} Success`,
      `${testState('FAILED')} Failures/Errors`,
      `${testState('SKIPPED')} Skipped`,
    ],
    ['right', 'right', 'right', 'right'],
    [[
      manifest.test_total.toLocaleString(),
      manifest.test_passed.toLocaleString(),
      manifest.test_failed.toLocaleString(),
      manifest.test_skipped.toLocaleString(),
    ], ['', percentage(manifest.test_passed, manifest.test_total), '', '']],
  );

const getCodeCoverageSummary = (manifest: Manifest) =>
  buildMarkdownTable(
    ['☰ Lines', 'ᛘ Branches'],
    ['right', 'right'],
    [[
      percentageNoZero(manifest.coverage_lines_hit, manifest.coverage_lines_total),
      percentageNoZero(manifest.coverage_branches_hit, manifest.coverage_branches_total),
    ]],
  );

const getTestDetails = (manifest: Manifest) =>
  buildMarkdownTable(
    ['✓✓ Test Suite', '☑ Test', 'State'],
    ['default', 'default', 'default'],
    manifest.test_details.map((row) => [`\`${row.suite}\``, row.test, testState(row.state)]),
  );

const getCodeCoverageDetails = (manifest: Manifest) =>
  buildMarkdownTable(
    ['🗎 File', '☰ Lines', 'ᛘ Branches'],
    ['left', 'right', 'right'],
    manifest.coverage_details.map((file) => [
      `\`${file.name}\``,
      percentageNoZero(file.lines_hit, file.lines_total),
      percentageNoZero(file.branches_hit, file.branches_total),
    ]),
  );

const testResulsHeaderLine = (manifest: Manifest) => [
  `Results from \`${manifest.source}\` contains ${manifest.testsuites_total} testsuites with ${manifest.test_total} tests:`,
  '',
];

const encodeBadge = (name: string, badge: string) => `![${name}](data:image/svg+xml;base64,${encodeBase64(badge)})`;

const badges = (config: TestReportConfig, manifest: Manifest) => {
  if (config.markdown?.badges) {
    const badges = [];
    if (config.testBadge) {
      badges.push(encodeBadge('tests', createTestBadge(config.testBadge, manifest)));
    }
    if (config.coverageBadge) {
      badges.push(encodeBadge('coverage', createCoverageBadge(config.coverageBadge, manifest)));
    }
    return badges.length > 0 ? [...badges, ''] : [];
  }
  return [];
};

export const convertTestresultsToMarkdown = (config: TestReportConfig, manifest: Manifest) =>
  [
    markdownTitle('Test Results', 1),
    badges(config, manifest),
    testResulsHeaderLine(manifest),
    markdownTitle('Summary', 2),
    markdownTitle('Test Results', 3),
    getTestResultSummary(manifest),
    markdownTitle('Code Coverage', 3),
    getCodeCoverageSummary(manifest),
    markdownCollapsibleTitle('Detailed Test Results', 2, config.markdown!.collapseDetails),
    getTestDetails(manifest),
    markdownCollapsibleEnd(config.markdown!.collapseDetails),
    markdownCollapsibleTitle('Detailed Code Coverage Results', 2, config.markdown!.collapseDetails),
    getCodeCoverageDetails(manifest),
    markdownCollapsibleEnd(config.markdown!.collapseDetails),
  ].flat().join('\n');
