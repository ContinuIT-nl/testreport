import { assertEquals } from '@std/assert';
import { createBadgeSvg, getWidthVerdana110 } from '../src/createBadgeSvg.ts';

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
    rounded: true
  });
  console.log(badge);
});

Deno.test('createBadge_no_message', () => {
  const badge_no_message = createBadgeSvg({
    label: 'tests',
    labelColor: '#555',
    rounded: true
  });
  console.log(badge_no_message);
});
