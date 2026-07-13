# PostHog post-wizard report

The wizard completed a Next.js App Router PostHog integration with client-side initialization via `instrumentation-client.ts`, a shared server-side Node client, authenticated user identification on app load, a reverse-proxy rewrite for browser ingestion, and targeted product analytics across auth, pricing, account management, checkout, and Stripe webhook flows. Environment variables were added to `.env.local`, and a PostHog dashboard with five saved insights was created for the newly instrumented events.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Captures successful user sign-ins, including checkout-driven authentication. | `app/(login)/actions.ts` |
| `user_signed_up` | Captures successful account creation and whether signup came from an invitation or checkout flow. | `app/(login)/actions.ts` |
| `account_updated` | Captures successful updates to account profile information. | `app/(login)/actions.ts` |
| `password_updated` | Captures successful password changes for authenticated users. | `app/(login)/actions.ts` |
| `team_member_invited` | Captures successful team member invitations with the selected role. | `app/(login)/actions.ts` |
| `pricing_cta_clicked` | Captures when a visitor starts checkout from the pricing page. | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | Captures successful Stripe checkout completion on the server. | `app/api/stripe/checkout/route.ts` |
| `subscription_webhook_processed` | Captures Stripe subscription webhook processing on the server. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1842147)
- [User signups (wizard)](https://us.posthog.com/project/483112/insights/TKof6GlT)
- [Pricing CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/lBj1zvOS)
- [Signup to checkout completion funnel (wizard)](https://us.posthog.com/project/483112/insights/RE5t8Ylj)
- [Account changes (wizard)](https://us.posthog.com/project/483112/insights/vca048XC)
- [Subscription webhooks processed (wizard)](https://us.posthog.com/project/483112/insights/w89deksy)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project under `.claude/skills/integration-nextjs-app-router`. This can be reused for future agent-assisted PostHog changes so later edits follow the same integration pattern.
