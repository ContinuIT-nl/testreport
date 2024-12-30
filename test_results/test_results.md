# Test Results

<svg xmlns="http://www.w3.org/2000/svg" role="img" width="121.9" height="20" viewBox="0 0 1219 200" aria-label="tests 24/24 passed"><title>tests 24/24 passed</title><g><clipPath id="r"><rect width="1219" height="200" rx="30" fill="#fff"/></clipPath></g><g clip-path="url(#r)"><rect fill="#555" width="366" height="200"/><rect fill="#2EBE4E" x="366" width="853" height="200"/></g><g aria-hidden="true" fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110"><text x="60" y="148" textLength="266" fill="#000" opacity="0.1">tests</text><text x="50" y="138" textLength="266">tests</text><text x="421" y="148" textLength="753" fill="#000" opacity="0.1">24/24 passed</text><text x="411" y="138" textLength="753">24/24 passed</text></g></svg>
<svg xmlns="http://www.w3.org/2000/svg" role="img" width="107.30000000000001" height="20" viewBox="0 0 1073 200" aria-label="coverage 99.2%"><title>coverage 99.2%</title><g><clipPath id="r"><rect width="1073" height="200" rx="30" fill="#fff"/></clipPath></g><g clip-path="url(#r)"><rect fill="#555" width="603" height="200"/><rect fill="#2EBE4E" x="603" width="470" height="200"/></g><g aria-hidden="true" fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110"><text x="60" y="148" textLength="503" fill="#000" opacity="0.1">coverage</text><text x="50" y="138" textLength="503">coverage</text><text x="658" y="148" textLength="370" fill="#000" opacity="0.1">99.2%</text><text x="648" y="138" textLength="370">99.2%</text></g></svg>

Results from `./test_results/testreport.json` contains 5 testsuites with 24 tests:

## Summary

### Test Results

| ☑ Tests | ✅ Success | ❌ Failures/Errors | ⚠️ Skipped |
| ------: | --------: | ----------------: | ---------: |
|      24 |        24 |                 0 |          0 |
|         |    100.0% |                   |            |

### Code Coverage

| ☰ Lines | ᛘ Branches |
| ------: | ---------: |
|   99.9% |      99.2% |

## Detailed Test Results

| ✓✓ Test Suite                     | ☑ Test                              | State |
| --------------------------------- | ----------------------------------- | ----- |
| `./test/checkTestReport.test.ts`  | checkTestReport                     | ✅     |
| `./test/checkTestReport.test.ts`  | checkTestReport_no_manifest         | ✅     |
| `./test/createBadge.test.ts`      | getWidth                            | ✅     |
| `./test/createBadge.test.ts`      | createBadge                         | ✅     |
| `./test/createBadge.test.ts`      | createBadge_no_message              | ✅     |
| `./test/createTestReport.test.ts` | testreport_deno_success             | ✅     |
| `./test/createTestReport.test.ts` | testreport_deno_failed              | ✅     |
| `./test/createTestReport.test.ts` | testreport_deno_disabled            | ✅     |
| `./test/createTestReport.test.ts` | testreport_jest                     | ✅     |
| `./test/createTestReport.test.ts` | testreport_vitest                   | ✅     |
| `./test/createTestReport.test.ts` | testreport_no_tests                 | ✅     |
| `./test/createTestReport.test.ts` | testreport_tests_invalid_definition | ✅     |
| `./test/createTestReport.test.ts` | testreport_tests_invalid_input      | ✅     |
| `./test/createTestReport.test.ts` | testreport_tests_invalid_output     | ✅     |
| `./test/execute.test.ts`          | execute help                        | ✅     |
| `./test/execute.test.ts`          | execute create                      | ✅     |
| `./test/execute.test.ts`          | execute create invalidConfig        | ✅     |
| `./test/execute.test.ts`          | execute check                       | ✅     |
| `./test/execute.test.ts`          | execute check unequal               | ✅     |
| `./test/utilities.test.ts`        | buildMarkdownTable                  | ✅     |
| `./test/utilities.test.ts`        | markdownTitle                       | ✅     |
| `./test/utilities.test.ts`        | exportOutput                        | ✅     |
| `./test/utilities.test.ts`        | percentage                          | ✅     |
| `./test/utilities.test.ts`        | percentageNoZero                    | ✅     |

## Detailed Code Coverage

| 🗎 File                   | ☰ Lines | ᛘ Branches |
| :------------------------ | ------: | ---------: |
| `checkTestReport.ts`      |  100.0% |     100.0% |
| `createTestReport.ts`     |  100.0% |     100.0% |
| `execute.ts`              |  100.0% |     100.0% |
| `testReportConfig.ts`     |  100.0% |        N/A |
| `testReportData.ts`       |  100.0% |     100.0% |
| `testReportToBadges.ts`   |  100.0% |        N/A |
| `testReportToManifest.ts` |   98.3% |      95.5% |
| `testReportToMarkdown.ts` |  100.0% |     100.0% |
| `createBadgeSvg.ts`       |  100.0% |     100.0% |
| `junit_parser.ts`         |  100.0% |        N/A |
| `lcov_parser.ts`          |  100.0% |     100.0% |
| `markdownUtils.ts`        |  100.0% |     100.0% |
| `miscUtils.ts`            |  100.0% |     100.0% |
