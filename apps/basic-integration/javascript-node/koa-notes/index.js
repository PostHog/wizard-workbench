import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { PostHog } from 'posthog-node';

const app = new Koa();
const router = new Router();

const posthog = new PostHog(process.env.POSTHOG_PROJECT_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
  flushAt: 1,
  flushInterval: 0,
});

const appStartedAt = new Date().toISOString();

app.use(bodyParser());

const folders = [{ id: 1, name: 'General' }];
const notes = [];
let nextFolderId = 2;
let nextNoteId = 1;

function getDistinctId(ctx) {
  return ctx.get('x-posthog-distinct-id') || ctx.get('x-user-id') || ctx.ip || 'anonymous';
}

function getRequestProperties(ctx, extraProperties = {}) {
  return {
    path: ctx.path,
    method: ctx.method,
    app: 'koa-notes',
    runtime: 'node',
    folder_count: folders.length,
    note_count: notes.length,
    ...extraProperties,
  };
}

async function captureEvent(ctx, event, properties = {}) {
  posthog.capture({
    distinctId: getDistinctId(ctx),
    event,
    properties: getRequestProperties(ctx, properties),
  });

  await posthog.flush();
}

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

  await captureEvent(ctx, 'folder_created', {
    folder_id: folder.id,
    folder_name_length: folder.name.length,
  });

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

  const movedNotesCount = notes.filter((note) => note.folder_id === folderId).length;

  // Move notes from deleted folder to General
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  folders.splice(index, 1);

  await captureEvent(ctx, 'folder_deleted', {
    deleted_folder_id: folderId,
    moved_notes_count: movedNotesCount,
    fallback_folder_id: 1,
  });

  ctx.status = 204;
});

// --- Notes ---

router.get('/api/notes', async (ctx) => {
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

  if (folder_id || search) {
    await captureEvent(ctx, 'notes_list_filtered', {
      has_folder_filter: Boolean(folder_id),
      has_search_query: Boolean(search),
      result_count: result.length,
      search_length: search ? String(search).length : 0,
    });
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

  await captureEvent(ctx, 'note_created', {
    note_id: note.id,
    folder_id: note.folder_id,
    title_length: note.title.length,
    content_length: note.content.length,
  });

  ctx.status = 201;
  ctx.body = note;
});

router.get('/api/notes/:id', async (ctx) => {
  const note = notes.find((n) => n.id === parseInt(ctx.params.id, 10));

  if (!note) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  await captureEvent(ctx, 'note_viewed', {
    note_id: note.id,
    folder_id: note.folder_id,
    title_length: note.title.length,
  });

  ctx.body = note;
});

router.patch('/api/notes/:id', async (ctx) => {
  const note = notes.find((n) => n.id === parseInt(ctx.params.id, 10));

  if (!note) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const previousFolderId = note.folder_id;
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

  await captureEvent(ctx, 'note_updated', {
    note_id: note.id,
    folder_id: note.folder_id,
    previous_folder_id: previousFolderId,
    title_updated: title !== undefined,
    content_updated: content !== undefined,
    folder_changed: folder_id !== undefined && previousFolderId !== note.folder_id,
    title_length: note.title.length,
    content_length: note.content.length,
  });

  ctx.body = note;
});

router.delete('/api/notes/:id', async (ctx) => {
  const index = notes.findIndex((n) => n.id === parseInt(ctx.params.id, 10));

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const deletedNote = notes[index];
  notes.splice(index, 1);

  await captureEvent(ctx, 'note_deleted', {
    note_id: deletedNote.id,
    folder_id: deletedNote.folder_id,
    title_length: deletedNote.title.length,
  });

  ctx.status = 204;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', async (err, ctx) => {
  posthog.captureException(err, getDistinctId(ctx), getRequestProperties(ctx, {
    app_started_at: appStartedAt,
  }));

  await posthog.flush();
});

const shutdownSignals = ['SIGINT', 'SIGTERM'];

for (const signal of shutdownSignals) {
  process.once(signal, async () => {
    await posthog.shutdown();
    process.exit(0);
  });
}

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});
