import { assert, assertEquals } from '@std/assert';
import { createBadgeSvg, getWidthVerdana110 } from '../src/utilities/createBadgeSvg.ts';

Deno.test('getWidth', () => {
  assertEquals(getWidthVerdana110('x'), 65);
  assertEquals(getWidthVerdana110('\0'), 0);
  assertEquals(getWidthVerdana110('马'), 65, 'glyph is not in Verdana');
  assertEquals(getWidthVerdana110('😊'), 65, 'emoji is not in Verdana');
});

Deno.test('createBadge', () => {
  const badge = createBadgeSvg({
    label: 'tests',
    message: '100%',
    labelColor: '#555',
    messageColor: '#3C1',
    rounded: true,
  });
  assert(badge.includes('tests'), 'badge should contain tests');
  assert(badge.includes('100%'), 'badge should contain 100%');
});

Deno.test('createBadge_no_message', () => {
  const badge_no_message = createBadgeSvg({
    label: 'tests',
    labelColor: '#555',
    rounded: true,
  });
  assert(badge_no_message.includes('tests'), 'badge_no_message should contain tests');
});
