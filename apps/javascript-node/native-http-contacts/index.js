import { createServer } from 'node:http';
import { PostHog } from 'posthog-node';

const contacts = [];
const groups = [{ id: 1, name: 'All Contacts' }];
let nextContactId = 1;
let nextGroupId = 2;

// --- PostHog Setup ---

function initializePosthog() {
  const apiKey = process.env.POSTHOG_API_KEY;

  if (!apiKey) {
    console.log("WARNING: PostHog not configured (POSTHOG_API_KEY not set)");
    console.log("         App will work but analytics won't be tracked");
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

  posthog.capture({
    distinctId,
    event,
    properties,
  });
}

// Extract distinct ID from request headers (supports X-PostHog-Distinct-ID from a
// frontend client) or falls back to 'anonymous'.
function getDistinctId(req) {
  return req.headers['x-posthog-distinct-id'] || 'anonymous';
}

// --- Helpers ---

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

      trackEvent(getDistinctId(req), 'group_created', {
        group_id: group.id,
        group_name: group.name,
        total_groups: groups.length,
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

      if (search || groupId) {
        trackEvent(getDistinctId(req), 'contacts_searched', {
          search_query: search || null,
          group_id_filter: groupId ? parseInt(groupId, 10) : null,
          results_count: result.length,
        });
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

      trackEvent(getDistinctId(req), 'contact_created', {
        contact_id: contact.id,
        has_phone: !!contact.phone,
        has_company: !!contact.company,
        group_id: contact.group_id,
        total_contacts: contacts.length,
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

      trackEvent(getDistinctId(req), 'contact_updated', {
        contact_id: contact.id,
        updated_fields: updatedFields,
        fields_count: updatedFields.length,
      });

      return json(res, 200, contact);
    }

    // DELETE /api/contacts/:id
    const deleteMatch = method === 'DELETE' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (deleteMatch) {
      const index = contacts.findIndex((c) => c.id === parseInt(deleteMatch[1], 10));
      if (index === -1) return json(res, 404, { error: 'Contact not found' });

      const [contact] = contacts.splice(index, 1);

      trackEvent(getDistinctId(req), 'contact_deleted', {
        contact_id: contact.id,
        had_phone: !!contact.phone,
        had_company: !!contact.company,
        group_id: contact.group_id,
        total_contacts: contacts.length,
      });

      res.writeHead(204);
      return res.end();
    }

    json(res, 404, { error: 'Not found' });
  } catch (err) {
    if (posthog) {
      posthog.captureException(err, getDistinctId(req));
    }
    json(res, 500, { error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Native HTTP contacts API running on http://localhost:${PORT}`);
});

// Graceful shutdown — flush pending PostHog events before exiting
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
