const express = require('express');
const { setupExpressErrorHandler } = require('posthog-node');
const posthog = require('./posthog');
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
    posthog.capture({
      event: 'todo_created',
      properties: { completed: todo.completed },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Todo created',
      attributes: { operation: 'create', completed: todo.completed },
    });
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const titleChanged = req.body.title !== undefined;
  const completionChanged = req.body.completed !== undefined;

  if (titleChanged) todo.title = req.body.title;
  if (completionChanged) todo.completed = req.body.completed;

  if (posthog) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        title_changed: titleChanged,
        completion_changed: completionChanged,
        completed: todo.completed,
      },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Todo updated',
      attributes: {
        operation: 'update',
        title_changed: titleChanged,
        completion_changed: completionChanged,
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

  const [todo] = todos.splice(index, 1);

  if (posthog) {
    posthog.capture({
      event: 'todo_deleted',
      properties: { completed: todo.completed },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Todo deleted',
      attributes: { operation: 'delete', completed: todo.completed },
    });
  }

  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    const shutdowns = [shutdownPostHogLogs()];

    if (posthog) {
      shutdowns.push(posthog.shutdown(3000).catch(() => {}));
    }

    void Promise.all(shutdowns).finally(() => process.exit(0));
  });
}

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
