import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { posthog } from './posthog.js';
import { posthogLog, shutdownPostHogLogs } from './posthog-logs.js';

const app = new Hono();

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
  posthog?.capture({
    event: 'link_created',
    properties: {
      tag_count: tags.length,
      has_description: Boolean(description),
    },
  });
  posthogLog?.emit({
    severityText: 'INFO',
    body: 'link_created',
    attributes: { tag_count: tags.length, has_description: Boolean(description) },
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

  const updatedFields = ['url', 'title', 'description', 'tags', 'favorite'].filter(
    (field) => body[field] !== undefined
  );
  posthog?.capture({
    event: 'link_updated',
    properties: { updated_fields: updatedFields },
  });
  posthogLog?.emit({
    severityText: 'INFO',
    body: 'link_updated',
    attributes: { updated_field_count: updatedFields.length },
  });
  return c.json(link);
});

// Delete a link
app.delete('/api/links/:id', (c) => {
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  links.splice(index, 1);
  posthog?.capture({ event: 'link_deleted' });
  posthogLog?.emit({
    severityText: 'INFO',
    body: 'link_deleted',
    attributes: { link_count: links.length },
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

app.onError((error, c) => {
  posthog?.captureException(error, 'hono-links-api');
  return c.text('Internal Server Error', 500);
});

const PORT = process.env.PORT || 3002;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
});

let isShuttingDown = false;

async function flushAnalyticsOnShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  await Promise.race([
    Promise.all([shutdownPostHogLogs(), posthog?.shutdown(3000).catch(() => {})]),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  process.kill(process.pid, signal);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    void flushAnalyticsOnShutdown(signal);
  });
}
