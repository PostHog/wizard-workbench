import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/lib/data';
import { getPostHogClient, shutdownPostHog } from '@/lib/posthog-server';
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos - Get all todos
export async function GET() {
  const posthog = getPostHogClient();

  try {
    const allTodos = getTodos();

    posthog.capture({
      distinctId: 'todo-api',
      event: 'todo_api_list_requested',
      properties: {
        todo_count: allTodos.length,
        completed_count: allTodos.filter((todo) => todo.completed).length,
      },
    });
    await shutdownPostHog();

    return NextResponse.json(allTodos);
  } catch (error) {
    posthog.captureException(error, 'todo-api', {
      endpoint: '/api/todos',
      method: 'GET',
    });
    await shutdownPostHog();

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
      distinctId: 'todo-api',
      event: 'todo_api_created',
      properties: {
        todo_id: newTodo.id,
        title_length: newTodo.title.length,
        has_description: Boolean(newTodo.description),
        completed: newTodo.completed,
      },
    });
    await shutdownPostHog();

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }

    posthog.captureException(error, 'todo-api', {
      endpoint: '/api/todos',
      method: 'POST',
    });
    await shutdownPostHog();

    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
