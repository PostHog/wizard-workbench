const express = require('express');
const { setupExpressErrorHandler } = require('posthog-node');
const { posthog, posthogLog } = require('./posthog');

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
  if (posthogLog) {
    posthogLog.info('todo created', { route: '/api/todos' });
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const updatesTitle = req.body.title !== undefined;
  const updatesCompletion = req.body.completed !== undefined;

  if (updatesTitle) todo.title = req.body.title;
  if (updatesCompletion) todo.completed = req.body.completed;

  if (posthog) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        updates_title: updatesTitle,
        updates_completion: updatesCompletion,
      },
    });
  }
  if (posthogLog) {
    posthogLog.info('todo updated', {
      route: '/api/todos/:id',
      updates_title: updatesTitle,
      updates_completion: updatesCompletion,
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
  if (posthogLog) {
    posthogLog.info('todo deleted', { route: '/api/todos/:id' });
  }

  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
  if (posthogLog) {
    posthogLog.info('express todo API started', { port: PORT });
  }
});

function shutdown() {
  server.close(async () => {
    if (posthog) {
      await posthog.shutdown(2000).catch(() => {});
    }
  });
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
