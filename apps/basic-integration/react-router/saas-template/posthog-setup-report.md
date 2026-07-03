<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this React Router v7 (Framework mode) SaaS template. Changes span client-side initialization, server-side middleware, user identification, event capture across 13 distinct business events, and error tracking in the root error boundary.

## What was changed

| Event name | Description | File |
|---|---|---|
| `login_initiated` | User submits the login form via email magic link or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `signup_initiated` | User submits the registration form via email magic link or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | An existing user successfully authenticates and is redirected to their organizations | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_registered` | A brand-new user account is created after completing auth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_profile_completed` | User submits the user account (name and avatar) step of onboarding | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User submits the organization setup step of onboarding | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User creates a new organization from the new organization page | `app/routes/_authenticated-routes+/organizations_+/new.tsx` |
| `team_member_invited` | An admin invites a team member to their organization via email | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/members.tsx` |
| `contact_sales_submitted` | User submits the contact sales form to inquire about enterprise pricing | `app/routes/contact-sales.tsx` |
| `checkout_session_started` | User initiates a Stripe checkout session to subscribe to a paid plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiates cancellation of their active subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription that was previously set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User initiates a plan switch to a different subscription tier or billing interval | `app/features/billing/billing-action.server.ts` |

**Other changes:**
- `app/entry.client.tsx` — PostHog JS initialized with reverse proxy (`/ingest`); `PostHogProvider` wraps the app
- `app/root.tsx` — `posthogMiddleware` added to the middleware chain; `usePostHog().captureException()` added to the error boundary
- `app/lib/posthog-middleware.ts` — New file: creates a per-request `posthog-node` client and makes it available via `context.posthog`
- `vite.config.ts` — Proxy rules for `/ingest`, `/ingest/static`, `/ingest/array`; `ssr.noExternal` for PostHog packages
- `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx` — `posthog.identify()` called with the authenticated user's ID, email, and name on every authenticated page load

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793583)
- [New User Registrations](https://us.posthog.com/project/483112/insights/p5wD1O3H)
- [Subscription Revenue Events](https://us.posthog.com/project/483112/insights/139PEcPK)
- [User Onboarding Funnel](https://us.posthog.com/project/483112/insights/EyYfgOoA)
- [Team & Organization Growth](https://us.posthog.com/project/483112/insights/HtnvlpTM)
- [Subscriptions Cancelled (Last 30 Days)](https://us.posthog.com/project/483112/insights/0pNb3g4v)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation calls it on every authenticated sidebar render, which is correct, but verify it fires before any events captured on authenticated routes.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
