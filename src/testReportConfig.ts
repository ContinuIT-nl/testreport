import {
  array,
  boolean,
  type InferOutput,
  literal,
  number,
  object,
  optional,
  parse,
  string,
  union,
} from '@valibot/valibot';

const defaultOKColor = '#2EBE4E';
const defaultFailedColor = '#900';
const defaultDisabledColor = '#880';
const defaultLabelColor = '#555';

const styleSchema = optional(union([literal('flat'), literal('rectangle')]), 'flat');

const testBadgeSchema = object({
  output: string(),
  label: optional(string(), 'tests'),
  color_label: optional(string(), defaultLabelColor),
  style: optional(styleSchema, 'flat'),
  color_ok: optional(string(), defaultOKColor),
  color_none: optional(string(), defaultDisabledColor),
  color_disabled: optional(string(), defaultDisabledColor),
  color_failed: optional(string(), defaultFailedColor),
});

const coverageBadgeSchema = object({
  output: string(),
  label: optional(string(), 'coverage'),
  color_label: optional(string(), defaultLabelColor),
  style: optional(styleSchema, 'flat'),
  levels: optional(
    array(object({
      threshold: number(),
      color: string(),
    })),
    [
      { threshold: 80, color: defaultOKColor },
      { threshold: 50, color: defaultDisabledColor },
      { threshold: 0, color: defaultFailedColor },
    ],
  ),
});

export const testReportConfigSchema = object({
  /**
   * Schema version.
   */
  $schema: optional(
    string(),
    'https://raw.githubusercontent.com/ContinuIT-nl/testreport/refs/heads/main/configSchema/testReportConfigSchema.json',
  ),

  input: object({
    junit: array(string()),
    coverage: array(string()),
  }),

  limits: optional(object({
    test_percentage_failed: optional(number(), 0),
    test_percentage_disabled: optional(number(), 0),
    coverage_percentage_minimal: optional(number(), 0),
  })),

  manifest: optional(object({
    output: string(),
  })),

  markdown: optional(object({
    output: string(),
    badges: optional(boolean(), false),
    collapseDetails: optional(boolean(), false),
  })),

  testBadge: optional(testBadgeSchema),

  coverageBadge: optional(coverageBadgeSchema),
});

/**
 * Type definition for the test report configuration.
 */
export type TestReportConfig = InferOutput<typeof testReportConfigSchema>;

export type CoverageBadgeConfig = InferOutput<typeof coverageBadgeSchema>;
export type TestBadgeConfig = InferOutput<typeof testBadgeSchema>;

export function parseTestReportConfig(configText: string) {
  return parse(testReportConfigSchema, JSON.parse(configText));
}
