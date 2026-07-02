import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/lib/data';
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
  try {
    const body = await request.json();
    const validatedData = todoSchema.parse(body);

    const newTodo = createTodo({
      title: validatedData.title,
      description: validatedData.description,
      completed: validatedData.completed,
    });

    // Server-side capture for todo creation
    try {
      const { PostHog } = await import('posthog-node');
      const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, { host: process.env.NEXT_PUBLIC_POSTHOG_HOST });
      client.capture({
        distinctId: 'server',
        event: 'todo_created',
        properties: {
          todo_id: newTodo.id,
          title_length: newTodo.title.length,
        },
      });
      await client.shutdown();
    } catch (err) {
      // If posthog-node isn't installed or fails, continue silently
      console.error('PostHog server capture failed:', err);
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
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
