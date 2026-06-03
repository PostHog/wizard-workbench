<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `posthog-js` singleton pattern for Next.js 15.3+, with reverse proxy routing, exception capture, and debug mode in development.
- **`next.config.ts`**: Added `/ingest/*` rewrites to route PostHog events and assets through the app's own domain (reverse proxy), preventing ad blockers from blocking analytics.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client singleton using `posthog-node` with immediate flush settings for serverless environments.
- **`app/(login)/actions.ts`**: Added server-side PostHog captures and `posthog.identify()` calls for authentication flows (`user_signed_in`, `user_signed_up`, `invitation_accepted`) and account management events (`account_updated`, `password_updated`, `account_deleted`, `team_member_invited`, `team_member_removed`).
- **`app/(dashboard)/layout.tsx`**: Added client-side `posthog.identify()` in `UserMenu` when user data loads, and `user_signed_out` capture with `posthog.reset()` on sign out.
- **`app/(dashboard)/pricing/submit-button.tsx`**: Added `checkout_started` event capture when user clicks "Get Started" on a pricing plan.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_completed` server-side event on successful Stripe checkout, plus error tracking on failure.
- **`app/api/stripe/webhook/route.ts`**: Added `subscription_changed` server-side event when Stripe subscription is updated or deleted.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiated a checkout session for a subscription plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed checkout and activated a subscription | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Team subscription was updated or cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted a team invitation during sign up | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |

## Next steps

To build a dashboard for these events, visit your PostHog project and create an **"Analytics basics"** dashboard with insights like:

- **Sign-up → Checkout funnel**: Funnel from `user_signed_up` → `checkout_started` → `checkout_completed`
- **Sign-in trend**: Trends chart for `user_signed_in` over time
- **Churn signals**: Trends for `account_deleted` and `subscription_changed` (with `subscription_status = canceled`)
- **Team growth**: Trends for `team_member_invited` and `invitation_accepted`
- **Account health**: Trends for `password_updated` and `account_updated`

[Create a new dashboard →](/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
