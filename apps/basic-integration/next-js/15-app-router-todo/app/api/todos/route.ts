import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/lib/data';
import { getPostHogServerClient } from '@/lib/posthog-server';
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos - Get all todos
export async function GET(request: NextRequest) {
  try {
    const allTodos = getTodos();
    const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') ?? 'anonymous';

    getPostHogServerClient().capture({
      distinctId,
      event: 'todo_collection_fetched',
      properties: {
        todo_count: allTodos.length,
        completed_count: allTodos.filter((todo) => todo.completed).length,
      },
    });

    return NextResponse.json(allTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  const posthog = getPostHogServerClient();
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') ?? 'anonymous';
  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID') ?? undefined;

  try {
    const body = await request.json();
    const validatedData = todoSchema.parse(body);

    const newTodo = createTodo({
      title: validatedData.title,
      description: validatedData.description,
      completed: validatedData.completed,
    });

    posthog.capture({
      distinctId,
      event: 'todo_created',
      properties: {
        $session_id: sessionId,
        todo_id: newTodo.id,
        has_description: Boolean(newTodo.description),
        completed_on_create: newTodo.completed,
        title_length: newTodo.title.length,
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      posthog.capture({
        distinctId,
        event: 'todo_api_error',
        properties: {
          $session_id: sessionId,
          route: '/api/todos',
          method: 'POST',
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
      route: '/api/todos',
      method: 'POST',
    });
    posthog.capture({
      distinctId,
      event: 'todo_api_error',
      properties: {
        $session_id: sessionId,
        route: '/api/todos',
        method: 'POST',
        error_type: 'server_error',
      },
    });

    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
