<wizard-report>
# PostHog post-wizard report

The wizard has integrated PostHog analytics into this Next.js App Router project. It added client initialization via instrumentation-client.ts, a lightweight server PostHog client, and targeted event captures across authentication, checkout, account management, and team administration paths. Environment variables were configured for the PostHog public token and host.

| event_name | event_description | file |
| --- | --- | --- |
| auth_submitted | User submitted the authentication form indicating sign-in or sign-up intent. | app/(login)/login.tsx |
| sign_in_succeeded | User successfully signed in. | app/(login)/actions.ts |
| sign_in_failed | Sign in attempt failed due to invalid credentials. | app/(login)/actions.ts |
| sign_up_succeeded | User account created successfully. | app/(login)/actions.ts |
| sign_up_failed | User signup failed due to existing account or validation error. | app/(login)/actions.ts |
| checkout_clicked | User clicked Get Started on pricing to begin checkout. | app/(dashboard)/pricing/submit-button.tsx |
| checkout_started | Server initiated Stripe checkout session. | lib/payments/actions.ts |
| checkout_completed | Stripe checkout completed and subscription IDs saved. | app/api/stripe/checkout/route.ts |
| customer_portal_opened | User opened the Stripe customer portal from dashboard. | lib/payments/actions.ts |
| account_update_submitted | User submitted account profile changes. | app/(dashboard)/dashboard/general/page.tsx |
| account_updated | User account details updated successfully on server. | app/(login)/actions.ts |
| password_updated | User password updated successfully. | app/(login)/actions.ts |
| account_deleted | User account deletion completed. | app/(login)/actions.ts |
| team_member_invited | A team invitation was sent by an owner. | app/(login)/actions.ts |
| team_member_removed | A team member was removed from the team. | app/(login)/actions.ts |
| subscription_changed | Stripe subscription was updated or canceled via webhook. | app/api/stripe/webhook/route.ts |

## Next steps

We've built some insights and a dashboard for monitoring core conversion and retention signals:

- Dashboard: Analytics basics (wizard)
  - Signup to checkout conversion (wizard)
  - Checkout journey drop-off (wizard)
  - Auth errors trend (wizard)
  - Team management actions (wizard)
  - Account health summary (wizard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls identify — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
