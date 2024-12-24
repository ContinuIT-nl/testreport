import type { TestReportConfig } from './testReportConfig.ts';
import type { Manifest } from './testReportToManifest.ts';
import { createBadgeSvg } from './utilities/createBadgeSvg.ts';

export function createTestBadge(reportConfig: TestReportConfig, manifest: Manifest): string {
  const messageColor = {
    'no tests': reportConfig.constants.test_message_color_failed,
    failed: reportConfig.constants.test_message_color_failed,
    skipped: reportConfig.constants.test_message_color_disabled,
    passed: reportConfig.constants.test_message_color_ok,
  }[manifest.test_status];

  const message = {
    'no tests': `${manifest.test_status}`,
    failed: `${manifest.test_failed}/${manifest.test_total} ${manifest.test_status}`,
    skipped: `${manifest.test_skipped}/${manifest.test_total} ${manifest.test_status}`,
    passed: `${manifest.test_passed}/${manifest.test_total} ${manifest.test_status}`,
  }[manifest.test_status];

  return createBadgeSvg({
    label: reportConfig.constants.test_label,
    message,
    labelColor: reportConfig.constants.test_label_color,
    messageColor,
    rounded: reportConfig.constants.test_rounded,
  });
}

export const createCoverageBadge = (reportConfig: TestReportConfig, manifest: Manifest): string =>
  createBadgeSvg({
    label: reportConfig.constants.coverage_label,
    message: manifest.coverage_percentage,
    labelColor: reportConfig.constants.coverage_label_color,
    messageColor: manifest.coverage_status === 'ok'
      ? reportConfig.constants.coverage_message_color_ok
      : reportConfig.constants.coverage_message_color_failed,
    rounded: reportConfig.constants.coverage_rounded,
  });
