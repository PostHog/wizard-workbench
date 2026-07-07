<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended Next.js 15.3+ approach), with a reverse proxy configured in `next.config.ts` to improve reliability against ad blockers. A server-side PostHog client (`lib/posthog-server.ts`) is used across all server actions and API routes to track critical business events. Users are identified on every authenticated dashboard load and reset on sign-out.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully completed registration. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `invitation_accepted` | A user signed up via a team invitation link. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account. | `app/(login)/actions.ts` |
| `checkout_initiated` | A user started the Stripe checkout flow from the pricing page. | `lib/payments/actions.ts` |
| `checkout_completed` | A user successfully completed checkout and activated a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team subscription was updated or cancelled via Stripe webhook. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813022)
- [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/CD8KJiQb)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/gpVMSsgB)
- [Subscription changes by status (wizard)](https://us.posthog.com/project/483112/insights/DKj3NfSU)
- [Team invitations sent (wizard)](https://us.posthog.com/project/483112/insights/Ftilkd4L)
- [Account deletions (wizard)](https://us.posthog.com/project/483112/insights/HCbxxHto)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `useEffect` in `app/(dashboard)/layout.tsx` handles this for authenticated users, but verify it fires correctly on every page load within the `/dashboard` route group.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
