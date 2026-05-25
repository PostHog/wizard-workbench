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

// Attach distinct ID from client-side header, or fall back to anonymous
app.use(async (ctx, next) => {
  ctx.state.distinctId =
    ctx.headers['x-posthog-distinct-id'] || 'anonymous';
  ctx.state.sessionId = ctx.headers['x-posthog-session-id'] || undefined;
  await next();
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
    distinctId: ctx.state.distinctId,
    event: 'folder_created',
    properties: {
      folder_id: folder.id,
      folder_name: folder.name,
      ...(ctx.state.sessionId && { $session_id: ctx.state.sessionId }),
    },
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
  let movedNoteCount = 0;
  for (const note of notes) {
    if (note.folder_id === folderId) {
      note.folder_id = 1;
      movedNoteCount++;
    }
  }

  folders.splice(index, 1);
  ctx.status = 204;

  posthog.capture({
    distinctId: ctx.state.distinctId,
    event: 'folder_deleted',
    properties: {
      folder_id: folderId,
      moved_note_count: movedNoteCount,
      ...(ctx.state.sessionId && { $session_id: ctx.state.sessionId }),
    },
  });
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

    posthog.capture({
      distinctId: ctx.state.distinctId,
      event: 'notes_searched',
      properties: {
        query: search,
        folder_id: folder_id ? parseInt(folder_id, 10) : null,
        result_count: result.length,
        ...(ctx.state.sessionId && { $session_id: ctx.state.sessionId }),
      },
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
    distinctId: ctx.state.distinctId,
    event: 'note_created',
    properties: {
      note_id: note.id,
      folder_id: note.folder_id,
      has_content: note.content.length > 0,
      ...(ctx.state.sessionId && { $session_id: ctx.state.sessionId }),
    },
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

  ctx.body = note;

  posthog.capture({
    distinctId: ctx.state.distinctId,
    event: 'note_updated',
    properties: {
      note_id: note.id,
      folder_id: note.folder_id,
      updated_fields: updatedFields,
      ...(ctx.state.sessionId && { $session_id: ctx.state.sessionId }),
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

  const [deleted] = notes.splice(index, 1);
  ctx.status = 204;

  posthog.capture({
    distinctId: ctx.state.distinctId,
    event: 'note_deleted',
    properties: {
      note_id: deleted.id,
      folder_id: deleted.folder_id,
      ...(ctx.state.sessionId && { $session_id: ctx.state.sessionId }),
    },
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
  posthog.captureException(err, ctx?.state?.distinctId);
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});
