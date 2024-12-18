import { buildMarkdownTable, markdownTitle } from '../src/utilities/markdownUtils.ts';
import { extractFilename } from '../src/utilities/miscUtils.ts';
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

Deno.test('extractFilename', () => {
  assertEquals(extractFilename('test/markdownUtils.test.ts'), 'markdownUtils.test.ts');
  assertEquals(extractFilename('test\\markdownUtils.ts'), 'markdownUtils.ts');
  assertEquals(extractFilename('ok'), 'ok');
  assertEquals(extractFilename(''), '');
});
