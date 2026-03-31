<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloutHub React Router v7 Framework application. Here's what was done:

- **Installed packages**: `posthog-js`, `@posthog/react`, `posthog-node`
- **Client-side initialization** (`app/entry.client.tsx`): PostHog is initialized with `posthog-js` and the app is wrapped in `<PostHogProvider>` for React hook access. Tracing headers are enabled for client-server correlation.
- **Server-side middleware** (`app/lib/posthog-middleware.ts`): A `posthogMiddleware` extracts session/user context from request headers (set automatically by the client SDK) and makes a `PostHog` Node client available via `context.posthog` for all server-side route handlers.
- **Root route** (`app/root.tsx`): The middleware is registered at the root level so it runs for all routes. The `ErrorBoundary` captures unhandled errors with `posthog.captureException()`.
- **React Router config** (`react-router.config.ts`): Enabled `v8_middleware: true` future flag to support the middleware pattern.
- **Vite config** (`vite.config.ts`): Added `posthog-js` and `@posthog/react` to `noExternal` for SSR compatibility, and configured an `/ingest` reverse proxy for the dev server.
- **Environment variables** (`.env`): `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set with your project credentials.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `package_selected` | User selects a fake follower package | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake followers purchase (main conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back one of their fake followers | `app/routes/profile.tsx` |

## Next steps

We suggest creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Purchase Conversion Funnel** — Funnel insight: `package_selected` → `followers_purchased`. Shows how many users who select a package go on to complete the purchase.
2. **Followers Purchased Over Time** — Trend insight for `followers_purchased`. Tracks purchase volume and revenue (`package_price` property) over time.
3. **Post Engagement** — Trend insight for `post_liked` and `post_unliked`. Monitors how users interact with feed content.
4. **Average Package Value** — Formula insight using `followers_purchased` with `package_price` property aggregation. Tracks average revenue per purchase.
5. **Follow-back Activity** — Trend insight for `follower_followed_back`. Shows how often users engage with their fake followers.

You can create these insights at: https://us.posthog.com/project/238460/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
