import { createServer } from 'node:http';
import { logApiOutcome, shutdownPostHogLogs } from './posthog-logs.js';
import { posthog } from './posthog.js';

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
      posthog?.capture({
        event: 'group_created',
        properties: { group_id: group.id },
      });
      logApiOutcome('INFO', 'group creation completed', {
        operation: 'group_created',
        status_code: 201,
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
      posthog?.capture({
        event: 'contact_created',
        properties: {
          group_id: contact.group_id,
          has_phone: Boolean(contact.phone),
          has_company: Boolean(contact.company),
        },
      });
      logApiOutcome('INFO', 'contact creation completed', {
        operation: 'contact_created',
        status_code: 201,
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
      const updatedFields = ['name', 'email', 'phone', 'company', 'group_id'].filter(
        (field) => body[field] !== undefined
      );
      if (body.name !== undefined) contact.name = body.name;
      if (body.email !== undefined) contact.email = body.email;
      if (body.phone !== undefined) contact.phone = body.phone;
      if (body.company !== undefined) contact.company = body.company;
      if (body.group_id !== undefined) contact.group_id = body.group_id;

      posthog?.capture({
        event: 'contact_updated',
        properties: {
          group_id: contact.group_id,
          updated_fields: updatedFields,
        },
      });
      logApiOutcome('INFO', 'contact update completed', {
        operation: 'contact_updated',
        status_code: 200,
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
      posthog?.capture({
        event: 'contact_deleted',
        properties: { group_id: contact.group_id },
      });
      logApiOutcome('INFO', 'contact deletion completed', {
        operation: 'contact_deleted',
        status_code: 204,
      });
      res.writeHead(204);
      return res.end();
    }

    json(res, 404, { error: 'Not found' });
  } catch (err) {
    posthog?.captureException(err);
    logApiOutcome('ERROR', 'API request failed', {
      operation: 'api_request',
      status_code: 500,
      error_type: err instanceof Error ? err.name : 'UnknownError',
    });
    json(res, 500, { error: 'Internal server error' });
  }
});

server.once('close', () => {
  void Promise.all([
    posthog?.shutdown(3000).catch(() => {}),
    shutdownPostHogLogs(),
  ]);
});

process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Native HTTP contacts API running on http://localhost:${PORT}`);
});
