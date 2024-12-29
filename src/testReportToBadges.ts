import type { CoverageBadgeConfig, TestBadgeConfig } from './testReportConfig.ts';
import type { Manifest } from './testReportToManifest.ts';
import { createBadgeSvg } from './utilities/createBadgeSvg.ts';

export function createTestBadge(config: TestBadgeConfig, manifest: Manifest): string {
  const messageColor = {
    'no tests': config.color_none,
    failed: config.color_failed,
    skipped: config.color_disabled,
    passed: config.color_ok,
  }[manifest.test_status];

  const message = {
    'no tests': `${manifest.test_status}`,
    failed: `${manifest.test_failed}/${manifest.test_total} ${manifest.test_status}`,
    skipped: `${manifest.test_skipped}/${manifest.test_total} ${manifest.test_status}`,
    passed: `${manifest.test_passed}/${manifest.test_total} ${manifest.test_status}`,
  }[manifest.test_status];

  return createBadgeSvg({
    label: config.label,
    message,
    labelColor: config.color_label,
    messageColor,
    rounded: config.style === 'flat',
  });
}

export const createCoverageBadge = (config: CoverageBadgeConfig, manifest: Manifest): string =>
  // Derive color
  createBadgeSvg({
    label: config.label,
    message: manifest.coverage_percentage,
    labelColor: config.color_label,
    messageColor: manifest.coverage_color,
    rounded: config.style === 'flat',
  });
