import { z } from 'npm:zod';

export const testReportConfigSchema = z.object({
  test_results: z.object({
    junit: z.array(z.string()),
    coverage: z.array(z.string()),
  }),
  output: z.object({
    markdown: z.string().optional(),
    manifest: z.string(),
    testBadge: z.string().optional(),
    coverageBadge: z.string().optional(),
  }),
});

export type TestReportConfig = z.infer<typeof testReportConfigSchema>;
