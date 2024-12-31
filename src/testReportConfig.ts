import { z } from 'npm:zod';

const defaultOKColor = '#2EBE4E';
const defaultFailedColor = '#900';
const defaultDisabledColor = '#880';
const defaultLabelColor = '#555';

const styleSchema = z.union([z.literal('flat'), z.literal('rectangle')]).default('flat');

const testBadgeSchema = z.object({
  output: z.string(),
  label: z.string().default('tests'),
  color_label: z.string().default(defaultLabelColor),
  style: styleSchema,
  color_ok: z.string().default(defaultOKColor),
  color_none: z.string().default(defaultDisabledColor),
  color_disabled: z.string().default(defaultDisabledColor),
  color_failed: z.string().default(defaultFailedColor),
});

const coverageBadgeSchema = z.object({
  output: z.string(),
  label: z.string().default('coverage'),
  color_label: z.string().default(defaultLabelColor),
  style: styleSchema,
  levels: z.array(z.object({
    threshold: z.number(),
    color: z.string(),
  })).default([
    { threshold: 80, color: defaultOKColor },
    { threshold: 50, color: defaultDisabledColor },
    { threshold: 0, color: defaultFailedColor },
  ]),
});

export const testReportConfigSchema = z.object({
  /**
   * Schema version.
   */
  $schema: z.string().default(
    'https://github.com/ContinuIT-nl/testreport/blob/main/configSchema/testReportConfigSchema.json',
  ),

  input: z.object({
    junit: z.array(z.string()),
    coverage: z.array(z.string()),
  }),

  limits: z.object({
    test_percentage_failed: z.number().default(0),
    test_percentage_disabled: z.number().default(0),
    coverage_percentage_minimal: z.number().default(0),
  }).optional(),

  manifest: z.object({
    output: z.string(),
  }).optional(),

  markdown: z.object({
    output: z.string(),
    badges: z.boolean().default(true),
    collapseDetails: z.boolean().default(false),
  }).optional(),

  testBadge: testBadgeSchema.optional(),

  coverageBadge: coverageBadgeSchema.optional(),
});

/**
 * Type definition for the test report configuration.
 */
export type TestReportConfig = z.infer<typeof testReportConfigSchema>;

export type CoverageBadgeConfig = z.infer<typeof coverageBadgeSchema>;
export type TestBadgeConfig = z.infer<typeof testBadgeSchema>;
