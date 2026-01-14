// MEEEEOWWW IM A DOG
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
export async function GET(request: NextRequest) {
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') || 'anonymous';

  try {
    const allTodos = getTodos();
    return NextResponse.json(allTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);

    // Track API error
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId,
      event: 'api_error',
      properties: {
        endpoint: '/api/todos',
        method: 'GET',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') || 'anonymous';
  const posthog = getPostHogClient();

  try {
    const body = await request.json();
    const validatedData = todoSchema.parse(body);

    const newTodo = createTodo({
      title: validatedData.title,
      description: validatedData.description,
      completed: validatedData.completed,
    });

    // Track server-side todo creation
    posthog.capture({
      distinctId,
      event: 'server_todo_created',
      properties: {
        todo_id: newTodo.id,
        has_description: !!validatedData.description,
        title_length: validatedData.title.length,
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Track validation error
      posthog.capture({
        distinctId,
        event: 'api_validation_error',
        properties: {
          endpoint: '/api/todos',
          method: 'POST',
          validation_errors: error.errors.map((e) => e.message),
        },
      });

      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating todo:', error);

    // Track API error
    posthog.capture({
      distinctId,
      event: 'api_error',
      properties: {
        endpoint: '/api/todos',
        method: 'POST',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
