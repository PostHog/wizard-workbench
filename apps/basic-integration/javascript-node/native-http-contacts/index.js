import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: process.env.POSTHOG_HOST,
  flushAt: 1,
  flushInterval: 0,
  enableExceptionAutocapture: true,
});

const contacts = [];
const groups = [{ id: 1, name: 'All Contacts' }];
let nextContactId = 1;
let nextGroupId = 2;

function getDistinctId(req) {
  return req.headers['x-user-id'] || req.headers['x-posthog-distinct-id'] || 'anonymous';
}

function getRequestContext(req, url) {
  return {
    distinctId: getDistinctId(req),
    properties: {
      endpoint: url.pathname,
      method: req.method,
      search_query_present: url.searchParams.has('search'),
      group_filter_present: url.searchParams.has('group_id'),
      $process_person_profile: false,
    },
  };
}

async function captureEvent(req, url, event, properties = {}) {
  posthog.capture({
    distinctId: getDistinctId(req),
    event,
    properties: {
      endpoint: url.pathname,
      method: req.method,
      ...properties,
      $process_person_profile: false,
    },
  });
  await posthog.flush();
}

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
    await posthog.withContext(getRequestContext(req, url), async () => {
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
      posthog.groupIdentify({
        groupType: 'contact_group',
        groupKey: String(group.id),
        properties: {
          name: group.name,
        },
        distinctId: getDistinctId(req),
      });
      await captureEvent(req, url, 'group_created', {
        group_id: group.id,
        has_custom_name: group.name !== 'All Contacts',
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

      if (groupId || search) {
        await captureEvent(req, url, 'contacts_searched', {
          result_count: result.length,
          has_group_filter: Boolean(groupId),
          has_search_query: Boolean(search),
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
      await captureEvent(req, url, 'contact_created', {
        contact_id: contact.id,
        group_id: contact.group_id,
        has_phone: Boolean(contact.phone),
        has_company: Boolean(contact.company),
        created_request_id: randomUUID(),
      });
      return json(res, 201, contact);
    }

    // GET /api/contacts/:id
    const getMatch = method === 'GET' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (getMatch) {
      const contact = contacts.find((c) => c.id === parseInt(getMatch[1], 10));
      if (!contact) return json(res, 404, { error: 'Contact not found' });
      await captureEvent(req, url, 'contact_viewed', {
        contact_id: contact.id,
        group_id: contact.group_id,
        has_company: Boolean(contact.company),
      });
      return json(res, 200, contact);
    }

    // PATCH /api/contacts/:id
    const patchMatch = method === 'PATCH' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (patchMatch) {
      const contact = contacts.find((c) => c.id === parseInt(patchMatch[1], 10));
      if (!contact) return json(res, 404, { error: 'Contact not found' });

      const body = await parseBody(req);
      const updatedFields = [];
      if (body.name !== undefined) {
        contact.name = body.name;
        updatedFields.push('name');
      }
      if (body.email !== undefined) {
        contact.email = body.email;
        updatedFields.push('email');
      }
      if (body.phone !== undefined) {
        contact.phone = body.phone;
        updatedFields.push('phone');
      }
      if (body.company !== undefined) {
        contact.company = body.company;
        updatedFields.push('company');
      }
      if (body.group_id !== undefined) {
        contact.group_id = body.group_id;
        updatedFields.push('group_id');
      }

      await captureEvent(req, url, 'contact_updated', {
        contact_id: contact.id,
        group_id: contact.group_id,
        updated_fields: updatedFields,
        updated_field_count: updatedFields.length,
      });

      return json(res, 200, contact);
    }

    // DELETE /api/contacts/:id
    const deleteMatch = method === 'DELETE' && path.match(/^\/api\/contacts\/(\d+)$/);
    if (deleteMatch) {
      const index = contacts.findIndex((c) => c.id === parseInt(deleteMatch[1], 10));
      if (index === -1) return json(res, 404, { error: 'Contact not found' });

      const [removedContact] = contacts.splice(index, 1);
      await captureEvent(req, url, 'contact_deleted', {
        contact_id: removedContact.id,
        group_id: removedContact.group_id,
        had_company: Boolean(removedContact.company),
      });
      res.writeHead(204);
      return res.end();
    }

    return json(res, 404, { error: 'Not found' });
    });
  } catch (err) {
    await posthog.captureExceptionImmediate(err, getDistinctId(req), {
      endpoint: path,
      method,
      error_name: err instanceof Error ? err.name : 'UnknownError',
      request_id: randomUUID(),
    });
    await captureEvent(req, url, 'api_error_captured', {
      error_name: err instanceof Error ? err.name : 'UnknownError',
      status_code: 500,
    });
    json(res, 500, { error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Native HTTP contacts API running on http://localhost:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await posthog.shutdown();
    process.exit(0);
  });
}
