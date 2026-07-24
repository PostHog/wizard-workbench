require('dotenv').config();

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
      properties: {
        title_length: title.length,
      },
    });
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const titleUpdated = req.body.title !== undefined && req.body.title !== todo.title;
  const completionChanged =
    req.body.completed !== undefined && req.body.completed !== todo.completed;

  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  if (posthog && titleUpdated) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        title_length: todo.title.length,
      },
    });
  }

  if (posthog && completionChanged) {
    posthog.capture({
      event: 'todo_completed',
      properties: {
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

  todos.splice(index, 1);

  if (posthog) {
    posthog.capture({
      event: 'todo_deleted',
    });
  }

  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
