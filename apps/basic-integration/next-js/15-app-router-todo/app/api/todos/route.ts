import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/lib/data';
import { getPostHogClient } from '@/lib/posthog-server';
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos - Get all todos
export async function GET() {
  try {
    const allTodos = getTodos();
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
  const posthog = getPostHogClient();
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
        completed: newTodo.completed,
        has_description: Boolean(newTodo.description),
        source: 'api',
        todo_id: newTodo.id,
        title_length: newTodo.title.length,
      },
    });
    await posthog.flush();

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      posthog.capture({
        distinctId,
        event: 'todo_create_failed',
        properties: {
          $session_id: sessionId,
          error_type: 'validation_error',
          source: 'api',
        },
      });
      await posthog.flush();

      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }

    posthog.captureException(error, distinctId, {
      $session_id: sessionId,
      endpoint: '/api/todos',
      method: 'POST',
    });
    posthog.capture({
      distinctId,
      event: 'todo_create_failed',
      properties: {
        $session_id: sessionId,
        error_type: 'server_error',
        source: 'api',
      },
    });
    await posthog.flush();

    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
