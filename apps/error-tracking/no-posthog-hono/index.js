import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ service: 'hono', status: 'ok' }));

serve({ fetch: app.fetch, port: 3000 });
console.log('listening on http://localhost:3000');
