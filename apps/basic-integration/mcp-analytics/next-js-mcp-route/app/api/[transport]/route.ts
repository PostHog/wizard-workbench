import { createMcpHandler } from 'mcp-handler';
import { instrument } from '@posthog/mcp';
import { PostHog } from 'posthog-node';
import { z } from 'zod';
import { createTodo, getTodos } from '@/lib/data';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogKey && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
  );
}

const posthog =
  posthogKey && posthogHost
    ? new PostHog(posthogKey, {
        host: posthogHost,
        enableExceptionAutocapture: true,
        flushAt: 1,
        flushInterval: 0,
        requestTimeout: 2000,
        fetchRetryCount: 0,
      })
    : undefined;

const handler = createMcpHandler(
  (server) => {
    if (posthog) {
      instrument(server, posthog);
    }

    server.tool('list_todos', 'List all todos', {}, async () => ({
      content: [{ type: 'text', text: JSON.stringify(getTodos()) }],
    }));
    server.tool(
      'create_todo',
      'Create a todo',
      { title: z.string() },
      async ({ title }) => ({
        content: [{ type: 'text', text: JSON.stringify(createTodo({ title })) }],
      }),
    );
  },
  {},
  { basePath: '/api' },
);

async function handle(request: Request) {
  try {
    return await handler(request);
  } finally {
    await posthog?.flush().catch(() => {});
  }
}

export { handle as GET, handle as POST, handle as DELETE };
