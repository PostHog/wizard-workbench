import { NextRequest, NextResponse } from 'next/server';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/data';
import { getPostHogClient } from '@/lib/posthog-server';
import { z } from 'zod';

const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos/[id] - Get a specific todo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const todo = getTodoById(todoId);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// PATCH /api/todos/[id] - Update a todo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateTodoSchema.parse(body);

    const updatedTodo = updateTodo(todoId, validatedData);

    if (!updatedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: `todo-${updatedTodo.id}`,
      event: 'todo_updated_api',
      properties: {
        todo_id: updatedTodo.id,
        completed: updatedTodo.completed,
        updated_fields: Object.keys(validatedData),
      },
    });
    await posthog.shutdown();

    return NextResponse.json(updatedTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }

    const posthog = getPostHogClient();
    posthog.captureException(error, undefined, {
      endpoint: '/api/todos/[id]',
      method: 'PATCH',
    });
    await posthog.shutdown();

    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const deleted = deleteTodo(todoId);

    if (!deleted) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: `todo-${todoId}`,
      event: 'todo_deleted_api',
      properties: {
        todo_id: todoId,
      },
    });
    await posthog.shutdown();

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    const posthog = getPostHogClient();
    posthog.captureException(error, undefined, {
      endpoint: '/api/todos/[id]',
      method: 'DELETE',
    });
    await posthog.shutdown();

    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
