import { NextRequest, NextResponse, after } from 'next/server';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { getTodos, createTodo } from '@/lib/data';
import { loggerProvider } from '@/instrumentation';
import { z } from 'zod';

const todoLogger = loggerProvider?.getLogger('posthog-todo-api');

function logTodoOperation(operation: string, statusCode: number) {
  todoLogger?.emit({
    body: 'Todo API operation completed',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      operation,
      outcome: 'success',
      status_code: statusCode,
    },
  });

  const provider = loggerProvider;
  if (provider) {
    after(async () => {
      await provider.forceFlush();
    });
  }
}

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

    logTodoOperation('todo_create', 201);
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
