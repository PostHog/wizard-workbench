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
  const posthog = getPostHogClient();

  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      posthog.capture({
        distinctId: 'todo-api-update-invalid-id',
        event: 'todo_update_api_failed',
        properties: {
          failure_reason: 'invalid_id',
        },
      });
      await posthog.flush();

      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateTodoSchema.parse(body);

    const updatedTodo = updateTodo(todoId, validatedData);

    if (!updatedTodo) {
      posthog.capture({
        distinctId: `todo-api-${todoId}`,
        event: 'todo_update_api_failed',
        properties: {
          todo_id: todoId,
          failure_reason: 'todo_not_found',
        },
      });
      await posthog.flush();

      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    posthog.capture({
      distinctId: `todo-api-${updatedTodo.id}`,
      event: 'todo_update_api_succeeded',
      properties: {
        todo_id: updatedTodo.id,
        completed: updatedTodo.completed,
        updated_fields: Object.keys(validatedData),
      },
    });
    await posthog.flush();

    return NextResponse.json(updatedTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      posthog.capture({
        distinctId: 'todo-api-update-validation',
        event: 'todo_update_api_failed',
        properties: {
          failure_reason: 'validation_error',
          issue_count: error.errors.length,
        },
      });
      await posthog.flush();

      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }

    posthog.captureException(error, 'todo-api-update-error');
    posthog.capture({
      distinctId: 'todo-api-update-error',
      event: 'todo_update_api_failed',
      properties: {
        failure_reason: 'server_error',
      },
    });
    await posthog.flush();

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
  const posthog = getPostHogClient();

  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      posthog.capture({
        distinctId: 'todo-api-delete-invalid-id',
        event: 'todo_delete_api_failed',
        properties: {
          failure_reason: 'invalid_id',
        },
      });
      await posthog.flush();

      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const deleted = deleteTodo(todoId);

    if (!deleted) {
      posthog.capture({
        distinctId: `todo-api-${todoId}`,
        event: 'todo_delete_api_failed',
        properties: {
          todo_id: todoId,
          failure_reason: 'todo_not_found',
        },
      });
      await posthog.flush();

      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    posthog.capture({
      distinctId: `todo-api-${todoId}`,
      event: 'todo_delete_api_succeeded',
      properties: {
        todo_id: todoId,
      },
    });
    await posthog.flush();

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    posthog.captureException(error, 'todo-api-delete-error');
    posthog.capture({
      distinctId: 'todo-api-delete-error',
      event: 'todo_delete_api_failed',
      properties: {
        failure_reason: 'server_error',
      },
    });
    await posthog.flush();

    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
