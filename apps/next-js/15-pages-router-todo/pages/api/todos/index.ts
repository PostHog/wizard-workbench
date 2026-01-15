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

      return res.status(201).json(newTodo);
    } catch (error) {
      const posthog = getPostHogClient();

      if (error instanceof z.ZodError) {
        // Track validation failure event
        posthog.capture({
          distinctId: 'anonymous',
          event: 'todo_create_failed',
          properties: {
            error_type: 'validation_error',
            error_details: error.errors,
          },
        });

        return res.status(400).json({
          error: 'Invalid todo data',
          details: error.errors,
        });
      }

      // Track server error event
      posthog.capture({
        distinctId: 'anonymous',
        event: 'todo_create_failed',
        properties: {
          error_type: 'server_error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      console.error('Error creating todo:', error);
      return res.status(500).json({ error: 'Failed to create todo' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
