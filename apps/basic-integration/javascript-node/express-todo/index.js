const express = require('express');
const { PostHog } = require('posthog-node');

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const todos = [];
let nextId = 1;

function getDistinctId(req) {
  return req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
}

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
    event: 'todo_created',
    properties: {
      todo_id: todo.id,
      title: todo.title,
    },
  });

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.body.title !== undefined) {
    todo.title = req.body.title;
    posthog.capture({
      distinctId: getDistinctId(req),
      event: 'todo_updated',
      properties: {
        todo_id: todo.id,
        title: todo.title,
      },
    });
  }

  if (req.body.completed !== undefined) {
    todo.completed = req.body.completed;
    if (todo.completed) {
      posthog.capture({
        distinctId: getDistinctId(req),
        event: 'todo_completed',
        properties: {
          todo_id: todo.id,
          title: todo.title,
        },
      });
    }
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
    event: 'todo_deleted',
    properties: {
      todo_id: deleted.id,
      title: deleted.title,
    },
  });

  res.status(204).send();
});

app.use((err, req, res, next) => {
  posthog.captureException(err, getDistinctId(req));
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  server.close();
  await posthog.shutdown();
  process.exit(0);
});
