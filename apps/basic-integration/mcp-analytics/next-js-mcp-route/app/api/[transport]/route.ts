import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { createTodo, getTodos } from '@/lib/data';

const handler = createMcpHandler(
  (server) => {
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

export { handler as GET, handler as POST, handler as DELETE };
