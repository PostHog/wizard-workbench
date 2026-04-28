export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

let todos: Todo[] = [
  {
    id: 1,
    title: 'Learn Next.js 15',
    description: 'Explore the new features in Next.js 15 including improved performance and developer experience',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'Build a todo app',
    description: 'Create a full-stack todo application with server-side API routes',
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: 'Deploy to production',
    description: 'Deploy the application to Vercel or another hosting platform',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextId = 4;

export function getTodos(): Todo[] {
  return todos;
}

export function getTodoById(id: number): Todo | undefined {
  return todos.find((todo) => todo.id === id);
}

export function createTodo(data: {
  title: string;
  description?: string;
  completed?: boolean;
}): Todo {
  const newTodo: Todo = {
    id: nextId++,
    title: data.title,
    description: data.description,
    completed: data.completed ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  todos.push(newTodo);
  return newTodo;
}

export function updateTodo(
  id: number,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
  }
): Todo | undefined {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return undefined;

  todos[index] = {
    ...todos[index],
    ...data,
    updatedAt: new Date(),
  };
  return todos[index];
}

export function deleteTodo(id: number): boolean {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return false;

  todos.splice(index, 1);
  return true;
}
