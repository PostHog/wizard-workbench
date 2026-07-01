import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const app = new Hono();

const links = [];
let nextId = 1;

function getDistinctId(c) {
  return (
    c.req.header('x-posthog-distinct-id') ||
    c.req.header('x-forwarded-for') ||
    c.req.header('x-real-ip') ||
    'anonymous'
  );
}

// List links (with optional tag filter and search)
app.get('/api/links', (c) => {
  let result = links;
  const tag = c.req.query('tag');
  const search = c.req.query('search');
  const favoritesOnly = c.req.query('favorites');

  if (tag) {
    result = result.filter((l) => l.tags.includes(tag));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
    );
  }
  if (favoritesOnly === 'true') {
    result = result.filter((l) => l.favorite);
  }

  if (tag || search || favoritesOnly) {
    posthog.capture({
      distinctId: getDistinctId(c),
      event: 'links_searched',
      properties: {
        tag: tag || null,
        search: search || null,
        favorites_only: favoritesOnly === 'true',
        result_count: result.length,
      },
    });
  }

  return c.json({ links: result, total: result.length });
});

// Save a new link
app.post('/api/links', async (c) => {
  const distinctId = getDistinctId(c);
  try {
    const { url, title, tags = [], description = '' } = await c.req.json();

    if (!url || !title) {
      return c.json({ error: 'url and title are required' }, 400);
    }

    const link = {
      id: nextId++,
      url,
      title,
      description,
      tags,
      favorite: false,
      created_at: new Date().toISOString(),
    };
    links.push(link);

    posthog.capture({
      distinctId,
      event: 'link_saved',
      properties: {
        link_id: link.id,
        url: link.url,
        title: link.title,
        tag_count: tags.length,
        has_description: description.length > 0,
      },
    });

    return c.json(link, 201);
  } catch (err) {
    posthog.captureException(err, distinctId);
    throw err;
  }
});

// Get a single link
app.get('/api/links/:id', (c) => {
  const link = links.find((l) => l.id === parseInt(c.req.param('id'), 10));

  if (!link) {
    return c.json({ error: 'Link not found' }, 404);
  }

  return c.json(link);
});

// Update a link
app.patch('/api/links/:id', async (c) => {
  const distinctId = getDistinctId(c);
  try {
    const link = links.find((l) => l.id === parseInt(c.req.param('id'), 10));

    if (!link) {
      return c.json({ error: 'Link not found' }, 404);
    }

    const body = await c.req.json();
    const prevFavorite = link.favorite;

    if (body.url !== undefined) link.url = body.url;
    if (body.title !== undefined) link.title = body.title;
    if (body.description !== undefined) link.description = body.description;
    if (body.tags !== undefined) link.tags = body.tags;
    if (body.favorite !== undefined) link.favorite = body.favorite;

    if (body.favorite !== undefined && body.favorite !== prevFavorite) {
      posthog.capture({
        distinctId,
        event: 'link_favorited',
        properties: {
          link_id: link.id,
          favorited: link.favorite,
        },
      });
    } else {
      posthog.capture({
        distinctId,
        event: 'link_updated',
        properties: {
          link_id: link.id,
          fields_updated: Object.keys(body),
        },
      });
    }

    return c.json(link);
  } catch (err) {
    posthog.captureException(err, distinctId);
    throw err;
  }
});

// Delete a link
app.delete('/api/links/:id', (c) => {
  const distinctId = getDistinctId(c);
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  const [deleted] = links.splice(index, 1);

  posthog.capture({
    distinctId,
    event: 'link_deleted',
    properties: {
      link_id: deleted.id,
      url: deleted.url,
      title: deleted.title,
    },
  });

  return c.body(null, 204);
});

// List all tags
app.get('/api/tags', (c) => {
  const tagCounts = {};
  for (const link of links) {
    for (const tag of link.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  return c.json({ tags: tagCounts });
});

const PORT = process.env.PORT || 3002;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});
