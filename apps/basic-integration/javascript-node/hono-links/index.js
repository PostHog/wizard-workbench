import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { posthog, shutdownPostHog } from './posthog.js';
import { posthogLogger, shutdownPostHogLogs } from './posthog-logs.js';

const app = new Hono();

app.onError((error, c) => {
  if (posthog) {
    posthog.captureException(error);
  }

  posthogLogger?.emit({
    severityText: 'ERROR',
    body: 'request failed',
    attributes: {
      operation: 'request_failed',
      http_status_code: 500,
      error_type: 'unhandled_error',
    },
  });

  console.error(error);
  return c.json({ error: 'Internal Server Error' }, 500);
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

  const tagCount = Array.isArray(tags) ? tags.length : 0;

  if (posthog) {
    posthog.capture({
      event: 'link_created',
      properties: {
        tag_count: tagCount,
        has_description: Boolean(description),
      },
    });
  }

  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'link created',
    attributes: {
      operation: 'link_created',
      tag_count: tagCount,
      has_description: Boolean(description),
    },
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

  if (posthog) {
    const updatedFields = Object.keys(body).filter((field) =>
      ['url', 'title', 'description', 'tags'].includes(field)
    );

    if (updatedFields.length > 0) {
      posthog.capture({
        event: 'link_updated',
        properties: { updated_fields: updatedFields },
      });
    }

    if (body.favorite !== undefined) {
      posthog.capture({
        event: 'link_favorite_changed',
        properties: { is_favorite: Boolean(body.favorite) },
      });
    }
  }

  return c.json(link);
});

// Delete a link
app.delete('/api/links/:id', (c) => {
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  links.splice(index, 1);

  if (posthog) {
    posthog.capture({
      event: 'link_deleted',
      properties: { remaining_link_count: links.length },
    });
  }

  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'link deleted',
    attributes: {
      operation: 'link_deleted',
      remaining_link_count: links.length,
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

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await Promise.all([shutdownPostHog(), shutdownPostHogLogs()]);
    process.kill(process.pid, signal);
  });
}

serve({ fetch: app.fetch, port: PORT }, () => {
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'service started',
    attributes: { operation: 'service_started' },
  });
  console.log(`Hono links API running on http://localhost:${PORT}`);
});
