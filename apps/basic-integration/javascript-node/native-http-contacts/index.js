import { createServer } from 'node:http';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

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

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  const distinctId =
    req.headers['x-posthog-distinct-id'] ||
    req.socket.remoteAddress ||
    'anonymous';
  const sessionId = req.headers['x-posthog-session-id'];

  return posthog.withContext(
    {
      distinctId,
      ...(sessionId ? { sessionId } : {}),
      properties: {
        $current_url: url.href,
        $request_method: method,
        $request_path: path,
        $user_agent: req.headers['user-agent'],
        $ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      },
    },
    async () => {
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

          posthog.capture({
            event: 'group created',
            properties: {
              group_id: group.id,
              group_name: group.name,
            },
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

          posthog.identify({
            distinctId: contact.email,
            properties: {
              $set: {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                company: contact.company,
              },
              $set_once: { first_seen: contact.created_at },
            },
          });

          posthog.capture({
            distinctId: contact.email,
            event: 'contact created',
            properties: {
              contact_id: contact.id,
              group_id: contact.group_id,
            },
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
          const updatedFields = [];
          if (body.name !== undefined) { contact.name = body.name; updatedFields.push('name'); }
          if (body.email !== undefined) { contact.email = body.email; updatedFields.push('email'); }
          if (body.phone !== undefined) { contact.phone = body.phone; updatedFields.push('phone'); }
          if (body.company !== undefined) { contact.company = body.company; updatedFields.push('company'); }
          if (body.group_id !== undefined) { contact.group_id = body.group_id; updatedFields.push('group_id'); }

          posthog.capture({
            distinctId: contact.email,
            event: 'contact updated',
            properties: {
              contact_id: contact.id,
              updated_fields: updatedFields,
            },
          });

          return json(res, 200, contact);
        }

        // DELETE /api/contacts/:id
        const deleteMatch = method === 'DELETE' && path.match(/^\/api\/contacts\/(\d+)$/);
        if (deleteMatch) {
          const index = contacts.findIndex((c) => c.id === parseInt(deleteMatch[1], 10));
          if (index === -1) return json(res, 404, { error: 'Contact not found' });

          const [contact] = contacts.splice(index, 1);

          posthog.capture({
            distinctId: contact.email,
            event: 'contact deleted',
            properties: {
              contact_id: contact.id,
            },
          });

          res.writeHead(204);
          return res.end();
        }

        json(res, 404, { error: 'Not found' });
      } catch (err) {
        posthog.captureException(err);
        json(res, 500, { error: 'Internal server error' });
      }
    }
  );
});

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Native HTTP contacts API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});
