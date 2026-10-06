import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PostHog } from 'posthog-node';
import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if (process.env.NODE_ENV !== 'production') {
  for (const [name, value] of Object.entries({
    POSTHOG_API_KEY: posthogApiKey,
    POSTHOG_HOST: posthogHost,
  })) {
    if (!value) {
      throw new Error(
        `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`
      );
    }
  }
}

export const posthog =
  posthogApiKey && posthogHost
    ? new PostHog(posthogApiKey, {
        host: posthogHost,
        enableExceptionAutocapture: true,
      })
    : null;

const posthogLogsSdk =
  posthogApiKey && posthogHost
    ? new NodeSDK({
        resource: resourceFromAttributes({
          'service.name': 'hono-links-api',
          'deployment.environment': process.env.NODE_ENV || 'development',
        }),
        logRecordProcessors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: new URL('/i/v1/logs', posthogHost).toString(),
              headers: { Authorization: `Bearer ${posthogApiKey}` },
            })
          ),
        ],
      })
    : null;

posthogLogsSdk?.start();
const posthogLog = logs.getLogger('posthog-links-api');

const app = new Hono();

app.onError((error, c) => {
  posthog?.captureException(error);
  posthogLog.emit({
    severityText: 'ERROR',
    body: 'request_handling_failed',
    attributes: { component: 'hono_router' },
  });
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
  posthog?.capture({
    event: 'link_created',
    properties: { tag_count: tags.length },
  });
  posthogLog.emit({
    severityText: 'INFO',
    body: 'link_created',
    attributes: { tag_count: tags.length },
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

  posthog?.capture({
    event: 'link_updated',
    properties: {
      updated_fields: Object.keys(body),
      is_favorite: link.favorite,
      tag_count: link.tags.length,
    },
  });
  posthogLog.emit({
    severityText: 'INFO',
    body: 'link_updated',
    attributes: {
      update_field_count: Object.keys(body).length,
      is_favorite: link.favorite,
      tag_count: link.tags.length,
    },
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
  posthogLog.emit({
    severityText: 'INFO',
    body: 'link_deleted',
    attributes: { remaining_link_count: links.length },
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

const server = serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono links API running on http://localhost:${PORT}`);
  posthogLog.emit({
    severityText: 'INFO',
    body: 'api_server_started',
    attributes: { runtime: 'nodejs' },
  });
});

const shutdown = () => {
  server.close(async () => {
    await Promise.allSettled([
      posthog?.shutdown(),
      posthogLogsSdk?.shutdown(),
    ]);
  });
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
