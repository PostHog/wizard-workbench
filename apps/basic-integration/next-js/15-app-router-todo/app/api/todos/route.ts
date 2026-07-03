import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/lib/data';
import { z } from 'zod';
import PostHogServer from '@/lib/posthog-server';

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
    // Capture server-side error
    try {
      const ph = PostHogServer();
      ph.capture({ distinctId: 'server', event: 'server_error', properties: { location: 'GET /api/todos', error: String(error) } });
    } catch (e) {
      console.error('PostHog capture failed:', e);
    }
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

    // Capture server-side todo created event
    try {
      const ph = PostHogServer();
      ph.capture({
        distinctId: 'anonymous',
        event: 'todo_created',
        properties: {
          title: newTodo.title,
          completed: newTodo.completed,
          id: newTodo.id,
        },
      });
    } catch (e) {
      console.error('PostHog capture failed:', e);
    }

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid todo data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating todo:', error);
    // Capture server-side error
    try {
      const ph = PostHogServer();
      ph.capture({ distinctId: 'server', event: 'server_error', properties: { location: 'POST /api/todos', error: String(error) } });
    } catch (e) {
      console.error('PostHog capture failed:', e);
    }
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
