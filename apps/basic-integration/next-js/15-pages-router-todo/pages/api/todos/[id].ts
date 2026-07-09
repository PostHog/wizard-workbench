import type { NextApiRequest, NextApiResponse } from 'next';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/data';
import { getPostHogServerClient } from '@/lib/posthog-server';
import { z } from 'zod';

const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos/[id] - Get a specific todo
// PATCH /api/todos/[id] - Update a todo
// DELETE /api/todos/[id] - Delete a todo
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const posthog = getPostHogServerClient();
  const distinctId = req.headers['x-posthog-distinct-id']?.toString() || 'anonymous-todo-user';

  const { id } = req.query;
  const todoId = parseInt(id as string);

  if (isNaN(todoId)) {
    posthog.capture({
      distinctId,
      event: 'todo_api_error',
      properties: {
        endpoint: '/api/todos/[id]',
        method: req.method ?? 'unknown',
        error_type: 'invalid_id',
      },
    });
    await posthog.shutdown();
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  if (req.method === 'GET') {
    try {
      const todo = getTodoById(todoId);

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      await posthog.shutdown();
      return res.status(200).json(todo);
    } catch (error) {
      posthog.captureException(error, distinctId, {
        endpoint: '/api/todos/[id]',
        method: 'GET',
        todo_id: todoId,
      });
      posthog.capture({
        distinctId,
        event: 'todo_api_error',
        properties: {
          endpoint: '/api/todos/[id]',
          method: 'GET',
          todo_id: todoId,
          error_type: 'fetch_failed',
        },
      });
      await posthog.shutdown();
      console.error('Error fetching todo:', error);
      return res.status(500).json({ error: 'Failed to fetch todo' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const validatedData = updateTodoSchema.parse(req.body);

      const updatedTodo = updateTodo(todoId, validatedData);

      if (!updatedTodo) {
        await posthog.shutdown();
        return res.status(404).json({ error: 'Todo not found' });
      }

      posthog.capture({
        distinctId,
        event: 'todo_updated_api',
        properties: {
          todo_id: updatedTodo.id,
          completed: updatedTodo.completed,
          has_description: Boolean(updatedTodo.description),
          method: 'PATCH',
        },
      });
      await posthog.shutdown();
      return res.status(200).json(updatedTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        posthog.capture({
          distinctId,
          event: 'todo_api_error',
          properties: {
            endpoint: '/api/todos/[id]',
            method: 'PATCH',
            todo_id: todoId,
            error_type: 'validation_failed',
          },
        });
        await posthog.shutdown();
        return res.status(400).json({
          error: 'Invalid todo data',
          details: error.errors,
        });
      }
      posthog.captureException(error, distinctId, {
        endpoint: '/api/todos/[id]',
        method: 'PATCH',
        todo_id: todoId,
      });
      posthog.capture({
        distinctId,
        event: 'todo_api_error',
        properties: {
          endpoint: '/api/todos/[id]',
          method: 'PATCH',
          todo_id: todoId,
          error_type: 'update_failed',
        },
      });
      await posthog.shutdown();
      console.error('Error updating todo:', error);
      return res.status(500).json({ error: 'Failed to update todo' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existingTodo = getTodoById(todoId);
      const deleted = deleteTodo(todoId);

      if (!deleted) {
        await posthog.shutdown();
        return res.status(404).json({ error: 'Todo not found' });
      }

      posthog.capture({
        distinctId,
        event: 'todo_deleted_api',
        properties: {
          todo_id: todoId,
          was_completed: existingTodo?.completed ?? false,
          method: 'DELETE',
        },
      });
      await posthog.shutdown();
      return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
      posthog.captureException(error, distinctId, {
        endpoint: '/api/todos/[id]',
        method: 'DELETE',
        todo_id: todoId,
      });
      posthog.capture({
        distinctId,
        event: 'todo_api_error',
        properties: {
          endpoint: '/api/todos/[id]',
          method: 'DELETE',
          todo_id: todoId,
          error_type: 'delete_failed',
        },
      });
      await posthog.shutdown();
      console.error('Error deleting todo:', error);
      return res.status(500).json({ error: 'Failed to delete todo' });
    }
  }

  await posthog.shutdown();
  return res.status(405).json({ error: 'Method not allowed' });
}
