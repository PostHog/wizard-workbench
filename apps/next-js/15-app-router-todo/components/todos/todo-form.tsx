'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import posthog from 'posthog-js';

interface TodoFormProps {
  onAdd: (title: string, description: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Capture client-side todo add button clicked event
      posthog.capture('todo_add_button_clicked', {
        has_description: !!description.trim(),
      });
      onAdd(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Add Todo
      </Button>
    </form>
  );
}
