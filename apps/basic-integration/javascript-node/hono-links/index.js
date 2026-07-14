import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';

const app = new Hono();

const posthogApiKey = process.env.POSTHOG_PROJECT_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if (!posthogApiKey) {
  throw new Error('Missing POSTHOG_PROJECT_API_KEY environment variable');
}

if (!posthogHost) {
  throw new Error('Missing POSTHOG_HOST environment variable');
}

const posthog = new PostHog(posthogApiKey, {
  host: posthogHost,
  enableExceptionAutocapture: true,
  flushAt: 1,
  flushInterval: 0,
});

const links = [];
let nextId = 1;

const getDistinctId = (c) => c.req.header('x-posthog-distinct-id') || c.req.header('x-forwarded-for') || 'anonymous';

const buildLinkProperties = (link) => ({
  link_id: link.id,
  has_description: Boolean(link.description),
  tag_count: Array.isArray(link.tags) ? link.tags.length : 0,
  favorite: Boolean(link.favorite),
  url_host: safeUrlHost(link.url),
});

const safeUrlHost = (value) => {
  try {
    return new URL(value).host;
  } catch {
    return 'invalid-url';
  }
};

const captureServerEvent = async (payload) => {
  posthog.capture(payload);
  await posthog.flush();
};

// List links (with optional tag filter and search)
app.get('/api/links', async (c) => {
  try {
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

    if (tag || search) {
      await captureServerEvent({
        distinctId: getDistinctId(c),
        event: 'links_searched',
        properties: {
          has_tag_filter: Boolean(tag),
          has_search_query: Boolean(search),
          favorites_only: favoritesOnly === 'true',
          result_count: result.length,
        },
      });
    }

    if (favoritesOnly === 'true') {
      await captureServerEvent({
        distinctId: getDistinctId(c),
        event: 'favorite_filter_used',
        properties: {
          result_count: result.length,
          has_tag_filter: Boolean(tag),
          has_search_query: Boolean(search),
        },
      });
    }

    return c.json({ links: result, total: result.length });
  } catch (err) {
    posthog.captureException(err, getDistinctId(c));
    await posthog.flush();
    throw err;
  }
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

    await captureServerEvent({
      distinctId: getDistinctId(c),
      event: 'link_created',
      properties: buildLinkProperties(link),
    });

    return c.json(link, 201);
  } catch (err) {
    posthog.captureException(err, getDistinctId(c));
    await posthog.flush();
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
    if (body.url !== undefined) link.url = body.url;
    if (body.title !== undefined) link.title = body.title;
    if (body.description !== undefined) link.description = body.description;
    if (body.tags !== undefined) link.tags = body.tags;
    if (body.favorite !== undefined) link.favorite = body.favorite;

    await captureServerEvent({
      distinctId: getDistinctId(c),
      event: 'link_updated',
      properties: {
        ...buildLinkProperties(link),
        updated_fields: Object.keys(body).sort(),
      },
    });

    return c.json(link);
  } catch (err) {
    posthog.captureException(err, getDistinctId(c));
    await posthog.flush();
    throw err;
  }
});

// Delete a link
app.delete('/api/links/:id', async (c) => {
  try {
    const index = links.findIndex((l) => l.id === parseInt(c.req.param('id'), 10));

    if (index === -1) {
      return c.json({ error: 'Link not found' }, 404);
    }

    const [deletedLink] = links.splice(index, 1);

    await captureServerEvent({
      distinctId: getDistinctId(c),
      event: 'link_deleted',
      properties: buildLinkProperties(deletedLink),
    });

    return c.body(null, 204);
  } catch (err) {
    posthog.captureException(err, getDistinctId(c));
    await posthog.flush();
    throw err;
  }
});

// List all tags
app.get('/api/tags', async (c) => {
  try {
    const tagCounts = {};
    for (const link of links) {
      for (const tag of link.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }

    await captureServerEvent({
      distinctId: getDistinctId(c),
      event: 'tags_listed',
      properties: {
        unique_tag_count: Object.keys(tagCounts).length,
      },
    });

    return c.json({ tags: tagCounts });
  } catch (err) {
    posthog.captureException(err, getDistinctId(c));
    await posthog.flush();
    throw err;
  }
});

const PORT = process.env.PORT || 3002;

const server = serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
});

const gracefulShutdown = async () => {
  server.close();
  await posthog.shutdown();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
