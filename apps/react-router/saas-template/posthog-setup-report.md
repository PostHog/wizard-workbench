# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the React Router v7 (Framework mode) SaaS template. The integration covers both client-side pageview tracking and server-side event capture across all critical user and business flows.

**Changes made:**

- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware that creates a per-request `PostHog` (node) client, attaches it to the React Router context, and passes correlation headers (`X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID`) from the browser client to the server for session stitching.
- **`app/root.tsx`** — Added `posthogMiddleware` to the root middleware chain; added `usePostHog().captureException()` in the global `ErrorBoundary` for automatic error tracking.
- **`app/entry.client.tsx`** — Initialised `posthog-js` with the project token and host, and wrapped the React tree in `<PostHogProvider>` so all client components can access PostHog via hooks.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling issues.
- **`app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx`** — Added `posthog.identify()` call after authentication so the user's email and name are associated with their PostHog distinct ID on every authenticated page load.
- **`app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`** — Captures `user_signed_up` for new accounts and `user_logged_in` for returning users immediately after the OAuth / OTP callback.
- **`app/features/onboarding/user-account/onboarding-user-account-action.server.ts`** — Captures `onboarding_profile_completed` after a user saves their name and avatar.
- **`app/features/organizations/create-organization/create-organization-action.server.ts`** — Captures `organization_created` with the org name, ID, and slug.
- **`app/features/billing/billing-action.server.ts`** — Captures `checkout_initiated`, `subscription_cancelled`, `subscription_resumed`, and `subscription_plan_switched` for every billing intent.
- **`app/features/organizations/settings/team-members/team-members-action.server.tsx`** — Captures `member_invited` with the invited email and role.
- **`app/features/billing/contact-sales/contact-sales-action.server.ts`** — Captures `contact_sales_submitted` with company and contact details.
- **`app/routes/api+/v1+/stripe.webhooks.ts`** — Captures `checkout_completed` and `subscription_created` from Stripe webhooks with Stripe session/subscription metadata.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

---

## Instrumented events

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired server-side when a new user account is created for the first time via email OTP or OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Fired server-side when an existing user completes authentication via email OTP or OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_profile_completed` | Fired server-side when a new user saves their profile (name and avatar) during onboarding | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | Fired server-side when a user successfully creates a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `checkout_initiated` | Fired server-side when a user opens a Stripe checkout session to start a subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | Fired server-side when a user switches their subscription to a different plan via the billing portal | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired server-side when a user initiates subscription cancellation via the billing portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired server-side when a user resumes a subscription that was set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `member_invited` | Fired server-side when an organization admin or owner invites a new member by email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | Fired server-side when a visitor submits the enterprise contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `checkout_completed` | Fired server-side via Stripe webhook when a checkout session is successfully completed | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_created` | Fired server-side via Stripe webhook when a new subscription is created in Stripe | `app/routes/api+/v1+/stripe.webhooks.ts` |

---

## Next steps

We've instrumented 12 events across your critical user and business flows. To visualise them, create an **"Analytics basics"** dashboard in PostHog ([go to dashboards →](https://us.posthog.com/project/2/dashboards)) with the following insights:

1. **Sign-up funnel** — Conversion funnel: `user_signed_up` → `onboarding_profile_completed` → `organization_created` → `checkout_initiated` → `checkout_completed`
2. **Daily new sign-ups** — Trend of `user_signed_up` over time
3. **Churn risk** — Trend of `subscription_cancelled` vs `subscription_resumed` over time
4. **Team growth** — Trend of `member_invited` over time, grouped by `organization_slug`
5. **Contact sales submissions** — Total count of `contact_sales_submitted`, useful for tracking enterprise pipeline

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
