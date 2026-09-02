# App Router vs Pages Router: Detailed Comparison

This document provides a comprehensive comparison between the **App Router** (`15-app-router-saas`) and **Pages Router** (`15-pages-router-saas`) implementations of the same SaaS application using Next.js 15.

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Directory Structure](#directory-structure)
3. [Routing](#routing)
4. [Data Fetching](#data-fetching)
5. [Server & Client Components](#server--client-components)
6. [API Routes](#api-routes)
7. [Authentication & Middleware](#authentication--middleware)
8. [Form Handling & Server Actions](#form-handling--server-actions)
9. [Layouts](#layouts)
10. [Performance Considerations](#performance-considerations)
11. [Developer Experience](#developer-experience)
12. [When to Use Each](#when-to-use-each)

---

## High-Level Architecture

### App Router (`15-app-router-saas`)

- **Philosophy**: Server-first with progressive enhancement
- **Rendering**: Server Components by default, opt-in to Client Components
- **Data Flow**: React Server Components (RSC) stream data from server
- **File Convention**: `app/` directory with nested layouts and pages

### Pages Router (`15-pages-router-saas`)

- **Philosophy**: Traditional client-side React with server-side rendering
- **Rendering**: Client Components by default, data fetched via `getServerSideProps`
- **Data Flow**: Server renders page with data, hydrates on client
- **File Convention**: `pages/` directory with file-based routing

---

## Directory Structure

### App Router Structure

```
15-app-router-saas/
├── app/
│   ├── (login)/              # Route group (doesn't affect URL)
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   ├── login.tsx         # Shared client component
│   │   └── actions.ts        # Server Actions
│   ├── (dashboard)/          # Route group with shared layout
│   │   ├── layout.tsx        # Dashboard-specific layout
│   │   ├── page.tsx          # Landing page "/"
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── general/
│   │       ├── activity/
│   │       └── security/
│   ├── api/                  # Route Handlers
│   │   ├── user/route.ts
│   │   ├── team/route.ts
│   │   └── stripe/
│   ├── layout.tsx            # Root layout
│   ├── not-found.tsx         # 404 page
│   └── globals.css
├── lib/                      # Shared utilities
├── components/               # UI components
└── middleware.ts             # Global middleware
```

### Pages Router Structure

```
15-pages-router-saas/
├── pages/
│   ├── _app.tsx             # App-level wrapper
│   ├── _document.tsx        # Document-level HTML wrapper
│   ├── index.tsx            # Landing page "/"
│   ├── sign-in.tsx          # Sign-in page
│   ├── sign-up.tsx          # Sign-up page
│   ├── pricing.tsx          # Pricing page
│   ├── dashboard/
│   │   ├── index.tsx        # Dashboard home
│   │   ├── general.tsx
│   │   ├── activity.tsx
│   │   └── security.tsx
│   └── api/                 # API routes
│       ├── user.ts
│       ├── team.ts
│       └── stripe/
│           ├── checkout.ts
│           └── webhook.ts
├── lib/                     # Shared utilities
│   └── actions/            # Server Actions (adapted)
├── components/             # UI components
│   ├── header.tsx
│   ├── login.tsx
│   └── dashboard-layout.tsx
├── styles/
│   └── globals.css
└── middleware.ts           # Global middleware
```

**Key Differences:**

1. **Route Groups**: App Router uses `(folder)` syntax for organizing routes without affecting URLs. Pages Router doesn't have this feature.
2. **Layouts**: App Router has nested `layout.tsx` files. Pages Router uses a single `_app.tsx` and custom layout components.
3. **File Naming**: App Router uses `page.tsx`, `layout.tsx`, `route.ts`. Pages Router uses filename as route (e.g., `index.tsx`, `sign-in.tsx`).

---

## Routing

### App Router

**File**: [app/(dashboard)/dashboard/general/page.tsx](15-app-router-saas/app/(dashboard)/dashboard/general/page.tsx)

```tsx
// Automatically creates route: /dashboard/general
export default function GeneralPage() {
  return <div>General Settings</div>;
}
```

**Features:**
- Route groups `(folder)` don't appear in URL
- Nested layouts automatically wrap child routes
- Special files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### Pages Router

**File**: [pages/dashboard/general.tsx](15-pages-router-saas/pages/dashboard/general.tsx)

```tsx
// Automatically creates route: /dashboard/general
export default function GeneralPage() {
  return (
    <DashboardLayout>
      <div>General Settings</div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Server-side data fetching
  return {
    props: {}
  };
};
```

**Features:**
- File path = URL path (direct mapping)
- Manual layout wrapping in each page
- `getServerSideProps` for SSR data fetching

---

## Data Fetching

### App Router

**Server Components** (default):

[app/(dashboard)/dashboard/page.tsx:272-287](15-app-router-saas/app/(dashboard)/dashboard/page.tsx#L272-L287)

```tsx
export default async function SettingsPage() {
  // Direct async/await in component
  const user = await getUser();
  const team = await getTeamForUser();

  return (
    <section>
      <ManageSubscription />
      <TeamMembers />
    </section>
  );
}
```

**Client Components** (with `'use client'`):

[app/(dashboard)/dashboard/page.tsx:40-46](15-app-router-saas/app/(dashboard)/dashboard/page.tsx#L40-L46)

```tsx
'use client';

function ManageSubscription() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  // Client-side data fetching with SWR
}
```

### Pages Router

**Server-Side** (`getServerSideProps`):

[pages/dashboard/index.tsx](15-pages-router-saas/pages/dashboard/index.tsx)

```tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUser();
  const team = user ? await getTeamForUser() : null;

  return {
    props: {
      fallback: {
        '/api/user': user,
        '/api/team': team
      }
    }
  };
};
```

**Client-Side** (in component):

```tsx
export default function DashboardPage() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  // Always client-side in Pages Router
}
```

**Key Differences:**

| Feature | App Router | Pages Router |
|---------|-----------|--------------|
| **Server Data Fetching** | `async` Server Components | `getServerSideProps` |
| **Static Generation** | `generateStaticParams` | `getStaticProps` |
| **Revalidation** | `revalidate` export | ISR via `revalidate` |
| **Data Location** | Inside component | Separate function |
| **Streaming** | Native support | Not supported |

---

## Server & Client Components

### App Router

**Server Component** (default):

[app/(dashboard)/page.tsx:5-130](15-app-router-saas/app/(dashboard)/page.tsx#L5-L130)

```tsx
// No 'use client' = Server Component
import { Button } from '@/components/ui/button';
import { Terminal } from './terminal';

export default function HomePage() {
  // Rendered on server
  return (
    <main>
      <Terminal /> {/* Can import Client Components */}
    </main>
  );
}
```

**Client Component**:

[app/(dashboard)/terminal.tsx:1-68](15-app-router-saas/app/(dashboard)/terminal.tsx#L1-L68)

```tsx
'use client'; // Explicit opt-in

import { useState, useEffect } from 'react';

export function Terminal() {
  const [copied, setCopied] = useState(false); // React hooks work

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text); // Browser APIs work
  };
}
```

### Pages Router

**All Components are Client Components**:

[pages/index.tsx](15-pages-router-saas/pages/index.tsx)

```tsx
// No 'use client' needed - everything is client by default
import { Terminal } from '@/components/terminal';

export default function HomePage({ fallback }: HomePageProps) {
  // Rendered on client after SSR hydration
  return (
    <div>
      <Header />
      <Terminal />
    </div>
  );
}

// Server-side rendering via getServerSideProps
export const getServerSideProps: GetServerSideProps = async () => {
  const user = await getUser();
  return {
    props: { fallback: { '/api/user': user } }
  };
};
```

**Key Differences:**

| Aspect | App Router | Pages Router |
|--------|-----------|--------------|
| **Default** | Server Component | Client Component |
| **Opt-in** | `'use client'` for client | `getServerSideProps` for SSR |
| **Hooks** | Only in Client Components | Everywhere |
| **Browser APIs** | Only in Client Components | Everywhere (with checks) |
| **DB Queries** | Directly in Server Components | Only in `getServerSideProps` |

---

## API Routes

### App Router (Route Handlers)

**File**: [app/api/user/route.ts:1-7](15-app-router-saas/app/api/user/route.ts#L1-L7)

```tsx
import { getUser } from '@/lib/db/queries';

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
```

**Features:**
- Uses Web `Request`/`Response` APIs
- Named exports for HTTP methods: `GET`, `POST`, `PUT`, etc.
- File must be named `route.ts`
- Can coexist with `page.tsx` in parent folders

### Pages Router (API Routes)

**File**: [pages/api/user.ts](15-pages-router-saas/pages/api/user.ts)

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/lib/db/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await getUser();
  return res.status(200).json(user);
}
```

**Features:**
- Uses Next.js-specific `NextApiRequest`/`NextApiResponse`
- Single default export handler function
- Manual method checking via `req.method`
- Must be in `pages/api/` directory

**Comparison:**

| Feature | App Router (Route Handlers) | Pages Router (API Routes) |
|---------|---------------------------|-------------------------|
| **File Name** | `route.ts` | Any name (e.g., `user.ts`) |
| **HTTP Methods** | Named exports (`GET`, `POST`) | Single handler + `req.method` |
| **APIs** | Web standard `Request`/`Response` | Next.js `NextApiRequest`/`NextApiResponse` |
| **Middleware** | Not built-in | Custom via helper functions |

---

## Authentication & Middleware

### Global Middleware (Same in Both)

**File**: [middleware.ts](15-pages-router-saas/middleware.ts)

Both implementations use identical global middleware:

```tsx
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isProtectedRoute = pathname.startsWith('/dashboard');

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Session refresh logic...
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

### Route-Level Protection

#### App Router

**Automatic** via file structure:

```
app/
├── (login)/          # Public routes
│   ├── sign-in/
│   └── sign-up/
└── (dashboard)/      # Protected by middleware
    └── dashboard/
```

- Middleware handles protection
- Server Components can directly check auth

#### Pages Router

**Manual** in `getServerSideProps`:

[pages/dashboard/index.tsx](15-pages-router-saas/pages/dashboard/index.tsx)

```tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      }
    };
  }

  try {
    await verifyToken(sessionCookie);
  } catch (error) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false
      }
    };
  }

  return { props: {} };
};
```

---

## Form Handling & Server Actions

### App Router

**Server Actions** (native):

[app/(login)/actions.ts:52-101](15-app-router-saas/app/(login)/actions.ts#L52-L101)

```tsx
'use server';

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const userWithTeam = await db
    .select({...})
    .from(users)
    .where(eq(users.email, email));

  await setSession(foundUser);
  redirect('/dashboard');
});
```

**Usage in Client Component**:

[app/(login)/login.tsx:18-21](15-app-router-saas/app/(login)/login.tsx#L18-L21)

```tsx
'use client';

export function Login({ mode }) {
  const [state, formAction, pending] = useActionState(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <form action={formAction}>
      {/* Form fields */}
    </form>
  );
}
```

### Pages Router

**Adapted Server Actions**:

[pages/sign-in.tsx](15-pages-router-saas/pages/sign-in.tsx)

```tsx
// Server Action defined in same file
async function signInAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string;

  const userWithTeam = await db
    .select({...})
    .from(users)
    .where(eq(users.email, email));

  await setSession(foundUser);
  return { success: true, redirectTo: '/dashboard' };
}

export default function SignInPage() {
  return <Login action={signInAction} />;
}
```

**Usage**:

[components/login.tsx](15-pages-router-saas/components/login.tsx)

```tsx
'use client';

export function Login({ action }) {
  const [state, formAction, pending] = useActionState(action, { error: '' });

  return (
    <form action={formAction}>
      {/* Form fields */}
    </form>
  );
}
```

**Key Differences:**

| Feature | App Router | Pages Router |
|---------|-----------|--------------|
| **Server Actions** | Native with `'use server'` | Adapted pattern |
| **Location** | Separate actions file | In page file |
| **Redirect** | `redirect()` (throws) | Return `{ redirectTo }` |
| **Revalidation** | `revalidatePath()` | Manual cache invalidation |

---

## Layouts

### App Router (Nested Layouts)

**Root Layout**: [app/layout.tsx:18-44](15-app-router-saas/app/layout.tsx#L18-L44)

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.className}>
      <body className="min-h-[100dvh] bg-gray-50">
        <SWRConfig value={{ fallback: {
          '/api/user': getUser(),
          '/api/team': getTeamForUser()
        }}}>
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
```

**Dashboard Layout**: [app/(dashboard)/layout.tsx:99-106](15-app-router-saas/app/(dashboard)/layout.tsx#L99-L106)

```tsx
export default function Layout({ children }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
```

**Nested Dashboard Layout**: [app/(dashboard)/dashboard/layout.tsx:9-73](15-app-router-saas/app/(dashboard)/dashboard/layout.tsx#L9-L73)

```tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col">
      <aside>{/* Sidebar */}</aside>
      <main>{children}</main>
    </div>
  );
}
```

**Result**: Automatic nesting
```
<RootLayout>
  <Layout>          {/* Dashboard layout */}
    <DashboardLayout> {/* Settings sidebar */}
      <Page />
    </DashboardLayout>
  </Layout>
</RootLayout>
```

### Pages Router (Manual Layouts)

**App Wrapper**: [pages/_app.tsx](15-pages-router-saas/pages/_app.tsx)

```tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <SWRConfig value={{ fallback: pageProps.fallback || {} }}>
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
```

**Document**: [pages/_document.tsx](15-pages-router-saas/pages/_document.tsx)

```tsx
export default function Document() {
  return (
    <Html lang="en" className="bg-white">
      <Head />
      <body className="min-h-[100dvh] bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**Dashboard Layout Component**: [components/dashboard-layout.tsx](15-pages-router-saas/components/dashboard-layout.tsx)

```tsx
export function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex">
        <aside>{/* Sidebar */}</aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
```

**Usage in Page**: [pages/dashboard/index.tsx](15-pages-router-saas/pages/dashboard/index.tsx)

```tsx
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <section>{/* Page content */}</section>
    </DashboardLayout>
  );
}
```

**Result**: Manual wrapping per page

---

## Performance Considerations

### App Router

**Advantages:**
- **Server Components**: Zero JavaScript for non-interactive parts
- **Streaming**: Progressive rendering with Suspense boundaries
- **Automatic Code Splitting**: Per-route automatic splitting
- **Data Fetching**: Parallel data fetching at component level
- **Caching**: Aggressive caching of Server Components

**Example - Streaming**:

```tsx
export default function Page() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent /> {/* Streams in when ready */}
      </Suspense>
    </div>
  );
}
```

### Pages Router

**Advantages:**
- **Predictable**: Traditional SSR model is well-understood
- **Simpler Mental Model**: Everything is a client component
- **Fine-Grained Control**: Manual `getServerSideProps` control

**Limitations:**
- No Server Components (more JavaScript to client)
- No streaming (full page wait for `getServerSideProps`)
- Manual code splitting via `dynamic()` imports

**Example - Code Splitting**:

```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

---

## Developer Experience

### App Router

**Pros:**
- Modern React features (Server Components, Suspense, Streaming)
- Colocated data fetching with components
- Less boilerplate for layouts
- Better TypeScript inference

**Cons:**
- Steeper learning curve (Server vs Client components)
- Must understand `'use client'` boundary
- Some libraries don't work in Server Components
- Debugging Server Components is harder

### Pages Router

**Pros:**
- Familiar React patterns
- Simpler mental model (everything is client)
- More library compatibility
- Easier to debug (all client-side)

**Cons:**
- More boilerplate (`getServerSideProps` in every page)
- Manual layout composition
- More JavaScript shipped to client
- Less modern features

---

## When to Use Each

### Use **App Router** If:

1. **Performance is critical** - Need smallest possible JavaScript bundle
2. **SEO is important** - Server Components are perfect for content-heavy pages
3. **Streaming is needed** - Progressive rendering for better UX
4. **Modern Stack** - Building a new app from scratch
5. **Complex Layouts** - Need nested layouts and route groups
6. **You want latest features** - React 18+ features, Server Actions

### Use **Pages Router** If:

1. **Simpler Mental Model** - Team is more comfortable with traditional React
2. **Library Compatibility** - Using libraries that need client-side rendering
3. **Existing Codebase** - Migrating from older Next.js versions
4. **Debugging Ease** - Need simpler debugging experience
5. **Full Control** - Prefer explicit `getServerSideProps` control
6. **Production-Proven** - Want battle-tested, stable patterns

---

## Migration Path

### From Pages Router to App Router

1. **Incremental Adoption**: Both can coexist in same project
2. **Start with New Features**: Build new pages in App Router
3. **Convert High-Traffic Pages**: Move pages with most traffic for perf gains
4. **Update Data Fetching**: Convert `getServerSideProps` to Server Components

### From App Router to Pages Router

1. **Create `pages/` directory** alongside `app/`
2. **Convert Server Components** to `getServerSideProps`
3. **Add `'use client'` patterns** to all interactive components
4. **Manual layout composition** in each page
5. **Convert Route Handlers** to API routes

---

## Conclusion

Both architectures achieve the **same functionality** with different approaches:

- **App Router**: Server-first, modern React, optimized performance
- **Pages Router**: Client-first, traditional patterns, predictable behavior

The **App Router** represents the future of Next.js and React, with better performance and modern patterns. However, the **Pages Router** remains a viable choice for teams who prefer its simplicity or need broader library compatibility.

**This SaaS template demonstrates that you can build the same application with either architecture**, choosing based on your team's needs and constraints rather than technical limitations.
