const express = require('express');
const { PostHog } = require('posthog-node');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const todos = [];
let nextId = 1;

// --- PostHog Setup ---

function initializePosthog() {
  const apiKey = process.env.POSTHOG_API_KEY;

  if (!apiKey) {
    console.log('WARNING: PostHog not configured (POSTHOG_API_KEY not set)');
    console.log("         App will work but analytics won't be tracked");
    return null;
  }

  return new PostHog(apiKey, {
    host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    enableExceptionAutocapture: true,
  });
}

const posthog = initializePosthog();

function trackEvent(distinctId, event, properties = {}) {
  if (!posthog) return;

  posthog.capture({
    distinctId,
    event,
    properties,
  });
}

// --- Routes ---

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

  const userId = req.body.user_id || req.headers['x-posthog-distinct-id'] || 'anonymous';

  trackEvent(userId, 'todo_created', {
    todo_id: todo.id,
    title_length: title.length,
    total_todos: todos.length,
  });

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  const userId = req.body.user_id || req.headers['x-posthog-distinct-id'] || 'anonymous';

  trackEvent(userId, 'todo_updated', {
    todo_id: todo.id,
    completed: todo.completed,
  });

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const todo = todos[index];
  todos.splice(index, 1);

  const userId = req.query.user_id || req.headers['x-posthog-distinct-id'] || 'anonymous';

  trackEvent(userId, 'todo_deleted', {
    todo_id: todo.id,
    was_completed: todo.completed,
  });

  res.status(204).send();
});

// --- Error Handling ---

// Global error handler — capture exceptions to PostHog
app.use((err, req, res, _next) => {
  const userId =
    req.body?.user_id ||
    req.query?.user_id ||
    req.headers['x-posthog-distinct-id'] ||
    'anonymous';

  if (posthog) {
    posthog.captureException(err, userId);
  }

  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Server ---

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

// Graceful shutdown, flush PostHog events before exiting
async function shutdown() {
  console.log('\nShutting down...');
  server.close();
  if (posthog) {
    await posthog.shutdown();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
