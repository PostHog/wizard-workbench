import { createServer } from 'node:http';
import { posthog } from './posthog.js';
import { posthogLogger, posthogLogSdk } from './posthog-logs.js';

const contacts = [];
const groups = [{ id: 1, name: 'All Contacts' }];
let nextContactId = 1;
let nextGroupId = 2;

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function json(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function emitPostHogLog(severityText, body, attributes) {
  posthogLogger?.emit({ severityText, body, attributes });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  try {
    // --- Groups ---

    if (method === 'GET' && path === '/api/groups') {
      const result = groups.map((g) => ({
        ...g,
        contact_count: contacts.filter((c) => c.group_id === g.id).length,
      }));
      return json(res, 200, result);
    }

    if (method === 'POST' && path === '/api/groups') {
      const body = await parseBody(req);
      if (!body.name) return json(res, 400, { error: 'name is required' });

      const group = { id: nextGroupId++, name: body.name };
      groups.push(group);
      if (posthog) {
        posthog.capture({
          event: 'group_created',
          properties: { group_id: group.id },
        });
      }
      emitPostHogLog('INFO', 'group created', {
        event: 'group.created',
        group_id: group.id,
      });
      return json(res, 201, group);
    }

    // --- Contacts ---

    if (method === 'GET' && path === '/api/contacts') {
      let result = contacts;
      const groupId = url.searchParams.get('group_id');
      const search = url.searchParams.get('search');

      if (groupId) {
        result = result.filter((c) => c.group_id === parseInt(groupId, 10));
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.phone && c.phone.includes(q))
        );
      }

      return json(res, 200, { contacts: result, total: result.length });
    }

    if (method === 'POST' && path === '/api/contacts') {
      const body = await parseBody(req);

      if (!body.name || !body.email) {
        return json(res, 400, { error: 'name and email are required' });
      }

      const contact = {
        id: nextContactId++,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        group_id: body.group_id || 1,
        created_at: new Date().toISOString(),
      };
      contacts.push(contact);
      if (posthog) {
        posthog.capture({
          event: 'contact_created',
          properties: { group_id: contact.group_id },
        });
      }
      emitPostHogLog('INFO', 'contact created', {
        event: 'contact.created',
        group_id: contact.group_id,
      });
      return json(res, 201, contact);
    }

    // GET /api/contacts/:id
    const getMatch = method === 'GET' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (getMatch) {
      const contact = contacts.find((c) => c.id === parseInt(getMatch[1], 10));
      if (!contact) return json(res, 404, { error: 'Contact not found' });
      return json(res, 200, contact);
    }

    // PATCH /api/contacts/:id
    const patchMatch = method === 'PATCH' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (patchMatch) {
      const contact = contacts.find((c) => c.id === parseInt(patchMatch[1], 10));
      if (!contact) return json(res, 404, { error: 'Contact not found' });

      const body = await parseBody(req);
      if (body.name !== undefined) contact.name = body.name;
      if (body.email !== undefined) contact.email = body.email;
      if (body.phone !== undefined) contact.phone = body.phone;
      if (body.company !== undefined) contact.company = body.company;
      if (body.group_id !== undefined) contact.group_id = body.group_id;

      const updatedFields = Object.keys(body).filter((field) =>
        ['name', 'email', 'phone', 'company', 'group_id'].includes(field)
      );
      if (posthog) {
        posthog.capture({
          event: 'contact_updated',
          properties: {
            group_id: contact.group_id,
            updated_fields: updatedFields,
          },
        });
      }
      emitPostHogLog('INFO', 'contact updated', {
        event: 'contact.updated',
        group_id: contact.group_id,
        updated_field_count: updatedFields.length,
      });
      return json(res, 200, contact);
    }

    // DELETE /api/contacts/:id
    const deleteMatch = method === 'DELETE' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (deleteMatch) {
      const index = contacts.findIndex((c) => c.id === parseInt(deleteMatch[1], 10));
      if (index === -1) return json(res, 404, { error: 'Contact not found' });

      const [contact] = contacts.splice(index, 1);
      if (posthog) {
        posthog.capture({
          event: 'contact_deleted',
          properties: { group_id: contact.group_id },
        });
      }
      emitPostHogLog('INFO', 'contact deleted', {
        event: 'contact.deleted',
        group_id: contact.group_id,
      });
      res.writeHead(204);
      return res.end();
    }

    json(res, 404, { error: 'Not found' });
  } catch (err) {
    if (posthog) {
      posthog.captureException(err, 'native-http-contacts-api');
    }
    emitPostHogLog('ERROR', 'contact API request failed', {
      event: 'contact_api.request_failed',
      error_type: err instanceof Error ? err.name : 'unknown_error',
    });
    json(res, 500, { error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Native HTTP contacts API running on http://localhost:${PORT}`);
});

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  await new Promise((resolve) => server.close(resolve));
  await Promise.all([posthog?.shutdown(), posthogLogSdk?.shutdown()]);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
