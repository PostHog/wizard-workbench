'use client';

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
              onChange={(e) => onToggle(todo.id, e.target.checked)}
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
            onClick={() => onDelete(todo.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
