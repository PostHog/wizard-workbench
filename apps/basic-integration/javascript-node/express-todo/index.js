require('dotenv').config();

const express = require('express');
const {
  PostHog,
  setupExpressRequestContext,
  setupExpressErrorHandler,
} = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;
const posthog = new PostHog(process.env.POSTHOG_TOKEN, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
  flushAt: 1,
  flushInterval: 0,
});

app.use(express.json());
setupExpressRequestContext(posthog, app);

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
    event: 'todo_created',
    properties: {
      todo_id: todo.id,
      todo_count: todos.length,
    },
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
    event: 'todo_updated',
    properties: {
      todo_id: todo.id,
      title_updated: titleUpdated,
      completion_updated: completionUpdated,
      is_completed: todo.completed,
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
    event: 'todo_deleted',
    properties: {
      todo_id: deletedTodo.id,
      was_completed: deletedTodo.completed,
      todo_count: todos.length,
    },
  });
  res.status(204).send();
});

setupExpressErrorHandler(posthog, app);

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
