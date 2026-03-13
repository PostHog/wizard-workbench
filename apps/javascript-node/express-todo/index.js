const express = require('express');
const { PostHog } = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;

const posthog = new PostHog(process.env.POSTHOG_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

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

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  posthog.capture({
    distinctId,
    event: 'todo created',
    properties: {
      todo_id: todo.id,
      todo_title: todo.title,
      $session_id: req.headers['x-posthog-session-id'],
    },
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

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  const sessionId = req.headers['x-posthog-session-id'];

  if (completedChanged && todo.completed) {
    posthog.capture({
      distinctId,
      event: 'todo completed',
      properties: {
        todo_id: todo.id,
        todo_title: todo.title,
        $session_id: sessionId,
      },
    });
  } else if (titleChanged) {
    posthog.capture({
      distinctId,
      event: 'todo updated',
      properties: {
        todo_id: todo.id,
        todo_title: todo.title,
        $session_id: sessionId,
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

  const [deleted] = todos.splice(index, 1);

  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  posthog.capture({
    distinctId,
    event: 'todo deleted',
    properties: {
      todo_id: deleted.id,
      todo_title: deleted.title,
      todo_was_completed: deleted.completed,
      $session_id: req.headers['x-posthog-session-id'],
    },
  });

  res.status(204).send();
});

app.use((err, req, res, next) => {
  const distinctId = req.headers['x-posthog-distinct-id'] || req.ip || 'anonymous';
  posthog.captureException(err, distinctId);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
