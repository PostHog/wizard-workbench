<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy through Next.js rewrites, a shared server-side client in `lib/posthog-server.ts`, user identification tied to the SWR-fetched user session, and event capture across all critical business flows: authentication, team management, and Stripe subscriptions.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `checkout_started` | A user clicked to start the checkout process on the pricing page. | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | A user successfully completed the Stripe checkout and activated a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription plan or status was updated via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A team's subscription was cancelled via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1818145)
- **Insight**: [New signups over time](https://us.posthog.com/project/483112/insights/peMIDSN5)
- **Insight**: [Checkout conversion funnel](https://us.posthog.com/project/483112/insights/EoRAN6dT)
- **Insight**: [Sign-ins vs sign-ups](https://us.posthog.com/project/483112/insights/BFUmGTmX)
- **Insight**: [Subscription events](https://us.posthog.com/project/483112/insights/7p7SjpGy)
- **Insight**: [Team collaboration actions](https://us.posthog.com/project/483112/insights/N5ewkywq)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `UserMenu` component identifies on every mount when user data is available via SWR, which covers both fresh logins and page refreshes.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
