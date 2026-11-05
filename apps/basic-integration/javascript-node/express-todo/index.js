const express = require('express');
const { setupExpressErrorHandler } = require('posthog-node');
const { posthog } = require('./posthog');
const { posthogLogger, shutdownPostHogLogs } = require('./logs');

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
      properties: { is_completed: todo.completed },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Todo created',
      attributes: { 'todo.operation': 'create' },
    });
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const updatedFields = [];

  if (req.body.title !== undefined) {
    todo.title = req.body.title;
    updatedFields.push('title');
  }

  if (req.body.completed !== undefined) {
    todo.completed = req.body.completed;
    updatedFields.push('completed');
  }

  if (posthog) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        updated_fields: updatedFields,
        is_completed: todo.completed,
      },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Todo updated',
      attributes: { 'todo.operation': 'update' },
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
    posthog.capture({ event: 'todo_deleted' });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Todo deleted',
      attributes: { 'todo.operation': 'delete' },
    });
  }

  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

const server = app.listen(PORT, () => {
  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'INFO',
      body: 'Express todo API started',
      attributes: { 'service.lifecycle': 'started' },
    });
  }

  console.log(`Express todo API running on http://localhost:${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await Promise.all([
      shutdownPostHogLogs(),
      posthog ? posthog.shutdown() : Promise.resolve(),
    ]);
    process.exit(0);
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
