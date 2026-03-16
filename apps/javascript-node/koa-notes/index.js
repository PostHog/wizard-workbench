import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { PostHog } from 'posthog-node';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

const folders = [{ id: 1, name: 'General' }];
const notes = [];
let nextFolderId = 2;
let nextNoteId = 1;

// --- PostHog Setup ---

function initializePosthog() {
  const projectToken = process.env.POSTHOG_PROJECT_TOKEN;

  if (!projectToken) {
    console.log('WARNING: PostHog not configured (POSTHOG_PROJECT_TOKEN not set)');
    console.log("         App will work but analytics won't be tracked");
    return null;
  }

  const client = new PostHog(projectToken, {
    host: process.env.POSTHOG_HOST,
  });

  return client;
}

const posthog = initializePosthog();

function trackEvent(distinctId, event, properties = {}) {
  if (!posthog) return;
  posthog.capture({ distinctId, event, properties });
}

// --- Folders ---

router.get('/api/folders', (ctx) => {
  const userId = ctx.query.user_id || 'anonymous';

  ctx.body = folders.map((f) => ({
    ...f,
    note_count: notes.filter((n) => n.folder_id === f.id).length,
  }));

  trackEvent(userId, 'folders_viewed', { folder_count: folders.length });
});

router.post('/api/folders', (ctx) => {
  const { name, user_id } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'name is required' };
    return;
  }

  const userId = user_id || 'anonymous';
  const folder = { id: nextFolderId++, name };
  folders.push(folder);
  ctx.status = 201;
  ctx.body = folder;

  trackEvent(userId, 'folder_created', { folder_id: folder.id });
});

router.delete('/api/folders/:id', (ctx) => {
  const folderId = parseInt(ctx.params.id, 10);

  if (folderId === 1) {
    ctx.status = 400;
    ctx.body = { error: 'Cannot delete the default folder' };
    return;
  }

  const index = folders.findIndex((f) => f.id === folderId);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Folder not found' };
    return;
  }

  const userId = ctx.query.user_id || 'anonymous';

  // Move notes from deleted folder to General
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  folders.splice(index, 1);
  ctx.status = 204;

  trackEvent(userId, 'folder_deleted', { folder_id: folderId });
});

// --- Notes ---

router.get('/api/notes', (ctx) => {
  let result = notes;
  const { folder_id, search, user_id } = ctx.query;

  if (folder_id) {
    result = result.filter((n) => n.folder_id === parseInt(folder_id, 10));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }

  ctx.body = { notes: result, total: result.length };

  const userId = user_id || 'anonymous';
  trackEvent(userId, 'notes_viewed', {
    total: result.length,
    folder_id: folder_id ? parseInt(folder_id, 10) : null,
    search_used: !!search,
  });
});

router.post('/api/notes', (ctx) => {
  const { title, content = '', folder_id = 1, user_id } = ctx.request.body;

  if (!title) {
    ctx.status = 400;
    ctx.body = { error: 'title is required' };
    return;
  }

  if (!folders.find((f) => f.id === folder_id)) {
    ctx.status = 400;
    ctx.body = { error: 'folder not found' };
    return;
  }

  const userId = user_id || 'anonymous';

  const note = {
    id: nextNoteId++,
    title,
    content,
    folder_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  notes.push(note);
  ctx.status = 201;
  ctx.body = note;

  trackEvent(userId, 'note_created', {
    note_id: note.id,
    folder_id: note.folder_id,
    content_length: content.length,
  });
});

router.get('/api/notes/:id', (ctx) => {
  const note = notes.find((n) => n.id === parseInt(ctx.params.id, 10));

  if (!note) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  ctx.body = note;

  const userId = ctx.query.user_id || 'anonymous';
  trackEvent(userId, 'note_viewed', { note_id: note.id, folder_id: note.folder_id });
});

router.patch('/api/notes/:id', (ctx) => {
  const note = notes.find((n) => n.id === parseInt(ctx.params.id, 10));

  if (!note) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const { title, content, folder_id, user_id } = ctx.request.body;
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (folder_id !== undefined) {
    if (!folders.find((f) => f.id === folder_id)) {
      ctx.status = 400;
      ctx.body = { error: 'folder not found' };
      return;
    }
    note.folder_id = folder_id;
  }
  note.updated_at = new Date().toISOString();

  ctx.body = note;

  const userId = user_id || 'anonymous';
  trackEvent(userId, 'note_updated', { note_id: note.id, folder_id: note.folder_id });
});

router.delete('/api/notes/:id', (ctx) => {
  const index = notes.findIndex((n) => n.id === parseInt(ctx.params.id, 10));

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const note = notes[index];
  const userId = ctx.query.user_id || 'anonymous';
  notes.splice(index, 1);
  ctx.status = 204;

  trackEvent(userId, 'note_deleted', { note_id: note.id, folder_id: note.folder_id });
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});

// Graceful shutdown, flush PostHog events before exiting
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
