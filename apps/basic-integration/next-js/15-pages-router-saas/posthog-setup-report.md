<wizard-report>
# PostHog post-wizard report

The wizard has integrated PostHog into this Next.js Pages Router project. It initialized posthog-js via instrumentation-client.ts, added server-side posthog-node utilities, set environment variables for host and keys, and instrumented key client and server events across authentication, checkout, billing portal access, team management, and account updates. Edits were minimal and aligned with the provided example patterns. PII was not sent in event properties; identification occurs via email on successful auth client-side only.

| Event name | Description | File |
| --- | --- | --- |
| auth_sign_in_attempted | User submitted the sign-in form to authenticate. | components/login.tsx |
| auth_sign_in_succeeded | User successfully signed in via API and session was created. | pages/api/auth/sign-in.ts |
| auth_sign_in_failed | User sign-in failed due to invalid credentials or validation errors. | pages/api/auth/sign-in.ts |
| auth_sign_up_attempted | User submitted the sign-up form to create an account. | components/login.tsx |
| auth_sign_up_succeeded | User account was created successfully and a session was started. | pages/api/auth/sign-up.ts |
| auth_sign_up_failed | User sign-up failed due to validation or server errors. | pages/api/auth/sign-up.ts |
| checkout_initiated | User clicked Get Started and a checkout session was requested. | pages/pricing.tsx |
| checkout_session_created | Server created a Stripe Checkout session or redirected user to sign up. | pages/api/stripe/create-checkout.ts |
| billing_portal_opened | User requested to open the Stripe customer portal from dashboard. | pages/dashboard/index.tsx |
| team_member_invited | User invited a new team member from the dashboard. | pages/api/team/invite.ts |
| team_member_removed | User removed a team member from the dashboard. | pages/api/team/remove-member.ts |
| account_updated | User updated account profile information (name or email). | pages/api/account/update.ts |
| auth_signed_out | User signed out and session cookie was cleared. | components/header.tsx |
| subscription_updated | Stripe webhook indicated a subscription change for a team. | pages/api/stripe/webhook.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: Analytics basics (wizard)
  - Auth conversion funnel (wizard)
  - Sign-in trend (wizard)
  - Checkout flow trend (wizard)
  - Team management activity (wizard)
  - Churn signals trend (wizard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls identify — ensure identify is invoked on subsequent sessions after login where appropriate.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
