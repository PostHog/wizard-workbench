const express = require('express');
const { PostHog } = require('posthog-node');

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

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

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  posthog.capture({
    distinctId,
    event: 'todo_created',
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

  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  posthog.capture({
    distinctId,
    event: 'todo_updated',
    properties: {
      todo_id: todo.id,
      todo_title: todo.title,
      todo_completed: todo.completed,
    },
  });

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const deletedTodo = todos[index];
  todos.splice(index, 1);

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  posthog.capture({
    distinctId,
    event: 'todo_deleted',
    properties: {
      todo_id: deletedTodo.id,
      todo_title: deletedTodo.title,
    },
  });

  res.status(204).send();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  posthog.captureException(err, distinctId);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  server.close();
  await posthog.shutdown();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
