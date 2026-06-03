<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A server-side PostHog client (`lib/posthog-server.ts`) was created for tracking critical business events in server actions and API routes. Users are identified client-side in the dashboard layout when authenticated, with `posthog.reset()` called on sign-out to properly end their session.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully completes registration, including team creation or accepting an invitation. | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully authenticates with their credentials. | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user explicitly signs out of their session. | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their account name or email in General Settings. | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password in Security Settings. | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user confirms and completes account deletion. | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team owner removes an existing member from the team. | `app/(login)/actions.ts` |
| `checkout_started` | Fired when a user clicks the checkout button on the pricing page, marking the start of the subscription conversion funnel. | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Fired server-side when Stripe redirects the user back after a successful checkout session, confirming subscription acquisition. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired server-side via Stripe webhook when a customer's subscription status changes. | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fired server-side via Stripe webhook when a subscription is canceled or becomes unpaid — key churn signal. | `app/api/stripe/webhook/route.ts` |
| `subscription_management_clicked` | Fired when a user clicks the Manage Subscription button in the dashboard, indicating billing intent. | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

To monitor user behavior, set up an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Subscription conversion funnel** — `checkout_started` → `checkout_completed` (measures pricing page to paid conversion)
2. **User acquisition trend** — `user_signed_up` over time (tracks growth)
3. **Churn signals** — `subscription_canceled` over time (monitors revenue churn)
4. **Authentication activity** — `user_signed_in` trend (measures retention/engagement)
5. **Team growth** — `team_member_invited` trend (tracks viral/collaborative growth)

Create these in [PostHog Insights](/insights) and add them to a new dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
