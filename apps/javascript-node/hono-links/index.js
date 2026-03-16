import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';

const app = new Hono();

const links = [];
let nextId = 1;

// --- PostHog Setup ---

function initializePosthog() {
  const projectToken = process.env.POSTHOG_PROJECT_TOKEN;

  if (!projectToken) {
    console.log('WARNING: PostHog not configured (POSTHOG_PROJECT_TOKEN not set)');
    return null;
  }

  return new PostHog(projectToken, {
    host: process.env.POSTHOG_HOST,
  });
}

const posthog = initializePosthog();

function trackEvent(distinctId, event, properties = {}) {
  if (!posthog) return;
  posthog.capture({ distinctId, event, properties });
}

// --- Routes ---

// List links (with optional tag filter and search)
app.get('/api/links', (c) => {
  let result = links;
  const tag = c.req.query('tag');
  const search = c.req.query('search');
  const favoritesOnly = c.req.query('favorites');
  const userId = c.req.query('user_id') || 'anonymous';

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

  trackEvent(userId, 'links_listed', {
    total: result.length,
    filtered_by_tag: tag || null,
    filtered_by_search: !!search,
    favorites_only: favoritesOnly === 'true',
  });

  return c.json({ links: result, total: result.length });
});

// Save a new link
app.post('/api/links', async (c) => {
  const { url, title, tags = [], description = '', user_id } = await c.req.json();

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

  const userId = user_id || 'anonymous';
  trackEvent(userId, 'link_saved', {
    link_id: link.id,
    tag_count: tags.length,
    has_description: !!description,
  });

  return c.json(link, 201);
});

// Get a single link
app.get('/api/links/:id', (c) => {
  const link = links.find((l) => l.id === parseInt(c.req.param('id'), 10));

  if (!link) {
    return c.json({ error: 'Link not found' }, 404);
  }

  const userId = c.req.query('user_id') || 'anonymous';
  trackEvent(userId, 'link_viewed', { link_id: link.id });

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

  const userId = body.user_id || 'anonymous';
  trackEvent(userId, 'link_updated', {
    link_id: link.id,
    favorite: link.favorite,
  });

  return c.json(link);
});

// Delete a link
app.delete('/api/links/:id', (c) => {
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  const link = links[index];
  const userId = c.req.query('user_id') || 'anonymous';
  links.splice(index, 1);

  trackEvent(userId, 'link_deleted', { link_id: link.id });

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

  const userId = c.req.query('user_id') || 'anonymous';
  trackEvent(userId, 'tags_listed', { unique_tags: Object.keys(tagCounts).length });

  return c.json({ tags: tagCounts });
});

const PORT = process.env.PORT || 3002;

const server = serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
});

// Graceful shutdown — flush PostHog events before exiting
async function shutdown() {
  server.close();
  if (posthog) {
    await posthog.shutdown();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
