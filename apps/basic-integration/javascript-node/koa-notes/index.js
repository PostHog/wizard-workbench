import 'dotenv/config';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { randomUUID } from 'node:crypto';
import { PostHog } from 'posthog-node';

if (!process.env.POSTHOG_PROJECT_TOKEN || !process.env.POSTHOG_HOST) {
  throw new Error('POSTHOG_PROJECT_TOKEN and POSTHOG_HOST must be configured');
}

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
  flushAt: 1,
  flushInterval: 0,
});

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(async (ctx, next) => {
  const distinctId = ctx.get('x-posthog-distinct-id');
  ctx.state.posthogDistinctId = distinctId || randomUUID();
  await next();
});

app.on('error', (error, ctx) => {
  posthog.captureException(error, ctx?.state.posthogDistinctId);
  posthog.flush().catch((flushError) => {
    console.error('Failed to flush PostHog exception', flushError);
  });
});

const folders = [{ id: 1, name: 'General' }];
const notes = [];
let nextFolderId = 2;
let nextNoteId = 1;

// --- Folders ---

router.get('/api/folders', (ctx) => {
  ctx.body = folders.map((f) => ({
    ...f,
    note_count: notes.filter((n) => n.folder_id === f.id).length,
  }));
});

router.post('/api/folders', async (ctx) => {
  const { name } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'name is required' };
    return;
  }

  const folder = { id: nextFolderId++, name };
  folders.push(folder);
  posthog.capture({
    distinctId: ctx.state.posthogDistinctId,
    event: 'folder_created',
    properties: {
      folder_id: folder.id,
      folder_count: folders.length,
    },
  });
  await posthog.flush();
  ctx.status = 201;
  ctx.body = folder;
});

router.delete('/api/folders/:id', async (ctx) => {
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
  let movedNoteCount = 0;
  for (const note of notes) {
    if (note.folder_id === folderId) {
      note.folder_id = 1;
      movedNoteCount += 1;
    }
  }

  folders.splice(index, 1);
  posthog.capture({
    distinctId: ctx.state.posthogDistinctId,
    event: 'folder_deleted',
    properties: {
      folder_id: folderId,
      moved_note_count: movedNoteCount,
      folder_count: folders.length,
    },
  });
  await posthog.flush();
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
  }

  ctx.body = { notes: result, total: result.length };
});

router.post('/api/notes', async (ctx) => {
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
  posthog.capture({
    distinctId: ctx.state.posthogDistinctId,
    event: 'note_created',
    properties: {
      note_id: note.id,
      folder_id,
      has_content: content.length > 0,
      note_count: notes.length,
    },
  });
  await posthog.flush();
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

router.patch('/api/notes/:id', async (ctx) => {
  const note = notes.find((n) => n.id === parseInt(ctx.params.id, 10));

  if (!note) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const { title, content, folder_id } = ctx.request.body;
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

  posthog.capture({
    distinctId: ctx.state.posthogDistinctId,
    event: 'note_updated',
    properties: {
      note_id: note.id,
      folder_id: note.folder_id,
      title_updated: title !== undefined,
      content_updated: content !== undefined,
      folder_updated: folder_id !== undefined,
    },
  });
  await posthog.flush();
  ctx.body = note;
});

router.delete('/api/notes/:id', async (ctx) => {
  const index = notes.findIndex((n) => n.id === parseInt(ctx.params.id, 10));

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const [deletedNote] = notes.splice(index, 1);
  posthog.capture({
    distinctId: ctx.state.posthogDistinctId,
    event: 'note_deleted',
    properties: {
      note_id: deletedNote.id,
      folder_id: deletedNote.folder_id,
      note_count: notes.length,
    },
  });
  await posthog.flush();
  ctx.status = 204;
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});

async function shutdown() {
  server.close();
  await posthog.shutdown();
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
