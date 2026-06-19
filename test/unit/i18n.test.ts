import { describe, expect, it } from 'vitest';

import en from '../../translations/en.json';
import nl from '../../translations/nl.json';

// Recursively collect dotted key paths from a translation tree.
function keys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') {
    return [prefix];
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k)
  );
}

describe('translations', () => {
  it('nl.json has exactly the same keys as en.json (no missing/extra)', () => {
    expect(keys(nl).sort()).toEqual(keys(en).sort());
  });
});
