const express = require('express');
const {
  PostHog,
  setupExpressRequestContext,
  setupExpressErrorHandler,
} = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;
const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

app.use(express.json());
setupExpressRequestContext(posthog, app);

const todos = [];
let nextId = 1;

function getDistinctId(req) {
  const headerDistinctId = req.get('x-posthog-distinct-id');

  if (headerDistinctId) {
    return headerDistinctId;
  }

  const requestDistinctId = req.body && req.body.distinctId;

  if (typeof requestDistinctId === 'string' && requestDistinctId.trim()) {
    return requestDistinctId.trim();
  }

  return 'anonymous_api_user';
}

function getCommonEventProperties(req) {
  return {
    todo_count: todos.length,
    request_path: req.path,
  };
}

app.get('/api/todos', (req, res) => {
  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todos_listed',
    properties: {
      ...getCommonEventProperties(req),
    },
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

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo_created',
    properties: {
      ...getCommonEventProperties(req),
      todo_id: todo.id,
      completed: todo.completed,
      title_length: todo.title.length,
    },
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

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo_updated',
    properties: {
      ...getCommonEventProperties(req),
      todo_id: todo.id,
      completed: todo.completed,
      previous_completed: previousCompleted,
      title_length: todo.title.length,
      previous_title_length: previousTitleLength,
    },
  });

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const [deletedTodo] = todos.splice(index, 1);

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo_deleted',
    properties: {
      ...getCommonEventProperties(req),
      todo_id: deletedTodo.id,
      completed: deletedTodo.completed,
      title_length: deletedTodo.title.length,
    },
  });

  res.status(204).send();
});

app.use((err, req, res, next) => {
  posthog.captureException(err, getDistinctId(req), {
    request_path: req.path,
    request_method: req.method,
  });

  next(err);
});

setupExpressErrorHandler(posthog, app);

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
