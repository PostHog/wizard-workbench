import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
  flushAt: 1,
  flushInterval: 0,
});

const app = new Hono();

function getDistinctId(c) {
  return c.req.header('x-posthog-distinct-id') || c.req.header('x-request-id') || 'anonymous_api_user';
}

async function captureLinkEvent(c, event, properties) {
  posthog.capture({
    distinctId: getDistinctId(c),
    event,
    properties,
  });
  await posthog.flush();
}

app.onError(async (err, c) => {
  posthog.captureException(err, getDistinctId(c), {
    endpoint: c.req.path,
    method: c.req.method,
  });
  await posthog.flush();
  return c.json({ error: 'Internal server error' }, 500);
});

const links = [];
let nextId = 1;

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

  return c.json({ links: result, total: result.length });
});

// Save a new link
app.post('/api/links', async (c) => {
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
  await captureLinkEvent(c, 'link_created', {
    tag_count: tags.length,
    has_description: Boolean(description),
  });
  return c.json(link, 201);
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
  const link = links.find((l) => l.id === parseInt(c.req.param('id'), 10));

  if (!link) {
    return c.json({ error: 'Link not found' }, 404);
  }

  const body = await c.req.json();
  if (body.url !== undefined) link.url = body.url;
  if (body.title !== undefined) link.title = body.title;
  if (body.description !== undefined) link.description = body.description;
  if (body.tags !== undefined) link.tags = body.tags;
  if (body.favorite !== undefined) link.favorite = body.favorite;

  await captureLinkEvent(c, 'link_updated', {
    updated_fields: Object.keys(body).filter((key) =>
      ['url', 'title', 'description', 'tags', 'favorite'].includes(key)
    ),
    is_favorite: link.favorite,
    tag_count: link.tags.length,
  });
  return c.json(link);
});

// Delete a link
app.delete('/api/links/:id', async (c) => {
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  const [deletedLink] = links.splice(index, 1);
  await captureLinkEvent(c, 'link_deleted', {
    was_favorite: deletedLink.favorite,
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

async function shutdown() {
  await posthog.shutdown();
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
