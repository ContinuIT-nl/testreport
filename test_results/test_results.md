# Test Results

Results from `./testreport.json` contains 5 testsuites with 25 tests:

## Summary

### Test Results

| ☑ Tests | ✅ Success | ❌ Failures/Errors | ⚠️ Skipped |
| ------: | --------: | ----------------: | ---------: |
|      25 |        25 |                 0 |          0 |
|         |    100.0% |                   |            |

### Code Coverage

| ☰ Lines | ᛘ Branches |
| ------: | ---------: |
|  100.0% |     100.0% |

<details>
<summary>Detailed Test Results</summary>

| ✓✓ Test Suite                     | ☑ Test                              | State |
| --------------------------------- | ----------------------------------- | ----- |
| `./test/checkTestReport.test.ts`  | checkTestReport                     | ✅     |
| `./test/checkTestReport.test.ts`  | checkTestReport_no_manifest         | ✅     |
| `./test/checkTestReport.test.ts`  | checkTestReport_failure             | ✅     |
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

</details>

<details>
<summary>Detailed Code Coverage Results</summary>

| 🗎 File                   | ☰ Lines | ᛘ Branches |
| :------------------------ | ------: | ---------: |
| `checkTestReport.ts`      |  100.0% |     100.0% |
| `createTestReport.ts`     |  100.0% |     100.0% |
| `execute.ts`              |  100.0% |     100.0% |
| `testReportConfig.ts`     |  100.0% |        N/A |
| `testReportData.ts`       |  100.0% |     100.0% |
| `testReportToBadges.ts`   |  100.0% |        N/A |
| `testReportToManifest.ts` |  100.0% |     100.0% |
| `testReportToMarkdown.ts` |  100.0% |     100.0% |
| `createBadgeSvg.ts`       |  100.0% |     100.0% |
| `junit_parser.ts`         |  100.0% |        N/A |
| `lcov_parser.ts`          |  100.0% |     100.0% |
| `markdownUtils.ts`        |  100.0% |     100.0% |
| `miscUtils.ts`            |  100.0% |     100.0% |

</details>
