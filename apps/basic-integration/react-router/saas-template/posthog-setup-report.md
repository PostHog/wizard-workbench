<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this React Router v7 Framework mode SaaS application. Here is a summary of what was added:

- **`app/entry.client.tsx`** — Initialized `posthog-js` with `PostHogProvider` wrapping the app. Added `__add_tracing_headers` so all server-side requests automatically carry `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` for client↔server correlation.
- **`app/lib/posthog-middleware.server.ts`** (new file) — A React Router middleware that creates a `posthog-node` client per request, extracts the tracing headers from the client SDK, and makes the client available via `posthogContext` throughout the request lifecycle. Added to the root middleware array.
- **`app/root.tsx`** — Added `posthogMiddleware` to the root middleware stack and wired `usePostHog().captureException()` into the `ErrorBoundary` for automatic error tracking.
- **`app/utils/env.server.ts`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the env schema (optional, so the app degrades gracefully without them).
- **`vite.config.ts`** — Added `ssr.noExternal` for `posthog-js` / `@posthog/react`, and a reverse proxy for `/ingest/*` to avoid ad-blocker interference.
- **`app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx`** — Added a loader that fetches the authenticated user's DB ID and name, then calls `posthog.identify()` client-side on every authenticated page load so returning visitors are linked to their known identity.
- **`app/features/organizations/layout/nav-user.tsx`** — Added `posthog.capture('user_logged_out')` and `posthog.reset()` on the logout form's `onSubmit` handler to unlink future events from the current user.
- **`app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`** — Added server-side `user_registered` (for new users) and `user_logged_in` (for returning users) events at the OAuth/magic-link callback point.
- **`app/features/onboarding/user-account/onboarding-user-account-action.server.ts`** — Added `onboarding_user_account_completed` after a successful profile save.
- **`app/features/onboarding/organization/onboarding-organization-action.server.ts`** — Added `onboarding_organization_completed` with properties for `company_size`, `company_types`, `referral_sources`, and `organization_id`.
- **`app/features/organizations/create-organization/create-organization-action.server.ts`** — Added `organization_created` after a new organization is saved.
- **`app/features/billing/billing-action.server.ts`** — Added `subscription_checkout_started`, `subscription_cancelled`, `subscription_resumed`, and `subscription_plan_switched` events in the billing action switch.
- **`app/features/billing/stripe-event-handlers.server.ts`** — Added `subscription_checkout_completed` in the Stripe webhook handler using a standalone `posthog-node` client (webhooks don't go through the request middleware).
- **`app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx`** — Added `paste_created` and `paste_deleted` events in the paste action handler.

| Event name | Description | File |
|---|---|---|
| `user_registered` | New user account created after email/OAuth verification | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user completes authentication | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User logs out | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_user_account_completed` | User completes the profile step of onboarding | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completes the organization setup step | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User creates a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiates a subscription checkout | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User cancels their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription set to cancel | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switches their subscription plan | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Stripe checkout session completes (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `paste_created` | User creates a new paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste_deleted` | User deletes a paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818377)
- [New user registrations (wizard)](https://us.posthog.com/project/483112/insights/CYmlKdc4)
- [Onboarding completion funnel (wizard)](https://us.posthog.com/project/483112/insights/mmiIIwnG)
- [Subscription acquisition funnel (wizard)](https://us.posthog.com/project/483112/insights/SWpjWWKw)
- [Subscription churn events (wizard)](https://us.posthog.com/project/483112/insights/EFc7DyXf)
- [Paste activity over time (wizard)](https://us.posthog.com/project/483112/insights/QIfn14Mw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap/CI scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the authenticated layout loader calls it on every authenticated page load, but verify this fires correctly after a page refresh with an active session.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
