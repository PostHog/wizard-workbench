<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS starter. Client-side tracking is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route PostHog traffic through `/ingest`. A server-side PostHog client (`lib/posthog-server.ts`) powers event capture in Server Actions and API routes. Users are identified client-side on every page load via `posthog.identify()` in the `UserMenu` component, and server-side on sign-in and sign-up. `posthog.reset()` is called on sign-out to unlink sessions.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account | `app/(login)/actions.ts` |
| `invitation_accepted` | A user accepted a team invitation during sign-up | `app/(login)/actions.ts` |
| `checkout_started` | A user initiated the Stripe checkout flow for a plan | `lib/payments/actions.ts` |
| `subscription_activated` | Stripe checkout completed and team subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | An existing subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | A subscription was canceled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | A team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1811962)
- [New signups over time](https://us.posthog.com/project/483112/insights/UkU8pKSi)
- [Signup to subscription funnel](https://us.posthog.com/project/483112/insights/0397sVNE)
- [Subscription cancellations vs activations](https://us.posthog.com/project/483112/insights/TIt8T07c)
- [Team growth — invites and removals](https://us.posthog.com/project/483112/insights/sRJPa9Un)
- [Account deletion rate](https://us.posthog.com/project/483112/insights/YqGCJEck)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `UserMenu` component calls it on load when the user session is present, covering returning visitors, but verify this fires correctly in your auth flow.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
