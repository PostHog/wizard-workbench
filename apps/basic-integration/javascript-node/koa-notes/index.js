import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { posthog } from './posthog.js';
import { logMutation, shutdownPostHogLogs } from './posthog-logs.js';

const app = new Koa();
const router = new Router();

app.on('error', (err) => {
  try {
    posthog?.captureException(err, 'server');
  } catch {}
});

app.use(bodyParser());

const folders = [{ id: 1, name: 'General' }];
const notes = [];
let nextFolderId = 2;
let nextNoteId = 1;

function captureAction(event, properties) {
  try {
    posthog?.capture({ event, properties });
  } catch {}
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
  captureAction('folder_created', { folder_id: folder.id });
  logMutation('folder_created', { resource_type: 'folder' });
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
  const movedNoteCount = notes.filter((note) => note.folder_id === folderId).length;
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  folders.splice(index, 1);
  captureAction('folder_deleted', {
    folder_id: folderId,
    moved_note_count: movedNoteCount,
  });
  logMutation('folder_deleted', {
    resource_type: 'folder',
    moved_note_count: movedNoteCount,
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
  captureAction('note_created', {
    note_id: note.id,
    folder_id: note.folder_id,
    has_content: Boolean(note.content),
  });
  logMutation('note_created', {
    resource_type: 'note',
    has_content: Boolean(note.content),
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
  const changedFields = [
    ...(title !== undefined ? ['title'] : []),
    ...(content !== undefined ? ['content'] : []),
    ...(folder_id !== undefined ? ['folder_id'] : []),
  ];
  captureAction('note_updated', {
    note_id: note.id,
    folder_id: note.folder_id,
    changed_fields: changedFields,
  });
  logMutation('note_updated', {
    resource_type: 'note',
    changed_field_count: changedFields.length,
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
  captureAction('note_deleted', {
    note_id: deletedNote.id,
    folder_id: deletedNote.folder_id,
  });
  logMutation('note_deleted', { resource_type: 'note' });
  ctx.status = 204;
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    void Promise.allSettled([posthog?.shutdown(3000), shutdownPostHogLogs()]).finally(() =>
      process.exit(0)
    );
  });

  setTimeout(() => process.exit(0), 3000).unref();
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
