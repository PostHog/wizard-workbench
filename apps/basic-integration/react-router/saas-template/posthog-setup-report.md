# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 SaaS template. The integration covers client-side initialization with session replay and autocapture, server-side event capture via a PostHog middleware, user identification on login, `posthog.reset()` on logout, and error tracking in the root error boundary. Fourteen custom events track the full user lifecycle — from registration through subscription, core product usage (pastes), and account deletion.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | A new user submits their email to start the registration process via magic link. | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_signed_up` | A brand-new user account is created in the database after completing OAuth or magic-link verification. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | An existing user successfully authenticates and lands on the app. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | A user explicitly signs out of their session. | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_profile_completed` | A new user finishes setting up their profile during the onboarding flow. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | A new organization is created during onboarding. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | A new organization is created from the organizations list page. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | A user initiates the Stripe checkout flow to start a paid subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_started` | A Stripe checkout session completes and the organization's subscription is activated. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | A Stripe subscription is deleted or expires, ending the organization's paid plan. | `app/features/billing/stripe-event-handlers.server.ts` |
| `paste_created` | A user creates a new paste within their organization. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste_deleted` | A user deletes an existing paste from their organization. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `organization_deleted` | An organization owner permanently deletes their organization. | `app/features/organizations/settings/general/general-organization-settings-action.server.ts` |
| `user_account_deleted` | A user permanently deletes their account and all associated data. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Files created

- `app/lib/posthog-middleware.ts` — PostHog Node.js middleware that initializes a server-side client per request, extracts `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers for session correlation, and shuts down cleanly after each request.

## Files modified

- `app/entry.client.tsx` — PostHog JS initialized with `tracing_headers` and wrapped in `PostHogProvider`.
- `app/root.tsx` — `posthogMiddleware` added to the middleware array; `usePostHog` added to `ErrorBoundary` to capture exceptions.
- `vite.config.ts` — `ssr.noExternal` set for `posthog-js` and `@posthog/react`.
- `app/utils/env.server.ts` — `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` added to the env schema.
- `app/features/organizations/layout/nav-user.tsx` — `posthog.reset()` called on logout form submit.
- `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx` — `posthog.identify()` called in `useEffect` when the authenticated layout mounts.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1813136)
- [User signup funnel](https://us.posthog.com/project/483112/insights/oN9rWHQK)
- [New signups over time](https://us.posthog.com/project/483112/insights/5JlAbdyw)
- [Subscription conversion](https://us.posthog.com/project/483112/insights/hNHWWP5d)
- [Paste activity](https://us.posthog.com/project/483112/insights/IvYwBj0G)
- [Subscription churn](https://us.posthog.com/project/483112/insights/paOVhmvh)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite (`npm test`) — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on every authenticated layout mount, which covers returning sessions, but verify this is working in your environment by checking the PostHog persons list after a test login.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
