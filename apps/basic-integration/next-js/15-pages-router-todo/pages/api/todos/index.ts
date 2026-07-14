import type { NextApiRequest, NextApiResponse } from 'next';
import { getTodos, createTodo } from '@/lib/data';
import { getPostHogClient } from '@/lib/posthog-server';
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos - Get all todos
// POST /api/todos - Create a new todo
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const posthog = getPostHogClient();
  const distinctId = req.headers['x-posthog-distinct-id']?.toString() || 'anonymous';

  if (req.method === 'GET') {
    try {
      const allTodos = getTodos();

      posthog.capture({
        distinctId,
        event: 'todo_list_requested_api',
        properties: {
          todo_count: allTodos.length,
          completed_count: allTodos.filter((todo) => todo.completed).length,
          active_count: allTodos.filter((todo) => !todo.completed).length,
        },
      });
      await posthog.flush();

      return res.status(200).json(allTodos);
    } catch (error) {
      posthog.captureException(error, distinctId);
      await posthog.flush();
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
        distinctId,
        event: 'todo_created_api',
        properties: {
          todo_id: newTodo.id,
          has_description: Boolean(newTodo.description),
          title_length: newTodo.title.length,
          completed: newTodo.completed,
        },
      });
      await posthog.flush();

      return res.status(201).json(newTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid todo data',
          details: error.errors,
        });
      }
      posthog.captureException(error, distinctId);
      await posthog.flush();
      console.error('Error creating todo:', error);
      return res.status(500).json({ error: 'Failed to create todo' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
