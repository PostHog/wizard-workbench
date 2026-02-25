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
  const apiKey = process.env.POSTHOG_API_KEY;

  if (!apiKey) {
    console.log('WARNING: PostHog not configured (POSTHOG_API_KEY not set)');
    console.log('         App will work but analytics won\'t be tracked');
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
  posthog.capture({ distinctId, event, properties });
}

// --- Folders ---

router.get('/api/folders', (ctx) => {
  ctx.body = folders.map((f) => ({
    ...f,
    note_count: notes.filter((n) => n.folder_id === f.id).length,
  }));
});

router.post('/api/folders', (ctx) => {
  const { name } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'name is required' };
    return;
  }

  const folder = { id: nextFolderId++, name };
  folders.push(folder);

  const userId = ctx.request.body.user_id || 'anonymous';
  trackEvent(userId, 'folder_created', {
    folder_id: folder.id,
    folder_name: folder.name,
    total_folders: folders.length,
  });

  ctx.status = 201;
  ctx.body = folder;
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

  // Move notes from deleted folder to General
  let movedNotes = 0;
  for (const note of notes) {
    if (note.folder_id === folderId) {
      note.folder_id = 1;
      movedNotes++;
    }
  }

  const deletedFolder = folders[index];
  folders.splice(index, 1);

  const userId = ctx.query.user_id || 'anonymous';
  trackEvent(userId, 'folder_deleted', {
    folder_id: folderId,
    folder_name: deletedFolder.name,
    notes_moved_to_general: movedNotes,
    total_folders: folders.length,
  });

  ctx.status = 204;
});

// --- Notes ---

router.get('/api/notes', (ctx) => {
  let result = notes;
  const { folder_id, search } = ctx.query;

  if (folder_id) {
    result = result.filter((n) => n.folder_id === parseInt(folder_id, 10));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );

    const userId = ctx.query.user_id || 'anonymous';
    trackEvent(userId, 'notes_searched', {
      query: search,
      results_count: result.length,
      folder_id: folder_id ? parseInt(folder_id, 10) : null,
    });
  }

  ctx.body = { notes: result, total: result.length };
});

router.post('/api/notes', (ctx) => {
  const { title, content = '', folder_id = 1 } = ctx.request.body;

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

  const note = {
    id: nextNoteId++,
    title,
    content,
    folder_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  notes.push(note);

  const userId = ctx.request.body.user_id || 'anonymous';
  trackEvent(userId, 'note_created', {
    note_id: note.id,
    folder_id: note.folder_id,
    title_length: title.length,
    content_length: content.length,
    total_notes: notes.length,
  });

  ctx.status = 201;
  ctx.body = note;
});

router.get('/api/notes/:id', (ctx) => {
  const note = notes.find((n) => n.id === parseInt(ctx.params.id, 10));

  if (!note) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  ctx.body = note;
});

router.patch('/api/notes/:id', (ctx) => {
  const note = notes.find((n) => n.id === parseInt(ctx.params.id, 10));

  if (!note) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const { title, content, folder_id } = ctx.request.body;
  const updatedFields = [];

  if (title !== undefined) { note.title = title; updatedFields.push('title'); }
  if (content !== undefined) { note.content = content; updatedFields.push('content'); }
  if (folder_id !== undefined) {
    if (!folders.find((f) => f.id === folder_id)) {
      ctx.status = 400;
      ctx.body = { error: 'folder not found' };
      return;
    }
    note.folder_id = folder_id;
    updatedFields.push('folder_id');
  }
  note.updated_at = new Date().toISOString();

  const userId = ctx.request.body.user_id || 'anonymous';
  trackEvent(userId, 'note_updated', {
    note_id: note.id,
    folder_id: note.folder_id,
    updated_fields: updatedFields,
  });

  ctx.body = note;
});

router.delete('/api/notes/:id', (ctx) => {
  const index = notes.findIndex((n) => n.id === parseInt(ctx.params.id, 10));

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const note = notes[index];
  notes.splice(index, 1);

  const userId = ctx.query.user_id || 'anonymous';
  trackEvent(userId, 'note_deleted', {
    note_id: note.id,
    folder_id: note.folder_id,
    note_age_hours: (Date.now() - new Date(note.created_at)) / 3600000,
    total_notes: notes.length,
  });

  ctx.status = 204;
});

app.use(router.routes());
app.use(router.allowedMethods());

// --- Error Handling ---

// Global Koa error handler — capture exceptions to PostHog
app.on('error', (err, ctx) => {
  const userId = ctx?.request?.body?.user_id || ctx?.query?.user_id || 'anonymous';

  if (posthog) {
    posthog.captureException(err, userId);
  }

  console.error('Unhandled error:', err.message);
});

// --- Server ---

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
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
