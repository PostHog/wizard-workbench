<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. PostHog is now initialized client-side via `instrumentation-client.ts` with a reverse proxy through Next.js rewrites. A server-side singleton client (`lib/posthog-server.ts`) is used in all API routes. User identification fires on sign-in and sign-up on both client and server, with session correlation via `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers. Error tracking is enabled via `capture_exceptions: true` and `posthog.captureException()` calls at key error boundaries. `posthog.reset()` is called on sign-out to unlink the session.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in via the login form | `components/login.tsx` |
| `user_signed_up` | User successfully created a new account via the signup form | `components/login.tsx` |
| `checkout_started` | User clicked Get Started to begin checkout for a pricing plan | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User clicked Manage Subscription to open the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | User successfully invited a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | User successfully removed a team member | `pages/dashboard/index.tsx` |
| `account_updated` | User saved changes to their account information (name/email) | `pages/dashboard/general.tsx` |
| `sign_in` | Server-side: user authentication succeeded | `pages/api/auth/sign-in.ts` |
| `sign_up` | Server-side: new user account created successfully | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Server-side: Stripe checkout session created for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Server-side: Stripe webhook confirmed a subscription update | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Server-side: Stripe webhook confirmed a subscription cancellation/deletion | `pages/api/stripe/webhook.ts` |

## Next steps

Visit your PostHog project to explore the data once events start flowing. Here are some recommended insights to build in the **Analytics basics** dashboard:

- [Signup to Checkout funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up"},{"id":"checkout_started"},{"id":"checkout_session_created"}]}) — track conversion from signup through checkout
- [Sign-ins over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in","math":"total"}]}) — monitor daily active sign-ins
- [Subscription cancellations](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_cancelled","math":"total"}]}) — track churn signals over time
- [Team growth](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"team_member_invited","math":"total"}]}) — measure team expansion activity
- [Checkout started vs created](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"checkout_started","math":"total"},{"id":"checkout_session_created","math":"total"}]}) — compare intent vs completion

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
