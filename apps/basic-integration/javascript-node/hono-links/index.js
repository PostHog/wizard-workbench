import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';

const app = new Hono();

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const links = [];
let nextId = 1;

const getDistinctId = (c) => c.req.header('x-posthog-distinct-id') || 'anonymous';

const captureException = (error, c, properties = {}) => {
  posthog.captureException(error, getDistinctId(c), {
    route: c.req.path,
    method: c.req.method,
    ...properties,
  });
};

// List links (with optional tag filter and search)
app.get('/api/links', (c) => {
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

    if (tag || search || favoritesOnly === 'true') {
      posthog.capture({
        distinctId: getDistinctId(c),
        event: 'links_filtered',
        properties: {
          has_tag_filter: Boolean(tag),
          has_search_query: Boolean(search),
          favorites_only: favoritesOnly === 'true',
          result_count: result.length,
        },
      });
    }

    return c.json({ links: result, total: result.length });
  } catch (error) {
    captureException(error, c, { operation: 'list_links' });
    return c.json({ error: 'Internal server error' }, 500);
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

    posthog.capture({
      distinctId: getDistinctId(c),
      event: 'link_created',
      properties: {
        link_id: link.id,
        tag_count: link.tags.length,
        has_description: Boolean(link.description),
        favorite: link.favorite,
      },
    });

    return c.json(link, 201);
  } catch (error) {
    captureException(error, c, { operation: 'create_link' });
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get a single link
app.get('/api/links/:id', (c) => {
  try {
    const linkId = parseInt(c.req.param('id'), 10);
    const link = links.find((l) => l.id === linkId);

    if (!link) {
      posthog.capture({
        distinctId: getDistinctId(c),
        event: 'link_not_found',
        properties: {
          link_id: linkId,
          operation: 'read',
        },
      });
      return c.json({ error: 'Link not found' }, 404);
    }

    return c.json(link);
  } catch (error) {
    captureException(error, c, { operation: 'get_link' });
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update a link
app.patch('/api/links/:id', async (c) => {
  try {
    const linkId = parseInt(c.req.param('id'), 10);
    const link = links.find((l) => l.id === linkId);

    if (!link) {
      posthog.capture({
        distinctId: getDistinctId(c),
        event: 'link_not_found',
        properties: {
          link_id: linkId,
          operation: 'update',
        },
      });
      return c.json({ error: 'Link not found' }, 404);
    }

    const body = await c.req.json();
    const updatedFields = [];

    if (body.url !== undefined) {
      link.url = body.url;
      updatedFields.push('url');
    }
    if (body.title !== undefined) {
      link.title = body.title;
      updatedFields.push('title');
    }
    if (body.description !== undefined) {
      link.description = body.description;
      updatedFields.push('description');
    }
    if (body.tags !== undefined) {
      link.tags = body.tags;
      updatedFields.push('tags');
    }
    if (body.favorite !== undefined) {
      link.favorite = body.favorite;
      updatedFields.push('favorite');
    }

    posthog.capture({
      distinctId: getDistinctId(c),
      event: 'link_updated',
      properties: {
        link_id: link.id,
        updated_fields: updatedFields,
        tag_count: link.tags.length,
        favorite: link.favorite,
      },
    });

    return c.json(link);
  } catch (error) {
    captureException(error, c, { operation: 'update_link' });
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete a link
app.delete('/api/links/:id', (c) => {
  try {
    const linkId = parseInt(c.req.param('id'), 10);
    const index = links.findIndex((l) => l.id === linkId);

    if (index === -1) {
      posthog.capture({
        distinctId: getDistinctId(c),
        event: 'link_not_found',
        properties: {
          link_id: linkId,
          operation: 'delete',
        },
      });
      return c.json({ error: 'Link not found' }, 404);
    }

    const [deletedLink] = links.splice(index, 1);

    posthog.capture({
      distinctId: getDistinctId(c),
      event: 'link_deleted',
      properties: {
        link_id: deletedLink.id,
        tag_count: deletedLink.tags.length,
        favorite: deletedLink.favorite,
      },
    });

    return c.body(null, 204);
  } catch (error) {
    captureException(error, c, { operation: 'delete_link' });
    return c.json({ error: 'Internal server error' }, 500);
  }
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

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
});
