import demoApps from '@/data/demo-apps.json';

export interface Applet {
  name: string;
  summary: string;
  desc: string;
  author: string;
  tags: string[];
  isOfficialApplet: boolean;
  packageName: string;
  fileName: string;
}

export const applets: Applet[] = demoApps as Applet[];

const CDN_BASE = 'https://applets.pixelrunner.dev';

/** Preview image URL: applets.pixelrunner.dev/$packageName.webp */
export function imageUrl(applet: Pick<Applet, 'packageName'>): string {
  return `${CDN_BASE}/${applet.packageName}.webp`;
}

/** Count applets per tag, most common first. */
export function tagCounts(list: Applet[] = applets): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const applet of list) {
    for (const tag of applet.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** The N most-used tags — used as showcase filter tabs. */
export function topTags(limit = 10, list: Applet[] = applets): string[] {
  return tagCounts(list)
    .slice(0, limit)
    .map((t) => t.tag);
}

/** Applets carrying `tag`, or all when tag is null/"all". */
export function filterByTag(tag: string | null, list: Applet[] = applets): Applet[] {
  if (!tag || tag === 'all') {
    return list;
  }
  return list.filter((applet) => applet.tags.includes(tag));
}
