const express = require('express');
const { setupExpressErrorHandler } = require('posthog-node');
const posthog = require('./posthog');

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
      properties: { todo_id: todo.id, title_length: title.length },
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
  const completedChanged = req.body.completed !== undefined && req.body.completed !== todo.completed;

  if (titleChanged) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  if (posthog && titleChanged) {
    posthog.capture({
      event: 'todo_renamed',
      properties: { todo_id: todo.id, title_length: todo.title.length },
    });
  }

  if (posthog && completedChanged) {
    posthog.capture({
      event: todo.completed ? 'todo_completed' : 'todo_reopened',
      properties: { todo_id: todo.id },
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
      properties: { todo_id: todo.id, was_completed: todo.completed },
    });
  }

  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

const server = app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    if (posthog) await posthog.shutdown();
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
