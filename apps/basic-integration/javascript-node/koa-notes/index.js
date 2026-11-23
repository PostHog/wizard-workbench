import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { posthog, shutdownPostHog } from './posthog.js';
import { posthogLogger, shutdownPostHogLogs } from './posthog-logs.js';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.on('error', (error, ctx) => {
  const distinctId = ctx?.state?.user?.id
    ? String(ctx.state.user.id)
    : 'koa-server';

  posthog?.captureException(error, distinctId, {
    $process_person_profile: false,
  });
  posthogLogger?.emit({
    severityText: 'ERROR',
    body: 'Koa request error',
    attributes: { 'error.type': error.name || 'Error' },
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

router.post('/api/folders', (ctx) => {
  const { name } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'name is required' };
    return;
  }

  const folder = { id: nextFolderId++, name };
  folders.push(folder);

  posthog?.capture({
    event: 'folder_created',
    properties: {
      folder_id: folder.id,
      $process_person_profile: false,
    },
  });
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'Folder created',
    attributes: { folder_id: folder.id },
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

  const moved_note_count = notes.filter((note) => note.folder_id === folderId).length;

  // Move notes from deleted folder to General
  for (const note of notes) {
    if (note.folder_id === folderId) note.folder_id = 1;
  }

  folders.splice(index, 1);

  posthog?.capture({
    event: 'folder_deleted',
    properties: {
      folder_id: folderId,
      moved_note_count,
      $process_person_profile: false,
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

  if (search || folder_id) {
    posthog?.capture({
      event: 'note_search_completed',
      properties: {
        has_search_query: Boolean(search),
        has_folder_filter: Boolean(folder_id),
        result_count: result.length,
        $process_person_profile: false,
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

  posthog?.capture({
    event: 'note_created',
    properties: {
      note_id: note.id,
      folder_id: note.folder_id,
      has_content: Boolean(content),
      $process_person_profile: false,
    },
  });
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'Note created',
    attributes: { note_id: note.id, folder_id: note.folder_id },
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

  posthog?.capture({
    event: 'note_updated',
    properties: {
      note_id: note.id,
      changed_title: title !== undefined,
      changed_content: content !== undefined,
      changed_folder: folder_id !== undefined,
      $process_person_profile: false,
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

  const [note] = notes.splice(index, 1);

  posthog?.capture({
    event: 'note_deleted',
    properties: {
      note_id: note.id,
      folder_id: note.folder_id,
      $process_person_profile: false,
    },
  });

  ctx.status = 204;
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Koa notes API running on http://localhost:${PORT}`);
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'Koa notes API started',
    attributes: { port: Number(PORT) },
  });
});

function shutdown() {
  server.close(() => {
    void Promise.all([shutdownPostHog(), shutdownPostHogLogs()]).finally(() =>
      process.exit(0)
    );
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
