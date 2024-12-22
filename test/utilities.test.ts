import { buildMarkdownTable, markdownTitle } from '../src/utilities/markdownUtils.ts';
import { exportOutput, extractFilename } from '../src/utilities/miscUtils.ts';
import { assertEquals } from '@std/assert';
import { equal } from '../src/utilities/equal.ts';

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

// todo: test equal
Deno.test('equal', () => {
  // simple types
  assertEquals(equal(1, 1), true);
  assertEquals(equal(1, 2), false);
  assertEquals(equal(null, null), true);
  assertEquals(equal(null, undefined), false);
  assertEquals(equal(undefined, undefined), true);
  assertEquals(equal(undefined, null), false);
  assertEquals(equal(true, true), true);
  assertEquals(equal(true, false), false);
  assertEquals(equal('a', 'a'), true);
  assertEquals(equal('a', 'b'), false);
  assertEquals(equal(1, '1'), false);
  assertEquals(equal(1, 1.1), false);

  // Arrays
  assertEquals(equal([1, 2, 3], [1, 2, 3]), true);
  assertEquals(equal([1, 2, 3], [1, 2, 4]), false);
  assertEquals(equal([1, 2, 3], [1, 2, 3, 4]), false);
  assertEquals(equal([1, 2, 3], [1, 2, 3, 4]), false);

  // Dates
  const now = new Date();
  assertEquals(equal(now, now), true);
  assertEquals(equal(now, now.getTime()), false);
  assertEquals(equal(now, new Date(now.getTime() + 1)), false);

  // Objects
  assertEquals(equal({ a: 1 }, { a: 1 }), true);
  assertEquals(equal({ a: 1 }, { a: 2 }), false);
  assertEquals(equal({ a: 1 }, { a: 1, b: 2 }), false);
  assertEquals(equal({ a: 1, b: 2 }, { a: 1 }), false);
  assertEquals(equal({ a: 1, b: 2 }, { c: 1 }), false);

  // unequal types
  assertEquals(equal(1, '1'), false);
  assertEquals(equal(1, 1.1), false);
  assertEquals(equal(1, null), false);
  assertEquals(equal(null, undefined), false);
  assertEquals(equal(undefined, null), false);
  assertEquals(equal(true, 'true'), false);
  assertEquals(equal(true, 1), false);
  assertEquals(equal(true, 0), false);
  assertEquals(equal(true, false), false);
  assertEquals(equal(true, { a: 1 }), false);
  assertEquals(equal(true, [1, 2, 3]), false);
  assertEquals(equal(true, new Date()), false);
  assertEquals(equal({ a: 1 }, 1), false);
  assertEquals(equal([1, 2, 3], 1), false);
  assertEquals(equal(new Date(), 1), false);
});
