import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { PostHog } from 'posthog-node';

const app = new Koa();
const router = new Router();

const posthog = new PostHog(process.env.POSTHOG_PUBLIC_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

app.use(bodyParser());

const folders = [{ id: 1, name: 'General' }];
const notes = [];
let nextFolderId = 2;
let nextNoteId = 1;

function getDistinctId(ctx) {
  return ctx.get('x-posthog-distinct-id') || ctx.get('x-user-id') || 'anonymous';
}

function getSessionId(ctx) {
  return ctx.get('x-posthog-session-id') || undefined;
}

function getRequestProperties(ctx) {
  return {
    path: ctx.path,
    method: ctx.method,
    $session_id: getSessionId(ctx),
  };
}

function identifyRequestActor(ctx) {
  const distinctId = getDistinctId(ctx);

  if (distinctId === 'anonymous') {
    return distinctId;
  }

  posthog.identify({
    distinctId,
    properties: {
      $set: {
        last_seen_path: ctx.path,
        last_request_method: ctx.method,
      },
    },
  });

  return distinctId;
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
  const distinctId = identifyRequestActor(ctx);
  folders.push(folder);
  posthog.capture({
    distinctId,
    event: 'folder_created',
    properties: {
      ...getRequestProperties(ctx),
      folder_id: folder.id,
      has_name: Boolean(folder.name),
    },
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
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  const reassignedNotesCount = notes.filter((note) => note.folder_id === 1).length;
  const distinctId = identifyRequestActor(ctx);

  folders.splice(index, 1);
  posthog.capture({
    distinctId,
    event: 'folder_deleted',
    properties: {
      ...getRequestProperties(ctx),
      folder_id: folderId,
      reassigned_notes_count: reassignedNotesCount,
    },
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
  const distinctId = identifyRequestActor(ctx);
  notes.push(note);
  posthog.capture({
    distinctId,
    event: 'note_created',
    properties: {
      ...getRequestProperties(ctx),
      note_id: note.id,
      folder_id: note.folder_id,
      title_length: note.title.length,
      content_length: note.content.length,
    },
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
  const previousFolderId = note.folder_id;
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

  const distinctId = identifyRequestActor(ctx);
  posthog.capture({
    distinctId,
    event: 'note_updated',
    properties: {
      ...getRequestProperties(ctx),
      note_id: note.id,
      folder_id: note.folder_id,
      previous_folder_id: previousFolderId,
      title_updated: title !== undefined,
      content_updated: content !== undefined,
      folder_changed: folder_id !== undefined && folder_id !== previousFolderId,
    },
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

  const distinctId = identifyRequestActor(ctx);
  const [deletedNote] = notes.splice(index, 1);
  posthog.capture({
    distinctId,
    event: 'note_deleted',
    properties: {
      ...getRequestProperties(ctx),
      note_id: deletedNote.id,
      folder_id: deletedNote.folder_id,
      title_length: deletedNote.title.length,
    },
  });
  ctx.status = 204;
});

app.on('error', (err, ctx) => {
  posthog.captureException(err, getDistinctId(ctx), {
    path: ctx.path,
    method: ctx.method,
    $session_id: getSessionId(ctx),
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3003;
const server = app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
});

async function shutdown() {
  server.close(() => {
    posthog.shutdown().catch((error) => {
      console.error('Failed to shut down PostHog cleanly', error);
    });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
