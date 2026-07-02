'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TodoFormProps {
  onAdd: (title: string, description: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Capture client-side event for form submission
      try {
        // posthog is imported dynamically to avoid adding it to global scope when not installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const posthog = require('posthog-js');
        if (posthog && posthog.capture) {
          posthog.capture('todo_add_clicked', { title_length: title.length });
        }
      } catch (err) {
        // If posthog-js is not installed, silently continue
      }

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
