require('dotenv').config();

const express = require('express');
const { PostHog, setupExpressRequestContext, setupExpressErrorHandler } = require('posthog-node');

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

if (!posthogProjectToken && process.env.NODE_ENV !== 'production') {
  throw new Error('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured');
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  throw new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
}

const posthog = posthogProjectToken && posthogHost
  ? new PostHog(posthogProjectToken, { host: posthogHost, enableExceptionAutocapture: true })
  : null;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

if (posthog) {
  setupExpressRequestContext(posthog, app);
}

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

  if (posthog) {
    posthog.capture({
      event: 'todo_created',
      properties: { todo_count: todos.length },
    });
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const titleUpdated = req.body.title !== undefined;
  const completedUpdated = req.body.completed !== undefined;

  if (titleUpdated) todo.title = req.body.title;
  if (completedUpdated) todo.completed = req.body.completed;

  if (posthog) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        title_updated: titleUpdated,
        completed_updated: completedUpdated,
        completed: todo.completed,
      },
    });
  }

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  todos.splice(index, 1);

  if (posthog) {
    posthog.capture({
      event: 'todo_deleted',
      properties: { todo_count: todos.length },
    });
  }

  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
