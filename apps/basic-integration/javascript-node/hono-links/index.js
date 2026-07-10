import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';

const app = new Hono();

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const links = [];
let nextId = 1;

function getDistinctId(c) {
  return c.req.header('x-user-id') || c.req.header('x-posthog-distinct-id') || 'anonymous';
}

function identifyRequestUser(c) {
  const distinctId = getDistinctId(c);

  if (distinctId !== 'anonymous') {
    posthog.identify({
      distinctId,
      properties: {
        last_seen_path: c.req.path,
        last_request_method: c.req.method,
      },
    });
  }

  return distinctId;
}

function getBaseProperties(c) {
  return {
    path: c.req.path,
    method: c.req.method,
    has_tag_filter: Boolean(c.req.query('tag')),
    has_search_query: Boolean(c.req.query('search')),
    favorites_only: c.req.query('favorites') === 'true',
  };
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

  if (tag || search || favoritesOnly === 'true') {
    const distinctId = identifyRequestUser(c);

    posthog.capture({
      distinctId,
      event: 'links_filtered',
      properties: {
        ...getBaseProperties(c),
        tag: tag || null,
        search_length: search ? search.length : 0,
        result_count: result.length,
      },
    });
  }

  return c.json({ links: result, total: result.length });
});

// Save a new link
app.post('/api/links', async (c) => {
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

    const distinctId = identifyRequestUser(c);

    posthog.capture({
      distinctId,
      event: 'link_created',
      properties: {
        path: c.req.path,
        method: c.req.method,
        tag_count: tags.length,
        has_description: Boolean(description),
        favorite: link.favorite,
        link_id: link.id,
      },
    });

    return c.json(link, 201);
  } catch (err) {
    posthog.captureException(err, identifyRequestUser(c), {
      path: c.req.path,
      method: c.req.method,
      operation: 'create_link',
    });
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
  try {
    const link = links.find((l) => l.id === parseInt(c.req.param('id'), 10));

    if (!link) {
      return c.json({ error: 'Link not found' }, 404);
    }

    const body = await c.req.json();
    const previousFavorite = link.favorite;
    if (body.url !== undefined) link.url = body.url;
    if (body.title !== undefined) link.title = body.title;
    if (body.description !== undefined) link.description = body.description;
    if (body.tags !== undefined) link.tags = body.tags;
    if (body.favorite !== undefined) link.favorite = body.favorite;

    const distinctId = identifyRequestUser(c);

    posthog.capture({
      distinctId,
      event: 'link_updated',
      properties: {
        path: c.req.path,
        method: c.req.method,
        link_id: link.id,
        changed_fields: Object.keys(body),
        favorite: link.favorite,
        tag_count: Array.isArray(link.tags) ? link.tags.length : 0,
      },
    });

    if (body.favorite !== undefined && body.favorite !== previousFavorite) {
      posthog.capture({
        distinctId,
        event: 'favorite_toggled',
        properties: {
          path: c.req.path,
          method: c.req.method,
          link_id: link.id,
          favorite: link.favorite,
        },
      });
    }

    return c.json(link);
  } catch (err) {
    posthog.captureException(err, identifyRequestUser(c), {
      path: c.req.path,
      method: c.req.method,
      operation: 'update_link',
    });
    throw err;
  }
});

// Delete a link
app.delete('/api/links/:id', (c) => {
  const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

  if (index === -1) {
    return c.json({ error: 'Link not found' }, 404);
  }

  const [deletedLink] = links.splice(index, 1);
  const distinctId = identifyRequestUser(c);

  posthog.capture({
    distinctId,
    event: 'link_deleted',
    properties: {
      path: c.req.path,
      method: c.req.method,
      link_id: deletedLink.id,
      favorite: deletedLink.favorite,
      tag_count: Array.isArray(deletedLink.tags) ? deletedLink.tags.length : 0,
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

const shutdownSignals = ['SIGINT', 'SIGTERM'];
for (const signal of shutdownSignals) {
  process.on(signal, async () => {
    await posthog.shutdown();
    process.exit(0);
  });
}

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
});
