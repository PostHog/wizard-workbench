require('dotenv').config();
const express = require('express');
const { PostHog } = require('posthog-node');

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const todos = [];
let nextId = 1;

const getDistinctId = (req) => req.get('x-posthog-distinct-id') || 'anonymous_server';

const captureAndFlush = async (req, event, properties) => {
  posthog.capture({
    distinctId: getDistinctId(req),
    event,
    properties,
  });
  await posthog.flush();
};

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const todo = { id: nextId++, title, completed: false };
  todos.push(todo);

  try {
    await captureAndFlush(req, 'todo_created', { todo_id: todo.id });
  } catch (error) {
    return next(error);
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', async (req, res, next) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  try {
    await captureAndFlush(req, 'todo_updated', {
      todo_id: todo.id,
      completed: todo.completed,
    });
  } catch (error) {
    return next(error);
  }

  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res, next) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const [deletedTodo] = todos.splice(index, 1);

  try {
    await captureAndFlush(req, 'todo_deleted', { todo_id: deletedTodo.id });
  } catch (error) {
    return next(error);
  }

  res.status(204).send();
});

app.use((err, req, res, next) => {
  posthog.captureException(err, req.get('x-posthog-distinct-id'));
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  await posthog.shutdown();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
