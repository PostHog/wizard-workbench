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

  try {
    const body = await request.json();
    const validatedData = todoSchema.parse(body);

    const newTodo = createTodo({
      title: validatedData.title,
      description: validatedData.description,
      completed: validatedData.completed,
    });

    posthog.capture({
      distinctId: `todo-api-${newTodo.id}`,
      event: 'todo_create_api_succeeded',
      properties: {
        todo_id: newTodo.id,
        has_description: Boolean(newTodo.description),
        title_length: newTodo.title.length,
      },
    });
    await posthog.flush();

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      posthog.capture({
        distinctId: 'todo-api-validation',
        event: 'todo_create_api_failed',
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

    posthog.captureException(error, 'todo-api-create-error');
    posthog.capture({
      distinctId: 'todo-api-create-error',
      event: 'todo_create_api_failed',
      properties: {
        failure_reason: 'server_error',
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
