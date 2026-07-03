import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/lib/data';
import { z } from 'zod';
import { getPostHogClient } from '@/lib/posthog-server';

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /api/todos - Get all todos
export async function GET(request: NextRequest) {
  try {
    const allTodos = getTodos();

    // Capture server-side list event
    const posthog = getPostHogClient();
    const distinctId = request.headers.get('x-posthog-distinct-id') || 'server';
    posthog.capture({
      distinctId,
      event: 'api_todos_listed',
      properties: { count: allTodos.length },
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
  try {
    const body = await request.json();
    const validatedData = todoSchema.parse(body);

    const newTodo = createTodo({
      title: validatedData.title,
      description: validatedData.description,
      completed: validatedData.completed,
    });

    // Capture server-side create event
    const posthog = getPostHogClient();
    const distinctId = request.headers.get('x-posthog-distinct-id') || 'server';
    posthog.capture({
      distinctId,
      event: 'api_todo_created',
      properties: { todo_id: newTodo.id, has_description: Boolean(newTodo.description) },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const posthog = getPostHogClient();
      const distinctId = request.headers.get('x-posthog-distinct-id') || 'server';
      posthog.capture({
        distinctId,
        event: 'api_validation_error',
        properties: { location: 'create_todo', errors: error.errors?.length ?? 0 },
      });

      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
