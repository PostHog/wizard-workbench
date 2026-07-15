import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';
import { loadEnvFile } from 'node:process';

loadEnvFile();

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});
const app = new Hono();

const getDistinctId = (c) => c.req.header('x-posthog-distinct-id') || 'anonymous';

const captureEvent = async (c, event, properties = {}) => {
  posthog.capture({ distinctId: getDistinctId(c), event, properties });
  await posthog.flush();
};

const links = [];
let nextId = 1;

// List links (with optional tag filter and search)
app.get('/api/links', async (c) => {
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

  if (tag || search || favoritesOnly === 'true') {
    await captureEvent(c, 'links_searched', {
      has_tag_filter: Boolean(tag),
      has_search_query: Boolean(search),
      favorites_only: favoritesOnly === 'true',
      result_count: result.length,
    });
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
  await captureEvent(c, 'link_created', {
    link_id: link.id,
    tag_count: link.tags.length,
    has_description: Boolean(link.description),
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

  await captureEvent(c, 'link_updated', {
    link_id: link.id,
    updated_fields: Object.keys(body).filter((field) =>
      ['url', 'title', 'description', 'tags', 'favorite'].includes(field)
    ),
  });
  return c.json(link);
});

// Delete a link
app.delete('/api/links/:id', async (c) => {
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  links.splice(index, 1);
  await captureEvent(c, 'link_deleted', { link_id: parseInt(c.req.param('id'), 10) });
  return c.body(null, 204);
});

app.onError(async (error, c) => {
  posthog.captureException(error, getDistinctId(c), {
    route: c.req.path,
    method: c.req.method,
  });
  await posthog.flush();
  return c.json({ error: 'Internal server error' }, 500);
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

const shutdown = async () => {
  await posthog.shutdown();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
