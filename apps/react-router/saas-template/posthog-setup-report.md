<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Router v7 SaaS template. The integration covers client-side event tracking, user identification, server-side Stripe webhook analytics, and error tracking.

**Changes made:**

- **`app/entry.client.tsx`** — Initialized `posthog-js` with the project token and host, wrapped the app with `PostHogProvider`. Enabled `__add_tracing_headers` so session and distinct IDs are automatically forwarded to the server.
- **`app/lib/posthog-middleware.ts`** _(new file)_ — Server-side PostHog middleware using `posthog-node`. Extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from each request and uses `withContext()` to correlate server-side events with the correct client session.
- **`app/root.tsx`** — Added `posthogMiddleware` to the global middleware array, and added `posthog.captureException()` in the root `ErrorBoundary` for automatic unhandled error tracking.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure SSR compatibility.
- **`app/routes/_user-authentication+/_anonymous-routes+/login.tsx`** — Captures `user_login_requested` with `method: "email"` or `method: "google"` on form submit.
- **`app/routes/_user-authentication+/_anonymous-routes+/register.tsx`** — Captures `user_signup_requested` with `method: "email"` or `method: "google"` on form submit.
- **`app/routes/_authenticated-routes+/organizations_+/new.tsx`** — Captures `organization_created` when the create organization form is submitted.
- **`app/routes/contact-sales.tsx`** — Captures `contact_sales_submitted` when the contact sales form is submitted.
- **`app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx`** — Calls `posthog.identify()` with the user's ID and email when the user enters the authenticated dashboard area.
- **`app/features/billing/stripe-event-handlers.server.ts`** — Captures three server-side events via Stripe webhooks: `checkout_completed`, `subscription_created`, and `subscription_cancelled`.

| Event | Description | File |
|---|---|---|
| `user_login_requested` | Fired when a user submits the login form (email or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_signup_requested` | Fired when a user submits the registration form (email or Google OAuth) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `organization_created` | Fired when a user submits the create organization form | `app/routes/_authenticated-routes+/organizations_+/new.tsx` |
| `contact_sales_submitted` | Fired when a user submits the contact sales form | `app/routes/contact-sales.tsx` |
| `subscription_created` | Server-side: fired when a Stripe subscription is created via webhook | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Server-side: fired when a Stripe subscription is deleted/cancelled via webhook | `app/features/billing/stripe-event-handlers.server.ts` |
| `checkout_completed` | Server-side: fired when a Stripe checkout session is completed via webhook | `app/features/billing/stripe-event-handlers.server.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup funnel** — Funnel from `user_signup_requested` → `organization_created` → `checkout_completed`. Shows your conversion rate from registration to paid customer.

2. **Login activity** — Trend of `user_login_requested` over time, broken down by `method` property (email vs. google). Tracks active users and preferred auth method.

3. **Subscription health** — Bar chart comparing `subscription_created` vs. `subscription_cancelled` counts over time. Essential for monitoring churn.

4. **Revenue events** — Trend of `checkout_completed` events over time. Tracks new paid conversions.

5. **Contact sales interest** — Trend of `contact_sales_submitted` over time. Signals enterprise sales pipeline activity.

To create this dashboard, visit your PostHog project and use **Insights** → **New insight** for each item above, then pin them to a new dashboard named "Analytics basics".

- PostHog project: https://us.posthog.com/project/2
- Create dashboard: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
