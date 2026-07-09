const express = require('express');
const { PostHog } = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;
const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

const posthog = posthogApiKey
  ? new PostHog(posthogApiKey, {
      host: posthogHost,
      enableExceptionAutocapture: true,
    })
  : null;

app.use(express.json());

const todos = [];
let nextId = 1;

function getDistinctId(req) {
  const headerValue = req.get('x-posthog-distinct-id');

  if (headerValue) {
    return headerValue;
  }

  return `api_request_${req.ip || 'unknown'}`;
}

function captureEvent(req, event, properties = {}) {
  if (!posthog) {
    return;
  }

  posthog.capture({
    distinctId: getDistinctId(req),
    event,
    properties,
  });
}

app.get('/api/todos', (req, res) => {
  captureEvent(req, 'todos_listed', {
    todo_count: todos.length,
  });

  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const todo = { id: nextId++, title, completed: false };
  todos.push(todo);

  captureEvent(req, 'todo_created', {
    todo_id: todo.id,
    title_length: todo.title.length,
    completed: todo.completed,
    todo_count: todos.length,
  });

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const previousCompleted = todo.completed;
  const previousTitleLength = todo.title.length;

  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  captureEvent(req, 'todo_updated', {
    todo_id: todo.id,
    completed: todo.completed,
    title_length: todo.title.length,
    completed_changed: previousCompleted !== todo.completed,
    title_changed: previousTitleLength !== todo.title.length,
  });

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const [deletedTodo] = todos.splice(index, 1);

  captureEvent(req, 'todo_deleted', {
    todo_id: deletedTodo.id,
    completed: deletedTodo.completed,
    title_length: deletedTodo.title.length,
    todo_count: todos.length,
  });

  res.status(204).send();
});

app.use((err, req, res, next) => {
  if (posthog) {
    posthog.captureException(err, getDistinctId(req), {
      route: req.originalUrl,
      method: req.method,
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

async function shutdown() {
  if (!posthog) {
    return;
  }

  await posthog.shutdown();
}

process.on('SIGINT', async () => {
  server.close(async () => {
    await shutdown();
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  server.close(async () => {
    await shutdown();
    process.exit(0);
  });
});
