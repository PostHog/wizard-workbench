require('dotenv').config();

const express = require('express');
const { PostHog, setupExpressErrorHandler, setupExpressRequestContext } = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;
const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

app.use(express.json());
setupExpressRequestContext(posthog, app);

const getDistinctId = (req) =>
  req.get('x-posthog-distinct-id') || req.get('x-posthog-session-id') || 'todo-api';

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
    distinctId: getDistinctId(req),
    event: 'todo_created',
    properties: { todo_id: todo.id, completed: todo.completed },
  });
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const titleUpdated = req.body.title !== undefined;
  const completionUpdated = req.body.completed !== undefined;
  if (titleUpdated) todo.title = req.body.title;
  if (completionUpdated) todo.completed = req.body.completed;

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo_updated',
    properties: {
      todo_id: todo.id,
      title_updated: titleUpdated,
      completion_updated: completionUpdated,
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

  todos.splice(index, 1);
  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo_deleted',
    properties: { todo_id: Number(req.params.id) },
  });
  res.status(204).send();
});

setupExpressErrorHandler(posthog, app);

const shutdown = async () => {
  await posthog.shutdown();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
