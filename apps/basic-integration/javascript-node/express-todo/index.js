const express = require('express');

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;
let posthog;
let posthogLogger;
let shutdownPosthogLogs;
let setupExpressErrorHandler;

if (!posthogProjectToken || !posthogHost) {
  if (process.env.NODE_ENV !== 'production') {
    if (!posthogProjectToken) {
      console.warn('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured');
    }

    if (!posthogHost) {
      console.warn('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
    }
  }
} else {
  const {
    PostHog,
    setupExpressErrorHandler: configureExpressErrorHandler,
  } = require('posthog-node');
  const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = require('@opentelemetry/resources');
  const {
    BatchLogRecordProcessor,
    LoggerProvider,
  } = require('@opentelemetry/sdk-logs');

  posthog = new PostHog(posthogProjectToken, {
    host: posthogHost,
    enableExceptionAutocapture: true,
  });
  setupExpressErrorHandler = configureExpressErrorHandler;

  const posthogLoggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'express-todo',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${posthogHost}/i/v1/logs`,
          headers: { Authorization: `Bearer ${posthogProjectToken}` },
        }),
      ),
    ],
  });
  posthogLogger = posthogLoggerProvider.getLogger('express-todo.posthog');
  shutdownPosthogLogs = () => posthogLoggerProvider.shutdown().catch(() => {});
}

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
  posthog?.capture({
    event: 'todo_created',
    properties: { completed: todo.completed },
  });
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'todo creation completed',
    attributes: { event: 'todo_created', status_code: 201, completed: todo.completed },
  });
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Not found' });
  }

  const titleUpdated = req.body.title !== undefined;
  const completionUpdated = req.body.completed !== undefined;

  if (titleUpdated) todo.title = req.body.title;
  if (completionUpdated) todo.completed = req.body.completed;

  posthog?.capture({
    event: 'todo_updated',
    properties: {
      title_updated: titleUpdated,
      completion_updated: completionUpdated,
      completed: todo.completed,
    },
  });
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'todo update completed',
    attributes: {
      event: 'todo_updated',
      status_code: 200,
      title_updated: titleUpdated,
      completion_updated: completionUpdated,
      completed: todo.completed,
    },
  });
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  const [todo] = todos.splice(index, 1);
  posthog?.capture({
    event: 'todo_deleted',
    properties: { completed: todo.completed },
  });
  posthogLogger?.emit({
    severityText: 'INFO',
    body: 'todo deletion completed',
    attributes: { event: 'todo_deleted', status_code: 204, completed: todo.completed },
  });
  res.status(204).send();
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

process.once('beforeExit', () => {
  void posthog?.shutdown(3000).catch(() => {});
  void shutdownPosthogLogs?.();
});

app.listen(PORT, () => {
  console.log(`Express todo API running on http://localhost:${PORT}`);
});
