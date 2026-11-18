const express = require('express');
const { setupExpressErrorHandler } = require('posthog-node');
const { posthog } = require('./posthog');
const { posthogLogger, shutdownPosthogLogs } = require('./posthog-logs');

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
    posthog.capture({
      event: 'todo_created',
      properties: { todo_count: todos.length },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'todo created',
      attributes: { event: 'todo_created', todo_count: todos.length },
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
  const completionUpdated = req.body.completed !== undefined;

  if (titleUpdated) todo.title = req.body.title;
  if (completionUpdated) todo.completed = req.body.completed;

  if (posthog) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        title_updated: titleUpdated,
        completion_updated: completionUpdated,
        completed: todo.completed,
      },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'todo updated',
      attributes: {
        event: 'todo_updated',
        title_updated: titleUpdated,
        completion_updated: completionUpdated,
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

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'todo deleted',
      attributes: { event: 'todo_deleted', todo_count: todos.length },
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

async function shutdown() {
  const shutdownTasks = [shutdownPosthogLogs().catch(() => {})];

  if (posthog) {
    shutdownTasks.push(posthog.shutdown(3000).catch(() => {}));
  }

  await Promise.race([
    Promise.all(shutdownTasks),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  process.exit(0);
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
