export type ShortLink = {
  slug: string;
  url: string;
  createdAt: string;
  clicks: number;
};

const links = new Map<string, ShortLink>([
  [
    "docs",
    {
      slug: "docs",
      url: "https://developers.cloudflare.com/workers/",
      createdAt: "2026-09-01T09:00:00.000Z",
      clicks: 128,
    },
  ],
  [
    "hono",
    {
      slug: "hono",
      url: "https://hono.dev",
      createdAt: "2026-09-14T16:30:00.000Z",
      clicks: 57,
    },
  ],
]);

export function getLink(slug: string): ShortLink | undefined {
  return links.get(slug);
}

export function saveLink(slug: string, url: string): ShortLink {
  const link: ShortLink = {
    slug,
    url,
    createdAt: new Date().toISOString(),
    clicks: 0,
  };
  links.set(slug, link);
  return link;
}

export function listLinks(): ShortLink[] {
  return [...links.values()];
}
