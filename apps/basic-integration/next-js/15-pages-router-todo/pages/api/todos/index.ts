import type { NextApiRequest, NextApiResponse } from 'next';
import { getTodos, createTodo } from '@/lib/data';
import { getPostHogClient, shutdownPostHog } from '@/lib/posthog-server';
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos - Get all todos
// POST /api/todos - Create a new todo
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const distinctId = req.headers['x-posthog-distinct-id'];
  const sessionId = req.headers['x-posthog-session-id'];
  const posthog = getPostHogClient();

  if (req.method === 'GET') {
    try {
      const allTodos = getTodos();

      posthog.capture({
        distinctId: typeof distinctId === 'string' ? distinctId : 'anonymous',
        event: 'todos_list_requested',
        properties: {
          total_todos: allTodos.length,
          completed_todos: allTodos.filter((todo) => todo.completed).length,
          $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        },
      });
      await shutdownPostHog();

      return res.status(200).json(allTodos);
    } catch (error) {
      posthog.captureException(error, typeof distinctId === 'string' ? distinctId : 'anonymous', {
        $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        endpoint: '/api/todos',
        method: 'GET',
      });
      await shutdownPostHog();
      console.error('Error fetching todos:', error);
      return res.status(500).json({ error: 'Failed to fetch todos' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validatedData = todoSchema.parse(req.body);

      const newTodo = createTodo({
        title: validatedData.title,
        description: validatedData.description,
        completed: validatedData.completed,
      });

      posthog.capture({
        distinctId: typeof distinctId === 'string' ? distinctId : `todo-${newTodo.id}`,
        event: 'todo_created_api',
        properties: {
          todo_id: newTodo.id,
          completed: newTodo.completed,
          has_description: Boolean(newTodo.description),
          title_length: newTodo.title.length,
          $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        },
      });
      await shutdownPostHog();

      return res.status(201).json(newTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        posthog.captureException(error, typeof distinctId === 'string' ? distinctId : 'anonymous', {
          $session_id: typeof sessionId === 'string' ? sessionId : undefined,
          endpoint: '/api/todos',
          method: 'POST',
        });
        await shutdownPostHog();
        return res.status(400).json({
          error: 'Invalid todo data',
          details: error.errors,
        });
      }
      posthog.captureException(error, typeof distinctId === 'string' ? distinctId : 'anonymous', {
        $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        endpoint: '/api/todos',
        method: 'POST',
      });
      await shutdownPostHog();
      console.error('Error creating todo:', error);
      return res.status(500).json({ error: 'Failed to create todo' });
    }
  }

  await shutdownPostHog();
  return res.status(405).json({ error: 'Method not allowed' });
}
