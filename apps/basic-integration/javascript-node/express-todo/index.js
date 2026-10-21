const express = require('express');
const { setupExpressErrorHandler } = require('posthog-node');
const { posthog } = require('./posthog');
const { posthogLogger } = require('./posthog-logs');

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
      properties: { total_todo_count: todos.length },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'info',
      body: 'Todo created through API',
      attributes: { todo_count: todos.length },
    });
  }

  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  if (posthog) {
    posthog.capture({
      event: 'todo_updated',
      properties: {
        title_updated: req.body.title !== undefined,
        completion_updated: req.body.completed !== undefined,
        is_completed: todo.completed,
      },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'info',
      body: 'Todo updated through API',
      attributes: {
        title_updated: req.body.title !== undefined,
        completion_updated: req.body.completed !== undefined,
        is_completed: todo.completed,
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
      properties: { remaining_todo_count: todos.length },
    });
  }

  if (posthogLogger) {
    posthogLogger.emit({
      severityText: 'info',
      body: 'Todo deleted through API',
      attributes: { remaining_todo_count: todos.length },
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
