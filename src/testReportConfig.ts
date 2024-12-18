import { z } from 'npm:zod';

const defaultOKColor = '#3C1';
const defaultFailedColor = '#900';
const defaultDisabledColor = '#880';
const defaultLabelColor = '#555';
export const testReportConfigSchema = z.object({
  test_results: z.object({
    /**
     * Array of file paths to JUnit test result files.
     */
    junit: z.array(z.string()),
    /**
     * Array of file paths to coverage result files.
     */
    coverage: z.array(z.string()),
  }),
  constants: z.object({
    /**
     * Label for the test badge.
     * Default value is 'tests'.
     */
    test_label: z.string().default('tests'),
    /**
     * Label color for the test badge when disabled.
     * Default value is '#555'.
     */
    test_label_color: z.string().default(defaultLabelColor),
    /**
     * Message color for the test badge.
     * Default value is '#3C1'.
     */
    test_message_color_ok: z.string().default(defaultOKColor),
    /**
     * Message color for the test badge when failed.
     * Default value is '#900'.
     */
    test_message_color_failed: z.string().default(defaultFailedColor),
    /**
     * Message color for the test badge when disabled.
     * Default value is '#880'.
     */
    test_message_color_disabled: z.string().default(defaultDisabledColor),
    /**
     * Determines if the test badge should have rounded corners.
     * Default value is true.
     */
    test_rounded: z.boolean().default(true),

    /**
     * Label for the coverage badge.
     * Default value is 'coverage'.
     */
    coverage_label: z.string().default('coverage'),
    /**
     * Label color for the coverage badge.
     * Default value is '#555'.
     */
    coverage_label_color: z.string().default(defaultLabelColor),
    /**
     * Message color for the coverage badge.
     * Default value is '#3C1'.
     */
    coverage_message_color_ok: z.string().default(defaultOKColor),
    /**
     * Message color for the coverage badge when failed.
     * Default value is '#900'.
     */
    coverage_message_color_failed: z.string().default(defaultFailedColor),
    /**
     * Message color for the coverage badge when disabled.
     * Default value is '#880'.
     */
    coverage_message_color_disabled: z.string().default(defaultDisabledColor),
    /**
     * Determines if the coverage badge should have rounded corners.
     * Default value is true.
     */
    coverage_rounded: z.boolean().default(true),
    /**
     * Threshold for the coverage badge to turn green.
     * Default value is 80.
     */
    coverage_threshold: z.number().default(80),
  }).default({
    test_label: 'tests',
    test_label_color: defaultLabelColor,
    test_message_color_ok: defaultOKColor,
    test_message_color_failed: defaultFailedColor,
    test_message_color_disabled: defaultDisabledColor,
    test_rounded: true,

    coverage_label: 'coverage',
    coverage_label_color: defaultLabelColor,
    coverage_message_color_ok: defaultOKColor,
    coverage_message_color_failed: defaultFailedColor,
    coverage_message_color_disabled: defaultDisabledColor,
    coverage_rounded: true,
    coverage_threshold: 80,
  }),
  /**
   * Output configuration for the test report.
   */
  output: z.object({
    /**
     * File path for the markdown output.
     * This field is optional.
     */
    markdown: z.string().optional(),
    /**
     * File path for the manifest output.
     */
    manifest: z.string(),
    /**
     * File path for the test badge output.
     * This field is optional.
     */
    testBadge: z.string().optional(),
    /**
     * File path for the coverage badge output.
     * This field is optional.
     */
    coverageBadge: z.string().optional(),
  }),
});

/**
 * Type definition for the test report configuration.
 */
export type TestReportConfig = z.infer<typeof testReportConfigSchema>;
