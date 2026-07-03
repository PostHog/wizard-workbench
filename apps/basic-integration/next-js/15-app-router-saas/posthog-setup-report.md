<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router SaaS starter by adding PostHog client initialization through `instrumentation-client.ts`, a reusable server-side PostHog client, reverse-proxy rewrites in `next.config.ts`, environment variable setup in `.env.local`, and targeted analytics capture across auth, billing, account settings, and team-management flows. It also created a starter PostHog dashboard and five saved insights for the newly instrumented events.

| Event name | Description | File |
| --- | --- | --- |
| user_signed_in | Captures successful user sign-in from the authentication form. | `app/(login)/login.tsx` |
| user_signed_up | Captures successful account creation from the authentication form. | `app/(login)/login.tsx` |
| user_signed_out | Captures when an authenticated user signs out from the header menu. | `app/(dashboard)/layout.tsx` |
| account_updated | Captures successful account profile updates from general settings. | `app/(dashboard)/dashboard/general/page.tsx` |
| password_updated | Captures successful password changes from security settings. | `app/(dashboard)/dashboard/security/page.tsx` |
| account_deleted | Captures confirmed account deletion attempts from security settings. | `app/(dashboard)/dashboard/security/page.tsx` |
| checkout_started | Captures when a user starts a Stripe checkout from pricing or dashboard flows. | `lib/payments/actions.ts` |
| checkout_completed | Captures successful Stripe checkout completion on the server callback. | `app/api/stripe/checkout/route.ts` |
| subscription_status_changed | Captures Stripe subscription lifecycle changes received from webhooks. | `app/api/stripe/webhook/route.ts` |
| team_member_invited | Captures successful team invitation submissions from team settings. | `app/(dashboard)/dashboard/page.tsx` |
| team_member_removed | Captures successful team member removal from team settings. | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796162
- Insight: Sign-ins by day (wizard) — https://us.posthog.com/project/483112/insights/7Fy0V5F2
- Insight: Sign-ups by day (wizard) — https://us.posthog.com/project/483112/insights/T8c8p0zD
- Insight: Checkout conversion summary (wizard) — https://us.posthog.com/project/483112/insights/awoCYPTQ
- Insight: Subscription lifecycle changes (wizard) — https://us.posthog.com/project/483112/insights/pro9GQ3d
- Insight: Team collaboration actions (wizard) — https://us.posthog.com/project/483112/insights/dZ5fzojC

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
