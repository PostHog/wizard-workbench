const express = require('express');
const {
  PostHog,
  setupExpressErrorHandler,
  setupExpressRequestContext,
} = require('posthog-node');

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if (!posthogApiKey || !posthogHost) {
  throw new Error('Missing POSTHOG_API_KEY or POSTHOG_HOST environment variables.');
}

const posthog = new PostHog(posthogApiKey, {
  host: posthogHost,
  enableExceptionAutocapture: true,
});

posthog.on('error', (err) => {
  console.error('PostHog error', err);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
setupExpressRequestContext(posthog, app);

const todos = [];
let nextId = 1;

function getDistinctId(req) {
  return req.header('x-posthog-distinct-id') || `api-user:${req.ip}`;
}

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const todo = { id: nextId++, title, completed: false };
    todos.push(todo);

    posthog.capture({
      distinctId: getDistinctId(req),
      event: 'todo_created',
      properties: {
        todo_id: todo.id,
        has_title: Boolean(todo.title),
        title_length: todo.title.length,
        completed: todo.completed,
      },
    });
    await posthog.flush();

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/todos/:id', async (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));

    if (!todo) {
      return res.status(404).json({ error: 'Not found' });
    }

    const previousCompleted = todo.completed;
    const previousTitleLength = todo.title.length;

    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    posthog.capture({
      distinctId: getDistinctId(req),
      event: 'todo_updated',
      properties: {
        todo_id: todo.id,
        completed: todo.completed,
        title_length: todo.title.length,
        completion_changed: previousCompleted !== todo.completed,
        title_changed: previousTitleLength !== todo.title.length,
      },
    });
    await posthog.flush();

    res.json(todo);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/todos/:id', async (req, res, next) => {
  try {
    const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Not found' });
    }

    const [deletedTodo] = todos.splice(index, 1);

    posthog.capture({
      distinctId: getDistinctId(req),
      event: 'todo_deleted',
      properties: {
        todo_id: deletedTodo.id,
        completed: deletedTodo.completed,
        title_length: deletedTodo.title.length,
      },
    });
    await posthog.flush();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

setupExpressErrorHandler(posthog, app);

app.use(async (err, req, res, next) => {
  posthog.captureException(err, getDistinctId(req), {
    route: req.path,
    method: req.method,
  });
  await posthog.flush();

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await posthog.shutdown();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
