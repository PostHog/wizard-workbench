# App Router vs Pages Router: Side-by-Side Comparison

This document highlights the specific code differences between the App Router and Pages Router implementations of the same todo application.

## 1. Entry Points and Layout

### App Router ([app/layout.tsx](../15-app-router-todo/app/layout.tsx))
```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App - Next.js 15',
  description: 'A full-stack todo application built with Next.js 15',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

### Pages Router ([pages/_app.tsx](pages/_app.tsx) + [pages/_document.tsx](pages/_document.tsx))
```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**Key Differences:**
- App Router: Single `layout.tsx` with metadata export
- Pages Router: Separate `_app.tsx` and `_document.tsx` files

## 2. Page Component

### App Router ([app/page.tsx](../15-app-router-todo/app/page.tsx))
```tsx
import { TodoList } from '@/components/todos/todo-list';

export default function HomePage() {
  return <TodoList />;
}
```

### Pages Router ([pages/index.tsx](pages/index.tsx))
```tsx
import Head from 'next/head';
import { TodoList } from '@/components/todos/todo-list';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Todo App - Next.js 15</title>
        <meta name="description" content="A full-stack todo application built with Next.js 15" />
      </Head>
      <TodoList />
    </>
  );
}
```

**Key Differences:**
- Pages Router: Uses `next/head` for metadata instead of `metadata` export

## 3. API Routes - Collection Endpoint

### App Router ([app/api/todos/route.ts](../15-app-router-todo/app/api/todos/route.ts))
```tsx
import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/lib/data';

// Named export for GET method
export async function GET() {
  try {
    const allTodos = getTodos();
    return NextResponse.json(allTodos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// Named export for POST method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // ... validation and creation
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    // ... error handling
  }
}
```

### Pages Router ([pages/api/todos/index.ts](pages/api/todos/index.ts))
```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTodos, createTodo } from '@/lib/data';

// Single default export handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const allTodos = getTodos();
      return res.status(200).json(allTodos);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch todos' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validatedData = todoSchema.parse(req.body);
      // ... creation logic
      return res.status(201).json(newTodo);
    } catch (error) {
      // ... error handling
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

**Key Differences:**
- App Router: Separate named exports (GET, POST) using `NextRequest`/`NextResponse`
- Pages Router: Single handler with method checking using `NextApiRequest`/`NextApiResponse`

## 4. API Routes - Dynamic Routes

### App Router ([app/api/todos/[id]/route.ts](../15-app-router-todo/app/api/todos/[id]/route.ts))
```tsx
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // params is a Promise in Next.js 15
  const todoId = parseInt(id);
  // ...
}
```

### Pages Router ([pages/api/todos/[id].ts](pages/api/todos/[id].ts))
```tsx
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;  // query params available directly
  const todoId = parseInt(id as string);

  if (req.method === 'GET') {
    // ...
  }

  if (req.method === 'PATCH') {
    // ...
  }

  if (req.method === 'DELETE') {
    // ...
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

**Key Differences:**
- App Router:
  - Params passed as second argument
  - Params is a Promise (must await in Next.js 15)
  - Located in `[id]/route.ts`
- Pages Router:
  - Params available via `req.query`
  - Synchronous access
  - Located in `[id].ts`

## 5. CSS Location

### App Router
- Located at `app/globals.css`
- Imported in `app/layout.tsx`

### Pages Router
- Located at `styles/globals.css`
- Imported in `pages/_app.tsx`

## 6. Configuration

### components.json
```json
// App Router
{
  "rsc": true,
  "tailwind": {
    "css": "app/globals.css"
  }
}

// Pages Router
{
  "rsc": false,
  "tailwind": {
    "css": "styles/globals.css"
  }
}
```

**Key Differences:**
- App Router: RSC (React Server Components) enabled
- Pages Router: RSC disabled (client components by default)

## Summary

Both implementations are **functionally identical** and use the same:
- Components (`components/`)
- Business logic (`lib/`)
- Styling approach (Tailwind CSS)
- Validation (Zod)
- Type system (TypeScript)

The only differences are in:
1. **File structure**: `app/` vs `pages/`
2. **Metadata handling**: `metadata` export vs `next/head`
3. **API route syntax**: Named exports vs method checking
4. **Params handling**: Async params vs sync query object
5. **Response types**: `NextResponse` vs direct `res` object
