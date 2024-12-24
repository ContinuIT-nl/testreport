# Test Results

Results from `testReport.json` contains 4 testsuites with 18 tests:

## Summary

### Test Results

| ☑ Tests | ✅ Success | ❌ Failures/Errors | ⚠️ Skipped |
| ------: | --------: | ----------------: | ---------: |
|      18 |        18 |                 0 |          0 |
|         |      0.0% |                   |            |

### Code Coverage

| ☰ Lines | ᛘ Branches |
| ------: | ---------: |
|  100.0% |     100.0% |

## Detailed Test Results

| ✓✓ Test Suite                     | ☑ Test                              | State |
| --------------------------------- | ----------------------------------- | ----- |
| `./test/checkTestReport.test.ts`  | checkTestReport                     | ✅     |
| `./test/createBadge.test.ts`      | getWidth                            | ✅     |
| `./test/createBadge.test.ts`      | createBadge                         | ✅     |
| `./test/createBadge.test.ts`      | createBadge_no_message              | ✅     |
| `./test/createTestReport.test.ts` | testReport_deno_success             | ✅     |
| `./test/createTestReport.test.ts` | testReport_deno_failed              | ✅     |
| `./test/createTestReport.test.ts` | testReport_deno_disabled            | ✅     |
| `./test/createTestReport.test.ts` | testReport_jest                     | ✅     |
| `./test/createTestReport.test.ts` | testReport_vitest                   | ✅     |
| `./test/createTestReport.test.ts` | testReport_no_tests                 | ✅     |
| `./test/createTestReport.test.ts` | testReport_tests_invalid_definition | ✅     |
| `./test/createTestReport.test.ts` | testReport_tests_invalid_input      | ✅     |
| `./test/createTestReport.test.ts` | testReport_tests_invalid_output     | ✅     |
| `./test/utilities.test.ts`        | buildMarkdownTable                  | ✅     |
| `./test/utilities.test.ts`        | markdownTitle                       | ✅     |
| `./test/utilities.test.ts`        | exportOutput                        | ✅     |
| `./test/utilities.test.ts`        | percentage                          | ✅     |
| `./test/utilities.test.ts`        | percentageNoZero                    | ✅     |

## Detailed Code Coverage

| 🗎 File                   | ☰ Lines | ᛘ Branches |
| :------------------------ | ------: | ---------: |
| `checkTestReport.ts`      |  100.0% |        N/A |
| `createTestReport.ts`     |  100.0% |     100.0% |
| `testReportConfig.ts`     |  100.0% |        N/A |
| `testReportData.ts`       |  100.0% |     100.0% |
| `testReportToBadges.ts`   |  100.0% |     100.0% |
| `testReportToManifest.ts` |  100.0% |     100.0% |
| `testReportToMarkdown.ts` |  100.0% |     100.0% |
| `createBadgeSvg.ts`       |  100.0% |     100.0% |
| `junit_parser.ts`         |  100.0% |        N/A |
| `lcov_parser.ts`          |  100.0% |     100.0% |
| `markdownUtils.ts`        |  100.0% |     100.0% |
| `miscUtils.ts`            |  100.0% |     100.0% |
