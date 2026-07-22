const express = require('express');
const posthog = require('./posthog');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const todos = [];
let nextId = 1;

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
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
    await posthog.flush();
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', async (req, res) => {
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
    await posthog.flush();
  }

  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  todos.splice(index, 1);

  if (posthog) {
    posthog.capture({ event: 'todo_deleted' });
    await posthog.flush();
  }

  res.status(204).send();
});

app.use(async (err, req, res, next) => {
  if (posthog) {
    posthog.captureException(err);
    await posthog.flush();
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Internal server error' });
});

const shutdown = async () => {
  if (posthog) {
    await posthog.shutdown();
  }
  process.exit(0);
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
