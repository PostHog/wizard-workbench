const express = require('express');
const { PostHog, setupExpressRequestContext, setupExpressErrorHandler } = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
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

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip;
  posthog.capture({
    distinctId,
    event: 'todo_created',
    properties: { todo_id: todo.id, title: todo.title },
  });

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const titleChanged = req.body.title !== undefined;
  const completedChanged = req.body.completed !== undefined;

  if (titleChanged) todo.title = req.body.title;
  if (completedChanged) todo.completed = req.body.completed;

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip;

  if (completedChanged && todo.completed) {
    posthog.capture({
      distinctId,
      event: 'todo_completed',
      properties: { todo_id: todo.id, title: todo.title },
    });
  } else if (titleChanged) {
    posthog.capture({
      distinctId,
      event: 'todo_updated',
      properties: { todo_id: todo.id, title: todo.title },
    });
  }

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const deleted = todos.splice(index, 1)[0];

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip;
  posthog.capture({
    distinctId,
    event: 'todo_deleted',
    properties: { todo_id: deleted.id, title: deleted.title },
  });

  res.status(204).send();
});

setupExpressErrorHandler(posthog, app);

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
