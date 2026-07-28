export interface Release {
  slug: string;
  version: string;
  title: string;
  date: string;
  summary: string;
  notes: string[];
  reactions: number;
}

const releases: Release[] = [
  {
    slug: 'v2-4-0',
    version: '2.4.0',
    title: 'Saved views everywhere',
    date: '2026-06-18',
    summary: 'Save any filtered list and share it with your team.',
    notes: [
      'Saved views on the issue list, the deploy log, and search',
      'Views can be shared read-only with a link',
      'Keyboard shortcut: press v to open the view switcher',
    ],
    reactions: 24,
  },
  {
    slug: 'v2-3-2',
    version: '2.3.2',
    title: 'Faster deploy log',
    date: '2026-05-30',
    summary: 'The deploy log now streams instead of polling.',
    notes: [
      'Log lines stream over SSE',
      'Fixed a crash when a deploy had no build step',
      'Reduced the log bundle by 40%',
    ],
    reactions: 11,
  },
  {
    slug: 'v2-3-0',
    version: '2.3.0',
    title: 'Environments',
    date: '2026-05-02',
    summary: 'Group deploys by environment instead of by branch.',
    notes: [
      'New environments settings page',
      'Per-environment secrets',
      'Branch mapping is now optional',
    ],
    reactions: 37,
  },
];

const subscribers = new Set<string>();

export function listReleases(): Release[] {
  return releases;
}

export function findRelease(slug: string): Release | undefined {
  return releases.find((release) => release.slug === slug);
}

export function react(slug: string): Release | undefined {
  const release = findRelease(slug);
  if (!release) return undefined;

  release.reactions += 1;
  return release;
}

export function subscribe(email: string): { subscribed: boolean; total: number } {
  const alreadySubscribed = subscribers.has(email);
  subscribers.add(email);
  return { subscribed: !alreadySubscribed, total: subscribers.size };
}
