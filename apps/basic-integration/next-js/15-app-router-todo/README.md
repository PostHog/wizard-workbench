# Next.js 15 Todo App

A simple, full-stack todo application built with Next.js 15, utilizing server-side API routes with in-memory storage for managing todo items.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete todos
- **Server-Side API Routes**: RESTful API endpoints using Next.js 15 route handlers
- **In-Memory Storage**: Simple data persistence (resets on server restart)
- **Modern UI**: Clean interface with Tailwind CSS and custom components
- **Type Safety**: Full TypeScript support with Zod validation

## Tech Stack

- **Next.js 15.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Zod** - Schema validation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## API Routes

### GET /api/todos
Get all todos

### POST /api/todos
Create a new todo
```json
{
  "title": "Learn Next.js",
  "description": "Study Next.js 15 features",
  "completed": false
}
```

### GET /api/todos/[id]
Get a specific todo by ID

### PATCH /api/todos/[id]
Update a todo
```json
{
  "completed": true
}
```

### DELETE /api/todos/[id]
Delete a todo

## Project Structure

```
apps/next-js/15-todo/
├── app/
│   ├── api/
│   │   └── todos/
│   │       ├── route.ts           # GET, POST /api/todos
│   │       └── [id]/
│   │           └── route.ts       # GET, PATCH, DELETE /api/todos/[id]
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── todos/
│   │   ├── todo-list.tsx         # Main todo list component
│   │   ├── todo-item.tsx         # Individual todo item
│   │   └── todo-form.tsx         # Form for adding todos
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── data.ts                   # In-memory data store
│   └── utils.ts
└── package.json
```

## Notes

- Data is stored in memory and will be reset when the development server restarts
- The app comes pre-seeded with 3 sample todos
- Perfect for learning Next.js 15 API routes without database complexity

## License

MIT
