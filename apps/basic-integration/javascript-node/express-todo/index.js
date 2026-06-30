const express = require('express');
const { PostHog } = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

app.use(express.json());

const todos = [];
let nextId = 1;

function getDistinctId(req) {
  return req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
}

app.get('/api/todos', (req, res) => {
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
    event: 'todo created',
    properties: {
      todo_id: todo.id,
      todo_title: todo.title,
    },
  });

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const changes = {};
  if (req.body.title !== undefined) {
    changes.title = req.body.title;
    todo.title = req.body.title;
  }
  if (req.body.completed !== undefined) {
    changes.completed = req.body.completed;
    todo.completed = req.body.completed;
  }

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo updated',
    properties: {
      todo_id: todo.id,
      todo_title: todo.title,
      todo_completed: todo.completed,
      changed_fields: Object.keys(changes),
    },
  });

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const [deleted] = todos.splice(index, 1);

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo deleted',
    properties: {
      todo_id: deleted.id,
      todo_title: deleted.title,
      todo_completed: deleted.completed,
    },
  });

  res.status(204).send();
});

app.use((err, req, res, next) => {
  posthog.captureException(err, getDistinctId(req));
  res.status(500).json({ error: 'Internal server error' });
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
