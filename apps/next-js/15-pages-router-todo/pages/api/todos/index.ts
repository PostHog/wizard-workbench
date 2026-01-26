import type { NextApiRequest, NextApiResponse } from 'next';
import { getTodos, createTodo } from '@/lib/data';
import { z } from 'zod';
import { getPostHogClient } from '@/lib/posthog-server';

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos - Get all todos
// POST /api/todos - Create a new todo
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const allTodos = getTodos();
      return res.status(200).json(allTodos);
    } catch (error) {
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

      // Capture server-side todo created event
      const posthog = getPostHogClient();
      const distinctId = req.headers['x-posthog-distinct-id'] as string || 'anonymous';
      posthog.capture({
        distinctId,
        event: 'server_todo_created',
        properties: {
          todo_id: newTodo.id,
          has_description: !!newTodo.description,
          source: 'api',
        },
      });

      return res.status(201).json(newTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Capture validation error event
        const posthog = getPostHogClient();
        const distinctId = req.headers['x-posthog-distinct-id'] as string || 'anonymous';
        posthog.capture({
          distinctId,
          event: 'server_validation_error',
          properties: {
            endpoint: '/api/todos',
            method: 'POST',
            errors: error.errors,
          },
        });

        return res.status(400).json({
          error: 'Invalid todo data',
          details: error.errors,
        });
      }
      console.error('Error creating todo:', error);

      // Capture API error event
      const posthog = getPostHogClient();
      const distinctId = req.headers['x-posthog-distinct-id'] as string || 'anonymous';
      posthog.capture({
        distinctId,
        event: 'server_api_error',
        properties: {
          endpoint: '/api/todos',
          method: 'POST',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      return res.status(500).json({ error: 'Failed to create todo' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
