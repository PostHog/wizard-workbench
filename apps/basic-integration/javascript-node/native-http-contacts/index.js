import { createServer } from 'node:http';
import { posthog } from './posthog.js';
import { posthogLog, posthogLogsSdk } from './posthog-logs.js';

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
        properties: {
          total_group_count: groups.length,
          $process_person_profile: false,
        },
      });
      posthogLog?.emit({
        severityText: 'INFO',
        body: 'group_created',
        attributes: { group_count: groups.length },
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
          $process_person_profile: false,
        },
      });
      posthogLog?.emit({
        severityText: 'INFO',
        body: 'contact_created',
        attributes: { group_id: contact.group_id, contact_count: contacts.length },
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
          updated_fields: updatedFields,
          updated_field_count: updatedFields.length,
          group_id: contact.group_id,
          $process_person_profile: false,
        },
      });
      posthogLog?.emit({
        severityText: 'INFO',
        body: 'contact_updated',
        attributes: { group_id: contact.group_id, updated_field_count: updatedFields.length },
      });
      return json(res, 200, contact);
    }

    // DELETE /api/contacts/:id
    const deleteMatch = method === 'DELETE' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (deleteMatch) {
      const index = contacts.findIndex((c) => c.id === parseInt(deleteMatch[1], 10));
      if (index === -1) return json(res, 404, { error: 'Contact not found' });

      const [deletedContact] = contacts.splice(index, 1);
      posthog?.capture({
        event: 'contact_deleted',
        properties: {
          group_id: deletedContact.group_id,
          remaining_contact_count: contacts.length,
          $process_person_profile: false,
        },
      });
      posthogLog?.emit({
        severityText: 'INFO',
        body: 'contact_deleted',
        attributes: {
          group_id: deletedContact.group_id,
          remaining_contact_count: contacts.length,
        },
      });
      res.writeHead(204);
      return res.end();
    }

    json(res, 404, { error: 'Not found' });
  } catch (err) {
    posthog?.captureException(err);
    json(res, 500, { error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Native HTTP contacts API running on http://localhost:${PORT}`);
  posthogLog?.emit({
    severityText: 'INFO',
    body: 'contacts_api_started',
    attributes: { port: Number(PORT) },
  });
});

async function shutdown() {
  await new Promise((resolve) => server.close(resolve));
  await Promise.all([posthog?.shutdown(), posthogLogsSdk?.shutdown()]);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
