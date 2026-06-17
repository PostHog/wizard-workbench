# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework SaaS template. PostHog is now initialized client-side in `entry.client.tsx` (with the `PostHogProvider` wrapper and a reverse-proxy `/ingest` route for ad-blocker resilience), and a server-side `posthogMiddleware` is wired into the root route middleware stack so every request carries a PostHog Node client with the correct `sessionId`/`distinctId` from the client headers. User identification runs client-side on every authenticated page load via the sidebar layout. Thirteen business events are captured across the full user lifecycle: authentication, onboarding, billing, team management, and account deletion. Error tracking is active in both the root `ErrorBoundary` and the shared `GeneralErrorBoundary`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | New user created via email magic link or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user logged in | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User explicitly logged out | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completed the user account onboarding step | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completed the organization onboarding step | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `subscription_checkout_initiated` | User opened a Stripe Checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Stripe confirmed checkout (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | User cancelled their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a cancelled subscription | `app/features/billing/billing-action.server.ts` |
| `team_member_invited_by_email` | Admin sent an email invitation to a new team member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `organization_invite_link_used` | User accepted an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `contact_sales_form_submitted` | User submitted the enterprise contact-sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `user_account_deleted` | User deleted their account from danger zone | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next steps

A dashboard named **"Analytics basics (wizard)"** was not automatically created because the PostHog MCP connection lacks the `dashboard:write` and `query:read` scopes at this time. You can create it manually with the suggested insights below:

- **[New dashboard](https://us.posthog.com/project/2/dashboard)** — Create a dashboard named "Analytics basics (wizard)"
- **[New insight](https://us.posthog.com/project/2/insights/new)** — Suggested insights to add:
  1. **Signup → Onboarding funnel** — Funnel: `user_signed_up` → `onboarding_user_account_completed` → `onboarding_organization_completed`
  2. **Signup trend** — Trends: `user_signed_up` over time
  3. **Subscription conversions** — Funnel: `subscription_checkout_initiated` → `subscription_checkout_completed`
  4. **Churn trend** — Trends: `subscription_cancelled` over time
  5. **Team growth** — Trends: `team_member_invited_by_email` over time

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite (`npm test`) — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap/onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent) into CI so production stack traces de-minify correctly.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `identify` call fires on every authenticated page load via the sidebar layout, so returning sessions should be covered; verify this in a real browser session.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
