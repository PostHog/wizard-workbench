import { NextRequest, NextResponse } from 'next/server';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/data';
import { getPostHogServerClient } from '@/lib/posthog-server';
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
  const posthog = getPostHogServerClient();
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') ?? 'anonymous';
  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID') ?? undefined;

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

    posthog.capture({
      distinctId,
      event: 'todo_updated',
      properties: {
        $session_id: sessionId,
        todo_id: updatedTodo.id,
        completed: updatedTodo.completed,
        fields_updated: Object.keys(validatedData),
        has_description: Boolean(updatedTodo.description),
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      posthog.capture({
        distinctId,
        event: 'todo_api_error',
        properties: {
          $session_id: sessionId,
          route: '/api/todos/[id]',
          method: 'PATCH',
          error_type: 'validation_error',
          issue_count: error.errors.length,
        },
      });

      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }

    posthog.captureException(error, distinctId, {
      $session_id: sessionId,
      route: '/api/todos/[id]',
      method: 'PATCH',
    });
    posthog.capture({
      distinctId,
      event: 'todo_api_error',
      properties: {
        $session_id: sessionId,
        route: '/api/todos/[id]',
        method: 'PATCH',
        error_type: 'server_error',
      },
    });

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
  const posthog = getPostHogServerClient();
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') ?? 'anonymous';
  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID') ?? undefined;

  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const existingTodo = getTodoById(todoId);
    const deleted = deleteTodo(todoId);

    if (!deleted) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    posthog.capture({
      distinctId,
      event: 'todo_deleted',
      properties: {
        $session_id: sessionId,
        todo_id: todoId,
        was_completed: existingTodo?.completed ?? false,
        had_description: Boolean(existingTodo?.description),
      },
    });

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    posthog.captureException(error, distinctId, {
      $session_id: sessionId,
      route: '/api/todos/[id]',
      method: 'DELETE',
    });
    posthog.capture({
      distinctId,
      event: 'todo_api_error',
      properties: {
        $session_id: sessionId,
        route: '/api/todos/[id]',
        method: 'DELETE',
        error_type: 'server_error',
      },
    });

    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
