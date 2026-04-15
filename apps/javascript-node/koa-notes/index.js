import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const app = new Koa();
const router = new Router();

app.use(bodyParser());

const folders = [{ id: 1, name: 'General' }];
const notes = [];
let nextFolderId = 2;
let nextNoteId = 1;

function getDistinctId(ctx) {
  return ctx.headers['x-posthog-distinct-id'] || 'anonymous';
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
  ctx.status = 201;
  ctx.body = folder;

  posthog.capture({
    distinctId: getDistinctId(ctx),
    event: 'folder created',
    properties: { folder_id: folder.id, folder_name: folder.name },
  });
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
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  const deletedFolder = folders[index];
  folders.splice(index, 1);
  ctx.status = 204;

  posthog.capture({
    distinctId: getDistinctId(ctx),
    event: 'folder deleted',
    properties: { folder_id: folderId, folder_name: deletedFolder.name },
  });
});

// --- Notes ---

router.get('/api/notes', (ctx) => {
  let result = notes;
  const { folder_id, search } = ctx.query;

  if (folder_id) {
    result = result.filter((n) => n.folder_id === parseInt(folder_id, 10));
    posthog.capture({
      distinctId: getDistinctId(ctx),
      event: 'notes filtered by folder',
      properties: { folder_id: parseInt(folder_id, 10) },
    });
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
    posthog.capture({
      distinctId: getDistinctId(ctx),
      event: 'notes searched',
      properties: { query: search, result_count: result.length },
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
  ctx.status = 201;
  ctx.body = note;

  posthog.capture({
    distinctId: getDistinctId(ctx),
    event: 'note created',
    properties: { note_id: note.id, folder_id: note.folder_id, has_content: note.content.length > 0 },
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

  ctx.body = note;

  posthog.capture({
    distinctId: getDistinctId(ctx),
    event: 'note updated',
    properties: {
      note_id: note.id,
      folder_id: note.folder_id,
      updated_title: title !== undefined,
      updated_content: content !== undefined,
      updated_folder: folder_id !== undefined,
    },
  });
});

router.delete('/api/notes/:id', (ctx) => {
  const index = notes.findIndex((n) => n.id === parseInt(ctx.params.id, 10));

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Note not found' };
    return;
  }

  const deletedNote = notes[index];
  notes.splice(index, 1);
  ctx.status = 204;

  posthog.capture({
    distinctId: getDistinctId(ctx),
    event: 'note deleted',
    properties: { note_id: deletedNote.id, folder_id: deletedNote.folder_id },
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
  posthog.captureException(err, ctx ? getDistinctId(ctx) : undefined);
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});
