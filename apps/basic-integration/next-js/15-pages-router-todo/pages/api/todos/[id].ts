import type { NextApiRequest, NextApiResponse } from 'next';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/data';
import { getPostHogClient, shutdownPostHog } from '@/lib/posthog-server';
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
  const { id } = req.query;
  const todoId = parseInt(id as string);
  const distinctId = req.headers['x-posthog-distinct-id'];
  const sessionId = req.headers['x-posthog-session-id'];
  const posthog = getPostHogClient();

  if (isNaN(todoId)) {
    await shutdownPostHog();
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  if (req.method === 'GET') {
    try {
      const todo = getTodoById(todoId);

      if (!todo) {
        await shutdownPostHog();
        return res.status(404).json({ error: 'Todo not found' });
      }

      await shutdownPostHog();
      return res.status(200).json(todo);
    } catch (error) {
      posthog.captureException(error, typeof distinctId === 'string' ? distinctId : `todo-${todoId}`, {
        $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        endpoint: '/api/todos/[id]',
        method: 'GET',
        todo_id: todoId,
      });
      await shutdownPostHog();
      console.error('Error fetching todo:', error);
      return res.status(500).json({ error: 'Failed to fetch todo' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const validatedData = updateTodoSchema.parse(req.body);

      const updatedTodo = updateTodo(todoId, validatedData);

      if (!updatedTodo) {
        await shutdownPostHog();
        return res.status(404).json({ error: 'Todo not found' });
      }

      posthog.capture({
        distinctId: typeof distinctId === 'string' ? distinctId : `todo-${todoId}`,
        event: 'todo_updated_api',
        properties: {
          todo_id: updatedTodo.id,
          completed: updatedTodo.completed,
          has_description: Boolean(updatedTodo.description),
          $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        },
      });
      await shutdownPostHog();

      return res.status(200).json(updatedTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        posthog.captureException(error, typeof distinctId === 'string' ? distinctId : `todo-${todoId}`, {
          $session_id: typeof sessionId === 'string' ? sessionId : undefined,
          endpoint: '/api/todos/[id]',
          method: 'PATCH',
          todo_id: todoId,
        });
        await shutdownPostHog();
        return res.status(400).json({
          error: 'Invalid todo data',
          details: error.errors,
        });
      }
      posthog.captureException(error, typeof distinctId === 'string' ? distinctId : `todo-${todoId}`, {
        $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        endpoint: '/api/todos/[id]',
        method: 'PATCH',
        todo_id: todoId,
      });
      await shutdownPostHog();
      console.error('Error updating todo:', error);
      return res.status(500).json({ error: 'Failed to update todo' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existingTodo = getTodoById(todoId);
      const deleted = deleteTodo(todoId);

      if (!deleted) {
        await shutdownPostHog();
        return res.status(404).json({ error: 'Todo not found' });
      }

      posthog.capture({
        distinctId: typeof distinctId === 'string' ? distinctId : `todo-${todoId}`,
        event: 'todo_deleted_api',
        properties: {
          todo_id: todoId,
          completed: existingTodo?.completed ?? null,
          had_description: Boolean(existingTodo?.description),
          $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        },
      });
      await shutdownPostHog();

      return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
      posthog.captureException(error, typeof distinctId === 'string' ? distinctId : `todo-${todoId}`, {
        $session_id: typeof sessionId === 'string' ? sessionId : undefined,
        endpoint: '/api/todos/[id]',
        method: 'DELETE',
        todo_id: todoId,
      });
      await shutdownPostHog();
      console.error('Error deleting todo:', error);
      return res.status(500).json({ error: 'Failed to delete todo' });
    }
  }

  await shutdownPostHog();
  return res.status(405).json({ error: 'Method not allowed' });
}
