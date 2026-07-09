<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 SaaS template. The integration covers client-side initialization (with session replay and autocapture), server-side event tracking via a request middleware, user identification on login and page refresh, error boundary capture, and a reverse proxy configuration for ad-block resistance.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired on the server when a new user account is created after OTP or OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_registered` | Fired on the server when a new user is created during the OTP confirm flow | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `user_logged_in` | Fired on the server when an existing user completes Google OAuth authentication | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Fired on the server when an existing user confirms their email OTP | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `user_logged_out` | Fired on the client when the user clicks the logout button | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_user_account_completed` | Fired on the server when a user finishes the personal profile onboarding step | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | Fired on the server when a user finishes the organization creation onboarding step | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | Fired on the server when a user creates a new organization after onboarding | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `checkout_session_started` | Fired on the server when a user initiates a Stripe checkout session to subscribe | `app/features/billing/billing-action.server.ts` |
| `subscription_created` | Fired on the server via Stripe webhook when a checkout session completes | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Fired on the server when a user opens the Stripe cancel subscription portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired on the server when a user resumes a subscription scheduled for cancellation | `app/features/billing/billing-action.server.ts` |
| `paste_created` | Fired on the server when a user creates a new paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste_deleted` | Fired on the server when a user deletes a paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `organization_updated` | Fired on the server when an organization owner updates name or logo | `app/features/organizations/settings/general/general-organization-settings-action.server.ts` |
| `organization_deleted` | Fired on the server when an organization owner deletes the organization | `app/features/organizations/settings/general/general-organization-settings-action.server.ts` |
| `user_account_updated` | Fired on the server when a user updates their profile name or avatar | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Key files created or modified

- **Created** `app/lib/posthog-middleware.ts` — React Router middleware that initializes a PostHog Node client per request and wires up `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` header correlation
- **Modified** `app/entry.client.tsx` — initializes posthog-js with reverse-proxy host, wraps `HydratedRouter` in `PostHogProvider`
- **Modified** `app/root.tsx` — adds posthog middleware and error boundary exception capture
- **Modified** `vite.config.ts` — adds SSR externals and `/ingest` reverse proxy for ad-block resistance
- **Modified** `app/utils/env.server.ts` — adds `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to env schema
- **Modified** `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx` — identifies the user client-side on every authenticated page load via `posthog.identify()`
- **Modified** `app/features/organizations/layout/nav-user.tsx` — captures `user_logged_out` and calls `posthog.reset()` on logout

## Next steps

We've built a dashboard and five insights to monitor user behavior based on the events just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1825462)
- [New user registrations](https://us.posthog.com/project/483112/insights/LKxKuKJH) — registrations over time by method
- [Signup to subscription conversion funnel](https://us.posthog.com/project/483112/insights/FAQeJ6tH) — 5-step funnel from registration to subscription
- [Subscription lifecycle events](https://us.posthog.com/project/483112/insights/nEabyOQQ) — created, cancelled, and resumed trends
- [Paste activity](https://us.posthog.com/project/483112/insights/9ODkGBUM) — paste creation and deletion over time
- [Daily active users](https://us.posthog.com/project/483112/insights/d2VkpVSW) — logged-in DAU area chart

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (run `npx posthog-cli sourcemap upload` or use the `@posthog/sourcemaps` Vite plugin as part of your build step).
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on every page load inside the organization sidebar layout, which should cover both fresh logins and returning visitors navigating to an authenticated route.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
