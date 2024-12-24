# testreport

[![JSR](https://jsr.io/badges/@continuit/testreport)](https://jsr.io/@continuit/testreport)
[![NPM](https://img.shields.io/npm/v/@continuit/testreport?logo=npm)](https://www.npmjs.com/package/@continuit/testreport)
[![ci](https://github.com/ContinuIT-nl/testreport/actions/workflows/ci.yml/badge.svg)](https://github.com/ContinuIT-nl/testreport/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This utility creates a test report from a JUnit XML file and a LCOV file.
It has two modes of operation:

- Create a test report and badges from a JUnit XML file and a LCOV file.
- Check if a previous test report is up to date with the current test results.

This utility can be used to create the test report inside your repository.
The report can be referenced from the README.md file and the generated badges can be used to show the test results on the repository page.

The second mode can be used to check if a previous test report is up to date with the current test results.
This can be used to ensure that the test report is updated with the current test results, for example when running tests on a CI server.

## Usage

| Platform | Command                              |
| -------- | ------------------------------------ |
| npm      | `npm install @continuit/testreport`  |
| deno     | `deno add jsr:@continuit/testreport` |

For other platforms see [jsr.io](https://jsr.io/packages/@continuit/testreport) for more information.

## Basic usage

Create a test report definition file, for example `testreport.json`:

```json
{
  "test_results": {
    "junit": ["testdata/junit.xml"],
    "coverage": ["testdata/cov.lcov"]
  },
  "output": {
    "markdown": "testresults/test_results.md",
    "manifest": "testresults/manifest.json",
    "testBadge": "testresults/test_badge.svg",
    "coverageBadge": "testresults/coverage_badge.svg"
  }
}
```

### `test_results`

| Key        | Type     | Description                                        |
| ---------- | -------- | -------------------------------------------------- |
| `junit`    | string[] | The JUnit XML files to include in the test report. |
| `coverage` | string[] | The LCOV files to include in the test report.      |

### `output`

| Key             | Type   | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `markdown`      | string | The path to the markdown file to create.       |
| `manifest`      | string | The path to the manifest file to create.       |
| `testBadge`     | string | The path to the test badge file to create.     |
| `coverageBadge` | string | The path to the coverage badge file to create. |

All output files are optional. If you want to perform the `--check` command, you need to provide at least the `manifest` file.

### `constants`

This whole section is optional. It contains the constants for generating the badges.

| Key                               | Type    | Default Value |
| --------------------------------- | ------- | ------------- |
| `test_label`                      | string  | "tests"       |
| `test_label_color`                | string  | "#555"        |
| `test_message_color_ok`           | string  | "#3C1"        |
| `test_message_color_failed`       | string  | "#900"        |
| `test_message_color_disabled`     | string  | "#880"        |
| `test_rounded`                    | boolean | true          |
| `coverage_label`                  | string  | "coverage"    |
| `coverage_label_color`            | string  | "#555"        |
| `coverage_message_color_ok`       | string  | "#3C1"        |
| `coverage_message_color_failed`   | string  | "#900"        |
| `coverage_message_color_disabled` | string  | "#880"        |
| `coverage_rounded`                | boolean | true          |
| `coverage_threshold`              | number  | 80            |

The `coverage_threshold` is the minimum coverage percentage that is required to pass the test.

Run the testreport utility:

```bash
testreport testreport.json
```

In the above example the test report will be created in the `testresults` folder.
Normally you would reference the test report from the README.md file and the badges from the repository page.
The folder `testdata` with the JUnit XML file and the LCOV file should not be checked into the repository.
In your CI pipeline you can run the testreport utility and check if the test report is up to date with the current test results.

```bash
testreport --check testreport.json
```

This will check if the test report is up to date with the current test results.
If the test report is not up to date, the utility will exit with a non-zero exit code.

## Setup

As long as JUnit XML and LCOV files are generated, the test report can be created.

### Deno

Run your tests to generate the JUnit XML file and the `coverage` folder. Then convert the `coverage` folder to a LCOV file.

```bash
deno test --coverage --clean --junit-path test_results/junit.xml
deno coverage --lcov --output=test_results/cov.lcov
```

### Jest

Make sure Jest and Jest-junit are installed:

```bash
npm install --save-dev jest jest-junit
```

Run your tests to with code coverage enabled.

```bash
jest --coverage
```

And in your `jest.config.js` configuration file add the following:

```typescript
module.exports = {
  ...,
  reporters: [
    'default',
    ['jest-junit', {outputDirectory: 'outputFolder', outputName: 'junit.xml'}],
  ]
}
```

### Vitest

Make sure Vitest and a coverage library is installed:

```bash
npm install --save-dev vitest @vitest/coverage-v8
```

An example of a minimal `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['lcov'],
    },
    environment: 'node',
    globals: true,
    include: ['**/*.test.mjs'],
    exclude: ['node_modules', 'dist'],
    reporters: ['junit'],
    outputFile: 'test-results.xml',
  },
});
```

## Code quality

The code quality is measured using unit tests and code coverage. See the [Test report](./test_results/test_results.md) for more information.

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for details.
