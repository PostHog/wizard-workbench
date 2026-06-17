# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) SaaS template. The integration covers client-side SDK initialisation, server-side event capture via a middleware, user identification, error tracking in the root error boundary, and 15 business-critical events spread across authentication, onboarding, billing, and core product flows.

**Key changes made:**

- `app/entry.client.tsx` — Initialises `posthog-js` at module load time and wraps `HydratedRouter` (and the existing `I18nextProvider`) with `PostHogProvider`, making the PostHog client available to all React components via the `usePostHog` hook.
- `app/lib/posthog-middleware.ts` *(new)* — A React Router v7 server-side middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers injected by the client SDK, and calls `posthog.withContext()` so every server-side capture is automatically linked to the correct session and user.
- `app/root.tsx` — Adds `posthogMiddleware` as the first entry in the middleware array and adds `posthog?.captureException(error)` to the root `ErrorBoundary` so all unhandled React Router errors are tracked.
- `vite.config.ts` — Adds `ssr.noExternal: ['posthog-js', '@posthog/react']` (required for SSR) and dev-server proxy rules that route `/ingest/static`, `/ingest/array`, and `/ingest` to PostHog's ingestion endpoints.
- `app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx` — Added a `loader` that returns the Supabase user's `id` and `email`, and a `useEffect` in the layout component that calls `posthog.identify()` on every authenticated page load, ensuring returning sessions are linked to the correct person profile.
- `app/features/organizations/layout/nav-user.tsx` — Calls `posthog.capture('user_logged_out')` and `posthog.reset()` on the logout form's `onSubmit` handler.
- `.env` — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added via the wizard-tools MCP (values are not committed to version control).

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes auth callback and is saved to the database | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user completes the magic-link/OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User clicks the logout button | `app/features/organizations/layout/nav-user.tsx` |
| `organization_created` | User creates a new organisation from /organizations/new | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `onboarding_completed` | User submits the organisation onboarding form | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout_started` | User initiates a Stripe checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_started` | Stripe confirms checkout session completed (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | User initiates subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription scheduled for cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switches between subscription plans | `app/features/billing/billing-action.server.ts` |
| `paste_created` | User creates a new paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste_deleted` | User deletes a paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `team_member_invited` | Admin invites a team member by email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | User submits the Contact Sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `pricing_page_viewed` | User views the pricing page (funnel entry point) | `app/routes/pricing.tsx` |

## Next steps

The PostHog API key currently in use does not have the `dashboard:write`, `insight:write`, or `query:read` scopes needed to programmatically create dashboards. To create an "Analytics basics (wizard)" dashboard manually:

1. Open [PostHog Insights → New](https://us.posthog.com/project/2/insights/new) and create the following five insights using the event names above:
   - **Signup → Onboarding → Active funnel** — Funnel: `user_signed_up` → `onboarding_completed` → `paste_created`
   - **Subscription conversion funnel** — Funnel: `pricing_page_viewed` → `checkout_started` → `subscription_started`
   - **New signups over time** — Trends: `user_signed_up` (daily)
   - **Subscription churn** — Trends: `subscription_cancelled` vs `subscription_started` (overlaid)
   - **Paste creation trend** — Trends: `paste_created` (daily, breakdown by `is_public`)

2. Open [PostHog Dashboards](https://us.posthog.com/project/2/dashboard), create a new dashboard named **"Analytics basics (wizard)"**, and add the five insights to it.

Alternatively, re-authenticate the PostHog MCP connector with the `dashboard:write`, `insight:write`, and `query:read` scopes and re-run the wizard's conclude phase so it can create the dashboard automatically.

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite (`npm test`) — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent) into CI so production stack traces de-minify in PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation runs `identify` on every authenticated layout load, but verify that a user who was previously identified and returns in a new session still gets correctly linked.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
