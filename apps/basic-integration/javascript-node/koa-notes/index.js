import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { PostHog } from 'posthog-node';

const app = new Koa();
const router = new Router();

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const getDistinctId = (ctx) => {
  const requestDistinctId = ctx.get('x-posthog-distinct-id');

  if (requestDistinctId) {
    return requestDistinctId;
  }

  return `api_${ctx.ip || 'unknown'}`;
};

const getRequestProperties = (ctx) => ({
  endpoint: ctx.path,
  method: ctx.method,
  $current_url: ctx.href,
  folder_id: ctx.params.id ? Number.parseInt(ctx.params.id, 10) : undefined,
  note_id: ctx.params.id ? Number.parseInt(ctx.params.id, 10) : undefined,
});

const captureEvent = (ctx, event, properties = {}) => {
  posthog.capture({
    distinctId: getDistinctId(ctx),
    event,
    properties: {
      ...getRequestProperties(ctx),
      ...properties,
    },
  });
};

app.use(bodyParser());

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

router.post('/api/folders', (ctx) => {
  const { name } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'name is required' };
    return;
  }

  const folder = { id: nextFolderId++, name };
  folders.push(folder);
  captureEvent(ctx, 'folder_created', {
    created_folder_id: folder.id,
    note_count_after_create: notes.filter((note) => note.folder_id === folder.id).length,
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

  const movedNotesCount = notes.filter((note) => note.folder_id === folderId).length;

  // Move notes from deleted folder to General
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  folders.splice(index, 1);
  captureEvent(ctx, 'folder_deleted', {
    deleted_folder_id: folderId,
    moved_notes_count: movedNotesCount,
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
  }

  captureEvent(ctx, 'notes_list_viewed', {
    filter_folder_id: folder_id ? parseInt(folder_id, 10) : undefined,
    has_search: Boolean(search),
    result_count: result.length,
  });
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
  captureEvent(ctx, 'note_created', {
    note_id: note.id,
    folder_id: note.folder_id,
    content_length: note.content.length,
    title_length: note.title.length,
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

  captureEvent(ctx, 'note_viewed', {
    note_id: note.id,
    folder_id: note.folder_id,
    content_length: note.content.length,
  });
  ctx.body = note;
});

router.patch('/api/notes/:id', (ctx) => {
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

  captureEvent(ctx, 'note_updated', {
    note_id: note.id,
    folder_id: note.folder_id,
    previous_folder_id: previousFolderId,
    title_updated: title !== undefined,
    content_updated: content !== undefined,
    folder_changed: folder_id !== undefined && previousFolderId !== note.folder_id,
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

  const [deletedNote] = notes.splice(index, 1);
  captureEvent(ctx, 'note_deleted', {
    note_id: deletedNote.id,
    folder_id: deletedNote.folder_id,
    content_length: deletedNote.content.length,
  });
  ctx.status = 204;
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    posthog.captureException(error, getDistinctId(ctx), {
      endpoint: ctx.path,
      method: ctx.method,
    });
    throw error;
  }
});

app.on('error', (error, ctx) => {
  posthog.captureException(error, getDistinctId(ctx), {
    endpoint: ctx.path,
    method: ctx.method,
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await posthog.shutdown();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
