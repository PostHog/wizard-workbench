import type { NextApiRequest, NextApiResponse } from 'next';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/data';
import { z } from 'zod';

const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos/[id] - Get a specific todo
// PATCH /api/todos/[id] - Update a todo
// DELETE /api/todos/[id] - Delete a todo
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const todoId = parseInt(id as string);

  if (isNaN(todoId)) {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  if (req.method === 'GET') {
    try {
      const todo = getTodoById(todoId);

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      return res.status(200).json(todo);
    } catch (error) {
      console.error('Error fetching todo:', error);
      return res.status(500).json({ error: 'Failed to fetch todo' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const validatedData = updateTodoSchema.parse(req.body);

      const updatedTodo = updateTodo(todoId, validatedData);

      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      return res.status(200).json(updatedTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid todo data',
          details: error.errors,
        });
      }
      console.error('Error updating todo:', error);
      return res.status(500).json({ error: 'Failed to update todo' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = deleteTodo(todoId);

      if (!deleted) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      return res.status(500).json({ error: 'Failed to delete todo' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
