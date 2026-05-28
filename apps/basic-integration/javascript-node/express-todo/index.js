const express = require('express');
const { PostHog } = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

function getDistinctId(req) {
  return req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
}

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

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo created',
    properties: { todo_id: todo.id, title: todo.title },
  });

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const wasCompleted = todo.completed;
  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  const distinctId = getDistinctId(req);

  if (req.body.title !== undefined) {
    posthog.capture({
      distinctId,
      event: 'todo updated',
      properties: { todo_id: todo.id, title: todo.title },
    });
  }

  if (!wasCompleted && todo.completed) {
    posthog.capture({
      distinctId,
      event: 'todo completed',
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

  const [deleted] = todos.splice(index, 1);

  posthog.capture({
    distinctId: getDistinctId(req),
    event: 'todo deleted',
    properties: { todo_id: deleted.id, title: deleted.title },
  });

  res.status(204).send();
});

app.use((err, req, res, next) => {
  posthog.captureException(err, getDistinctId(req));
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});
