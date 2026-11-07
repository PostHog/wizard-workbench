import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { posthog } from './posthog.js';
import { posthogLogger, shutdownPosthogLogs } from './posthog-logs.js';

const app = new Koa();

function shutdownForSignal(signal) {
  const shutdowns = [shutdownPosthogLogs().catch(() => {})];
  if (posthog) {
    shutdowns.push(posthog.shutdown(3000).catch(() => {}));
  }
  const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
  void Promise.race([Promise.all(shutdowns), timeout]).finally(() => {
    process.kill(process.pid, signal);
  });
}

process.once('SIGINT', () => shutdownForSignal('SIGINT'));
process.once('SIGTERM', () => shutdownForSignal('SIGTERM'));

app.on('error', (err) => {
  if (posthog) {
    posthog.captureException(err);
  }
});
const router = new Router();

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
  if (posthog) {
    posthog.capture({
      event: 'folder_created',
      properties: { folder_id: folder.id },
    });
  }
  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'folder created',
      attributes: { event: 'folder_created', folder_id: folder.id },
    });
  }
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

  const notesMoved = notes.filter((note) => note.folder_id === folderId).length;

  // Move notes from deleted folder to General
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  folders.splice(index, 1);
  if (posthog) {
    posthog.capture({
      event: 'folder_deleted',
      properties: { folder_id: folderId, notes_moved: notesMoved },
    });
  }
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
  if (posthog) {
    posthog.capture({
      event: 'note_created',
      properties: { folder_id: note.folder_id, content_length: note.content.length },
    });
  }
  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'note created',
      attributes: {
        event: 'note_created',
        folder_id: note.folder_id,
        content_length: note.content.length,
      },
    });
  }
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
  if (title !== undefined) {
    note.title = title;
    updatedFields.push('title');
  }
  if (content !== undefined) {
    note.content = content;
    updatedFields.push('content');
  }
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
  if (posthog) {
    posthog.capture({
      event: 'note_updated',
      properties: { folder_id: note.folder_id, updated_fields: updatedFields },
    });
  }
  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'note updated',
      attributes: {
        event: 'note_updated',
        folder_id: note.folder_id,
        updated_field_count: updatedFields.length,
      },
    });
  }

  ctx.body = note;
});

router.delete('/api/notes/:id', (ctx) => {
  const index = notes.findIndex((n) => n.id === parseInt(ctx.params.id, 10));

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const [note] = notes.splice(index, 1);
  if (posthog) {
    posthog.capture({
      event: 'note_deleted',
      properties: { folder_id: note.folder_id },
    });
  }
  ctx.status = 204;
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});
