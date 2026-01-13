'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Todo } from '@/lib/data';
import { TodoForm } from './todo-form';
import { TodoItem } from './todo-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import posthog from 'posthog-js';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      posthog.capture('todos_fetch_failed', {
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      posthog.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title: string, description: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        posthog.capture('todo_created', {
          todo_id: newTodo.id,
          title_length: title.length,
          has_description: !!description,
        });
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
      posthog.capture('todo_create_failed', {
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      posthog.captureException(error);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
        if (completed) {
          posthog.capture('todo_completed', {
            todo_id: id,
          });
        } else {
          posthog.capture('todo_uncompleted', {
            todo_id: id,
          });
        }
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
      posthog.capture('todo_update_failed', {
        todo_id: id,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      posthog.captureException(error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
        posthog.capture('todo_deleted', {
          todo_id: id,
        });
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
      posthog.capture('todo_delete_failed', {
        todo_id: id,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      posthog.captureException(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold">Todo App</h1>
          <Link
            href="/about"
            className="text-sm text-primary hover:underline"
          >
            About
          </Link>
        </div>
        <p className="text-muted-foreground">
          Manage your tasks with Next.js 15 server-side API routes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>Create a new task to keep track of</CardDescription>
        </CardHeader>
        <CardContent>
          <TodoForm onAdd={handleAddTodo} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Active Tasks ({activeTodos.length})
          </h2>
          {activeTodos.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No active tasks. Add one above!
            </p>
          ) : (
            <div className="space-y-3">
              {activeTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </div>

        {completedTodos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Completed ({completedTodos.length})
            </h2>
            <div className="space-y-3">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
