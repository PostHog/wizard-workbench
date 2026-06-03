<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 SaaS starter. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach, with a reverse proxy configured in `next.config.ts` to improve event delivery reliability.
- **Server-side analytics** via `lib/posthog-server.ts` using `posthog-node`, capturing critical business events in Server Actions and API routes.
- **User identification** on both client and server: `posthog.identify()` is called in the sign-in/sign-up forms (client-side) and in the corresponding server actions, ensuring seamless correlation between frontend and backend events.
- **Error tracking** enabled via `capture_exceptions: true` in the client-side initialization.
- **11 business-critical events** tracked across authentication, subscription, and team management flows.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account, either standalone or via team invitation | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_out` | User explicitly signed out of their session | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan | `lib/payments/actions.ts` |
| `subscription_completed` | Stripe checkout completed successfully and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Subscription status updated or canceled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deleted their account | `app/(login)/actions.ts` |

## Next steps

Dashboard creation was skipped because the PostHog API key in this environment is missing the required scopes (`dashboard:write`, `insight:write`, `query:read`). You can manually create a dashboard in PostHog with the following recommended insights:

1. **Sign-up funnel** — Funnel from `user_signed_up` → `checkout_started` → `subscription_completed`
2. **Sign-in trend** — Trend of `user_signed_in` over time
3. **Churn events** — Trend of `account_deleted` and `subscription_changed` (with status=canceled)
4. **Team growth** — Trend of `team_member_invited` and `team_member_removed`
5. **Subscription conversion** — Ratio of `checkout_started` to `subscription_completed`

Visit your [PostHog dashboards](/dashboard) to get started.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
