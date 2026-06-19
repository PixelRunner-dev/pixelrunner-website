import { describe, expect, it } from 'vitest';

import {
  applets,
  filterByTag,
  imageUrl,
  tagCounts,
  topTags,
  type Applet
} from '@/lib/applets';

const sample: Applet[] = [
  mk('Buienradar', 'buienradar', 'buienradar', ['weather']),
  mk('Wrigley Clock', 'wrigleyclock', 'wrigley_clock', ['clock']),
  mk('Jacket', 'jacket', 'jacket', ['weather', 'tracking'])
];

function mk(name: string, packageName: string, fileName: string, tags: string[]): Applet {
  return { name, summary: name, desc: name, author: 'x', tags, isOfficialApplet: false, packageName, fileName };
}

describe('imageUrl', () => {
  it('builds applets.pixelrunner.dev/$packageName.webp', () => {
    expect(imageUrl({ packageName: 'wrigleyclock' })).toBe(
      'https://applets.pixelrunner.dev/wrigleyclock.webp'
    );
  });

  it('every bundled applet produces a valid CDN url', () => {
    for (const applet of applets) {
      expect(imageUrl(applet)).toMatch(
        /^https:\/\/applets\.pixelrunner\.dev\/[^/]+\.webp$/
      );
    }
  });
});

describe('tagCounts / topTags', () => {
  it('counts tags across multi-tag entries, most common first', () => {
    expect(tagCounts(sample)).toEqual([
      { tag: 'weather', count: 2 },
      { tag: 'clock', count: 1 },
      { tag: 'tracking', count: 1 }
    ]);
    expect(topTags(2, sample)).toEqual(['weather', 'clock']);
  });
});

describe('filterByTag', () => {
  it('returns entries carrying the tag', () => {
    expect(filterByTag('weather', sample).map((a) => a.packageName)).toEqual([
      'buienradar',
      'jacket'
    ]);
  });

  it('returns all for null or "all"', () => {
    expect(filterByTag(null, sample)).toHaveLength(3);
    expect(filterByTag('all', sample)).toHaveLength(3);
  });
});

describe('bundled data', () => {
  it('has 85 applets, all with a fileName', () => {
    expect(applets).toHaveLength(85);
    expect(applets.every((a) => typeof a.fileName === 'string' && a.fileName.length > 0)).toBe(true);
  });
});
