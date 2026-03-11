# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode SaaS template. The integration covers the full user lifecycle — from registration and login through onboarding, billing, and enterprise sales — using both client-side (`posthog-js` / `@posthog/react`) and server-side (`posthog-node`) instrumentation.

**Key changes made:**

- **`app/entry.client.tsx`** — Initialised `posthog-js` with `defaults: "2026-01-30"` and `__add_tracing_headers` for automatic session correlation between client and server. Wrapped the hydrated React tree with `<PostHogProvider>`.
- **`app/lib/posthog-middleware.server.ts`** *(new file)* — React Router v7 `MiddlewareFunction` that creates a per-request `PostHog` node client, reads `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` correlation headers injected by the browser SDK, attaches the client to route context via `posthog.withContext()`, and shuts it down after the response.
- **`app/root.tsx`** — Added `posthogMiddleware` to the root middleware array so every server request has a PostHog context available.
- **`app/utils/env.server.ts`** — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` as optional fields in the Zod env schema.
- **`vite.config.ts`** — Added `ssr.noExternal: ["posthog-js", "@posthog/react"]` so these packages are bundled correctly for SSR.
- **`.env`** — Populated `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`.
- **Auth routes** — `user_registered` (with `posthog.identify`) and `user_logged_in` captured client-side in the email and Google OAuth form submit handlers. `user_logged_out` captured server-side via middleware context.
- **Onboarding** — `onboarding_user_account_completed` and `onboarding_organization_completed` captured server-side with rich org properties.
- **Billing** — `checkout_session_opened`, `subscription_cancelled`, `subscription_resumed`, `subscription_switched` captured server-side in `billing-action.server.ts`. `checkout_session_completed` captured via a standalone PostHog node client inside the Stripe webhook handler (no middleware context is available there).
- **Enterprise sales** — `contact_sales_submitted` captured server-side with lead properties.

| Event | Description | File |
|---|---|---|
| `user_registered` | User submits the registration form (email or Google) to create a new account | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User submits the login form (email or Google) to log into an existing account | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_logged_out` | User logs out of the application | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completes the user account onboarding step (sets their name/photo) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completes the organization onboarding step (creates their organization) | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout_session_opened` | User initiates a Stripe checkout session to subscribe to a paid plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User clicks the cancel subscription button and is redirected to the Stripe cancellation flow | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription that was set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_switched` | User switches to a different subscription plan (upgrade or downgrade) | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Stripe webhook confirms a checkout session was completed and subscription was created | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submits the contact sales form on the enterprise contact page | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

We've suggested building an **"Analytics basics"** dashboard in PostHog with the following five insights based on the events instrumented above:

1. **User acquisition trend** — Daily `user_registered` event count over time (line chart).
2. **Registration-to-paid conversion funnel** — Funnel: `user_registered` → `onboarding_organization_completed` → `checkout_session_opened` → `checkout_session_completed`.
3. **Churn signals** — Weekly `subscription_cancelled` count, broken down by `organization_id`.
4. **Subscription activity** — Stacked bar: `checkout_session_completed`, `subscription_switched`, `subscription_resumed`, and `subscription_cancelled` per week.
5. **Enterprise interest** — Weekly `contact_sales_submitted` count alongside `checkout_session_opened` to compare self-serve vs. sales-assisted interest.

To create this dashboard, go to **Dashboards → New dashboard** in your PostHog project and add insights using the event names listed above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
