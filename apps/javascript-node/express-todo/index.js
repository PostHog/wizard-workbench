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
    distinctId: req.ip,
    event: 'todo_created',
    properties: { todo_id: todo.id, title: todo.title },
  });

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  posthog.capture({
    distinctId: req.ip,
    event: 'todo_updated',
    properties: {
      todo_id: todo.id,
      title: todo.title,
      completed: todo.completed,
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
    distinctId: req.ip,
    event: 'todo_deleted',
    properties: { todo_id: deleted.id, title: deleted.title },
  });

  res.status(204).send();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  posthog.captureException(err, req.ip);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  server.close();
  await posthog.shutdown();
  process.exit(0);
});
