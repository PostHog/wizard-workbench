<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. Both client-side and server-side tracking have been set up, covering the full user journey from first visit through subscription management.

## Summary of changes

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Created — initializes posthog-js with reverse proxy, exception capture, and debug mode |
| `next.config.ts` | Updated — added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect: true` |
| `lib/posthog-server.ts` | Created — server-side PostHog Node.js client helper |
| `.env.local` | Updated — added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `app/(login)/login.tsx` | Updated — client-side `posthog.identify()` on sign-in/sign-up form submit |
| `app/(login)/actions.ts` | Updated — server-side events for auth and team actions |
| `lib/payments/stripe.ts` | Updated — `checkout_started` event before Stripe redirect |
| `app/api/stripe/checkout/route.ts` | Updated — `checkout_completed` event after successful payment |
| `app/api/stripe/webhook/route.ts` | Updated — `subscription_updated` and `subscription_cancelled` from Stripe webhooks |
| `app/(dashboard)/pricing/submit-button.tsx` | Updated — client-side `pricing_cta_clicked` on pricing CTA click |

## Tracked events

| Event | Description | File |
|-------|-------------|------|
| `pricing_cta_clicked` | User clicks "Get Started" on the pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `user_signed_up` | New user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `password_updated` | User changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account (churn) | `app/(login)/actions.ts` |
| `account_updated` | User updates profile name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a team member | `app/(login)/actions.ts` |
| `checkout_started` | User is sent to Stripe checkout | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completes Stripe checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription status changed | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: subscription cancelled (churn) | `app/api/stripe/webhook/route.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user behavior:

1. **Signup-to-paid conversion funnel** — `pricing_cta_clicked` → `user_signed_up` → `checkout_started` → `checkout_completed`
2. **New user sign-ups over time** — daily trend of `user_signed_up`
3. **Churn signals** — combined trend of `account_deleted` + `subscription_cancelled`
4. **Checkout completions** — daily trend of `checkout_completed`
5. **Daily active sign-ins** — daily trend of `user_signed_in`

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
