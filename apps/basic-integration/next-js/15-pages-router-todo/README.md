# Next.js 15 Todo App (Pages Router)

A simple, full-stack todo application built with Next.js 15, utilizing the Pages Router with server-side API routes and in-memory storage for managing todo items.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete todos
- **Server-Side API Routes**: RESTful API endpoints using Next.js 15 Pages Router API routes
- **In-Memory Storage**: Simple data persistence (resets on server restart)
- **Modern UI**: Clean interface with Tailwind CSS and custom components
- **Type Safety**: Full TypeScript support with Zod validation

## Tech Stack

- **Next.js 15.3** - React framework with Pages Router
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
apps/next-js/15-pages-router-todo/
├── pages/
│   ├── _app.tsx                  # Custom App component
│   ├── _document.tsx             # Custom Document component
│   ├── index.tsx                 # Home page
│   └── api/
│       └── todos/
│           ├── index.ts          # GET, POST /api/todos
│           └── [id].ts           # GET, PATCH, DELETE /api/todos/[id]
├── components/
│   ├── todos/
│   │   ├── todo-list.tsx         # Main todo list component
│   │   ├── todo-item.tsx         # Individual todo item
│   │   └── todo-form.tsx         # Form for adding todos
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── data.ts                   # In-memory data store
│   └── utils.ts
├── styles/
│   └── globals.css               # Global styles
└── package.json
```

## Pages Router vs App Router

This project is a Pages Router implementation of the App Router todo application. The key differences include:

### Routing
- **Pages Router**: Uses `pages/` directory for file-based routing
- **App Router**: Uses `app/` directory for file-based routing

### Page Structure
- **Pages Router**:
  - Uses `_app.tsx` for global app wrapper
  - Uses `_document.tsx` for HTML document structure
  - Metadata managed via `next/head` component
- **App Router**:
  - Uses `layout.tsx` for layouts
  - Metadata managed via `metadata` export

### API Routes
- **Pages Router**:
  - Located in `pages/api/`
  - Uses `NextApiRequest` and `NextApiResponse`
  - Single handler function that checks `req.method`
- **App Router**:
  - Located in `app/api/*/route.ts`
  - Uses `NextRequest` and `NextResponse`
  - Named exports for each HTTP method (GET, POST, etc.)

### Dynamic Routes
- **Pages Router**: Uses `[id].ts` with `req.query.id` (string)
- **App Router**: Uses `[id]/route.ts` with async `params` (Promise)

## Notes

- Data is stored in memory and will be reset when the development server restarts
- The app comes pre-seeded with 3 sample todos
- Perfect for learning Next.js 15 Pages Router without database complexity
- Functionally identical to the App Router version, just using different routing paradigms

## License

MIT
