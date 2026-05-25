# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (framework mode) SaaS template. The integration covers both client-side and server-side event tracking across the full user lifecycle — from signup through billing, team management, and core product usage.

**Key changes made:**

- **`app/entry.client.tsx`** — Initialized `posthog-js` with `PostHogProvider` wrapping the app. Enabled `__add_tracing_headers` so all server-side actions can correlate events to the same session/user as the client.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware that initializes a `posthog-node` client per request, extracts the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers set by the client SDK, and shuts down cleanly after each response.
- **`app/root.tsx`** — Registered the PostHog middleware in the global middleware chain. Added `posthog.captureException()` in the root error boundary for automatic error tracking.
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors.
- **`app/features/organizations/layout/nav-user.tsx`** — Added `posthog.reset()` on the logout form submit to unlink the session from the identified user.
- **`app/routes/.../auth.callback.ts`** — Captured `user_signed_up` (new users) and `user_logged_in` (returning users) server-side with user ID and email as distinct ID and properties.
- **`app/routes/.../_sidebar-layout.tsx`** — Client-side `posthog.identify()` called once per authenticated session with the user's database ID, email, and name.
- **`app/features/onboarding/.../onboarding-user-account-action.server.ts`** — Captured `onboarding_profile_completed` after user sets up their profile.
- **`app/features/organizations/create-organization/create-organization-action.server.ts`** — Captured `organization_created` with org ID, name, and slug.
- **`app/features/organizations/settings/team-members/team-members-action.server.tsx`** — Captured `team_member_invited` with invited email, role, and org ID.
- **`app/features/billing/billing-action.server.ts`** — Captured four billing events: `subscription_checkout_started`, `subscription_cancelled`, `subscription_plan_switched`, and `subscription_resumed`.
- **`app/features/billing/stripe-event-handlers.server.ts`** — Captured `subscription_created` in the Stripe webhook handler.
- **`app/features/billing/contact-sales/contact-sales-action.server.ts`** — Captured `contact_sales_submitted` with work email and company name.
- **`app/routes/.../$organizationSlug+/pastes.tsx`** — Captured `paste_created` and `paste_deleted` with paste ID, org ID, language, and visibility.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user account created after OAuth/OTP verification | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user successfully authenticated | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_profile_completed` | User completed the profile onboarding step (name + avatar) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `team_member_invited` | Admin invited a team member via email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `subscription_checkout_started` | User initiated a Stripe checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_created` | Stripe subscription successfully created (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | User initiated a subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User initiated a plan upgrade or downgrade | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription scheduled to cancel | `app/features/billing/billing-action.server.ts` |
| `contact_sales_submitted` | User submitted the enterprise contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `paste_created` | User created a new paste in their organization | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste_deleted` | User deleted a paste from their organization | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)
- [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/7269091) — tracks `subscription_checkout_started` → `subscription_created`
- [Daily Sign Ups & Sign Ins](https://us.posthog.com/project/2/insights/7269092) — trends for `user_signed_up` and `user_logged_in`
- [Subscription Revenue Events](https://us.posthog.com/project/2/insights/7269093) — billing event trends
- [Churn Signals](https://us.posthog.com/project/2/insights/7269102) — `subscription_cancelled` trends
- [Team Growth Activity](https://us.posthog.com/project/2/insights/7269103) — `team_member_invited` and `organization_created` trends

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
