import { buildMarkdownTable, markdownTitle } from '../src/utilities/markdownUtils.ts';
import { exportOutput, percentage, percentageNoZero } from '../src/utilities/miscUtils.ts';
import { assertEquals } from '@std/assert';

const testTable = [
  ['Header 1', 'Header 2', 'Header 3'],
  ['Row 1, Column 1', 'Row 1, Column 2', 'Row 1, Column 3'],
  ['Row 2, Column 1', 'Row 2, Column 2', 'Row 2, Column 3'],
];

const expectedTable = [
  '| Header 1        | Header 2        | Header 3        |',
  '| :-------------- | :-------------: | --------------: |',
  '| Row 1, Column 1 | Row 1, Column 2 | Row 1, Column 3 |',
  '| Row 2, Column 1 | Row 2, Column 2 | Row 2, Column 3 |',
  '',
];

Deno.test('buildMarkdownTable', () => {
  const tableMarkdown = buildMarkdownTable(testTable[0], ['left', 'center', 'right'], testTable.slice(1));
  assertEquals(tableMarkdown, expectedTable);
});

Deno.test('markdownTitle', () => {
  assertEquals(markdownTitle('Test Title', 2), ['## Test Title', '']);
  assertEquals(markdownTitle('Test Title!', 3), ['### Test Title!', '']);
});

Deno.test('exportOutput', async () => {
  // empty filename means nothing is saved
  await exportOutput(undefined, () => 'test');
  await exportOutput('', () => 'test');

  // See if file contents is expected
  const filename = 'test_results/test_results.txt';
  await exportOutput(filename, () => 'test');
  const file = await Deno.readTextFile(filename);
  assertEquals(file, 'test');
});

Deno.test('percentage', () => {
  assertEquals(percentage(1, 10), '10.0%');
  assertEquals(percentage(0, 10), '0.0%');
  assertEquals(percentage(1, 0), 'N/A');
});

Deno.test('percentageNoZero', () => {
  assertEquals(percentageNoZero(1, 10), '10.0%');
  assertEquals(percentageNoZero(0, 10), '');
  assertEquals(percentageNoZero(1, 0), 'N/A');
});
