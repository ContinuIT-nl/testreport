# testreport

[![JSR](https://jsr.io/badges/@continuit/testreport)](https://jsr.io/@continuit/testreport)
[![NPM](https://img.shields.io/npm/v/@continuit/testreport?logo=npm)](https://www.npmjs.com/package/@continuit/testreport)
[![ci](https://github.com/ContinuIT-nl/testreport/actions/workflows/ci.yml/badge.svg)](https://github.com/ContinuIT-nl/testreport/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This unitity creates a test report from a JUnit XML file and a LCOV file.
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

Run the testreport utility:

```bash
testreport testreport.json
```

In the above example the test report will be created in the `testresults` directory.
Normally you would reference the test report from the README.md file and the badges from the repository page.
The folder `testdata` with the JUnit XML file and the LCOV file should not be checked into the repository. 
In your CI pipeline you can run the testreport utility and check if the test report is up to date with the current test results.  

```bash
testreport testreport.json --check
```

This will check if the test report is up to date with the current test results.
If the test report is not up to date, the utility will exit with a non-zero exit code.

## Code quality

The code quality is measured using unit tests and code coverage. See the [Test report](./test_results/test_results.md) for more information.

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for details.
