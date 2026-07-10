'use client';

import posthog from 'posthog-js';
import { Todo } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <Card className={todo.completed ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={todo.completed}
              onChange={(e) => {
                posthog.capture('todo_completion_toggled', {
                  todo_id: todo.id,
                  next_completed_state: e.target.checked,
                  had_description: Boolean(todo.description),
                });
                onToggle(todo.id, e.target.checked);
              }}
              className="mt-1"
            />
            <div className="flex-1">
              <CardTitle className={todo.completed ? 'line-through' : ''}>
                {todo.title}
              </CardTitle>
              {todo.description && (
                <CardDescription className="mt-1.5">
                  {todo.description}
                </CardDescription>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              posthog.capture('todo_delete_clicked', {
                todo_id: todo.id,
                was_completed: todo.completed,
              });
              onDelete(todo.id);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
