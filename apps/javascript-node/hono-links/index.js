import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';

const app = new Hono();

const links = [];
let nextId = 1;

// --- PostHog Setup ---

function initializePosthog() {
  const apiKey = process.env.POSTHOG_API_KEY;

  if (!apiKey) {
    console.log('WARNING: PostHog not configured (POSTHOG_API_KEY not set)');
    console.log('         App will work but analytics won\'t be tracked');
    return null;
  }

  return new PostHog(apiKey, {
    host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    enableExceptionAutocapture: true,
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
  const userId = c.req.header('x-user-id') || 'anonymous';

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

  if (search || tag) {
    trackEvent(userId, 'links_searched', {
      search_query: search || null,
      tag_filter: tag || null,
      favorites_only: favoritesOnly === 'true',
      results_count: result.length,
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

  const userId = c.req.header('x-user-id') || 'anonymous';

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

  trackEvent(userId, 'link_created', {
    link_id: link.id,
    has_description: description.length > 0,
    tag_count: tags.length,
    total_links: links.length,
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
  const userId = c.req.header('x-user-id') || 'anonymous';

  const prevFavorite = link.favorite;

  if (body.url !== undefined) link.url = body.url;
  if (body.title !== undefined) link.title = body.title;
  if (body.description !== undefined) link.description = body.description;
  if (body.tags !== undefined) link.tags = body.tags;
  if (body.favorite !== undefined) link.favorite = body.favorite;

  // Track favorite toggle as its own event
  if (body.favorite !== undefined && body.favorite !== prevFavorite) {
    trackEvent(userId, 'link_favorited', {
      link_id: link.id,
      favorited: link.favorite,
    });
  }

  // Track general field updates (excluding pure favorite toggles)
  const updatedFields = Object.keys(body).filter((k) => k !== 'favorite');
  if (updatedFields.length > 0) {
    trackEvent(userId, 'link_updated', {
      link_id: link.id,
      updated_fields: updatedFields,
    });
  }

  return c.json(link);
});

// Delete a link
app.delete('/api/links/:id', (c) => {
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  const userId = c.req.header('x-user-id') || 'anonymous';
  const [deleted] = links.splice(index, 1);

  trackEvent(userId, 'link_deleted', {
    link_id: deleted.id,
    was_favorite: deleted.favorite,
    tag_count: deleted.tags.length,
    age_hours: (Date.now() - new Date(deleted.created_at)) / 3600000,
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

// --- Error Handling ---

app.onError((err, c) => {
  const userId = c.req.header('x-user-id') || 'anonymous';

  if (posthog) {
    posthog.captureException(err, userId);
  }

  console.error('Unhandled error:', err.message);
  return c.json({ error: 'Internal server error' }, 500);
});

// --- Server ---

const PORT = process.env.PORT || 3002;

const server = serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
});

// Graceful shutdown — flush PostHog events before exiting
async function shutdown() {
  console.log('\nShutting down...');
  server.close();
  if (posthog) {
    await posthog.shutdown();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
