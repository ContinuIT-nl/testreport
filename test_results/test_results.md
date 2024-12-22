# Test Results

Results from `testReport.json` contains 4 testsuites with 17 tests:

## Summary

### Test Results

| ☑ Tests | ✅ Success | ❌ Failures/Errors | ⚠️ Skipped |
| ------: | --------: | ----------------: | ---------: |
|      17 |        17 |                 0 |          0 |
|         |           |                   |            |

### Code Coverage

| ☰ Lines | ᛘ Branches |
| ------: | ---------: |
|  100.0% |     100.0% |

## Detailed Test Results

| ✓✓ Test Suite              | ☑ Test                          | State |
| -------------------------- | ------------------------------- | ----- |
| `checkTestReport.test.ts`  | checkTestReport                 | ✅     |
| `createBadge.test.ts`      | getWidth                        | ✅     |
| `createBadge.test.ts`      | createBadge                     | ✅     |
| `createBadge.test.ts`      | createBadge_no_message          | ✅     |
| `createTestReport.test.ts` | testReport_deno_success         | ✅     |
| `createTestReport.test.ts` | testReport_deno_failed          | ✅     |
| `createTestReport.test.ts` | testReport_deno_disabled        | ✅     |
| `createTestReport.test.ts` | testReport_jest                 | ✅     |
| `createTestReport.test.ts` | testReport_vitest               | ✅     |
| `createTestReport.test.ts` | testReport_no_tests             | ✅     |
| `createTestReport.test.ts` | testReport_tests_invalid_input  | ✅     |
| `createTestReport.test.ts` | testReport_tests_invalid_output | ✅     |
| `utilities.test.ts`        | buildMarkdownTable              | ✅     |
| `utilities.test.ts`        | markdownTitle                   | ✅     |
| `utilities.test.ts`        | extractFilename                 | ✅     |
| `utilities.test.ts`        | exportOutput                    | ✅     |
| `utilities.test.ts`        | equal                           | ✅     |

## Detailed Code Coverage

| 🗎 File                   | ☰ Lines | ᛘ Branches |
| :------------------------ | ------: | ---------: |
| `checkTestReport.ts`      |  100.0% |            |
| `createTestReport.ts`     |  100.0% |     100.0% |
| `testReportConfig.ts`     |  100.0% |            |
| `testReportData.ts`       |  100.0% |     100.0% |
| `testReportToManifest.ts` |  100.0% |            |
| `testReportToMarkdown.ts` |  100.0% |     100.0% |
| `createBadgeSvg.ts`       |  100.0% |     100.0% |
| `equal.ts`                |  100.0% |     100.0% |
| `junit_parser.ts`         |  100.0% |            |
| `lcov_parser.ts`          |  100.0% |     100.0% |
| `markdownUtils.ts`        |  100.0% |     100.0% |
| `miscUtils.ts`            |  100.0% |     100.0% |
