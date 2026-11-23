const express = require('express');
const { setupExpressErrorHandler } = require('posthog-node');
const { posthog } = require('./posthog');
const { posthogLogger, shutdownPostHogLogs } = require('./posthog-logs');

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

  if (posthog) {
    posthog.capture({ event: 'todo_created' });
  }

  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'todo created',
    attributes: { 'todo.action': 'created' },
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

  if (posthog) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        title_updated: titleUpdated,
        completion_updated: completionUpdated,
        completed: completionUpdated ? todo.completed : undefined,
      },
    });
  }

  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'todo updated',
    attributes: {
      'todo.action': 'updated',
      title_updated: titleUpdated,
      completion_updated: completionUpdated,
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

  if (posthog) {
    posthog.capture({ event: 'todo_deleted' });
  }

  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'todo deleted',
    attributes: { 'todo.action': 'deleted' },
  });

  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    void Promise.allSettled([
      shutdownPostHogLogs(),
      posthog?.shutdown(3000),
    ]).finally(() => process.exit(0));
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
